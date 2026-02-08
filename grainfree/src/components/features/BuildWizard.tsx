"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Header from "@/components/layout/Header/Header";

type Answer = string | string[] | number | null;

type StepType = "single" | "multi" | "text" | "scale";

type StepId =
  | "goal"
  | "restrictions"
  | "other_restrictions"
  | "reaction_severity"
  | "cross_contamination"
  | "kitchen_environment"
  | "eating_out_frequency"
  | "biggest_struggles"
  | "symptoms"
  | "symptom_pattern"
  | "trigger_suspects"
  | "past_attempts"
  | "success_definition"
  | "cooking_time"
  | "cooking_skill"
  | "household"
  | "budget"
  | "shopping_style"
  | "cuisine_prefs"
  | "hard_avoids_favorites"
  | "macro_goal"
  | "plan_includes"
  | "coaching_style"
  | "final_notes";

type StepConfig = {
  id: StepId;
  label: string;
  helper?: string;
  type: StepType;
  options?: string[];
  placeholder?: string;
  /** For scale steps */
  min?: number;
  max?: number;
  minLabel?: string;
  maxLabel?: string;
  /** Validation */
  required?: boolean;
  /** Optional: show only if predicate passes */
  when?: (answers: Answers) => boolean;
};

type Answers = Record<StepId, Answer>;

const RESTRICTIONS = [
  "Gluten/Wheat (Celiac or sensitivity)",
  "Dairy/Lactose",
  "Peanuts",
  "Tree nuts",
  "Eggs",
  "Soy",
  "Fish",
  "Shellfish",
  "Sesame",
  "Low FODMAP",
  "Vegan",
  "Vegetarian",
  "Halal",
  "Other (type it)",
];

const SYMPTOMS = [
  "Bloating",
  "Brain fog",
  "Fatigue",
  "Indigestion / reflux",
  "Nausea",
  "Skin flare-ups",
  "Headaches",
  "Joint pain",
  "Diarrhea / constipation",
  "Mood / irritability",
  "Other (type it)",
];

const STRUGGLES = [
  "I don’t trust labels",
  "I’m scared of cross-contamination",
  "Eating out feels impossible",
  "I get symptoms but don’t know why",
  "Meal planning overwhelms me",
  "It’s too expensive to eat safe",
  "I can’t hit nutrition goals safely",
  "I feel restricted / socially isolated",
  "I keep accidentally getting exposed",
];

const PLAN_INCLUDES = [
  "Safety rules (cross-contamination + label-reading)",
  "7-day safe starter plan (meals)",
  "Safe product list + swaps",
  "Grocery list template",
  "Eating-out playbook",
  "Symptom tracking routine",
  "Macro / calorie guidance (simple)",
  "Budget-friendly strategy",
];

const COACHING_STYLE = [
  "Gentle & encouraging",
  "Direct & structured",
  "Detailed & science-forward",
];

const defaultAnswers: Answers = {
  goal: null,
  restrictions: [],
  other_restrictions: "",
  reaction_severity: null,
  cross_contamination: null,
  kitchen_environment: null,
  eating_out_frequency: null,
  biggest_struggles: [],
  symptoms: [],
  symptom_pattern: null,
  trigger_suspects: "",
  past_attempts: null,
  success_definition: "",
  cooking_time: null,
  cooking_skill: null,
  household: null,
  budget: null,
  shopping_style: null,
  cuisine_prefs: [],
  hard_avoids_favorites: "",
  macro_goal: null,
  plan_includes: [],
  coaching_style: "Gentle & encouraging",
  final_notes: "",
};

function hasOtherSelection(arr: string[] | null | undefined) {
  if (!arr) return false;
  return arr.some((x) => x.toLowerCase().includes("other"));
}

function selectedCount(ans: Answer) {
  return Array.isArray(ans) ? ans.length : ans ? 1 : 0;
}

