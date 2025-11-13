"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/providers/AuthProvider";

export default function PageProfileAccount() {
  const { user } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ─── Load profile ───────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", user.id)
          .maybeSingle();
        if (error) throw error;
        setUsername(data?.username || "");
        setEmail(user.email || "");
      } catch (err) {
        console.error("Error fetching profile:", err);
        setMessage("⚠️ Could not load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  // ─── Save changes ───────────────────────────────────────────────
  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setMessage("");
    try {
      const updates = {
        id: user.id,
        username,
        updated_at: new Date().toISOString(),
      };
      const { error } = await supabase.from("profiles").upsert(updates);
      if (error) throw error;
      setMessage("✅ Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      setMessage("⚠️ Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  // ─── UI ───────────────────────────────────────────────
  if (!user)
    return (
      <div className="text-gray-300">
        Please sign in to view your account settings.
      </div>
    );

  return (
    <div className="max-w-2xl">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-sm text-gray-300 hover:text-white transition"
      >
        <span className="text-xl leading-none">←</span> Back to Main
      </button>

      <h1 className="text-3xl font-semibold mb-6">Profile Settings</h1>

      {loading ? (
        <p className="text-gray-400">Loading…</p>
      ) : (
        <div className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full bg-[#1E3B32] border border-white/10 px-4 py-3 rounded-lg focus:ring-2 focus:ring-[#00B84A]"
            />
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Email</label>
            <input
              value={email}
              disabled
              className="w-full bg-[#1E3B32] border border-white/10 px-4 py-3 rounded-lg opacity-70 cursor-not-allowed"
            />
          </div>

          {/* Save button */}
          <div className="pt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                saving
                  ? "bg-green-800 cursor-wait"
                  : "bg-[#00B84A] hover:bg-[#00913A]"
              }`}
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
            {message && (
              <p className="text-gray-300 mt-3 text-sm italic">{message}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
