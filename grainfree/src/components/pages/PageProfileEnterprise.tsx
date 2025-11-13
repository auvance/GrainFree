"use client";

import { useState } from "react";
import PageProfileAccount from "../features/PageProfileAccount";
import PageProfilePreferences from "../features/PageProfilePreference";
import PageProfileSecurity from "../features/PageProfileSecurity";
import Header from "../layout/Header";

export default function PageProfileEnterprise() {
  const [activeTab, setActiveTab] = useState("account");

  const menu = [
    { id: "account", label: "Profile Settings" },
    { id: "preferences", label: "Account Preferences" },
    { id: "security", label: "Security" },
  ];

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
    
    <main className="min-h-screen  bg-[#1F2E2B] text-white">
      
        <section className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="w-64 bg-[#233B34] border-r border-white/10 p-6 flex flex-col">
            <h2 className="text-2xl font-semibold mb-8">Account</h2>
            <nav className="flex flex-col gap-2">
              {menu.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`text-left px-4 py-2 rounded-lg transition ${
                    activeTab === item.id
                      ? "bg-[#00B84A] text-white"
                      : "hover:bg-white/10 text-gray-300"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <section className="flex-1 p-10 bg-gradient-to-b from-[#2F4339] to-[#3E594E]">
            {renderSection()}
          </section>
      </section>
    </main>
  );
}