function buildSteps(answers: Answers): StepConfig[] {
  const hasRestrictions = (answers.restrictions as string[])?.length > 0;
  const hasSymptoms = (answers.symptoms as string[])?.length > 0;

  const base: StepConfig[] = [
    {
      id: "goal",
      label: "What’s your #1 goal right now?",
      helper:
        "This helps us tailor the guide to what matters most to you.",
      type: "single",
      required: true,
      options: [
        "Feel safe eating daily",
        "Reduce symptoms",
        "Build a sustainable routine",
        "Gain/lose weight safely",
        "Improve energy & performance",
      ],
    },
    {
      id: "restrictions",
      label: "Which restrictions/allergens should GrainFree protect you from?",
      helper:
        "Select everything that applies. We’ll tailor safety rules and swaps.",
      type: "multi",
      required: true,
      options: RESTRICTIONS,
    },
    {
      id: "other_restrictions",
      label: "Any other restrictions you want us to account for?",
      helper:
        "Optional — e.g., corn, oats, nightshades, specific brands/ingredients.",
      type: "text",
      required: false,
      placeholder: "Type anything important here…",
      when: (a) => hasOtherSelection(a.restrictions as string[]),
    },
    {
      id: "reaction_severity",
      label: "How serious are your reactions overall?",
      helper:
        "This changes how strict your plan should be (and how we handle eating out).",
      type: "single",
      required: true,
      options: [
        "Mild discomfort",
        "Moderate symptoms",
        "Severe / high-risk (e.g., anaphylaxis / epipen)",
        "Not sure",
      ],
      when: () => hasRestrictions,
    },
    {
      id: "cross_contamination",
      label: "How sensitive are you to cross-contamination?",
      helper:
        "Think shared fryers, traces, shared cutting boards, etc.",
      type: "single",
      required: true,
      options: [
        "I can handle traces sometimes",
        "Depends — I’m somewhat sensitive",
        "Very sensitive — strict avoidance",
        "Not sure",
      ],
      when: () => hasRestrictions,
    },
    {
      id: "kitchen_environment",
      label: "What’s your eating environment like?",
      helper:
        "We’ll tailor safety habits to your real life setup.",
      type: "single",
      required: true,
      options: [
        "Mostly home cooking",
        "Mix of home + eating out",
        "Mostly eating out / takeout",
        "Shared kitchen (roommates/family)",
      ],
    },
    {
      id: "eating_out_frequency",
      label: "How often do you eat out or order takeout?",
      helper:
        "We’ll include an eating-out playbook if this is common.",
      type: "single",
      required: true,
      options: ["Rarely", "1–2x/week", "3–5x/week", "Most days"],
    },
    {
      id: "biggest_struggles",
      label: "What are your biggest struggles right now?",
      helper: "Pick up to 2 — we’ll focus the plan around these.",
      type: "multi",
      required: true,
      options: STRUGGLES,
    },

    // --- Symptoms block (conditional) ---
    {
      id: "symptoms",
      label: "Any current symptoms you want to improve?",
      helper: "Optional, but helps us personalize patterns and suggestions.",
      type: "multi",
      required: false,
      options: SYMPTOMS,
      when: (a) =>
        a.goal === "Reduce symptoms" ||
        (a.biggest_struggles as string[])?.includes(
          "I get symptoms but don’t know why"
        ),
    },
    {
      id: "symptom_pattern",
      label: "When do symptoms usually happen?",
      helper:
        "We’ll use this to suggest a practical tracking approach (not medical advice).",
      type: "single",
      required: true,
      options: [
        "Soon after eating",
        "Hours later / next day",
        "Only when eating out",
        "Random / unclear",
        "Not sure",
      ],
      when: () => hasSymptoms,
    },
    {
      id: "trigger_suspects",
      label: "Anything you suspect is triggering symptoms?",
      helper: "Optional — e.g., oats, sauces, dairy, stress, caffeine.",
      type: "text",
      required: false,
      placeholder: "Type suspected triggers or patterns…",
      when: () => hasSymptoms,
    },

    // --- Attempts / success ---
    {
      id: "past_attempts",
      label: "What best describes where you’re at?",
      helper:
        "We’ll adapt your plan to your experience level and what you’ve tried.",
      type: "single",
      required: true,
      options: [
        "I’m new to this",
        "I’ve tried elimination diets",
        "I’m gluten-free but still get symptoms",
        "Tracking apps didn’t work for me",
        "Working with a clinician",
      ],
    },
    {
      id: "success_definition",
      label: "What does “success” look like in 2–4 weeks?",
      helper:
        "Make it real — less anxiety eating, fewer symptoms, consistent meals, etc.",
      type: "text",
      required: true,
      placeholder: "Example: Eat safely all week without anxiety + no bloating.",
    },

    // --- Reality constraints ---
    {
      id: "cooking_time",
      label: "How much time can you spend per meal?",
      type: "single",
      required: true,
      options: ["5–10 min", "15–25 min", "30–45 min", "Meal prep 1x/week", "Mix"],
    },
    {
      id: "cooking_skill",
      label: "How comfortable are you cooking?",
      type: "single",
      required: true,
      options: ["Beginner", "Intermediate", "Confident", "I mostly assemble foods"],
    },
    {
      id: "household",
      label: "Who are you cooking for?",
      helper: "This affects portioning, complexity, and “family-safe” swaps.",
      type: "single",
      required: true,
      options: ["Just me", "Me + partner", "Family with kids", "Shared household"],
    },
    {
      id: "budget",
      label: "Weekly grocery budget (approx.)",
      type: "single",
      required: true,
      options: ["<$50", "$50–$100", "$100–$175", "$175–$250", "$250+"],
    },
    {
      id: "shopping_style",
      label: "How do you prefer to shop?",
      helper: "We’ll tailor your product strategy.",
      type: "single",
      required: true,
      options: [
        "I want exact safe brands/products",
        "I’m okay with ingredients-based rules",
        "I want the simplest defaults (tell me what to buy)",
        "I like exploring options (give me variety)",
      ],
    },
    {
      id: "cuisine_prefs",
      label: "Preferred cuisines / flavors",
      type: "multi",
      required: true,
      options: [
        "Mediterranean",
        "Middle Eastern",
        "South Asian",
        "East Asian",
        "Latin",
        "American",
        "Simple / mild flavors",
        "Spicy",
      ],
    },
    {
      id: "hard_avoids_favorites",
      label: "Hard avoids + favorites",
      helper:
        "Tell us foods you absolutely avoid and foods you love (so the plan feels like you).",
      type: "text",
      required: false,
      placeholder: "Avoid: mushrooms. Love: chicken bowls, rice, berries…",
    },

    // --- Nutrition goal (optional but useful) ---
    {
      id: "macro_goal",
      label: "Any nutrition preference you care about?",
      helper: "Optional — we’ll keep it simple.",
      type: "single",
      required: false,
      options: [
        "High-protein",
        "Lower sugar",
        "Higher calories (gain weight)",
        "Lower calories (lose weight)",
        "Balanced / no focus",
      ],
    },

    // --- Output shaping ---
    {
      id: "plan_includes",
      label: "What do you want your guide to include?",
      helper: "Select what would actually help you stick to it.",
      type: "multi",
      required: true,
      options: PLAN_INCLUDES,
    },
    {
      id: "coaching_style",
      label: "What tone should GrainFree use?",
      type: "single",
      required: true,
      options: COACHING_STYLE,
    },
    {
      id: "final_notes",
      label: "Anything else we should know to personalize this?",
      helper: "Optional — schedule, travel, cravings, social situations, etc.",
      type: "text",
      required: false,
      placeholder: "Add anything important here…",
    },
  ];

  // Apply `when` conditions
  return base.filter((s) => (s.when ? s.when(answers) : true));
}

