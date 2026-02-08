import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type ScanReq = { barcode: string; userId: string | null };

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

type Reason = { type: "allergen" | "diet"; key: string; label: string; evidence?: string };
type Verdict = {
  level: "safe" | "caution" | "unsafe";
  reasons: Reason[];
  missingData?: boolean;
  advice?: string; // extra field (frontend can ignore if you want)
};

function normalizeText(s?: string) {
  return (s || "").toLowerCase();
}

function asTagArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(String).map((x) => x.trim()).filter(Boolean);
  if (typeof v === "string") return v.split(",").map((x) => x.trim()).filter(Boolean);
  return [];
}

function containsAny(haystack: string, needles: string[]) {
  return needles.find((n) => haystack.includes(n));
}

function hasAnyTag(tags: string[], matchers: string[]) {
  const set = new Set(tags);
  return matchers.find((m) => set.has(m));
}

/**
 * Pull more text sources from OFF than just ingredients_text.
 * Also keep structured tags separate.
 */
function collectProductText(product: any) {
  const ingredientsText =
    product?.ingredients_text ||
    product?.ingredients_text_en ||
    product?.ingredients_text_with_allergens ||
    "";

  const allergensText = product?.allergens || product?.allergens_from_ingredients || "";
  const tracesText = product?.traces || product?.traces_from_ingredients || "";

  const allergensTags = asTagArray(product?.allergens_tags);
  const tracesTags = asTagArray(product?.traces_tags);
  const labelsTags = asTagArray(product?.labels_tags);

  // sometimes OFF stores ingredient objects
  const ingredientsArr =
    Array.isArray(product?.ingredients)
      ? product.ingredients.map((i: any) => i?.text).filter(Boolean).join(", ")
      : "";

  const combined = [
    ingredientsText,
    ingredientsArr,
    allergensText,
    tracesText,
    allergensTags.join(" "),
    tracesTags.join(" "),
    labelsTags.join(" "),
    product?.product_name || "",
    product?.product_name_en || "",
  ]
    .filter(Boolean)
    .join("\n");

  const missingData =
    !ingredientsText &&
    !ingredientsArr &&
    !allergensText &&
    allergensTags.length === 0 &&
    labelsTags.length === 0;

  return {
    combined: normalizeText(combined),
    ingredientsText: normalizeText(ingredientsText || ingredientsArr),
    allergensTags,
    tracesTags,
    labelsTags,
    missingData,
  };
}

/**
 * Gluten logic:
 * - HARD: explicit gluten-containing grains OR OFF allergen tag "en:gluten"/"en:contains-gluten"
 * - SOFT: oats/traces/may contain
 * IMPORTANT: Do NOT treat generic "flour" as gluten.
 */
const GLUTEN_GRAINS = [
  "wheat",
  "barley",
  "rye",
  "malt",
  "semolina",
  "spelt",
  "farina",
  "triticale",
  "bulgur",
  "couscous",
  "breadcrumbs",
];

const GLUTEN_TRACE_PHRASES = [
  "may contain wheat",
  "may contain gluten",
  "traces of gluten",
  "gluten traces",
];

const OATS_SOFT = ["oats", "en:oats"];

const OFF_GLUTEN_TAGS = ["en:gluten", "en:contains-gluten"];
const OFF_GLUTEN_TRACE_TAGS = ["en:gluten", "en:gluten-traces"]; // OFF isn't perfectly consistent
const OFF_GF_LABELS = ["en:gluten-free", "en:no-gluten"];

/**
 * Non-gluten flours that should NOT trigger gluten:
 */
const SAFE_FLOUR_CONTEXT = [
  "rice flour",
  "brown rice flour",
  "corn flour",
  "maize flour",
  "tapioca flour",
  "potato flour",
  "almond flour",
  "coconut flour",
  "buckwheat flour",
  "sorghum flour",
  "cassava flour",
  "chickpea flour",
  "gram flour",
  "lentil flour",
];

/**
 * Explicit gluten flour patterns (these ARE unsafe):
 */
const GLUTEN_FLOUR_PATTERNS: RegExp[] = [
  /\bwheat\s+flour\b/,
  /\bflour\s*\(wheat\)\b/,
  /\bbarley\s+flour\b/,
  /\brye\s+flour\b/,
  /\bmalt(ed)?\s+flour\b/,
];

