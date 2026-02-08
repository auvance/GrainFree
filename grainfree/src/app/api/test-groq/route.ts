import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

/**
 * IMPORTANT:
 * Use a server Supabase client here (service role) so inserts/upserts work reliably.
 * Make sure these env vars exist in Vercel:
 * - SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 */
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

type Incoming = {
  userId?: string;
  answers?: Record<string, unknown>;
  payload?: unknown; // from BuildWizard v2
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
    meals: { type: "Breakfast" | "Lunch" | "Dinner" | "Snack"; name: string; calories?: number; notes?: string }[];
  }[];

  groceryList: { section: string; items: string[] }[];

  eatingOutPlaybook?: { title: string; bullets: string[] }[];

  symptomTrackingRoutine?: { title: string; bullets: string[] }[];

  budgetStrategy?: { title: string; bullets: string[] }[];

  nextSteps: { title: string; bullets: string[] }[];

  // Keep compatibility with your existing dashboard assumptions
  goals: { title: string; progress: number }[];
  meals: { name: string; type: "Breakfast" | "Lunch" | "Dinner" | "Snack"; calories: number }[];
  recommendations: { title: string; why: string }[];
};

function safeJsonExtract(text: string) {
  const trimmed = text.trim();

  // If it's already JSON
  try {
    return JSON.parse(trimmed);
  } catch {
    // Attempt to extract the largest JSON block
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (!match) return null;

    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

/**
 * Simple calorie target heuristic (non-medical).
 * Uses goal + macro_goal + activity-ish signals if present.
 */
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

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Incoming;
    const userId = body.userId;
    const payload = body.payload; // prefer payload
    const answers = body.answers ?? {}; // fallback

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Hard requirement: we want the new payload
    // but we won't fail if it isn't present (backward compatible)
    const effectivePayload = payload ?? { user_profile: { legacy_answers: answers } };

    const system = `
You are an expert nutrition coach focused on allergen safety and practical adherence.
You do NOT diagnose or provide medical advice.
You provide safety-first guidance, swaps, routines, and meal/product suggestions.

Return STRICT JSON only. No markdown. No prose outside JSON.
If you are uncertain, include safe defaults and clearly label unknowns.
`;

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

  "safetyRules": [
    { "title": string, "bullets": string[] }
  ],

  "safeSwaps": [
    { "category": string, "swaps": [ { "from": string, "to": string, "note"?: string } ] }
  ],

  "sevenDayStarterPlan": [
    {
      "day": 1,
      "meals": [
        { "type": "Breakfast"|"Lunch"|"Dinner"|"Snack", "name": string, "calories"?: number, "notes"?: string }
      ]
    }
  ],

  "groceryList": [
    { "section": string, "items": string[] }
  ],

  "eatingOutPlaybook": [
    { "title": string, "bullets": string[] }
  ],

  "symptomTrackingRoutine": [
    { "title": string, "bullets": string[] }
  ],

  "budgetStrategy": [
    { "title": string, "bullets": string[] }
  ],

  "nextSteps": [
    { "title": string, "bullets": string[] }
  ],

  "goals": [{ "title": string, "progress": number }],
  "meals": [{ "name": string, "type": "Breakfast"|"Lunch"|"Dinner"|"Snack", "calories": number }],
  "recommendations": [{ "title": string, "why": string }]
}

Rules for compatibility fields:
- "meals" should include ~6-10 items total (mix of types).
- "goals" 3-6 items, progress 0-100.
- "recommendations" 5-10 items.
- If eating out is rare, keep eatingOutPlaybook short but still include basics.
- Calories: if unknown, omit in sevenDayStarterPlan meals; BUT in compatibility "meals" include calories numbers.
`;

    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: system.trim() },
        { role: "user", content: userPrompt.trim() },
      ],
      temperature: 0.35,
    });

    const text = response.choices?.[0]?.message?.content?.trim() || "";
    const parsed = safeJsonExtract(text) as Partial<PlanJSON> | null;

    if (!parsed) {
      return NextResponse.json(
        { error: "AI returned invalid JSON. Try again." },
        { status: 502 }
      );
    }

    // Derive calorie target more robustly from payload
    const calorieTarget = deriveCalorieTarget(effectivePayload, 2000);

    // Normalize fields for DB insert
    const planToSave = {
      user_id: userId,
      title: parsed.title ?? "Personalized Allergen-Safe Guide",
      description: parsed.description ?? "Generated by AI",
      goals: parsed.goals ?? [],
      meals: parsed.meals ?? [],
      recommendations: parsed.recommendations ?? [],
      status: "active",

      // Optional: store rich content if your table has jsonb columns
      // If you don't have these columns yet, comment these out
      // profile_summary: parsed.profileSummary ?? "",
      // safety_rules: parsed.safetyRules ?? [],
      // safe_swaps: parsed.safeSwaps ?? [],
      // seven_day_plan: parsed.sevenDayStarterPlan ?? [],
      // grocery_list: parsed.groceryList ?? [],
      // eating_out_playbook: parsed.eatingOutPlaybook ?? [],
      // symptom_tracking: parsed.symptomTrackingRoutine ?? [],
      // budget_strategy: parsed.budgetStrategy ?? [],
      // next_steps: parsed.nextSteps ?? [],
    };

    const { data, error } = await supabaseAdmin
      .from("healthplans")
      .insert(planToSave)
      .select()
      .single();

    if (error) throw error;

    // Update profile calorie target
    await supabaseAdmin
      .from("profiles")
      .upsert({ id: userId, calorie_target: calorieTarget }, { onConflict: "id" });

    return NextResponse.json({ success: true, plan: data, rich: parsed });
  } catch (err) {
    console.error("generate-plan error:", err);
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
