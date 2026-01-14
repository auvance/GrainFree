"use client";

import { supabase } from "@/lib/supabaseClient";

export default function PageProfileSecurity() {
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error);
      alert("Failed to log out. Please try again.");
    } else {
      window.location.href = "/"; // redirect to homepage
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-semibold mb-6 font-[AeonikArabic]">Security & Access</h1>
      <p className="text-gray-300 mb-8 font-[AeonikArabic]">
        Manage your account security, sessions, and sign out safely from all
        devices.
      </p>

      <div className="space-y-6">
        <div className="bg-[#2C4435] border border-white/10 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-2 font-[AeonikArabic]">Two-Factor Authentication</h2>
          <p className="text-sm text-gray-400 mb-4 font-[AeonikArabic]">
            Coming soon — secure your account with multi-factor authentication
            for extra protection.
          </p>
          <button
            disabled
            className="px-5 py-2 rounded-lg bg-gray-600 text-white cursor-not-allowed opacity-70 font-[AeonikArabic]"
          >
            Disabled
          </button>
        </div>

        <div className="bg-[#2C4435] border border-white/10 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-2 font-[AeonikArabic]">Active Sessions</h2>
          <p className="text-sm text-gray-400 mb-4 font-[AeonikArabic]">
            You&apos;re currently signed in on this device. Sign out to end this
            session.
          </p>
          <button
            onClick={handleLogout}
            className="px-5 py-2 rounded-lg bg-red-700 hover:bg-red-800 font-semibold font-[AeonikArabic]"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
