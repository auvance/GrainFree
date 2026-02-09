"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  min?: number;
  max?: number;
  minLabel?: string;
  maxLabel?: string;
  required?: boolean;
  when?: (answers: Answers) => boolean;

  /**
   * ✅ NEW: per-step grid layout for option cards.
   * Examples:
   * - "grid-cols-1 md:grid-cols-2"
   * - "grid-cols-2 md:grid-cols-3 lg:grid-cols-7"
   */
  gridClassName?: string;
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
      helper: "This helps us tailor the guide to what matters most to you.",
      type: "single",
      required: true,
      options: [
        "Feel safe eating daily",
        "Reduce symptoms",
        "Build a sustainable routine",
        "Gain/lose weight safely",
        "Improve energy & performance",
      ],
      gridClassName: "grid-cols-1 md:grid-cols-2",
    },

    {
      id: "restrictions",
      label: "Which restrictions/allergens should GrainFree protect you from?",
      helper: "Select everything that applies. We’ll tailor safety rules and swaps.",
      type: "multi",
      required: true,
      options: RESTRICTIONS,
      // ✅ More dense (tweak this anytime)
      gridClassName: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5",
      // If you ever want 7 on desktop:
      // gridClassName: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-7",
    },

    {
      id: "other_restrictions",
      label: "Any other restrictions you want us to account for?",
      helper: "Optional — e.g., corn, oats, nightshades, specific brands/ingredients.",
      type: "text",
      required: false,
      placeholder: "Type anything important here…",
      when: (a) => hasOtherSelection(a.restrictions as string[]),
    },

    {
      id: "reaction_severity",
      label: "How serious are your reactions overall?",
      helper: "This changes how strict your plan should be (and how we handle eating out).",
      type: "single",
      required: true,
      options: [
        "Mild discomfort",
        "Moderate symptoms",
        "Severe / high-risk (e.g., anaphylaxis / epipen)",
        "Not sure",
      ],
      when: () => hasRestrictions,
      gridClassName: "grid-cols-1 md:grid-cols-2",
    },

    {
      id: "cross_contamination",
      label: "How sensitive are you to cross-contamination?",
      helper: "Think shared fryers, traces, shared cutting boards, etc.",
      type: "single",
      required: true,
      options: [
        "I can handle traces sometimes",
        "Depends — I’m somewhat sensitive",
        "Very sensitive — strict avoidance",
        "Not sure",
      ],
      when: () => hasRestrictions,
      gridClassName: "grid-cols-1 md:grid-cols-2",
    },

    {
      id: "kitchen_environment",
      label: "What’s your eating environment like?",
      helper: "We’ll tailor safety habits to your real life setup.",
      type: "single",
      required: true,
      options: [
        "Mostly home cooking",
        "Mix of home + eating out",
        "Mostly eating out / takeout",
        "Shared kitchen (roommates/family)",
      ],
      gridClassName: "grid-cols-1 md:grid-cols-2",
    },

    {
      id: "eating_out_frequency",
      label: "How often do you eat out or order takeout?",
      helper: "We’ll include an eating-out playbook if this is common.",
      type: "single",
      required: true,
      options: ["Rarely", "1–2x/week", "3–5x/week", "Most days"],
      gridClassName: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2",
    },

    {
      id: "biggest_struggles",
      label: "What are your biggest struggles right now?",
      helper: "Pick up to 2 — we’ll focus the plan around these.",
      type: "multi",
      required: true,
      options: STRUGGLES,
      gridClassName: "grid-cols-1 md:grid-cols-3 lg:grid-cols-3",
    },

    {
      id: "symptoms",
      label: "Any current symptoms you want to improve?",
      helper: "Optional, but helps us personalize patterns and suggestions.",
      type: "multi",
      required: false,
      options: SYMPTOMS,
      when: (a) =>
        a.goal === "Reduce symptoms" ||
        (a.biggest_struggles as string[])?.includes("I get symptoms but don’t know why"),
      // Symptoms can be dense too
      gridClassName: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    },

    {
      id: "symptom_pattern",
      label: "When do symptoms usually happen?",
      helper: "We’ll use this to suggest a practical tracking approach (not medical advice).",
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
      gridClassName: "grid-cols-1 md:grid-cols-2",
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

    {
      id: "past_attempts",
      label: "What best describes where you’re at?",
      helper: "We’ll adapt your plan to your experience level and what you’ve tried.",
      type: "single",
      required: true,
      options: [
        "I’m new to this",
        "I’ve tried elimination diets",
        "I’m gluten-free but still get symptoms",
        "Tracking apps didn’t work for me",
        "Working with a clinician",
      ],
      gridClassName: "grid-cols-1 md:grid-cols-2",
    },

    {
      id: "success_definition",
      label: "What does “success” look like in 2–4 weeks?",
      helper: "Make it real — less anxiety eating, fewer symptoms, consistent meals, etc.",
      type: "text",
      required: true,
      placeholder: "Example: Eat safely all week without anxiety + no bloating.",
    },

    {
      id: "cooking_time",
      label: "How much time can you spend per meal?",
      type: "single",
      required: true,
      options: ["5–10 min", "15–25 min", "30–45 min", "Meal prep 1x/week", "Mix"],
      gridClassName: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5",
    },

    {
      id: "cooking_skill",
      label: "How comfortable are you cooking?",
      type: "single",
      required: true,
      options: ["Beginner", "Intermediate", "Confident", "I mostly assemble foods"],
      gridClassName: "grid-cols-1 md:grid-cols-2",
    },

    {
      id: "household",
      label: "Who are you cooking for?",
      helper: "This affects portioning, complexity, and “family-safe” swaps.",
      type: "single",
      required: true,
      options: ["Just me", "Me + partner", "Family with kids", "Shared household"],
      gridClassName: "grid-cols-1 md:grid-cols-2",
    },

    {
      id: "budget",
      label: "Weekly grocery budget (approx.)",
      type: "single",
      required: true,
      options: ["<$50", "$50–$100", "$100–$175", "$175–$250", "$250+"],
      gridClassName: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5",
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
      gridClassName: "grid-cols-1 md:grid-cols-2",
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
      gridClassName: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
    },

    {
      id: "hard_avoids_favorites",
      label: "Hard avoids + favorites",
      helper: "Tell us foods you absolutely avoid and foods you love (so the plan feels like you).",
      type: "text",
      required: false,
      placeholder: "Avoid: mushrooms. Love: chicken bowls, rice, berries…",
    },

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
      gridClassName: "grid-cols-1 md:grid-cols-2",
    },

    {
      id: "plan_includes",
      label: "What do you want your guide to include?",
      helper: "Select what would actually help you stick to it.",
      type: "multi",
      required: true,
      options: PLAN_INCLUDES,
      // This is often a “big list” → denser layout feels better
      gridClassName: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2",
      // Or if you really want it compressed:
      // gridClassName: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    },

    {
      id: "coaching_style",
      label: "What tone should GrainFree use?",
      type: "single",
      required: true,
      options: COACHING_STYLE,
      gridClassName: "grid-cols-1 md:grid-cols-3",
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
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="font-[AeonikArabic] text-[0.7rem] uppercase tracking-[0.22em] text-white/60">
        Your personalization so far
      </p>

      <div className="mt-3 space-y-2 font-[AeonikArabic] text-white/85 text-sm">
        {goal ? (
          <div>
            <span className="text-white/60">Goal:</span>{" "}
            <span className="font-semibold">{goal}</span>
          </div>
        ) : null}

        {topRestrictions.length ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-white/60">Protect from:</span>
            {topRestrictions.map((r) => (
              <span
                key={r}
                className="rounded-full bg-[#00B84A]/15 border border-[#00B84A]/25 px-3 py-1 text-[0.72rem] text-[#9DE7C5]"
              >
                {r}
              </span>
            ))}
            {restrictions.length > 3 ? (
              <span className="text-white/60 text-[0.72rem]">
                +{restrictions.length - 3} more
              </span>
            ) : null}
          </div>
        ) : null}

        {topStruggles.length ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-white/60">Focus areas:</span>
            {topStruggles.map((s) => (
              <span
                key={s}
                className="rounded-full bg-white/10 border border-white/15 px-3 py-1 text-[0.72rem] text-white/85"
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

  const [phase, setPhase] = useState<"idle" | "out" | "in">("idle");
  const pendingIndexRef = useRef<number | null>(null);

  const steps = useMemo(() => buildSteps(answers), [answers]);
  const step = steps[stepIndex];

  const progress = useMemo(
    () => Math.round(((stepIndex + 1) / steps.length) * 100),
    [stepIndex, steps.length]
  );

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

  useEffect(() => {
    if (!userId) return;
    const saveDraft = async () => {
      await supabase.from("healthplans_drafts").upsert({ user_id: userId, answers });
    };
    saveDraft();
  }, [answers, userId]);

  useEffect(() => {
    if (stepIndex > steps.length - 1) setStepIndex(steps.length - 1);
  }, [steps.length, stepIndex]);

  const canNext = useMemo(() => {
    if (!step) return false;
    const a = answers[step.id];

    if (!step.required) return true;
    if (step.type === "text") return typeof a === "string" && a.trim().length > 0;
    if (step.type === "multi") return selectedCount(a) > 0;
    if (step.type === "single") return a !== null && a !== "";
    if (step.type === "scale") return typeof a === "number";
    return false;
  }, [answers, step]);

  const isLast = stepIndex === steps.length - 1;

  const transitionTo = (nextIndex: number) => {
    if (phase !== "idle") return;
    pendingIndexRef.current = nextIndex;

    setPhase("out");

    window.setTimeout(() => {
      const idx = pendingIndexRef.current;
      if (typeof idx === "number") setStepIndex(idx);
      setPhase("in");

      window.setTimeout(() => {
        setPhase("idle");
        pendingIndexRef.current = null;
      }, 170);
    }, 170);
  };

  const onSelect = (value: string) => {
    if (!step) return;

    if (step.type === "single") {
      setAnswers((s) => ({ ...s, [step.id]: value }));
      return;
    }

    if (step.type === "multi") {
      const current = (answers[step.id] as string[]) || [];
      const maxPick = step.id === "biggest_struggles" ? 2 : 99;

      const set = new Set(current);
      if (set.has(value)) {
        set.delete(value);
      } else {
        if (set.size >= maxPick) {
          const arr = Array.from(set);
          arr.shift();
          setAnswers((s) => ({ ...s, [step.id]: [...arr, value] }));
          return;
        }
        set.add(value);
      }
      setAnswers((s) => ({ ...s, [step.id]: Array.from(set) }));
    }
  };

  const onScale = (n: number) => {
    if (!step) return;
    setAnswers((s) => ({ ...s, [step.id]: n }));
  };

  const onNext = () => {
    if (stepIndex < steps.length - 1) transitionTo(stepIndex + 1);
  };

  const onPrev = () => {
    if (stepIndex > 0) transitionTo(stepIndex - 1);
  };

  const buildPayloadForAI = (answers: Answers) => {
    const restrictions = (answers.restrictions as string[]) || [];
    const symptoms = (answers.symptoms as string[]) || [];
    const struggles = (answers.biggest_struggles as string[]) || [];
    const planIncludes = (answers.plan_includes as string[]) || [];

    return {
      user_profile: {
        goal: answers.goal,
        restrictions,
        other_restrictions: answers.other_restrictions,
        reaction_severity: answers.reaction_severity,
        cross_contamination: answers.cross_contamination,
        kitchen_environment: answers.kitchen_environment,
        eating_out_frequency: answers.eating_out_frequency,
        struggles,
        symptoms,
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

  const contentOpacity =
    phase === "out" ? "opacity-0" : "opacity-100";

  const contentTransform =
    phase === "out" ? "translate-y-[2px]" : "translate-y-0";

  // ✅ NEW: step-specific grid layout fallback
  const optionGridCols = step?.gridClassName ?? "grid-cols-1 md:grid-cols-2";

  return (
    <div className="min-h-screen text-white">
      <Header />

      <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#2E3F36]">
          <div className="relative p-5 sm:p-6 md:p-8">
            <div className="mx-auto w-full max-w-4xl">
              <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl p-5 sm:p-6 md:p-8 flex flex-col">
                {!started ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <p className="font-[AeonikArabic] text-xs tracking-[0.22em] uppercase text-white/70">
                      build wizard
                    </p>
                    <h1 className="mt-3 font-[AeonikArabic] text-3xl md:text-4xl font-bold">
                      Build Your Personal{" "}
                      <span className="italic text-[#9DE7C5]">Allergen-Safe</span>{" "}
                      Guide
                    </h1>
                    <p className="mt-4 font-[AeonikArabic] text-white/80 max-w-xl leading-relaxed">
                      Answer a few questions and we’ll generate a safety-first plan: safe meals,
                      safe products, swaps, and a routine that fits your real life.
                    </p>

                    <button
                      onClick={() => setStarted(true)}
                      className="mt-8 rounded-xl bg-[#00B84A] hover:bg-green-700 transition px-8 py-3 font-[AeonikArabic] text-sm text-white"
                    >
                      Start
                    </button>

                    <div className="mt-6 w-full max-w-xl">
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left">
                        <p className="font-[AeonikArabic] text-white/80 text-sm leading-relaxed">
                          <span className="font-semibold text-white">Privacy note:</span> This is for
                          personalization. GrainFree doesn’t diagnose — it provides practical safety
                          guidance and routines.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <header className="shrink-0">
                      <div className="flex items-center justify-between gap-4">
                        <p className="font-[AeonikArabic] text-xs uppercase tracking-[0.22em] text-white/70">
                          Question {stepIndex + 1} of {steps.length}
                        </p>
                        <p className="font-[AeonikArabic] text-xs text-white/60">
                          {progress}%
                        </p>
                      </div>

                      <div className="mt-3 h-2 w-full rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#9DE7C5]/80 transition-[width] duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>

                      <div className="mt-5">
                        <h1 className="font-[AeonikArabic] text-xl sm:text-2xl md:text-3xl font-bold leading-tight">
                          {step?.label}
                        </h1>
                        {step?.helper ? (
                          <p className="mt-2 font-[AeonikArabic] text-sm text-white/70 leading-relaxed">
                            {step.helper}
                          </p>
                        ) : null}
                      </div>

                      <div className="mt-4">
                        {stepIndex >= 3 ? <RecapCard answers={answers} /> : null}
                      </div>
                    </header>

                    <div className="mt-5 flex-1 overflow-hidden">
                      <div
                        className={[
                          "h-full transition-all duration-200 ease-out",
                          contentOpacity,
                          contentTransform,
                        ].join(" ")}
                      >
                        {step?.type === "text" ? (
                          <div className="h-full">
                            <textarea
                              value={(answers[step.id] as string) || ""}
                              onChange={(e) =>
                                setAnswers((s) => ({ ...s, [step.id]: e.target.value }))
                              }
                              placeholder={step.placeholder}
                              className={[
                                "w-full h-full resize-none",
                                "rounded-2xl border border-white/10 bg-white/5",
                                "p-4 outline-none placeholder:text-white/45",
                                "font-[AeonikArabic] text-white leading-relaxed",
                                "focus:ring-2 focus:ring-[#9DE7C5]/30",
                              ].join(" ")}
                            />
                          </div>
                        ) : step?.type === "scale" ? (
                          <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-5 flex flex-col justify-center">
                            <div className="flex items-center justify-between mb-3 font-[AeonikArabic] text-white/70 text-sm">
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

                            <div className="mt-4 font-[AeonikArabic] text-white/80">
                              Selected:{" "}
                              <span className="font-semibold text-white">
                                {(answers[step.id] as number) ?? (step.min ?? 1)}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="h-full">
                            <div
                              className={[
                                "grid gap-3 h-full content-start",
                                // ✅ PER-STEP CONTROL HERE
                                optionGridCols,
                              ].join(" ")}
                            >
                              {step?.options?.map((opt) => {
                                const selected =
                                  step.type === "single"
                                    ? answers[step.id] === opt
                                    : ((answers[step.id] as string[]) || []).includes(opt);

                                return (
                                  <button
                                    key={opt}
                                    onClick={() => onSelect(opt)}
                                    className={[
                                      "group rounded-2xl border text-left transition",
                                      "px-4 py-4",
                                      "font-[AeonikArabic]",
                                      selected
                                        ? "bg-[#00B84A]/90 border-[#00B84A] text-white"
                                        : "bg-black/20 border-white/10 hover:bg-white/8 text-white/90",
                                    ].join(" ")}
                                    type="button"
                                  >
                                    <div className="flex items-start justify-between gap-3">
                                      <div className="min-w-0">
                                        <div className="font-semibold leading-snug line-clamp-2">
                                          {opt}
                                        </div>
                                        {opt.toLowerCase().includes("other") && selected ? (
                                          <div className="mt-1 text-xs text-white/80">
                                            You’ll be able to type details next.
                                          </div>
                                        ) : null}
                                      </div>

                                      <div
                                        className={[
                                          "shrink-0 mt-0.5 h-5 w-5 rounded-full border",
                                          selected
                                            ? "border-white/80 bg-white/20"
                                            : "border-white/25 bg-black/10 group-hover:border-white/40",
                                        ].join(" ")}
                                      />
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <footer className="mt-5 shrink-0 flex items-center justify-between">
                      <button
                        onClick={onPrev}
                        disabled={stepIndex === 0 || phase !== "idle"}
                        className="rounded-xl border border-white/12 bg-white/5 hover:bg-white/10 disabled:opacity-40 transition px-4 py-2 font-[AeonikArabic] text-sm"
                        type="button"
                      >
                        Back
                      </button>

                      {!isLast ? (
                        <button
                          onClick={onNext}
                          disabled={!canNext || phase !== "idle"}
                          className="rounded-xl bg-[#00B84A] hover:bg-green-700 disabled:opacity-40 transition px-5 py-2 font-[AeonikArabic] text-sm"
                          type="button"
                        >
                          Next
                        </button>
                      ) : (
                        <button
                          onClick={onSubmit}
                          disabled={phase !== "idle"}
                          className="rounded-xl bg-[#00B84A] hover:bg-green-700 disabled:opacity-40 transition px-5 py-2 font-[AeonikArabic] text-sm"
                          type="button"
                        >
                          Build my guide
                        </button>
                      )}
                    </footer>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#00B84A] border-t-transparent mb-4" />
          <p className="text-lg font-semibold font-[AeonikArabic] text-white">
            Building your allergen-safe guide…
          </p>
          <p className="mt-2 max-w-md text-center font-[AeonikArabic] text-white/70 text-sm">
            We’re tailoring safety rules, swaps, meals, and a routine based on your answers.
          </p>
        </div>
      )}
    </div>
  );
}
