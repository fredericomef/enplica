"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Diagnostic = {
  id: string;
  overall_score: number | null;
  max_score: number | null;
  percentage: number | null;
  priority_area: string | null;
  status: string | null;
  created_at: string;
};

type Client = {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  birth_date: string | null;
  role: string | null;
  cnpj: string | null;
  created_at: string;
  diagnostics: Diagnostic[] | null;
};

export default function AdminPage() {
  const router = useRouter();

  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadClients() {
    setLoading(true);
    setError("");

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.replace("/admin/login");
      return;
    }

    const response = await fetch("/api/admin/clients", {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        await supabase.auth.signOut();
        router.replace("/admin/login");
        return;
      }

      setError(
        data?.error || "Não foi possível carregar os clientes.",
      );
      setLoading(false);
      return;
    }

    setClients(data.clients ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadClients();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  const filteredClients = useMemo(() => {
    const normalizedSearch = search
      .trim()
      .toLowerCase();

    if (!normalizedSearch) {
      return clients;
    }

    return clients.filter((client) => {
      return [
        client.name,
        client.email,
        client.whatsapp,
        client.cnpj ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);
    });
  }, [clients, search]);

  function getLatestDiagnostic(client: Client) {
    if (!client.diagnostics?.length) {
      return null;
    }

    return [...client.diagnostics].sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime(),
    )[0];
  }

  function getStatusLabel(status: string | null) {
    if (status === "COMPLETED") {
      return "Concluído";
    }

    if (status === "RELEASED") {
      return "Liberado";
    }

    if (status === "CONTRACTED") {
      return "Contratado";
    }

    return status || "Sem diagnóstico";
  }

  return (
    <main className="min-h-screen bg-[#050509] text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <header className="mb-8 flex flex-col gap-5 border-b border-white/10 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.35em] text-cyan-400">
              ENPLICA
            </div>

            <h1 className="text-3xl font-bold">
              Painel Administrativo
            </h1>

            <p className="mt-2 text-sm text-white/50">
              Gestão de clientes e diagnósticos.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:border-red-400/40 hover:text-red-300"
          >
            Sair
          </button>
        </header>

        <section className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
            <div className="text-xs uppercase tracking-wider text-white/40">
              Clientes
            </div>

            <div className="mt-2 text-3xl font-bold">
              {clients.length}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
            <div className="text-xs uppercase tracking-wider text-white/40">
              Diagnósticos
            </div>

            <div className="mt-2 text-3xl font-bold">
              {
                clients.filter(
                  (client) =>
                    getLatestDiagnostic(client),
                ).length
              }
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
            <div className="text-xs uppercase tracking-wider text-white/40">
              Resultado médio
            </div>

            <div className="mt-2 text-3xl font-bold">
              {clients.length
                ? `${Math.round(
                    clients.reduce((total, client) => {
                      const diagnostic =
                        getLatestDiagnostic(client);

                      return (
                        total +
                        (diagnostic?.percentage ?? 0)
                      );
                    }, 0) / clients.length,
                  )}%`
                : "—"}
            </div>
          </div>
        </section>

        <section className="mb-6">
          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Buscar por nome, e-mail, WhatsApp ou CNPJ..."
            className="w-full rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-4 text-white outline-none placeholder:text-white/30 focus:border-cyan-400/60"
          />
        </section>

        {loading && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-8 text-center text-white/50">
            Carregando clientes...
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-300">
            {error}
          </div>
        )}

        {!loading && !error && (
          <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px]">
                <thead className="border-b border-white/10 bg-white/[0.035]">
                  <tr className="text-left text-xs uppercase tracking-wider text-white/40">
                    <th className="px-5 py-4">Cliente</th>
                    <th className="px-5 py-4">Contato</th>
                    <th className="px-5 py-4">Cargo</th>
                    <th className="px-5 py-4">Diagnóstico</th>
                    <th className="px-5 py-4">Prioridade</th>
                    <th className="px-5 py-4">Cadastro</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredClients.map((client) => {
                    const diagnostic =
                      getLatestDiagnostic(client);

                    return (
                      <tr
                        key={client.id}
                        className="border-b border-white/5 transition hover:bg-white/[0.025]"
                      >
                        <td className="px-5 py-5">
                          <div className="font-semibold">
                            {client.name}
                          </div>

                          <div className="mt-1 text-xs text-white/40">
                            {client.email}
                          </div>
                        </td>

                        <td className="px-5 py-5 text-sm text-white/70">
                          {client.whatsapp}
                        </td>

                        <td className="px-5 py-5 text-sm text-white/70">
                          {client.role || "—"}
                        </td>

                        <td className="px-5 py-5">
                          {diagnostic ? (
                            <div>
                              <div className="font-semibold text-cyan-300">
                                {diagnostic.percentage ?? 0}%
                              </div>

                              <div className="mt-1 text-xs text-white/40">
                                {getStatusLabel(
                                  diagnostic.status,
                                )}
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-white/30">
                              —
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-5">
                          {diagnostic?.priority_area ? (
                            <span className="rounded-full border border-purple-400/20 bg-purple-400/10 px-3 py-1 text-xs text-purple-300">
                              {diagnostic.priority_area}
                            </span>
                          ) : (
                            <span className="text-white/30">
                              —
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-5 text-sm text-white/50">
                          {new Date(
                            client.created_at,
                          ).toLocaleDateString("pt-BR")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredClients.length === 0 && (
              <div className="p-10 text-center text-white/40">
                Nenhum cliente encontrado.
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
