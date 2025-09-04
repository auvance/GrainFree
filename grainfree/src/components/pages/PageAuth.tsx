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
      const { data, error } = await supabase.auth.signUp({
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
    <main className="flex min-h-screen items-center justify-center bg-[#FAFAF5]">
      <div className="w-full max-w-md bg-white shadow rounded-lg p-8">
        <h1 className="text-2xl font-bold text-center text-[#3D4F46]">
          {mode === "signup"
            ? "Create Account"
            : mode === "signin"
            ? "Sign In"
            : "Forgot Password"}
        </h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded border px-4 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {mode !== "forgot" && (
            <input
              type="password"
              placeholder="Password"
              className="w-full rounded border px-4 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}

          {mode === "signup" && (
            <input
              type="text"
              placeholder="Username"
              className="w-full rounded border px-4 py-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          )}

          {message && <p className="text-sm text-red-600">{message}</p>}

          <button
            type="submit"
            className="w-full rounded bg-green-600 py-2 text-white"
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
            className="mt-4 w-full rounded bg-gray-200 py-2"
          >
            Continue with Google
          </button>
        )}

        <p className="mt-4 text-center text-sm">
          {mode === "signup" && (
            <>
              Already have an account?{" "}
              <button onClick={() => setMode("signin")} className="text-green-600 underline">
                Sign In
              </button>
            </>
          )}
          {mode === "signin" && (
            <>
              Don’t have an account?{" "}
              <button onClick={() => setMode("signup")} className="text-green-600 underline">
                Sign Up
              </button>
              <br />
              Forgot password?{" "}
              <button onClick={() => setMode("forgot")} className="text-green-600 underline">
                Reset
              </button>
            </>
          )}
          {mode === "forgot" && (
            <>
              Remembered your password?{" "}
              <button onClick={() => setMode("signin")} className="text-green-600 underline">
                Sign In
              </button>
            </>
          )}
        </p>
      </div>
    </main>
  );
}
