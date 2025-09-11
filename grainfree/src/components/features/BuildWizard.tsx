"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Answer = string | string[] | null;

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

const steps: { id: Step; label: string; type: "single" | "multi" | "text"; options?: string[]; placeholder?: string }[] = [
  { id: "goal", label: "Primary goal", type: "single", options: ["Gain healthy weight", "Reduce bloating", "Energy & stamina", "General clean eating"] },
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
    placeholder: "Add extra details (e.g., specific foods you avoid, schedule, goals in your own words)",
  },
];

export default function BuildWizard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<Step, Answer>>({
    goal: null,
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

  // Gate: logged-in users only
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.replace("/auth");
    });
  }, [router]);

  const progress = useMemo(() => Math.round(((stepIndex + 1) / steps.length) * 100), [stepIndex]);

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
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user.id;
    if (!userId) {
      setLoading(false);
      router.replace("/auth");
      return;
    }

    try {
      const res = await fetch("/api/test-groq", {
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

      // Redirect and show “new plan” popup
      router.push("/dash?newPlan=1");
    } catch (e: any) {
      console.error(e.message);
      setLoading(false);
    }
  };

  const isLast = stepIndex === steps.length - 1;
  const canNext =
    (step.type === "text" && typeof answers[step.id] === "string") ||
    (step.type !== "text" && answers[step.id] !== null && (Array.isArray(answers[step.id]) ? (answers[step.id] as string[]).length >= 0 : true));

  return (
    <section className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-6 md:p-8">
      {/* Title */}
      <header className="mb-6">
        <p className="text-sm uppercase tracking-widest text-white/70">Build your plan</p>
        <h1 className="text-2xl md:text-3xl font-bold">{step.label}</h1>
      </header>

      {/* Progress */}
      <div className="w-full h-2 bg-white/10 rounded mb-6">
        <div className="h-2 bg-[#008509] rounded" style={{ width: `${progress}%` }} />
      </div>

      {/* Content */}
      <div className="space-y-4">
        {step.type !== "text" && step.options?.length ? (
          <div className="flex flex-wrap gap-3">
            {step.options.map((opt) => {
              const selected =
                step.type === "single"
                  ? answers[step.id] === opt
                  : (answers[step.id] as string[])?.includes(opt);
              return (
                <button
                  key={opt}
                  onClick={() => onSelect(opt)}
                  className={`px-3 py-2 rounded-lg border transition ${
                    selected ? "bg-[#008509] border-[#008509] text-white" : "bg-white/5 border-white/15 hover:bg-white/10"
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
            className="w-full rounded-lg border border-white/10 bg-white/5 p-3 outline-none placeholder:text-white/50"
          />
        )}
      </div>

      {/* Actions */}
      <footer className="mt-8 flex items-center justify-between">
        <button
          onClick={onPrev}
          disabled={stepIndex === 0}
          className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-40"
        >
          Back
        </button>

        {!isLast ? (
          <button
            onClick={onNext}
            disabled={!canNext}
            className="px-5 py-2 rounded-lg bg-[#008509] hover:bg-green-700 disabled:opacity-40"
          >
            Next
          </button>
        ) : (
          <button onClick={onSubmit} className="px-5 py-2 rounded-lg bg-[#008509] hover:bg-green-700">
            Build my plan
          </button>
        )}
      </footer>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#008509] border-t-transparent mb-4" />
          <p className="text-lg font-semibold">Building your meal plan for a better life…</p>
        </div>
      )}
    </section>
  );
}
