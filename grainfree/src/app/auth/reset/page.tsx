"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async () => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) setMessage(error.message);
    else setMessage("Password updated successfully. You can log in now.");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAFAF5] font-[AeonikArabic]">
      <div className="bg-white p-8 rounded-lg shadow w-full max-w-sm">
        <h1 className="text-xl font-bold mb-4">Reset Password</h1>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
        />
        <button
          onClick={handleReset}
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          Update Password
        </button>
        {message && <p className="mt-4 text-sm">{message}</p>}
      </div>
    </main>
  );
}
