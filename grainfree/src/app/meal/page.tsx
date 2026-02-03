import { Suspense } from "react";
import PageMeal from "@/components/pages/PageMeal";

export default function MealPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading…</div>}>
      <PageMeal />
    </Suspense>
  );
}