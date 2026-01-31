"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { IScannerControls } from "@zxing/browser";
import { BrowserMultiFormatReader } from "@zxing/browser";

type Props = {
  open: boolean;
  onClose: () => void;
  onDetected: (code: string) => void;
  title?: string;
};

export default function BarcodeScannerModal({
  open,
  onClose,
  onDetected,
  title = "Scan barcode",
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);

  const [status, setStatus] = useState<
    "idle" | "starting" | "ready" | "permission_denied" | "unsupported" | "error"
  >("idle");

  const [errorMsg, setErrorMsg] = useState<string>("");
  const [manualCode, setManualCode] = useState("");

  const isSecureContext = useMemo(() => {
    if (typeof window === "undefined") return true;
    return window.isSecureContext || window.location.hostname === "localhost";
  }, []);

  

  useEffect(() => {
    if (!open) return;

    if (!isSecureContext) {
      setStatus("unsupported");
      setErrorMsg("Camera requires HTTPS (or localhost).");
      return;
    }
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setStatus("unsupported");
      setErrorMsg("Camera access is not supported in this browser.");
      return;
    }

    let cancelled = false;

    const start = async () => {
      setStatus("starting");
      setErrorMsg("");

      try {
        const reader = new BrowserMultiFormatReader();


        if (videoRef.current) {
          videoRef.current.setAttribute("playsinline", "true"); // iOS Safari
          videoRef.current.muted = true;
          videoRef.current.autoplay = true;
        }

        const constraints: MediaStreamConstraints = {
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        };

        const controls = await reader.decodeFromConstraints(
          constraints,
          videoRef.current!,
          (result) => {
            if (result) {
              const text = result.getText();
              const cleaned = text.replace(/\s+/g, "");
              onDetected(cleaned);
              onClose();
            }
          }
        );

        if (cancelled) {
          controls.stop();
          return;
        }

        controlsRef.current = controls;
        setStatus("ready");
      } catch (e: any) {
        const name = e?.name || "";
        const msg = e?.message || "Failed to start camera.";

        if (name === "NotAllowedError" || name === "SecurityError") {
          setStatus("permission_denied");
          setErrorMsg("Camera permission denied. Enable it in your browser settings.");
        } else {
          setStatus("error");
          setErrorMsg(msg);
        }
      }
    };

    start();

    return () => {
      cancelled = true;
      controlsRef.current?.stop();
      controlsRef.current = null;
      setStatus("idle");
      setErrorMsg("");
      setManualCode("");
    };
  }, [open, isSecureContext, onClose, onDetected]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* overlay */}
      <button
        aria-label="Close scanner"
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
      />

      {/* modal */}
      <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-[520px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border border-white/15 bg-white/80 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center justify-between border-b border-black/5 p-5">
          <div>
            <h2 className="text-base font-semibold text-[#1E3B32]">{title}</h2>
            <p className="text-xs text-gray-600">
              Point your camera at the barcode. Good lighting helps.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-black/10 px-3 py-1 text-sm hover:bg-black/5"
          >
            Close
          </button>
        </div>

        <div className="space-y-4 p-5">
          <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-black">
            <video ref={videoRef} className="h-[320px] w-full object-cover" />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-[180px] w-[280px] rounded-2xl border-2 border-white/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.15)]" />
            </div>

            {status === "starting" && (
              <div className="absolute inset-0 grid place-items-center text-sm text-white">
                Starting camera…
              </div>
            )}
          </div>

          {status === "unsupported" && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {errorMsg || "Barcode scanning isn’t supported here."}
            </div>
          )}

          {status === "permission_denied" && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              {errorMsg}
              <div className="mt-2 text-xs text-amber-900/70">
                iPhone Safari: aA → Website Settings → Camera → Allow
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {errorMsg}
            </div>
          )}

          <div className="rounded-2xl border border-black/10 bg-white p-3">
            <label className="text-xs font-medium text-gray-700">
              Enter barcode manually
            </label>
            <div className="mt-2 flex gap-2">
              <input
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                inputMode="numeric"
                placeholder="e.g., 0123456789012"
                className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#009B3E]/20"
              />
              <button
                onClick={() => {
                  const cleaned = manualCode.replace(/\s+/g, "");
                  if (!cleaned) return;
                  onDetected(cleaned);
                  onClose();
                }}
                className="shrink-0 rounded-xl bg-[#1E3B32] px-4 py-2 text-sm text-white hover:bg-[#162d26]"
              >
                Go
              </button>
            </div>

            <p className="mt-2 text-[11px] text-gray-500">
              If scanning fails, paste/type the barcode here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
