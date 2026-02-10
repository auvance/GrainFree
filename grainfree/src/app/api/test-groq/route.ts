import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type Incoming = {
  userId?: string;
  answers?: Record<string, unknown>;
  payload?: unknown;
};

type GuidePayload = {
  user_profile?: {
    goal?: string;
    macro_goal?: string;
    cooking_time?: string;
  };
};

type PlanJSON = {
  title: string;
  description: string;

  profileSummary: string;

  safetyRules: { title: string; bullets: string[] }[];
  safeSwaps: { category: string; swaps: { from: string; to: string; note?: string }[] }[];

  sevenDayStarterPlan: {
    day: number;
    meals: {
      type: "Breakfast" | "Lunch" | "Dinner" | "Snack";
      name: string;
      calories?: number;
      notes?: string;
    }[];
  }[];

  groceryList: { section: string; items: string[] }[];

  eatingOutPlaybook?: { title: string; bullets: string[] }[];
  symptomTrackingRoutine?: { title: string; bullets: string[] }[];
  budgetStrategy?: { title: string; bullets: string[] }[];

  nextSteps: { title: string; bullets: string[] }[];

  goals: { title: string; progress: number }[];
  meals: { name: string; type: "Breakfast" | "Lunch" | "Dinner" | "Snack"; calories: number }[];
  recommendations: { title: string; why: string }[];
};

function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) return null;

  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

