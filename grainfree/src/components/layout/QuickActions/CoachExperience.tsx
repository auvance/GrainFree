"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/providers/AuthProvider";

type ChatMsg = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
};

type HealthPlan = {
  title?: string;
  description?: string;
  goals?: { title: string; progress: number }[];
  recommendations?: { title: string; why?: string }[];
  [key: string]: any;
} | null;

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function cx(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

/**
 * CoachExperience
 * - Premium, calm “coach” surface (not a generic chat UI)
 * - Uses plan context when available
 * - Calls your API route (you can wire this to Groq next)
 */
export default function CoachExperience({
  plan,
  onExitToDash,
}: {
  plan?: HealthPlan;
  onExitToDash?: () => void;
}) {
  const { user } = useAuth();

  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>(() => [
    {
      id: uid(),
      role: "assistant",
      content: `Hey${user?.email ? "" : ""} — I’m your GrainFree Coach. Ask me anything about meals, products, symptoms, or your guide. I’ll keep it practical and safe.`,
      createdAt: Date.now(),
    },
  ]);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const suggested = useMemo(() => {
    const base = [
      "Is this product safe for me?",
      "What should I eat today based on my goal?",
      "I feel bloated — what are the likely triggers?",
      "Give me gluten-free swaps for my usual meals.",
    ];
    const goalHint = plan?.goals?.[0]?.title;
    if (goalHint) {
      return [
        `Help me with: ${goalHint}`,
        ...base,
      ].slice(0, 6);
    }
    return base;
  }, [plan]);

  const planContext = useMemo(() => {
    if (!plan) return null;
    return {
      title: plan.title,
      description: plan.description,
      goals: plan.goals?.slice?.(0, 4) ?? [],
      recommendations: plan.recommendations?.slice?.(0, 6) ?? [],
    };
  }, [plan]);

  async function send(text: string) {
    const t = text.trim();
    if (!t || busy) return;

    const userMsg: ChatMsg = {
      id: uid(),
      role: "user",
      content: t,
      createdAt: Date.now(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setBusy(true);

    try {
      /**
       * Wire to your Groq route next.
       * For now: we’ll call a placeholder endpoint if it exists.
       *
       * Recommended: create `/api/coach` that takes:
       * { userId, message, planContext }
       */
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id ?? null,
          message: t,
          planContext,
        }),
      });

      // If you haven’t created /api/coach yet, we’ll gracefully fallback:
      if (!res.ok) {
        const fallback: ChatMsg = {
          id: uid(),
          role: "assistant",
          content:
            "Coach API isn’t wired yet. Next step is creating `/api/coach` so I can answer using your plan + safe libraries.\n\nFor now: tell me what you’re trying to solve (symptoms, goal, or a product ingredient list) and I’ll help you design the prompts + schema.",
          createdAt: Date.now(),
        };
        setMessages((m) => [...m, fallback]);
        return;
      }

      const data = await res.json();
      const answerText =
        (typeof data?.answer === "string" && data.answer.trim()) ||
        "I didn’t get a usable response. Try again.";

      const assistantMsg: ChatMsg = {
        id: uid(),
        role: "assistant",
        content: answerText,
        createdAt: Date.now(),
      };
      setMessages((m) => [...m, assistantMsg]);
    } catch (e) {
      const assistantMsg: ChatMsg = {
        id: uid(),
        role: "assistant",
        content:
          "Something failed while contacting the coach. If you want, paste the console error and I’ll fix the route + payload.",
        createdAt: Date.now(),
      };
      setMessages((m) => [...m, assistantMsg]);
    } finally {
      setBusy(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  return (
    <div className="space-y-6">
      {/* Top context strip */}
      <div className="rounded-3xl border border-white/10 bg-black/20 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <p className="font-[AeonikArabic] text-xs tracking-[0.22em] uppercase text-white/60">
              personalized context
            </p>
            <h3 className="mt-2 font-[AeonikArabic] text-[1.35rem] font-semibold">
              {plan?.title ? plan.title : "No guide detected yet"}
            </h3>
            <p className="mt-2 font-[AeonikArabic] text-sm text-white/70 leading-relaxed max-w-[70ch]">
              {plan?.description
                ? plan.description
                : "Build a guide to unlock answers based on your dietary restrictions, symptoms, and goals."}
            </p>
          </div>

          {onExitToDash ? (
            <button
              onClick={onExitToDash}
              className="rounded-xl border border-white/12 bg-white/10 hover:bg-white/15 transition px-4 py-2 text-xs font-[AeonikArabic]"
            >
              Back to dashboard
            </button>
          ) : null}
        </div>

        {/* Suggested prompts */}
        <div className="mt-4 flex flex-wrap gap-2">
          {suggested.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => send(s)}
              disabled={busy}
              className={cx(
                "rounded-full border border-white/12 bg-white/8 hover:bg-white/12 transition px-3 py-2 text-xs font-[AeonikArabic] text-white/85",
                busy && "opacity-60 cursor-not-allowed"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Chat surface */}
      <div className="rounded-3xl border border-white/10 bg-black/20 overflow-hidden">
        <div className="p-5 sm:p-6 max-h-[55vh] overflow-y-auto">
          <div className="space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cx(
                  "flex",
                  m.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cx(
                    "max-w-[85%] rounded-2xl px-4 py-3 border text-sm sm:text-[0.95rem] font-[AeonikArabic] leading-relaxed whitespace-pre-wrap",
                    m.role === "user"
                      ? "bg-[#00B84A]/20 border-[#00B84A]/25 text-white"
                      : "bg-white/8 border-white/10 text-white/90"
                  )}
                >
                  {m.content}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-white/10 p-4 sm:p-5 bg-black/10">
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={2}
              placeholder="Ask anything… (Enter to send, Shift+Enter for newline)"
              className="flex-1 resize-none rounded-2xl bg-black/20 border border-white/10 px-4 py-3 font-[AeonikArabic] outline-none placeholder:text-white/45"
            />
            <button
              type="button"
              onClick={() => send(input)}
              disabled={busy || !input.trim()}
              className={cx(
                "rounded-2xl px-5 py-3 font-[AeonikArabic] text-sm border border-white/10 transition",
                busy || !input.trim()
                  ? "bg-white/5 text-white/50 cursor-not-allowed"
                  : "bg-[#00B84A] hover:bg-green-700 text-white"
              )}
            >
              {busy ? "…" : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
