"use client";

import { Suspense, useEffect, useState } from "react";
import { createClient } from "@/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function AuthVerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const next = searchParams.get("next") ?? "/update-password";

  useEffect(() => {
    const supabase = createClient();

    const handleAuth = async () => {
      const hash = window.location.hash;
      const code = searchParams.get("code");

      if (hash) {
        const params = new URLSearchParams(hash.replace("#", ""));
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (!error) {
            window.history.replaceState(null, "", window.location.pathname + "?next=" + next);
            router.replace(next);
            return;
          }
        }
      }

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
          router.replace(next);
          return;
        }
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace(next);
        return;
      }

      setStatus("error");
    };

    handleAuth();
  }, [router, next, searchParams]);

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-8 border border-slate-700 shadow-xl">
            <h1 className="text-xl font-bold text-white mb-2">Invalid or expired link</h1>
            <p className="text-slate-400 text-sm mb-6">
              This link may have expired or already been used. Request a new invitation or try again.
            </p>
            <Link
              href="/login"
              className="inline-block px-6 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-500"
            >
              Go to login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <div className="text-center">
        <div className="animate-spin w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-slate-400">Setting up your account…</p>
      </div>
    </div>
  );
}

function AuthVerifyFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <div className="text-center">
        <div className="animate-spin w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-slate-400">Loading…</p>
      </div>
    </div>
  );
}

export default function AuthVerifyPage() {
  return (
    <Suspense fallback={<AuthVerifyFallback />}>
      <AuthVerifyContent />
    </Suspense>
  );
}
