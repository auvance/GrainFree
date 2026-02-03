import { Suspense } from "react";
import PageDash from "@/components/pages/PageDash";

export default function DashPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading…</div>}>
      <PageDash />
    </Suspense>
  );
}