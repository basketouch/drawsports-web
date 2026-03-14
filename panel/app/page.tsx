import { redirect } from "next/navigation";
import { createClient } from "@/supabase/server";
import Link from "next/link";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="text-center space-y-8 px-4">
        <h1 className="text-4xl font-bold text-white tracking-tight">
          DrawSports PRO
        </h1>
        <p className="text-slate-300 text-lg max-w-md mx-auto">
          Panel de gestión de licencias. Inicia sesión para ver tu estado PRO.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-500 transition-colors"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-slate-600 text-slate-300 font-medium hover:bg-slate-800 transition-colors"
          >
            Crear cuenta
          </Link>
          <Link
            href="https://drawsports.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-slate-600 text-slate-300 font-medium hover:bg-slate-800 transition-colors"
          >
            drawsports.app
          </Link>
        </div>
      </div>
      <p className="mt-12 text-slate-500 text-sm">
        by Basketouch Solutions Spain
      </p>
    </div>
  );
}
