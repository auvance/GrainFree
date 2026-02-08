import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type SaveReq = {
  userId: string | null;
  barcode: string;
  product: {
    name: string;
    brand: string;
    image: string;
    ingredients_text: string;
    allergens: string;
    traces?: string;
  };
  verdict: {
    level: "safe" | "caution" | "unsafe";
    reasons: any[];
  };
};

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as SaveReq;

    const userId = body.userId?.trim() || null;
    const barcode = (body.barcode || "").replace(/\s+/g, "");
    const product = body.product;
    const verdict = body.verdict;

    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!barcode) return NextResponse.json({ error: "Missing barcode" }, { status: 400 });
    if (!product?.name) return NextResponse.json({ error: "Missing product" }, { status: 400 });

    const supabaseAdmin = getSupabaseAdmin();
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Missing server configuration" }, { status: 500 });
    }

    // ✅ Upsert to saved_products
    // Assumes you can store barcode. Use a unique constraint (user_id, barcode) if possible.
    const { data, error } = await supabaseAdmin
      .from("saved_products")
      .upsert(
        {
          user_id: userId,
          barcode,
          name: product.name,
          brand: product.brand,
          image: product.image,
          ingredients_text: product.ingredients_text,
          allergens: product.allergens,
          traces: product.traces ?? "",
          verdict_level: verdict.level,
          verdict_reasons: verdict.reasons ?? [],
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,barcode" }
      )
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, saved: data });
  } catch (err) {
    console.error("api/scan/save error:", err);
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
