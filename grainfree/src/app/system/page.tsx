"use client";

import BuildWizard from "@/components/features/BuildWizard";

export default function BuildPage() {
  return (
    <main className="min-h-[100vh] bg-[#475845] px-4 text-white">
      <div className="mx-auto max-w-5xl">
        <BuildWizard />
      </div>
    </main>
  );
}
