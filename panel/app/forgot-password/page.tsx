"use client";

import { useState } from "react";
import { createClient } from "@/supabase/client";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    setSuccess(true);
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
        <div className="w-full max-w-md">
          <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-8 border border-slate-700 shadow-xl text-center">
            <h1 className="text-xl font-bold text-white mb-2">
              Revisa tu correo
            </h1>
            <p className="text-slate-400 text-sm mb-6">
              Si existe una cuenta con <strong className="text-slate-300">{email}</strong>, recibirás un enlace para restablecer tu contraseña.
            </p>
            <Link
              href="/login"
              className="inline-block px-6 py-2 rounded-lg bg-slate-700 text-slate-200 text-sm font-medium hover:bg-slate-600 transition-colors"
            >
              Volver a iniciar sesión
            </Link>
          </div>
          <p className="mt-6 text-center text-slate-500 text-sm">
            <Link href="/" className="hover:text-slate-400">
              ← Volver
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-8 border border-slate-700 shadow-xl">
          <h1 className="text-2xl font-bold text-white text-center mb-6">
            Restablecer contraseña
          </h1>
          <p className="text-slate-400 text-sm text-center mb-6">
            Introduce tu email y te enviaremos un enlace para crear una nueva contraseña.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-300 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-600 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="tu@email.com"
              />
            </div>
            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Enviando…" : "Enviar enlace"}
            </button>
          </form>
          <p className="mt-4 text-center text-slate-400 text-sm">
            <Link href="/login" className="text-blue-400 hover:underline">
              ← Volver a iniciar sesión
            </Link>
          </p>
        </div>
        <p className="mt-6 text-center text-slate-500 text-sm">
          <Link href="/" className="hover:text-slate-400">
            ← Volver
          </Link>
        </p>
      </div>
    </div>
  );
}
