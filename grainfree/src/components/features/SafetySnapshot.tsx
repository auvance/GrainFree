"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/providers/AuthProvider";

type DraftAnswers = Record<string, any> | null;

function Chip({ children }: { children: string }) {
  return (
    <span className="rounded-full bg-[#00B84A]/15 border border-[#00B84A]/25 px-3 py-1 text-xs text-[#9DE7C5] font-[AeonikArabic]">
      {children}
    </span>
  );
}

export default function SafetySnapshot({
  title = "Safety snapshot",
  onUpdateGuide,
}: {
  title?: string;
  onUpdateGuide?: () => void;
}) {
  const { user } = useAuth();
  const [draft, setDraft] = useState<DraftAnswers>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const run = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("healthplans_drafts")
        .select("answers")
        .eq("user_id", user.id)
        .maybeSingle();

      setDraft((data?.answers as DraftAnswers) ?? null);
      setLoading(false);
    };

    run();
  }, [user]);

  const restrictions = useMemo(() => {
    const diet = (draft?.dietary_restrictions ?? []) as string[];
    const conditions = (draft?.specific_conditions ?? []) as string[];
    // Keep chips clean and “safety” focused
    const merged = [...diet, ...conditions].filter(Boolean);
    return Array.from(new Set(merged)).slice(0, 10);
  }, [draft]);

  const symptoms = useMemo(() => {
    const s = (draft?.symptoms ?? []) as string[];
    return s.slice(0, 4);
  }, [draft]);

  const lifestyle = useMemo(() => {
    const l = (draft?.lifestyle ?? []) as string[];
    return l.slice(0, 3);
  }, [draft]);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/15 backdrop-blur-xl p-6 sm:p-7">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/8 to-transparent opacity-70" />
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-[AeonikArabic] text-xs tracking-[0.18em] uppercase text-white/60">
              safety
            </p>
            <h2 className="mt-2 font-[AeonikArabic] text-[1.45rem] font-semibold">
              {title}
            </h2>
            <p className="mt-2 font-[AeonikArabic] text-sm text-white/70 leading-relaxed">
              Your personal rules at a glance. (This pulls from your wizard draft.)
            </p>
          </div>

          {onUpdateGuide ? (
            <button
              onClick={onUpdateGuide}
              className="rounded-xl border border-white/12 bg-white/8 hover:bg-white/12 transition px-4 py-2 text-xs font-[AeonikArabic]"
            >
              Update
            </button>
          ) : null}
        </div>

        {loading ? (
          <p className="mt-4 font-[AeonikArabic] text-sm text-white/70">
            Loading your safety profile…
          </p>
        ) : restrictions.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="font-[AeonikArabic] text-white/80 font-semibold">
              No safety profile yet.
            </p>
            <p className="mt-1 font-[AeonikArabic] text-sm text-white/70">
              Build/rebuild your guide so GrainFree knows your restrictions and conditions.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-4 flex flex-wrap gap-2">
              {restrictions.map((r) => (
                <Chip key={r}>{r}</Chip>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="font-[AeonikArabic] text-xs tracking-[0.18em] uppercase text-white/60">
                  symptoms
                </p>
                <p className="mt-2 font-[AeonikArabic] text-sm text-white/85">
                  {symptoms.length ? symptoms.join(", ") : "Not set"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="font-[AeonikArabic] text-xs tracking-[0.18em] uppercase text-white/60">
                  lifestyle
                </p>
                <p className="mt-2 font-[AeonikArabic] text-sm text-white/85">
                  {lifestyle.length ? lifestyle.join(", ") : "Not set"}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
