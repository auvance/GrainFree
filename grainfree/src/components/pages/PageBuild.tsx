"use client";

import { useState } from "react";
import QuestionCard from "@/components/features/QuestionCard";
import LoadingScreen from "@/components/features/LoadingScreen";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header/Header";

type Question = {
  id: number;
  question: string;
  type: "multiple" | "single" | "text";
  options?: string[];
};

const questions: Question[] = [
  {
    id: 1,
    question: "What are your goals?",
    type: "multiple",
    options: [
      "Reduce Bloating/Gas",
      "Reduce Constipation",
      "Reduce Acid Reflux",
      "Gain Weight",
      "Gain Muscle",
      "Eat Healthier",
    ],
  },
  {
    id: 2,
    question: "Do you have any food allergies?",
    type: "multiple",
    options: ["Gluten", "Dairy", "Nuts", "Soy", "Eggs", "None"],
  },
  {
    id: 3,
    question: "What is your typical activity level?",
    type: "single",
    options: ["Low", "Moderate", "High"],
  },
  {
    id: 4,
    question: "What’s your preferred meal style?",
    type: "single",
    options: ["Quick Prep", "Home Cooked", "Mixed"],
  },
  {
    id: 5,
    question: "How many meals do you usually eat per day?",
    type: "single",
    options: ["2", "3", "4+"],
  },
  {
    id: 6,
    question: "What’s your budget preference?",
    type: "single",
    options: ["Low", "Medium", "High"],
  },
  {
    id: 7,
    question: "Do you prefer vegetarian or non-vegetarian meals?",
    type: "single",
    options: ["Vegetarian", "Non-Vegetarian", "Mixed"],
  },
  {
    id: 8,
    question: "Do you have any specific health conditions?",
    type: "multiple",
    options: ["Diabetes", "Celiac Disease", "IBS", "Other", "None"],
  },
  {
    id: 9,
    question: "How motivated are you to change your eating habits?",
    type: "single",
    options: ["Not very", "Somewhat", "Very motivated"],
  },
  {
    id: 10,
    question: "Anything else you'd like us to know? (Optional)",
    type: "text",
  },
];

export default function PageBuild() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string[] | string>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAnswer = (id: number, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const nextStep = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // Final submit
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        router.push("/dash?newPlan=true"); // redirect with flag
      }, 3000);
    }
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  if (loading) return <LoadingScreen />;

  return (


<main className="bg-[#475845]">
   <Header/>
   <section className="flex min-h-screen items-center justify-center  text-white px-4">

   
      <div className="w-full max-w-3xl">
        <QuestionCard
          question={questions[step]}
          answer={answers[questions[step].id]}
          onAnswer={handleAnswer}
        />

        {/* Navigation */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={prevStep}
            disabled={step === 0}
            className="px-4 py-2 bg-gray-500 rounded disabled:opacity-50"
          >
            Back
          </button>
          <button
            onClick={nextStep}
            className="px-4 py-2 bg-[#008509] rounded hover:bg-green-700"
          >
            {step === questions.length - 1 ? "Submit" : "Next"}
          </button>
        </div>

        {/* Progress */}
        <p className="mt-4 text-center text-sm text-gray-200">
          Question {step + 1} of {questions.length}
        </p>
      </div>
      </section>
    </main>
  );
}
