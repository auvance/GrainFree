"use client";

import { useEffect, useMemo, useState } from "react";
import PageProfileAccount from "@/components/profiles/PageProfileAccount";
import PageProfilePreferences from "@/components/profiles/PageProfilePreference";
import PageProfileSecurity from "@/components/profiles/PageProfileSecurity";
import Header from "@/components/layout/Header/Header";

type TabId = "account" | "preferences" | "security";

export default function PageProfileEnterprise() {
  const [activeTab, setActiveTab] = useState<TabId>("account");
  const [animKey, setAnimKey] = useState(0);

  const menu = useMemo(
    () => [
      { id: "account" as const, label: "Profile" },
      { id: "preferences" as const, label: "Diet & Allergens" },
      { id: "security" as const, label: "Security" },
    ],
    []
  );

  // subtle fade/slide when switching tabs
  useEffect(() => {
    setAnimKey((k) => k + 1);
  }, [activeTab]);

  const renderSection = () => {
    switch (activeTab) {
      case "preferences":
        return <PageProfilePreferences />;
      case "security":
        return <PageProfileSecurity />;
      default:
        return <PageProfileAccount />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="bg-black/95 backdrop-blur-sm border-b border-white/5">
        <Header />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-80 border-r border-white/10 bg-black p-6 flex flex-col overflow-y-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-[#00B84A] font-[AeonikArabic]">Settings</h1>
            <p className="text-sm text-white/50 mt-1 font-[AeonikArabic]">
              Manage your profile, diet rules, and security.
            </p>
          </div>

          <nav className="flex flex-col gap-2">
            {menu.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={[
                    "px-4 py-3 rounded-xl text-left transition-all duration-200 ease-out font-[AeonikArabic]",
                    "active:scale-[0.99]",
                    active
                      ? "bg-[#00B84A] text-black font-semibold shadow-[0_0_0_1px_rgba(0,184,74,0.35)]"
                      : "text-gray-300 hover:bg-white/5",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-[AeonikArabic]">{item.label}</span>
                    <span
                      className={[
                        "text-xs px-2 py-1 rounded-full transition-all duration-200 font-[AeonikArabic]",
                        active ? "bg-black/10 text-black" : "bg-white/5 text-white/40",
                      ].join(" ")}
                    >
                      {item.id === "preferences" ? "Global" : " "}
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>

          <div className="mt-auto pt-6 text-xs text-white/35 font-[AeonikArabic]">
            Tip: Your diet & allergens automatically apply to Hub + AI + products.
          </div>
        </aside>

        {/* Content */}
        <section className="flex-1 p-10 bg-[#0B0F0E] overflow-y-auto">
          <div
            key={animKey}
            className={[
              "max-w-3xl rounded-2xl border border-white/10 bg-[#121816] p-8",
              "transition-all duration-200 ease-out",
              "animate-[fadeInUp_220ms_ease-out]",
            ].join(" ")}
          >
            {renderSection()}
          </div>

          {/* local keyframes via tailwind arbitrary animation (needs no config) */}
          <style jsx global>{`
            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(6px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
        </section>
      </div>
    </div>
  );
}
