"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Header from "@/components/layout/Header/Header";

type Answer = string | string[] | null;

// Step IDs
type Step =
  | "goal"
  | "dietary_restrictions"
  | "symptoms"
  | "activity_level"
  | "age_range"
  | "specific_conditions"
  | "lifestyle"
  | "budget"
  | "cuisine_prefs"
  | "freeform";

// Step configuration type
type StepConfig = {
  id: Step;
  label: string;
  type: "single" | "multi" | "text";
  options?: string[];
  placeholder?: string;
};

// Step definitions
const steps: StepConfig[] = [
  {
    id: "goal",
    label: "Primary goal(s)",
    type: "multi",
    options: ["Gain healthy weight", "Reduce bloating", "Energy & stamina", "General clean eating"],
  },
  { id: "dietary_restrictions", label: "Dietary restrictions", type: "multi", options: ["Gluten-free", "Lactose-free", "Nut-free", "Soy-free", "Halal", "Vegan"] },
  { id: "symptoms", label: "Current symptoms (if any)", type: "multi", options: ["Brain fog", "Bloating", "Fatigue", "Indigestion", "Nausea", "Skin flare-ups"] },
  { id: "activity_level", label: "Activity level", type: "single", options: ["Low", "Moderate", "High"] },
  { id: "age_range", label: "Age range", type: "single", options: ["13-17", "18-24", "25-34", "35-44", "45-54", "55+"] },
  { id: "specific_conditions", label: "Specific conditions", type: "multi", options: ["Celiac", "IBS", "IBD", "Diabetes", "PCOS", "Other"] },
  { id: "lifestyle", label: "Lifestyle preferences", type: "multi", options: ["Quick prep", "Meal prep Sundays", "Family-friendly", "Budget-friendly", "High-protein"] },
  { id: "budget", label: "Weekly grocery budget (approx)", type: "single", options: ["<$40", "$40-$75", "$75-$120", "$120-$200", "$200+"] },
  { id: "cuisine_prefs", label: "Preferred cuisines", type: "multi", options: ["Mediterranean", "Middle Eastern", "South Asian", "East Asian", "Latin", "American"] },
  {
    id: "freeform",
    label: "Anything else to personalize?",
    type: "text",
    placeholder: "Add extra details (e.g., foods you avoid, schedule, or your own goals)",
  },
];


export default function BuildWizard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<Step, Answer>>({
    goal: [],
    dietary_restrictions: [],
    symptoms: [],
    activity_level: null,
    age_range: null,
    specific_conditions: [],
    lifestyle: [],
    budget: null,
    cuisine_prefs: [],
    freeform: "",
  });

  const step = steps[stepIndex];
  const progress = useMemo(() => Math.round(((stepIndex + 1) / steps.length) * 100), [stepIndex]);

  // Load session + saved answers
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace("/auth");
        return;
      }
      setUserId(data.session.user.id);

      // Load saved draft from Supabase (table: healthplans_drafts)
      const { data: draft } = await supabase
        .from("healthplans_drafts")
        .select("answers")
        .eq("user_id", data.session.user.id)
        .single();

      if (draft?.answers) {
        setAnswers(draft.answers);
      }
    };
    init();
  }, [router]);

  // Auto-save to Supabase on answers change
  useEffect(() => {
    if (!userId) return;
    const saveDraft = async () => {
      await supabase
        .from("healthplans_drafts")
        .upsert({ user_id: userId, answers });
    };
    saveDraft();
  }, [answers, userId]);

  const onSelect = (value: string) => {
    if (step.type === "single") {
      setAnswers((s) => ({ ...s, [step.id]: value }));
    } else if (step.type === "multi") {
      const arr = new Set([...(answers[step.id] as string[]), value]);
      if ((answers[step.id] as string[]).includes(value)) arr.delete(value);
      setAnswers((s) => ({ ...s, [step.id]: Array.from(arr) }));
    }
  };

  const onNext = () => {
    if (stepIndex < steps.length - 1) setStepIndex((i) => i + 1);
  };
  const onPrev = () => {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  };

  const onSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/test-groq", {
        next: {revalidate: 3600},
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, answers }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        console.error(data.error || "Failed to generate plan");
        return;
      }

      // Clear draft after successful plan generation
      await supabase.from("healthplans_drafts").delete().eq("user_id", userId);

      router.push("/dash?newPlan=1");
  } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      console.error(message);
      setLoading(false);
    }
  };

  const isLast = stepIndex === steps.length - 1;
  const canNext =
    (step.type === "text" && typeof answers[step.id] === "string") ||
    (step.type !== "text" && answers[step.id] !== null);

  return (
    <div className="min-h-screen flex flex-col bg-[#475845]">
      {/* Header */}
      <div className="bg-[#475845]">
        <Header />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center">
        <section className="rounded-2xl bg-[#2C4435] backdrop-blur-md border border-white/15 p-6 md:p-25 w-full max-w-4xl mx-4">
      {!started ? (
        <div className="flex flex-col items-center text-center space-y-6">
          <h1 className="w-150 text-3xl md:text-4xl font-bold text-white font-[AeonikArabic]">
            Ready To Build Your Personal<span className="italic"> Gluten Free</span> Guide?
          </h1>
          <p className="text-white/80 max-w-lg font-[AeonikArabic]">
            We&apos;ll ask a few quick questions and create your personalized results, products, meals, and tools to get you started.
          </p>
          <button
            onClick={() => setStarted(true)}
            className="font-[AeonikArabic] px-20 py-3 rounded-lg bg-[#65A775] hover:bg-[#3E824F] text-[#25332A] text-lg font-normal shadow"
          >
            Start!
          </button>
        </div>
      ) : (
        <>
          {/* Title + Progress */}
          <header className="mb-6">
            <p className="font-[AeonikArabic] text-sm uppercase tracking-widest text-white/70">
              Question {stepIndex + 1} of {steps.length}
            </p>
            <h1 className="font-[AeonikArabic] text-2xl md:text-3xl font-bold">{step.label}</h1>
          </header>

          <div className="w-full h-2 bg-white/10 rounded mb-6">
            <div className="h-2 bg-[#4B7C57] rounded" style={{ width: `${progress}%` }} />
          </div>

          {/* Content */}
          <div className="space-y-4">
            {step.type !== "text" && step.options?.length ? (
              <div className="font-[AeonikArabic] grid grid-cols-1 md:grid-cols-2 gap-3">
                {step.options.map((opt) => {
                  const selected =
                    step.type === "single"
                      ? answers[step.id] === opt
                      : (answers[step.id] as string[])?.includes(opt);
                  return (
                    <button
                      key={opt}
                      onClick={() => onSelect(opt)}
                      className={`px-5 py-5 rounded-lg border transition text-center ${
                        selected
                          ? "bg-[#008509] border-[#008509] text-white"
                          : "bg-[#355B3E] border-[#384E3E] hover:bg-[#3E824F] text-[#06200B]"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            ) : (
              <textarea
                value={(answers.freeform as string) || ""}
                onChange={(e) => setAnswers((s) => ({ ...s, freeform: e.target.value }))}
                placeholder={step.placeholder}
                rows={5}
                className="w-full rounded-lg border border-white/10 bg-white/5 p-3 outline-none placeholder:text-white/50 font-[AeonikArabic] text-white"
              />
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
                Build my plan
              </button>
            )}
          </footer>
        </>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#008509] border-t-transparent mb-4" />
          <p className="text-lg font-semibold font-[AeonikArabic] text-white">Building your meal plan for a better life…</p>
        </div>
      )}
        </section>
      </main>
    </div>
  );
}
