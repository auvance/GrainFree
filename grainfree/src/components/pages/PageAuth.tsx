"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

export default function PageAuth() {
  const router = useRouter();

  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Redirect away if already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.push("/");
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" && !isRedirecting) {
        router.push("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [router, isRedirecting]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRedirecting) return;

    setMessage("");
    setSuccess(false);

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } },
      });

      if (error) {
        setMessage(error.message);
      } else {
        setSuccess(true);
        setMessage("Account created! Check your email to confirm.");
      }
    }

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
      } else {
        setSuccess(true);
        setIsRedirecting(true);
        setMessage("Success! Logging you in, redirecting…");

        setTimeout(() => {
          router.push("/");
        }, 2000);
      }
    }

    if (mode === "forgot") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "http://localhost:3000/auth/reset",
      });

      if (error) {
        setMessage(error.message);
      } else {
        setSuccess(true);
        setMessage("Password reset email sent.");
      }
    }
  };

  const handleGoogle = async () => {
    if (isRedirecting) return;
    await supabase.auth.signInWithOAuth({ provider: "google" });
  };

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* LEFT — BRAND PANEL */}
      <section className="hidden lg:flex flex-col justify-around p-16 bg-gradient-to-br from-[#0F2A1D] to-[#1E3B32] text-white">
        <div>
          <h1 className="text-[6rem] font-bold font-[AeonikArabic] ">
            Grain<span className="text-[#00A76F] font-[AeonikArabic]">Free</span>
          </h1>
          <p className="max-w-md text-white/80 text-lg leading-relaxed font-[AeonikArabic]">
            Discover safe meals, track nutrition, and explore allergen-friendly
            foods, powered by real data and AI-driven health plans.
          </p>
        </div>

        <p className="text-sm text-white/40 font-[AeonikArabic]">
          © {new Date().getFullYear()} GrainFree. All rights reserved.
        </p>
      </section>

      {/* RIGHT — AUTH PANEL */}
      <section className="flex items-center justify-center px-6">
        <div className="w-full max-w-md">
        
        <div className="flex gap-5">
          <div className="mb-6">
            <Image 
              src="/LeafLogo.svg" 
              alt="GrainFree Logo" 
              width={60} 
              height={60}
            />
          </div>
          <div>
            <h2 className="text-3xl font-semibold mb-2 font-[AeonikArabic]">
            {mode === "signup"
              ? "Create account"
              : mode === "signin"
              ? "Welcome back"
              : "Reset password"}
            </h2>

            <p className="text-gray-500 mb-6 font-[AeonikArabic]">
            {mode === "signup"
              ? "It’s free and takes less than a minute."
              : mode === "signin"
              ? "Sign in to continue to your dashboard."
              : "We’ll email you a reset link."}
            </p>
          </div>
        </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              disabled={isRedirecting}
              className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#00A76F] font-[AeonikArabic]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {mode !== "forgot" && (
              <input
                type="password"
                placeholder="Password"
                disabled={isRedirecting}
                className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#00A76F] font-[AeonikArabic]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            )}

            {mode === "signup" && (
              <input
                type="text"
                placeholder="Username"
                disabled={isRedirecting}
                className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-[#00A76F] font-[AeonikArabic]"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            )}

            {message && (
              <p
                className={`text-sm px-3 py-2 rounded font-[AeonikArabic] ${
                  success
                    ? "text-green-700 bg-green-50"
                    : "text-red-500 bg-red-50"
                }`}
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={isRedirecting}
              className={`w-full py-3 rounded-md transition font-[AeonikArabic] ${
                isRedirecting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black text-white hover:opacity-90"
              }`}
            >
              {isRedirecting
                ? "Logging you in…"
                : mode === "signup"
                ? "Create account"
                : mode === "signin"
                ? "Login now"
                : "Send reset link"}
            </button>
          </form>

          {mode !== "forgot" && (
            <button
              onClick={handleGoogle}
              disabled={isRedirecting}
              className="w-full mt-4 border border-gray-300 py-3 rounded-md flex items-center justify-center gap-2 hover:bg-blue-50 font-[AeonikArabic]"
            >
              Continue with Google
            </button>
          )}

          {/* SWITCH MODES */}
          <div className="mt-6 text-sm text-gray-600 font-[AeonikArabic]">
            {mode === "signin" && (
              <>
                Don’t have an account?{" "}
                <button
                  onClick={() => setMode("signup")}
                  className="text-[#00A76F] underline"
                >
                  Create one
                </button>
                <br />
                <button
                  onClick={() => setMode("forgot")}
                  className="text-[#00A76F] underline mt-2 inline-block"
                >
                  Forgot password?
                </button>
              </>
            )}

            {mode === "signup" && (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setMode("signin")}
                  className="text-[#00A76F] underline"
                >
                  Sign in
                </button>
              </>
            )}

            {mode === "forgot" && (
              <>
                Remembered your password?{" "}
                <button
                  onClick={() => setMode("signin")}
                  className="text-[#00A76F] underline"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
