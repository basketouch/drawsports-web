"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/supabase/client";

type Props = {
  orgId: string;
};

export function ManageTeam({ orgId }: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [orgName, setOrgName] = useState("");
  const [orgNameEdit, setOrgNameEdit] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  useEffect(() => {
    if (!supabaseUrl) return;
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.access_token) return;
      fetch(`${supabaseUrl}/functions/v1/update-org?org_id=${encodeURIComponent(orgId)}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.name) {
            setOrgName(data.name);
            setOrgNameEdit(data.name);
          }
        })
        .catch(() => {});
    });
  }, [orgId, supabaseUrl]);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    const supabase = createClient();

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      setMessage({ type: "error", text: "Sesión expirada. Inicia sesión de nuevo." });
      setLoading(false);
      return;
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) {
      setMessage({ type: "error", text: "Configuración incorrecta." });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${supabaseUrl}/functions/v1/invite-org-member`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ org_id: orgId, email: email.trim() }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMessage({
          type: "error",
          text: data?.error || `Error ${res.status}: ${res.statusText}`,
        });
        setLoading(false);
        return;
      }

      if (data?.error) {
        setMessage({ type: "error", text: data.error });
        setLoading(false);
        return;
      }

      setMessage({
        type: "success",
        text: data?.invited
          ? "Invitación enviada por email."
          : "Usuario añadido al equipo.",
      });
      setEmail("");
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Error inesperado",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveTeamName(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setSavingName(true);
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token || !supabaseUrl) {
      setMessage({ type: "error", text: "Sesión expirada." });
      setSavingName(false);
      return;
    }
    try {
      const res = await fetch(`${supabaseUrl}/functions/v1/update-org`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ org_id: orgId, name: orgNameEdit.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage({ type: "error", text: data?.error || "Error al guardar" });
        setSavingName(false);
        return;
      }
      setOrgName(orgNameEdit.trim());
      setIsEditingName(false);
      setMessage({ type: "success", text: "Nombre del equipo actualizado." });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Error inesperado" });
    } finally {
      setSavingName(false);
    }
  }

  return (
    <div className="mt-6 p-4 bg-white rounded-xl shadow-sm border border-slate-200 space-y-6">
      <div>
        <h3 className="font-semibold text-slate-900 mb-2">Nombre del equipo</h3>
        {isEditingName ? (
          <form onSubmit={handleSaveTeamName} className="flex gap-2 flex-wrap items-center">
            <input
              type="text"
              value={orgNameEdit}
              onChange={(e) => setOrgNameEdit(e.target.value)}
              placeholder="Ej: Equipo Barcelona"
              minLength={2}
              maxLength={100}
              required
              className="flex-1 min-w-[200px] px-3 py-2 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={savingName}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 disabled:opacity-50"
            >
              {savingName ? "Guardando…" : "Guardar"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditingName(false);
                setOrgNameEdit(orgName);
              }}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm hover:bg-slate-50"
            >
              Cancelar
            </button>
          </form>
        ) : (
          <div className="flex items-center gap-2">
            <p className="text-slate-700">{orgName || "Mi equipo"}</p>
            <button
              type="button"
              onClick={() => setIsEditingName(true)}
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              Editar
            </button>
          </div>
        )}
      </div>
      <div>
        <h3 className="font-semibold text-slate-900 mb-3">Invitar al equipo</h3>
      <form onSubmit={handleInvite} className="flex gap-2 flex-wrap">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@ejemplo.com"
          required
          className="flex-1 min-w-[200px] px-3 py-2 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Enviando…" : "Invitar"}
        </button>
      </form>
      {message && (
        <p
          className={`mt-2 text-sm ${
            message.type === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {message.text}
        </p>
      )}
      </div>
    </div>
  );
}