function RecapCard({ answers }: { answers: Answers }) {
  const restrictions = (answers.restrictions as string[]) || [];
  const struggles = (answers.biggest_struggles as string[]) || [];
  const goal = answers.goal as string | null;

  const topRestrictions = restrictions.slice(0, 3);
  const topStruggles = struggles.slice(0, 2);

  if (!goal && restrictions.length === 0 && struggles.length === 0) return null;

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
      <p className="font-[AeonikArabic] text-xs uppercase tracking-widest text-white/60">
        Your personalization so far
      </p>
      <div className="mt-2 space-y-2 font-[AeonikArabic] text-white/85">
        {goal ? (
          <div>
            <span className="text-white/60">Goal:</span>{" "}
            <span className="font-semibold">{goal}</span>
          </div>
        ) : null}

        {topRestrictions.length ? (
          <div className="flex flex-wrap gap-2">
            <span className="text-white/60">Protect from:</span>
            {topRestrictions.map((r) => (
              <span
                key={r}
                className="rounded-full bg-[#00B84A]/15 border border-[#00B84A]/25 px-3 py-1 text-xs text-[#9DE7C5]"
              >
                {r}
              </span>
            ))}
            {restrictions.length > 3 ? (
              <span className="text-white/60 text-xs">
                +{restrictions.length - 3} more
              </span>
            ) : null}
          </div>
        ) : null}

        {topStruggles.length ? (
          <div className="flex flex-wrap gap-2">
            <span className="text-white/60">Focus areas:</span>
            {topStruggles.map((s) => (
              <span
                key={s}
                className="rounded-full bg-white/10 border border-white/15 px-3 py-1 text-xs text-white/85"
              >
                {s}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function BuildWizard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answers>(defaultAnswers);

  const steps = useMemo(() => buildSteps(answers), [answers]);
  const step = steps[stepIndex];
  const progress = useMemo(
    () => Math.round(((stepIndex + 1) / steps.length) * 100),
    [stepIndex, steps.length]
  );

  // session + draft
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace("/auth");
        return;
      }
      setUserId(data.session.user.id);

      const { data: draft } = await supabase
        .from("healthplans_drafts")
        .select("answers")
        .eq("user_id", data.session.user.id)
        .single();

      if (draft?.answers) {
        setAnswers({ ...defaultAnswers, ...(draft.answers as Partial<Answers>) });
      }
    };
    init();
  }, [router]);

  // autosave
  useEffect(() => {
    if (!userId) return;
    const saveDraft = async () => {
      await supabase.from("healthplans_drafts").upsert({ user_id: userId, answers });
    };
    saveDraft();
  }, [answers, userId]);

  // Keep stepIndex in bounds if steps change due to branching
  useEffect(() => {
    if (stepIndex > steps.length - 1) setStepIndex(steps.length - 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps.length]);

  const onSelect = (value: string) => {
    if (!step) return;

    if (step.type === "single") {
      setAnswers((s) => ({ ...s, [step.id]: value }));
      return;
    }

    if (step.type === "multi") {
      const current = (answers[step.id] as string[]) || [];
      // Special rule: struggles = max 2 (premium, not overwhelming)
      const maxPick = step.id === "biggest_struggles" ? 2 : 99;

      const set = new Set(current);
      if (set.has(value)) {
        set.delete(value);
      } else {
        if (set.size >= maxPick) {
          // Replace last selection to avoid “blocked” feel
          const arr = Array.from(set);
          arr.shift();
          setAnswers((s) => ({ ...s, [step.id]: [...arr, value] }));
          return;
        }
        set.add(value);
      }
      setAnswers((s) => ({ ...s, [step.id]: Array.from(set) }));
      return;
    }
  };

  const onScale = (n: number) => {
    setAnswers((s) => ({ ...s, [step.id]: n }));
  };

  const onNext = () => {
    if (stepIndex < steps.length - 1) setStepIndex((i) => i + 1);
  };

  const onPrev = () => {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  };

  const isLast = stepIndex === steps.length - 1;

  const canNext = useMemo(() => {
    if (!step) return false;

    const a = answers[step.id];

    if (!step.required) return true;

    if (step.type === "text") {
      // required text must be non-empty
      return typeof a === "string" && a.trim().length > 0;
    }

    if (step.type === "multi") {
      return selectedCount(a) > 0;
    }

    if (step.type === "single") {
      return a !== null && a !== "";
    }

    if (step.type === "scale") {
      return typeof a === "number";
    }

    return false;
  }, [answers, step]);

  const buildPayloadForAI = (answers: Answers) => {
    const restrictions = (answers.restrictions as string[]) || [];
    const symptoms = (answers.symptoms as string[]) || [];
    const struggles = (answers.biggest_struggles as string[]) || [];
    const planIncludes = (answers.plan_includes as string[]) || [];

    return {
      user_profile: {
        goal: answers.goal,
        restrictions: restrictions,
        other_restrictions: answers.other_restrictions,
        reaction_severity: answers.reaction_severity,
        cross_contamination: answers.cross_contamination,
        kitchen_environment: answers.kitchen_environment,
        eating_out_frequency: answers.eating_out_frequency,
        struggles: struggles,
        symptoms: symptoms,
        symptom_pattern: answers.symptom_pattern,
        trigger_suspects: answers.trigger_suspects,
        past_attempts: answers.past_attempts,
        success_definition: answers.success_definition,
        cooking_time: answers.cooking_time,
        cooking_skill: answers.cooking_skill,
        household: answers.household,
        budget: answers.budget,
        shopping_style: answers.shopping_style,
        cuisine_prefs: (answers.cuisine_prefs as string[]) || [],
        hard_avoids_favorites: answers.hard_avoids_favorites,
        macro_goal: answers.macro_goal,
        coaching_style: answers.coaching_style,
        final_notes: answers.final_notes,
      },
      output_preferences: {
        plan_includes: planIncludes,
        tone: answers.coaching_style,
      },
      output_schema_hint: {
        // This helps your Groq prompt return consistent JSON.
        sections: [
          "profileSummary",
          "safetyRules",
          "safeSwaps",
          "7DayStarterPlan",
          "groceryList",
          "eatingOutPlaybook",
          "symptomTrackingRoutine",
          "budgetStrategy",
          "nextSteps",
        ],
      },
    };
  };

  const onSubmit = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const payload = buildPayloadForAI(answers);

      const res = await fetch("/api/test-groq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, answers, payload }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        console.error(data.error || "Failed to generate plan");
        return;
      }

      await supabase.from("healthplans_drafts").delete().eq("user_id", userId);
      router.push("/dash?newPlan=1");
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      console.error(message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#475845]">
      <div className="bg-[#475845]">
        <Header />
      </div>

      <main className="flex-1 flex items-center justify-center">
        <section className="rounded-2xl bg-[#2C4435] backdrop-blur-md border border-white/15 p-6 md:p-10 w-full max-w-4xl mx-4">
          {!started ? (
            <div className="flex flex-col items-center text-center space-y-6">
              <h1 className="text-3xl md:text-4xl font-bold text-white font-[AeonikArabic]">
                Build Your Personal <span className="italic">Allergen-Free</span> Guide
              </h1>
              <p className="text-white/80 max-w-lg font-[AeonikArabic]">
                Answer a few questions and we’ll generate a safety-first plan: safe meals, safe products, swaps,
                and a routine that fits your real life.
              </p>

              <button
                onClick={() => setStarted(true)}
                className="font-[AeonikArabic] px-10 py-3 rounded-lg bg-[#65A775] hover:bg-[#3E824F] text-[#25332A] text-lg font-normal shadow"
              >
                Start
              </button>

              <div className="max-w-xl w-full pt-2">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4 text-left">
                  <p className="font-[AeonikArabic] text-white/80 text-sm">
                    <span className="font-semibold text-white">Privacy note:</span> This is for personalization.
                    GrainFree doesn’t diagnose — it provides practical safety guidance and routines.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Title + Progress */}
              <header className="mb-6 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="font-[AeonikArabic] text-sm uppercase tracking-widest text-white/70">
                    Question {stepIndex + 1} of {steps.length}
                  </p>
                  <p className="font-[AeonikArabic] text-sm text-white/60">
                    {progress}%
                  </p>
                </div>

                <h1 className="font-[AeonikArabic] text-2xl md:text-3xl font-bold text-white">
                  {step?.label}
                </h1>
                {step?.helper ? (
                  <p className="font-[AeonikArabic] text-white/70">{step.helper}</p>
                ) : null}

                <div className="w-full h-2 bg-white/10 rounded">
                  <div
                    className="h-2 bg-[#4B7C57] rounded"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Recap card after early steps */}
                {stepIndex >= 3 ? <RecapCard answers={answers} /> : null}
              </header>

              {/* Content */}
              <div className="space-y-4">
                {step?.type === "text" ? (
                  <textarea
                    value={(answers[step.id] as string) || ""}
                    onChange={(e) =>
                      setAnswers((s) => ({ ...s, [step.id]: e.target.value }))
                    }
                    placeholder={step.placeholder}
                    rows={5}
                    className="w-full rounded-lg border border-white/10 bg-white/5 p-3 outline-none placeholder:text-white/50 font-[AeonikArabic] text-white"
                  />
                ) : step?.type === "scale" ? (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between mb-2 font-[AeonikArabic] text-white/70 text-sm">
                      <span>{step.minLabel ?? "Low"}</span>
                      <span>{step.maxLabel ?? "High"}</span>
                    </div>
                    <input
                      type="range"
                      min={step.min ?? 1}
                      max={step.max ?? 5}
                      value={(answers[step.id] as number) ?? (step.min ?? 1)}
                      onChange={(e) => onScale(Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="mt-2 font-[AeonikArabic] text-white/80">
                      Selected:{" "}
                      <span className="font-semibold text-white">
                        {(answers[step.id] as number) ?? (step.min ?? 1)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="font-[AeonikArabic] grid grid-cols-1 md:grid-cols-2 gap-3">
                    {step?.options?.map((opt) => {
                      const selected =
                        step.type === "single"
                          ? answers[step.id] === opt
                          : ((answers[step.id] as string[]) || []).includes(opt);

                      return (
                        <button
                          key={opt}
                          onClick={() => onSelect(opt)}
                          className={`px-5 py-4 rounded-lg border transition text-left ${
                            selected
                              ? "bg-[#008509] border-[#008509] text-white"
                              : "bg-[#355B3E] border-[#384E3E] hover:bg-[#3E824F] text-white/90"
                          }`}
                        >
                          <div className="font-semibold">{opt}</div>

                          {/* micro helper for “Other” choices */}
                          {opt.toLowerCase().includes("other") && selected ? (
                            <div className="mt-1 text-xs text-white/80">
                              You’ll be able to type details next.
                            </div>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Actions */}
              <footer className="mt-8 flex items-center justify-between">
                <button
                  onClick={onPrev}
                  disabled={stepIndex === 0}
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-40 font-[AeonikArabic] text-white"
                >
                  Back
                </button>

                {!isLast ? (
                  <button
                    onClick={onNext}
                    disabled={!canNext}
                    className="px-5 py-2 rounded-lg bg-[#008509] hover:bg-green-700 disabled:opacity-40 font-[AeonikArabic] text-white"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={onSubmit}
                    className="px-5 py-2 rounded-lg bg-[#008509] hover:bg-green-700 font-[AeonikArabic] text-white"
                  >
                    Build my guide
                  </button>
                )}
              </footer>
            </>
          )}

          {/* Loading Overlay */}
          {loading && (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#008509] border-t-transparent mb-4" />
              <p className="text-lg font-semibold font-[AeonikArabic] text-white">
                Building your allergen-safe guide…
              </p>
              <p className="mt-2 max-w-md text-center font-[AeonikArabic] text-white/70 text-sm">
                We’re tailoring safety rules, swaps, meals, and a routine based on your answers.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