function safeJsonExtract(text: string) {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

function deriveCalorieTarget(payload: GuidePayload | null | undefined, fallback = 2000) {
  const goal = String(payload?.user_profile?.goal ?? "");
  const macroGoal = String(payload?.user_profile?.macro_goal ?? "");
  const cookingTime = String(payload?.user_profile?.cooking_time ?? "");

  let target = fallback;

  if (goal.toLowerCase().includes("gain")) target = 2800;
  if (goal.toLowerCase().includes("lose")) target = 1800;
  if (goal.toLowerCase().includes("energy")) target = 2400;
  if (goal.toLowerCase().includes("reduce symptoms")) target = 2100;

  if (macroGoal.toLowerCase().includes("higher calories")) target = Math.max(target, 2600);
  if (macroGoal.toLowerCase().includes("lower calories")) target = Math.min(target, 1900);

  if (cookingTime.toLowerCase().includes("meal prep")) target += 100;

  if (target < 1600) target = 1600;
  if (target > 3200) target = 3200;

  return target;
}


// Allergens
function asStringArray(v: unknown): string[] {
  if (!v) return [];
  if (Array.isArray(v)) return v.map(String).map(s => s.trim()).filter(Boolean);
  if (typeof v === "string") return v.split(",").map(s => s.trim()).filter(Boolean);
  return [];
}

function pickProfileSafetyFromPayload(payload: unknown): {
  allergens?: string[];
  diet?: string[];
  conditions?: string[];
  medical_conditions?: string[];
  intolerances?: string[];
} {
  const p = payload as Record<string, unknown> | null;
  const up = (p?.user_profile ?? p) as Record<string, unknown> | null;

  return {
    allergens: asStringArray(up?.allergens),
    diet: asStringArray(up?.diet),
    conditions: asStringArray(up?.conditions),
    medical_conditions: asStringArray(up?.medical_conditions),
    intolerances: asStringArray(up?.intolerances),
  };
}



export async function POST(req: Request) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    if (!supabaseAdmin) {
      return NextResponse.json(
        {
          error:
            "Missing Supabase env. Set SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY.",
        },
        { status: 500 }
      );
    }

    const body = (await req.json()) as Incoming;
    const userId = body.userId;
    const payload = body.payload;
    const answers = body.answers ?? {};

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const effectivePayload = payload ?? { user_profile: { legacy_answers: answers } };

    const system = `
You are an expert nutrition coach focused on allergen safety and practical adherence.
You do NOT diagnose or provide medical advice.
You provide safety-first guidance, swaps, routines, and meal/product suggestions.

Return STRICT JSON only. No markdown. No prose outside JSON.
If you are uncertain, include safe defaults and clearly label unknowns.
`.trim();

    const userPrompt = `
Generate a personalized ALLERGEN-SAFE GUIDE.

User profile + preferences (JSON):
${JSON.stringify(effectivePayload, null, 2)}

REQUIREMENTS:
- Must be safe for the user's listed allergens/restrictions.
- Include cross-contamination guidance based on sensitivity level.
- Feel highly tailored: reference the user's struggles, success definition, budget, cooking time, and cuisines.
- Do NOT claim diagnosis. Use language like "common triggers" and "tracking suggestions".
- Provide actionable steps and a 7-day starter plan.

OUTPUT FORMAT (STRICT JSON):
{
  "title": string,
  "description": string,
  "profileSummary": string,
  "safetyRules": [{ "title": string, "bullets": string[] }],
  "safeSwaps": [{ "category": string, "swaps": [{ "from": string, "to": string, "note"?: string }] }],
  "sevenDayStarterPlan": [{ "day": 1, "meals": [{ "type": "Breakfast"|"Lunch"|"Dinner"|"Snack", "name": string, "calories"?: number, "notes"?: string }] }],
  "groceryList": [{ "section": string, "items": string[] }],
  "eatingOutPlaybook": [{ "title": string, "bullets": string[] }],
  "symptomTrackingRoutine": [{ "title": string, "bullets": string[] }],
  "budgetStrategy": [{ "title": string, "bullets": string[] }],
  "nextSteps": [{ "title": string, "bullets": string[] }],
  "goals": [{ "title": string, "progress": number }],
  "meals": [{ "name": string, "type": "Breakfast"|"Lunch"|"Dinner"|"Snack", "calories": number }],
  "recommendations": [{ "title": string, "why": string }]
}
`.trim();

    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: system },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.35,
    });

    const text = response.choices?.[0]?.message?.content?.trim() || "";
    
    const parsed = safeJsonExtract(text) as Partial<PlanJSON> | null;

    if (!parsed) {
      return NextResponse.json(
        {
          error: "AI returned invalid JSON. Try again.",
          debug_preview: text.slice(0, 800),
        },
        { status: 502 }
      );
    }
    

    const calorieTarget = deriveCalorieTarget(effectivePayload as GuidePayload, 2000);

    const planToSave = {
      user_id: userId,
      title: parsed.title ?? "Personalized Allergen-Safe Guide",
      description: parsed.description ?? "Generated by AI",
      goals: parsed.goals ?? [],
      meals: parsed.meals ?? [],
      recommendations: parsed.recommendations ?? [],
      status: "active",
    };

    const { data, error } = await supabaseAdmin
      .from("healthplans")
      .insert(planToSave)
      .select()
      .single();

    if (error) throw error;

    // Update profile calorie target + safety fields (so SafetySnapshot can render)
    const safety = pickProfileSafetyFromPayload(effectivePayload);

      await supabaseAdmin
    .from("profiles")
    .upsert(
      {
        id: userId,
        calorie_target: calorieTarget,
        ...(safety.allergens?.length ? { allergens: safety.allergens } : {}),
        ...(safety.diet?.length ? { diet: safety.diet.join(", ") } : {}), // diet column is text in your screenshot
      },
      { onConflict: "id" }
    );
    // await supabaseAdmin
    //   .from("profiles")
    //   .upsert(
    //     {
    //       id: userId,
    //       calorie_target: calorieTarget,
    //       ...(safety.allergens?.length ? { allergens: safety.allergens } : {}),
    //       ...(safety.diet?.length ? { diet: safety.diet } : {}),
    //       ...(safety.conditions?.length ? { conditions: safety.conditions } : {}),
    //       ...(safety.medical_conditions?.length ? { medical_conditions: safety.medical_conditions } : {}),
    //       ...(safety.intolerances?.length ? { intolerances: safety.intolerances } : {}),
    //     },
    //     { onConflict: "id" }
    //   );


    return NextResponse.json({ success: true, plan: data, rich: parsed });
  } catch (err) {
    console.error("generate-plan error:", err);
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
