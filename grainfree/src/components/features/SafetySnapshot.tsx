"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/providers/AuthProvider";

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

type ProfileSafetyRow = {
  allergens: string[] | string | null;
  diet: string[] | string | null;
};


export default function SafetySnapshot({
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
    <section className={`relative overflow-hidden rounded-3xl border border-white/10 bg-black/15 backdrop-blur-xl p-6 sm:p-7 mr-4 ml-4`}>
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
              Pulled from your profile (allergens/diet).
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
