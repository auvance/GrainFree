"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { LogIn, UserCircle } from "lucide-react";

type AuthUser = { id: string; email?: string; user_metadata?: Record<string, unknown> } | null;

interface UserProfileProps {
  user: AuthUser;
  loading: boolean;
}

export default function UserProfileTwo({ user, loading }: UserProfileProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Logged-out state */}
      {!loading && !user && (
        <Link href="/auth" title="Sign in / Log in">
          <LogIn className="w-6 h-6 text-gray-600 hover:text-black transition" />
        </Link>
      )}

      {/* Logged-in state */}
      {!loading && user && (
        <>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center cursor-pointer"
          >
            <UserCircle className="w-6 h-6 text-[#12241A] hover:text-[#BCD2C7] transition" />
          </button>

          {open && (
            <div className="absolute left-0 mt-5 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black/10 overflow-hidden z-5">
              {/* Header with username + email */}
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-900">
                  {String(user.user_metadata?.username ?? "Anonymous")}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.email ?? ""}
                </p>
              </div>

              {/* Menu items */}
              <ul className="py-2 text-sm text-gray-800">
                <li>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Account Preferences
                  </Link>
                </li>
                {/* <li>
                  <Link
                    href="/account"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Profile Settings
                  </Link>
                </li> */}
                <li>
                  <button
                    onClick={() => supabase.auth.signOut()}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Log out
                  </button>
                </li>
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
