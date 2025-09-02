"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function PageAuth() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    }
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAFAF5]">
      <div className="w-full max-w-md bg-white shadow rounded-lg p-8">
        <h1 className="text-2xl font-bold text-center text-[#3D4F46]">
          {mode === "signup" ? "Create Account" : "Sign In"}
        </h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded border px-4 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full rounded border px-4 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full rounded bg-green-600 py-2 text-white"
          >
            {mode === "signup" ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <button
          onClick={handleGoogle}
          className="mt-4 w-full rounded bg-gray-200 py-2"
        >
          Continue with Google
        </button>

        <p className="mt-4 text-center text-sm">
          {mode === "signup" ? "Already have an account?" : "Don’t have an account?"}{" "}
          <button
            onClick={() =>
              setMode(mode === "signup" ? "signin" : "signup")
            }
            className="text-green-600 underline"
          >
            {mode === "signup" ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </main>
  );
}
