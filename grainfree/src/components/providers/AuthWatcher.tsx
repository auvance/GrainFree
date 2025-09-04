"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthWatcher({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") router.push("/");
      if (event === "SIGNED_OUT") router.push("/auth");
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router]);

  return <>{children}</>;
}
