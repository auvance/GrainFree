"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function PageAuth() {
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } },
      });
      if (error) setMessage(error.message);
      else setMessage("Check your email to confirm your account.");
    }

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message);
    }

    if (mode === "forgot") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "http://localhost:3000/auth/reset",
      });
      if (error) setMessage(error.message);
      else setMessage("We’ve sent you a password reset email.");
    }
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" });
  };

  return (
    <main className="min-h-screen bg-[#475845] flex flex-col items-center justify-center px-4">
      {/* Top heading */}
      <div className="text-center mb-8">
        <h2 className="text-[3rem] font-bold text-white font-[AeonikArabic]">
          Welcome to{" "}
          <span className="text-[#4A4A4A]">Grain</span>
          <span className="text-[#008509]">Free!</span>
        </h2>
        <p className="text-[1.2rem] font-[AeonikArabic] text-white/80 mt-2">
          Sign up or log in to continue
        </p>
      </div>

      {/* Glassy card */}
      <section className="w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-8">
        <h1 className="font-[AeonikArabic] text-xl font-semibold text-center text-white mb-4">
          {mode === "signup"
            ? "Create Account"
            : mode === "signin"
            ? "Sign In"
            : "Forgot Password"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            className="font-[AeonikArabic] w-full rounded-lg border border-white/20 bg-white/20 placeholder-white/60 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#008509]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
           
          />

          {mode !== "forgot" && (
            <input
              type="password"
              placeholder="Password"
              className="font-[AeonikArabic] w-full rounded-lg border border-white/20 bg-white/20 placeholder-white/60 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#008509]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}

          {mode === "signup" && (
            <input
              type="text"
              placeholder="Username"
              className="font-[AeonikArabic] w-full rounded-lg border border-white/20 bg-white/20 placeholder-white/60 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#008509]"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          )}

          {message && (
            <p className="font-[AeonikArabic] text-sm text-red-400 bg-red-500/10 px-3 py-2 rounded">
              {message}
            </p>
          )}

          <button
            type="submit"
            className="font-[AeonikArabic] cursor-pointer w-full rounded-lg bg-[#008509] py-2 text-white font-medium hover:bg-green-700 transition"
          >
            {mode === "signup"
              ? "Sign Up"
              : mode === "signin"
              ? "Sign In"
              : "Send Reset Link"}
          </button>
        </form>

        {mode !== "forgot" && (
          <button
            onClick={handleGoogle}
            className="font-[AeonikArabic] cursor-pointer mt-3 w-full rounded-lg bg-white/20 text-white py-2 hover:bg-white/30 transition"
          >
            Continue with Google
          </button>
        )}

        {/* Switch states */}
        <p className="mt-4 text-center text-xs text-white/70">
          {mode === "signup" && (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setMode("signin")}
                className="font-[AeonikArabic] cursor-pointer text-[#00A76F] underline"
              >
                Sign In
              </button>
            </>
          )}
          {mode === "signin" && (
            <>
              Don’t have an account?{" "}
              <button
                onClick={() => setMode("signup")}
                className="font-[AeonikArabic] cursor-pointer text-[#00A76F] underline"
              >
                Sign Up
              </button>
              <br />
              Forgot password?{" "}
              <button
                onClick={() => setMode("forgot")}
                className="font-[AeonikArabic] cursor-pointer text-[#00A76F] underline"
              >
                Reset
              </button>
            </>
          )}
          {mode === "forgot" && (
            <>
              Remembered your password?{" "}
              <button
                onClick={() => setMode("signin")}
                className="font-[AeonikArabic] text-[#00A76F] underline"
              >
                Sign In
              </button>
            </>
          )}
        </p>
      </section>
    </main>
  );
}
