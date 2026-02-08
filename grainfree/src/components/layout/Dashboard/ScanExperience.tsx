"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import BarcodeScannerModal from "@/components/features/BarcodeScannerModal";

type ScanResult = {
  found: boolean;
  barcode: string;
  product?: {
    name: string;
    brand: string;
    image: string;
    ingredients_text: string;
    allergens: string;
    traces: string;
    quantity: string;
    countries: string;
  };
  verdict?: {
    level: "safe" | "caution" | "unsafe";
    reasons: { type: "allergen" | "diet"; key: string; label: string; evidence?: string }[];
    missingData?: boolean;
  };
  userContext?: { allergens: string[]; diet: string[] };
  error?: string;
};

function badgeStyles(level: "safe" | "caution" | "unsafe") {
  if (level === "safe") return "bg-[#00B84A]/20 border-[#00B84A]/25 text-white";
  if (level === "caution") return "bg-amber-400/15 border-amber-300/25 text-white";
  return "bg-red-500/15 border-red-400/25 text-white";
}

export default function ScanExperience({
  onAskCoach,
}: {
  onAskCoach?: (prefill?: string) => void;
}) {
  const { user } = useAuth();

  const [openScanner, setOpenScanner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);

  const [history, setHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  async function loadHistory() {
    if (!user?.id) return;
    setHistoryLoading(true);
    try {
      const res = await fetch("/api/scan/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, limit: 10 }),
      });
      const data = await res.json();
      setHistory(data.items ?? []);
    } finally {
      setHistoryLoading(false);
    }
  }

  async function runScan(barcode: string) {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ barcode, userId: user?.id ?? null }),
      });

      const data = (await res.json()) as ScanResult;
      setResult(data);

      // ✅ refresh history after scan (because api/scan inserts scan_history)
      await loadHistory();
    } catch {
      setResult({ found: false, barcode, error: "Scan failed. Try again." });
    } finally {
      setLoading(false);
    }
  }

  async function saveToLibrary() {
    if (!user?.id || !result?.found || !result.product || !result.verdict) return;

    setSaving(true);
    try {
      const res = await fetch("/api/scan/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          barcode: result.barcode,
          product: result.product,
          verdict: result.verdict,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save product");

      // optional: toast later
      // ✅ refresh history (and later you can refresh saved counts too)
      await loadHistory();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const level = result?.verdict?.level;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div>
          <p className="font-[AeonikArabic] text-xs tracking-[0.22em] uppercase text-white/60">
            scanner
          </p>
          <h2 className="mt-2 font-[AeonikArabic] text-[1.6rem] font-semibold">
            Scan a barcode for allergen safety
          </h2>
          <p className="mt-2 font-[AeonikArabic] text-sm text-white/70 max-w-[70ch]">
            We’ll check ingredients + allergen tags against your profile and warn you if something
            looks risky. Always verify labels for severe allergies.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              setResult(null);
              setOpenScanner(true);
            }}
            className="rounded-xl border border-white/12 bg-white/8 hover:bg-white/12 transition px-4 py-2 text-xs font-[AeonikArabic]"
          >
            Scan
          </button>

          {onAskCoach && (
            <button
              onClick={() =>
                onAskCoach(
                  result?.product
                    ? `Is "${result.product.name}" safe for me? Ingredients: ${result.product.ingredients_text}`
                    : "Is this product safe for me?"
                )
              }
              className="rounded-xl bg-[#00B84A] hover:bg-green-700 transition px-4 py-2 text-xs font-[AeonikArabic]"
            >
              Ask Coach
            </button>
          )}
        </div>
      </div>
      
      {/* Result */}
      {result && !loading && (
        <div className="rounded-3xl border border-white/10 bg-black/20 p-6 sm:p-7">
          {!result.found ? (
            <div className="space-y-2">
              <div className="font-[AeonikArabic] text-lg font-semibold">Not found</div>
              <div className="text-white/70 text-sm font-[AeonikArabic]">
                {result.error ?? "We couldn’t find this barcode in our product database."}
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Verdict header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <div className="font-[AeonikArabic] text-xl font-semibold">
                    {result.product?.name}
                  </div>
                  <div className="font-[AeonikArabic] text-sm text-white/70">
                    {result.product?.brand ? `${result.product.brand} • ` : ""}
                    {result.product?.quantity || ""}
                  </div>
                </div>

                {level && (
                  <div
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-[AeonikArabic] ${badgeStyles(
                      level
                    )}`}
                  >
                    <span className="font-semibold uppercase tracking-wider">{level}</span>
                    {result.verdict?.missingData ? (
                      <span className="text-white/75">(limited data)</span>
                    ) : null}
                  </div>
                )}
              </div>

              {/* Reasons */}
              <div className="space-y-2">
                <p className="font-[AeonikArabic] text-xs tracking-[0.22em] uppercase text-white/60">
                  why
                </p>

                {result.verdict?.reasons?.length ? (
                  <ul className="space-y-2">
                    {result.verdict.reasons.map((r, idx) => (
                      <li
                        key={`${r.key}-${idx}`}
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                      >
                        <div className="font-[AeonikArabic] text-sm text-white/90">
                          ⚠️ {r.label}
                        </div>
                        {r.evidence ? (
                          <div className="font-[AeonikArabic] text-xs text-white/60 mt-1">
                            Trigger: “{r.evidence}”
                          </div>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-[AeonikArabic] text-sm text-white/80">
                    No obvious conflicts found based on your profile. Still verify the label if you
                    have severe allergies.
                  </div>
                )}
              </div>

              {/* Ingredients */}
              <div className="space-y-2">
                <p className="font-[AeonikArabic] text-xs tracking-[0.22em] uppercase text-white/60">
                  ingredients
                </p>
                <div className="rounded-2xl border border-white/10 bg-black/15 px-4 py-3 font-[AeonikArabic] text-sm text-white/80 leading-relaxed whitespace-pre-wrap">
                  {result.product?.ingredients_text || "No ingredient text available."}
                </div>
              </div>

              {/* Footer actions */}
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  onClick={() => setOpenScanner(true)}
                  className="rounded-xl border border-white/12 bg-white/8 hover:bg-white/12 transition px-4 py-2 text-xs font-[AeonikArabic]"
                >
                  Scan another
                </button>

                {onAskCoach && (
                  <button
                    onClick={() =>
                      onAskCoach(
                        `Is "${result.product?.name}" safe for me? Ingredients: ${result.product?.ingredients_text}`
                      )
                    }
                    className="rounded-xl bg-[#00B84A] hover:bg-green-700 transition px-4 py-2 text-xs font-[AeonikArabic]"
                  >
                    Ask Coach
                  </button>
                )}

                <button
                  onClick={saveToLibrary}
                  disabled={saving}
                  className="rounded-xl border border-white/12 bg-white/8 hover:bg-white/12 transition px-4 py-2 text-xs font-[AeonikArabic] disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Save to library"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ✅ History always visible */}
      <section className="rounded-3xl border border-white/10 bg-black/15 p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-[AeonikArabic] text-xs tracking-[0.22em] uppercase text-white/60">
              history
            </p>
            <h3 className="mt-2 font-[AeonikArabic] text-[1.25rem] font-semibold">
              Recent scans
            </h3>
          </div>
          <button
            onClick={loadHistory}
            className="rounded-xl border border-white/12 bg-white/8 hover:bg-white/12 transition px-4 py-2 text-xs font-[AeonikArabic]"
          >
            {historyLoading ? "Refreshing…" : "Refresh"}
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {history.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm font-[AeonikArabic] text-white/70">
              {historyLoading ? "Loading history…" : "No scans yet. Scan your first product."}
            </div>
          ) : (
            history.slice(0, 10).map((h) => (
              <button
                key={h.id}
                onClick={() => {
                  setResult({
                    found: true,
                    barcode: h.barcode,
                    product: {
                      name: h.product_name,
                      brand: h.brand,
                      image: h.image,
                      ingredients_text: h.ingredients_text,
                      allergens: h.allergens,
                      traces: h.traces,
                      quantity: "",
                      countries: "",
                    },
                    verdict: {
                      level: h.verdict_level,
                      reasons: h.verdict_reasons ?? [],
                      missingData: false,
                    },
                  } as any);
                }}
                className="text-left rounded-2xl border border-white/10 bg-white/5 hover:bg-white/8 transition p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="font-[AeonikArabic] text-sm text-white/90 line-clamp-2">
                    {h.product_name || "Unknown product"}
                  </div>
                  <span className="rounded-full border border-white/12 bg-black/20 px-3 py-1 text-[11px] font-[AeonikArabic] text-white/75">
                    {h.verdict_level}
                  </span>
                </div>
                <div className="mt-1 font-[AeonikArabic] text-xs text-white/55">
                  {new Date(h.created_at).toLocaleString()}
                </div>
              </button>
            ))
          )}
        </div>
      </section>

      {/* Scanner Modal */}
      <BarcodeScannerModal
        open={openScanner}
        onClose={() => setOpenScanner(false)}
        onDetected={(code) => {
          setOpenScanner(false);
          runScan(code);
        }}
        title="Scan a product"
      />

      {/* Loading state */}
      {loading && (
        <div className="rounded-3xl border border-white/10 bg-black/20 p-6 font-[AeonikArabic] text-white/80">
          Checking product safety…
        </div>
      )}

      
    </div>
  );
}
