import { redirect } from "next/navigation";
import { createClient } from "@/supabase/server";
import { CheckCircle, XCircle, Calendar, Users } from "lucide-react";
import { LogoutButton } from "./LogoutButton";
import { ManageTeam } from "./ManageTeam";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("email, is_pro, subscription_end, organization_id, organization_role")
    .eq("id", user.id)
    .single();

  const email = profile?.email ?? user.email ?? "";
  const isPro = profile?.is_pro ?? false;
  const subscriptionEnd = profile?.subscription_end
    ? new Date(profile.subscription_end)
    : null;
  const canManageTeam = isPro && profile?.organization_id && profile?.organization_role === "owner";
  const isMember = profile?.organization_role === "member";

  // Obtener nombre del equipo (owners y members)
  let orgName: string | null = null;
  if (profile?.organization_id) {
    const { data: org } = await supabase
      .from("organizations")
      .select("name")
      .eq("id", profile.organization_id)
      .single();
    orgName = org?.name ?? null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-900">DrawSports PRO</h1>
          <LogoutButton />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900">
              Estado de tu licencia
            </h2>
            <p className="text-slate-500 text-sm mt-1">{email}</p>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex items-start gap-4">
              {isPro ? (
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              ) : (
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-slate-400" />
                </div>
              )}
              <div>
                <p className="font-medium text-slate-900">
                  {isPro ? "Licencia PRO activa" : "Sin licencia PRO"}
                </p>
                <p className="text-slate-500 text-sm mt-0.5">
                  {isPro
                    ? "Tienes acceso completo a DrawSports PRO en la app."
                    : "Contacta con nosotros para activar tu licencia PRO."}
                </p>
              </div>
            </div>

            {isPro && subscriptionEnd && (
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                <Calendar className="w-5 h-5 text-slate-500" />
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Próxima renovación
                  </p>
                  <p className="text-slate-500 text-sm">
                    {subscriptionEnd.toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            )}

            {isPro && orgName && (
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                <Users className="w-5 h-5 text-slate-500" />
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Equipo
                  </p>
                  <p className="text-slate-500 text-sm">{orgName}</p>
                </div>
              </div>
            )}

            {!isPro && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">
                  Si ya has pagado, la licencia puede tardar unos minutos en
                  activarse. Si el problema persiste, contacta con{" "}
                  <a
                    href="mailto:soporte@drawsports.app"
                    className="font-medium underline"
                  >
                    soporte@drawsports.app
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>

        {canManageTeam && profile?.organization_id && (
          <ManageTeam orgId={profile.organization_id} />
        )}

        <div className="mt-6 flex gap-4">
          <a
            href="https://drawsports.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            drawsports.app →
          </a>
          {!isMember && (
            <a
              href="https://drawsports.lemonsqueezy.com/checkout/buy/23e4c4bc-ff18-4fa0-acf6-9dcfbe2cd3b3?discount=0"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              Comprar / Renovar PRO →
            </a>
          )}
        </div>
      </main>

      <footer className="max-w-4xl mx-auto px-4 py-8 text-center text-slate-500 text-sm">
        by Basketouch Solutions Spain
      </footer>
    </div>
  );
}
