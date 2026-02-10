"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/providers/AuthProvider";

type Goal = { title: string; progress: number };

type ProfileSafetyRow = {
  allergens: string[] | string | null;
  diet: string[] | string | null;
};

function Chip({ children }: { children: string }) {
  return (
    <span className="rounded-full bg-[#00B84A]/15 border border-[#00B84A]/25 px-3 py-1 text-xs text-[#9DE7C5] font-[AeonikArabic]">
      {children}
    </span>
  );
}

function asArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(String).map((s) => s.trim()).filter(Boolean);
  if (typeof v === "string") return v.split(",").map((x) => x.trim()).filter(Boolean);
  return [];
}

export default function PlanGoals({
  goals = [],
  variant = "preview",
  limit = 4,
  onViewAll,
  onBuildGuide,
}: {
  goals: Goal[];
  variant?: "preview" | "full";
  limit?: number;
  onViewAll?: () => void;
  onBuildGuide?: () => void;
}) {
  const shown = useMemo(() => {
    const clean = Array.isArray(goals) ? goals : [];
    return variant === "full" ? clean : clean.slice(0, limit);
  }, [goals, limit, variant]);

  const empty = shown.length === 0;
  const CARD_HEIGHT = "min-h-[600px] lg:min-h-[600px]";

  return (
    <section
      className={`relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#243A31] via-[#1E2F28] to-[#15221D] p-5 sm:p-6 ${CARD_HEIGHT}`}
    >
      <div className="pointer-events-none absolute inset-0 opacity-45 bg-[radial-gradient(circle_at_25%_20%,rgba(157,231,197,0.20),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_85%_70%,rgba(0,184,74,0.18),transparent_55%)]" />

      <div className="relative">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4">
          <div>
            <p className="font-[AeonikArabic] text-xs tracking-[0.22em] uppercase text-white/55">
              progress
            </p>
            <h3 className="mt-2 font-[AeonikArabic] text-[1.35rem] font-semibold">
              Your goals
            </h3>
            <p className="mt-1 font-[AeonikArabic] text-sm text-white/70">
              A clear path — updated as you log meals and follow your guide.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onViewAll && (
              <button
                onClick={onViewAll}
                className="rounded-xl border border-white/12 bg-white/5 hover:bg-white/10 transition px-3 py-2 text-xs font-[AeonikArabic] text-white/85"
              >
                View all
              </button>
            )}
            {onBuildGuide && (
              <button
                onClick={onBuildGuide}
                className="rounded-xl border border-white/12 bg-white/5 hover:bg-white/10 transition px-3 py-2 text-xs font-[AeonikArabic] text-white/85"
              >
                Update guide
              </button>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="mt-5 space-y-3">
          {empty ? (
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="font-[AeonikArabic] text-sm text-white/80">No goals yet.</p>
              <p className="mt-1 font-[AeonikArabic] text-xs text-white/60">
                Build a guide to generate goals that match your restrictions + lifestyle.
              </p>
            </div>
          ) : (
            shown.map((g, i) => <GoalRow key={`${g.title}-${i}`} goal={g} />)
          )}
        </div>

        {/* Footer hint */}
        <div className="mt-5 flex items-center justify-between gap-3">
          <p className="font-[AeonikArabic] text-xs text-white/55">
            Tip: “caution” foods will slow progress — scan products to stay consistent.
          </p>
        </div>

        {/* ✅ SafetySnapshot block goes right here (below goals + hint) */}
        <div className="mt-5">
          <SafetySnapshotInline title="Safety snapshot" onUpdateGuide={onBuildGuide} />
        </div>
      </div>
    </section>
  );
}

function GoalRow({ goal }: { goal: { title: string; progress: number } }) {
  const pct = clamp(Math.round(Number(goal.progress ?? 0)), 0, 100);

  return (
    <div className="rounded-2xl border border-white/10 bg-black/15 p-4 ">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-[AeonikArabic] text-sm font-medium text-white/90 truncate">
            {goal.title}
          </p>
          <p className="mt-1 font-[AeonikArabic] text-xs text-white/55">
            Progress target
          </p>
        </div>

        <div className="shrink-0 rounded-full border border-white/12 bg-black/20 px-3 py-1 text-[11px] font-[AeonikArabic] text-white/75">
          {pct}%
        </div>
      </div>

      <div className="mt-3 h-2 w-full rounded-full bg-white/10 overflow-hidden">
        <div className="h-full rounded-full bg-[#00B84A]/70" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/** Internal-only component: not exported, so imports remain unchanged */
function SafetySnapshotInline({
  title = "Safety snapshot",
  onUpdateGuide,
}: {
  title?: string;
  onUpdateGuide?: () => void;
}) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [allergens, setAllergens] = useState<string[]>([]);
  const [diet, setDiet] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;

    const run = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("profiles")
        .select("allergens, diet")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("SafetySnapshot profile fetch error:", error);
        setLoading(false);
        return;
      }

      const row = data as ProfileSafetyRow | null;

      setAllergens(asArray(row?.allergens));
      setDiet(asArray(row?.diet));

      setLoading(false);
    };

    run();
  }, [user]);

  const chips = useMemo(() => {
    const merged = [...allergens, ...diet].filter(Boolean);
    return Array.from(new Set(merged)).slice(0, 12);
  }, [allergens, diet]);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/15 backdrop-blur-xl p-4 sm:p-5">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/8 to-transparent opacity-70" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-[AeonikArabic] text-xs tracking-[0.18em] uppercase text-white/60">
              safety
            </p>
            <h2 className="mt-2 font-[AeonikArabic] text-[1.35rem] font-semibold">
              {title}
            </h2>
            <p className="mt-2 font-[AeonikArabic] text-sm text-white/70 leading-relaxed">
              Pulled from your profile=
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
          <p className="mt-4 font-[AeonikArabic] text-sm text-white/70">Loading…</p>
        ) : chips.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="font-[AeonikArabic] text-white/80 font-semibold">
              No safety profile yet.
            </p>
            <p className="mt-1 font-[AeonikArabic] text-sm text-white/70">
              Add allergens/diet in your profile or rebuild your guide.
            </p>
          </div>
        ) : (
          <div className="mt-4 flex flex-wrap gap-2">
            {chips.map((r) => (
              <Chip key={r}>{r}</Chip>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