const DAIRY = ["milk", "lactose", "whey", "casein", "butter", "cheese", "cream", "yogurt", "en:milk"];
const PEANUTS = ["peanut", "groundnut", "arachis", "en:peanuts"];
const TREE_NUTS = ["almond", "cashew", "hazelnut", "walnut", "pecan", "pistachio", "macadamia", "brazil nut", "en:nuts"];
const SOY = ["soy", "soya", "soybean", "edamame", "tofu", "tempeh", "lecithin", "en:soybeans"];
const EGGS = ["egg", "albumin", "ovalbumin", "en:eggs"];
const SESAME = ["sesame", "tahini", "en:sesame-seeds"];
const FISH = ["fish", "salmon", "tuna", "cod", "anchovy", "en:fish"];
const SHELLFISH = ["shrimp", "prawn", "crab", "lobster", "shellfish", "en:crustaceans", "en:molluscs"];

function verdictFromProduct(
  product: any,
  userAllergens: string[] = [],
  userDiet: string[] = [],
  userConditions: string[] = []
): Verdict {
  const {
    combined,
    ingredientsText,
    allergensTags,
    tracesTags,
    labelsTags,
    missingData,
  } = collectProductText(product);

  const reasons: Reason[] = [];

  // normalize user signals
  const a = userAllergens.map((x) => x.toLowerCase());
  const d = userDiet.map((x) => x.toLowerCase());
  const c = userConditions.map((x) => x.toLowerCase());

  const shouldCheckGluten =
    a.includes("gluten") ||
    a.includes("celiac") ||
    c.includes("celiac") ||
    d.includes("gluten-free") ||
    d.includes("gluten free") ||
    true; // scanner baseline: always detect gluten

  const shouldCheckDairy = a.includes("dairy") || a.includes("milk") || a.includes("lactose") || c.includes("lactose intolerance");
  const shouldCheckNuts = a.includes("tree nuts") || a.includes("tree_nuts") || a.includes("nuts") || a.includes("peanuts");
  const shouldCheckSoy = a.includes("soy");
  const shouldCheckEggs = a.includes("eggs") || a.includes("egg");
  const shouldCheckSesame = a.includes("sesame");
  const shouldCheckFish = a.includes("fish");
  const shouldCheckShellfish = a.includes("shellfish");

  // ---------- Gluten detection ----------
  if (shouldCheckGluten) {
    const offAllergenHit = hasAnyTag(allergensTags, OFF_GLUTEN_TAGS);
    const offTraceHit = hasAnyTag(tracesTags, OFF_GLUTEN_TRACE_TAGS);
    const explicitlyGF =
      hasAnyTag(labelsTags, OFF_GF_LABELS) ||
      combined.includes("gluten-free") ||
      combined.includes("gluten free");

    const grainHit = containsAny(combined, GLUTEN_GRAINS);
    const tracePhraseHit = containsAny(combined, GLUTEN_TRACE_PHRASES);
    const oatsHit = containsAny(combined, OATS_SOFT);

    const explicitGlutenFlourHit = GLUTEN_FLOUR_PATTERNS.find((rx) => rx.test(ingredientsText))?.source;

    // IMPORTANT: flour false-positive fix
    // If "flour" appears but it's in a known safe context, do not treat it as gluten.
    const safeFlourContextHit = containsAny(ingredientsText, SAFE_FLOUR_CONTEXT);

    // If OFF explicitly labels gluten-free, we avoid hard-flagging on weak evidence.
    // We still allow "unsafe" when OFF allergen tag says gluten OR clear wheat/barley/rye evidence.
    if (offAllergenHit) {
      if (explicitlyGF) {
        // conflict: gluten-free label but gluten allergen tag
        // => keep it CAUTION (user asked: keep it as caution), and tell them to verify label.
        reasons.push({
          type: "allergen",
          key: "gluten",
          label: "Label says gluten-free, but OFF allergen tag indicates gluten — verify the package",
          evidence: `${offAllergenHit} (labels: ${OFF_GF_LABELS.join(", ")})`,
        });
      } else {
        reasons.push({
          type: "allergen",
          key: "gluten",
          label: "Contains gluten (OFF allergen tag)",
          evidence: `${offAllergenHit}`,
        });
      }
    } else if (explicitGlutenFlourHit) {
      // e.g., "wheat flour"
      reasons.push({
        type: "allergen",
        key: "gluten",
        label: "Contains gluten (wheat/barley/rye flour)",
        evidence: "wheat/barley/rye flour",
      });
    } else if (grainHit) {
      // If grain hit is “oats” handle below; otherwise this is hard.
      // NOTE: "oats" is not in GLUTEN_GRAINS; we treat oats separately as soft.
      if (explicitlyGF) {
        // product claims GF but contains a gluten grain word in text
        // could be misleading text in ingredients copy, but still risky — caution.
        reasons.push({
          type: "allergen",
          key: "gluten",
          label: "Potential gluten risk (text mentions gluten grains) — verify label",
          evidence: grainHit,
        });
      } else {
        reasons.push({
          type: "allergen",
          key: "gluten",
          label: "Contains gluten (wheat/barley/rye family)",
          evidence: grainHit,
        });
      }
    } else if (oatsHit || offTraceHit || tracePhraseHit) {
      // Soft risk: oats/traces
      // If explicitly GF, we keep it caution (not unsafe) because cross-contam varies.
      reasons.push({
        type: "allergen",
        key: "gluten",
        label: explicitlyGF
          ? "Possible gluten cross-contamination (oats/traces) — check for certified GF"
          : "Possible gluten risk (oats/traces)",
        evidence: oatsHit || offTraceHit || tracePhraseHit,
      });
    } else {
      // Special case: keyword “flour” appears (generic) — do NOT flag unsafe
      // Example: “gluten free bisquick” with “rice flour”
      if (ingredientsText.includes("flour") && !safeFlourContextHit) {
        // unknown flour type => caution only (not unsafe)
        reasons.push({
          type: "allergen",
          key: "gluten",
          label: "Contains flour (type unclear) — verify it’s gluten-free",
          evidence: "flour",
        });
      }

      // Another special: product name/label contains word “gluten” (gluten-free),
      // should not create a negative hit by itself.
      // We do nothing here on purpose.
    }
  }

  // ---------- Other allergens (only if user indicates them) ----------
  if (shouldCheckDairy) {
    const hit = containsAny(combined, DAIRY);
    if (hit) reasons.push({ type: "allergen", key: "dairy", label: "Dairy / milk", evidence: hit });
  }
  if (shouldCheckNuts) {
    const peanutHit = containsAny(combined, PEANUTS);
    if (peanutHit) reasons.push({ type: "allergen", key: "peanuts", label: "Peanuts", evidence: peanutHit });

    const treeHit = containsAny(combined, TREE_NUTS);
    if (treeHit) reasons.push({ type: "allergen", key: "tree_nuts", label: "Tree nuts", evidence: treeHit });
  }
  if (shouldCheckSoy) {
    const hit = containsAny(combined, SOY);
    if (hit) reasons.push({ type: "allergen", key: "soy", label: "Soy", evidence: hit });
  }
  if (shouldCheckEggs) {
    const hit = containsAny(combined, EGGS);
    if (hit) reasons.push({ type: "allergen", key: "eggs", label: "Eggs", evidence: hit });
  }
  if (shouldCheckSesame) {
    const hit = containsAny(combined, SESAME);
    if (hit) reasons.push({ type: "allergen", key: "sesame", label: "Sesame", evidence: hit });
  }
  if (shouldCheckFish) {
    const hit = containsAny(combined, FISH);
    if (hit) reasons.push({ type: "allergen", key: "fish", label: "Fish", evidence: hit });
  }
  if (shouldCheckShellfish) {
    const hit = containsAny(combined, SHELLFISH);
    if (hit) reasons.push({ type: "allergen", key: "shellfish", label: "Shellfish", evidence: hit });
  }

  // ---------- Diet constraints (basic MVP) ----------
  if (d.includes("vegan")) {
    const nonVeganHits = ["milk", "whey", "casein", "egg", "honey", "gelatin", "cheese", "butter"];
    const hit = containsAny(combined, nonVeganHits);
    if (hit) reasons.push({ type: "diet", key: "vegan", label: "Not vegan-friendly", evidence: hit });
  }

  if (d.includes("halal")) {
    const hit = containsAny(combined, ["pork", "gelatin", "lard", "wine", "beer", "rum", "brandy"]);
    if (hit) reasons.push({ type: "diet", key: "halal", label: "May not be halal", evidence: hit });
  }

  // ---------- Level rules ----------
  // User asked: keep false positives as CAUTION rather than unsafe.
  // Therefore:
  // - Any clear allergen conflict => unsafe
  // - Any “possible/verify/trace/unclear” => caution
  // - Nothing => safe

  const hasUnsafeAllergen = reasons.some((r) => {
    if (r.type !== "allergen") return false;
    const L = r.label.toLowerCase();
    // “contains gluten” is unsafe, but our “label says gluten-free but tag indicates gluten” stays caution.
    if (L.includes("contains gluten") && !L.includes("label says gluten-free")) return true;
    if (L.includes("dairy") || L.includes("peanuts") || L.includes("tree nuts") || L.includes("soy") || L.includes("eggs") || L.includes("sesame") || L.includes("fish") || L.includes("shellfish")) {
      return true;
    }
    return false;
  });

  let level: Verdict["level"] = "safe";
  if (hasUnsafeAllergen) level = "unsafe";
  else if (reasons.length > 0) level = "caution";

  const advice =
    level === "safe"
      ? "Looks safe based on available data — still double-check the package label if you have severe allergies."
      : level === "caution"
      ? "Proceed with caution. Double-check the package label and look for certified allergen/gluten-free statements."
      : "Not recommended based on available data. Avoid unless you can confirm safety on the label/manufacturer site.";

  return { level, reasons, missingData, advice };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ScanReq;
    const barcode = (body.barcode || "").replace(/\s+/g, "");
    const userId = body.userId?.trim() || null;

    if (!barcode) return NextResponse.json({ error: "Missing barcode" }, { status: 400 });

    const offUrl = `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(barcode)}.json`;
    const offRes = await fetch(offUrl, { cache: "no-store" });
    const offJson = await offRes.json();

    const product = offJson?.product || null;
    const status = offJson?.status;

    if (!product || status !== 1) {
      return NextResponse.json(
        { found: false, error: "Product not found for this barcode." },
        { status: 404 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();

    let userAllergens: string[] = [];
    let userDiet: string[] = [];
    let userConditions: string[] = [];

    if (supabaseAdmin && userId) {
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("allergens, diet, intolerances, preferences, conditions, medical_conditions")
        .eq("id", userId)
        .maybeSingle();

      userAllergens = asTagArray((profile as any)?.allergens);
      userDiet = asTagArray((profile as any)?.diet);
      userConditions = [
        ...asTagArray((profile as any)?.conditions),
        ...asTagArray((profile as any)?.medical_conditions),
      ];
    }

    const verdict = verdictFromProduct(product, userAllergens, userDiet, userConditions);

    // Persist scan history (best-effort)
    let scanId: string | null = null;
    if (supabaseAdmin && userId) {
      const { data: inserted } = await supabaseAdmin
        .from("scan_history")
        .insert({
          user_id: userId,
          barcode,
          product_name: product.product_name || product.product_name_en || "Unknown product",
          brand: product.brands || "",
          image: product.image_url || product.image_front_url || "",
          ingredients_text: product.ingredients_text || product.ingredients_text_en || "",
          allergens: product.allergens || product.allergens_from_ingredients || "",
          traces: product.traces || "",
          verdict_level: verdict.level,
          verdict_reasons: verdict.reasons ?? [],
        })
        .select("id")
        .single();

      scanId = inserted?.id ?? null;
    }

    return NextResponse.json({
      found: true,
      scanId,
      barcode,
      product: {
        name: product.product_name || product.product_name_en || "Unknown product",
        brand: product.brands || "",
        image: product.image_url || product.image_front_url || "",
        ingredients_text: product.ingredients_text || product.ingredients_text_en || "",
        allergens: product.allergens || product.allergens_from_ingredients || "",
        traces: product.traces || "",
        quantity: product.quantity || "",
        countries: product.countries || "",
      },
      verdict,
      userContext: { allergens: userAllergens, diet: userDiet, conditions: userConditions },
      // helpful debugging (optional — remove later)
      offSignals: {
        allergens_tags: asTagArray(product?.allergens_tags),
        traces_tags: asTagArray(product?.traces_tags),
        labels_tags: asTagArray(product?.labels_tags),
      },
    });
  } catch (err) {
    console.error("api/scan error:", err);
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
