import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type VerdictLevel = "safe" | "caution" | "unsafe";

type Reason = {
  type: "allergen" | "diet";
  key: string;
  label: string;
  evidence?: string;
};

type Verdict = {
  level: VerdictLevel;
  reasons: Reason[];
  missingData?: boolean;
  advice?: string;
};

type SavedProductPayload = {
  userId: string;
  barcode: string;
  product: {
    name: string;
    brand: string;
    image: string;
    ingredients_text: string;
    allergens: string;
    traces: string;
    quantity: string;
    countries: string;
  };
  verdict: Verdict;
};

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;

  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function isSavedProductPayload(body: unknown): body is SavedProductPayload {
  if (typeof body !== "object" || body === null) return false;
  const b = body as Record<string, unknown>;

  if (!isNonEmptyString(b.userId)) return false;
  if (!isNonEmptyString(b.barcode)) return false;

  const product = b.product;
  const verdict = b.verdict;

  if (typeof product !== "object" || product === null) return false;
  if (typeof verdict !== "object" || verdict === null) return false;

  const p = product as Record<string, unknown>;
  const v = verdict as Record<string, unknown>;

  // minimal required product fields
  const productFields = [
    "name",
    "brand",
    "image",
    "ingredients_text",
    "allergens",
    "traces",
    "quantity",
    "countries",
  ] as const;

  for (const key of productFields) {
    if (typeof p[key] !== "string") return false;
  }

  const level = v.level;
  if (level !== "safe" && level !== "caution" && level !== "unsafe") return false;

  if (!Array.isArray(v.reasons)) return false;

  return true;
}

export async function POST(req: Request) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Server misconfigured (missing Supabase env vars)." },
        { status: 500 }
      );
    }

    const bodyUnknown: unknown = await req.json();

    if (!isSavedProductPayload(bodyUnknown)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { userId, barcode, product, verdict } = bodyUnknown;

    // Upsert into saved_products (adjust columns if your schema differs)
    const { data, error } = await supabaseAdmin
      .from("saved_products")
      .upsert(
        {
          user_id: userId,
          barcode: barcode.replace(/\s+/g, ""),
          product_name: product.name,
          brand: product.brand,
          image: product.image,
          ingredients_text: product.ingredients_text,
          allergens: product.allergens,
          traces: product.traces,
          quantity: product.quantity,
          countries: product.countries,
          verdict_level: verdict.level,
          verdict_reasons: verdict.reasons,
          verdict_missing_data: verdict.missingData ?? false,
          verdict_advice: verdict.advice ?? null,
        },
        { onConflict: "user_id,barcode" }
      )
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, item: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
