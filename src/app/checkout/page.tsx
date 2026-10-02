"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Order {
  id: string;
  client_id: string;
  service_code: string;
  service_name: string;
  provider: "SIM" | "NEXA";
  amount: number;
  pricing_type: "FIXED" | "QUOTE";
  status: string;
  payment_status: string;
  payment_provider: string | null;
  payment_id: string | null;
  payment_reference: string | null;
  checkout_url: string | null;
  pix_qr_code: string | null;
  pix_copy_paste: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) {
      setError("Pedido não informado.");
      setLoading(false);
      return;
    }

    async function loadOrder() {
      try {
        const response = await fetch(
          `/api/orders/${encodeURIComponent(orderId as string)}`,
          {
            method: "GET",
            cache: "no-store",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          setError(
            data?.error ||
              "Não foi possível carregar a contratação.",
          );
          setLoading(false);
          return;
        }

        if (!data?.order) {
          setError("Pedido não encontrado.");
          setLoading(false);
          return;
        }

        setOrder(data.order);
        setLoading(false);
      } catch (err) {
        console.error(
          "Erro ao carregar pedido:",
          err,
        );

        setError(
          "Não foi possível carregar a contratação.",
        );

        setLoading(false);
      }
    }

    loadOrder();
  }, [orderId]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050507] text-white">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-[#00B8FF]" />

          <p className="mt-5 text-sm text-white/50">
            Carregando sua contratação...
          </p>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050507] px-5 text-white">
        <div className="w-full max-w-lg rounded-[2rem] border border-red-500/20 bg-white/[0.025] p-8 text-center backdrop-blur-xl">
          <div className="text-xs font-bold tracking-[0.25em] text-red-300">
            CONTRATAÇÃO
          </div>

          <h1 className="mt-4 text-2xl font-bold">
            Não foi possível continuar
          </h1>

          <p className="mt-4 text-sm leading-7 text-white/50">
            {error || "Pedido não encontrado."}
          </p>

          <button
            type="button"
            onClick={() => router.push("/diagnostico")}
            className="mt-8 rounded-xl bg-gradient-to-r from-[#00B8FF] to-[#8A2EFF] px-6 py-3 text-xs font-bold tracking-[0.08em] text-white transition-all hover:scale-[1.02]"
          >
            VOLTAR AO DIAGNÓSTICO
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050507] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[#00B8FF]/10 blur-[150px]" />

        <div className="absolute right-[-10%] top-[35%] h-[500px] w-[500px] rounded-full bg-[#8A2EFF]/10 blur-[150px]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:70px_70px]" />
      </div>

      <section className="relative z-10 mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-20">
        <div className="text-center">
          <div className="text-[11px] font-semibold tracking-[0.3em] text-[#7DDAFF]">
            ENPLICA · CONTRATAÇÃO
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-5xl">
            Finalize sua contratação
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/45">
            Confira os dados da contratação antes de
            prosseguir para o pagamento.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-2xl rounded-[2rem] border border-[#00B8FF]/20 bg-white/[0.025] p-7 shadow-[0_0_80px_rgba(0,184,255,0.06)] backdrop-blur-xl sm:p-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-[10px] font-bold tracking-[0.25em] text-white/30">
                SERVIÇO
              </div>

              <h2 className="mt-3 text-2xl font-bold">
                {order.service_name}
              </h2>

              <div className="mt-2 text-xs text-white/35">
                Código: {order.service_code}
              </div>
            </div>

            <div
              className={`rounded-full border px-3 py-1.5 text-[10px] font-bold tracking-[0.15em] ${
                order.provider === "SIM"
                  ? "border-[#FF8A2B]/30 bg-[#FF8A2B]/10 text-[#FFB66B]"
                  : "border-[#00B8FF]/30 bg-[#00B8FF]/10 text-[#7DDAFF]"
              }`}
            >
              {order.provider}
            </div>
          </div>

          <div className="my-8 h-px bg-white/[0.07]" />

          <div className="flex items-end justify-between gap-5">
            <div>
              <div className="text-[10px] font-bold tracking-[0.2em] text-white/30">
                VALOR
              </div>

              <div className="mt-2 text-3xl font-bold">
                {formatCurrency(order.amount)}
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] font-bold tracking-[0.2em] text-white/30">
                STATUS
              </div>

              <div className="mt-2 text-sm font-semibold text-[#7DDAFF]">
                Aguardando pagamento
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-white/[0.07] bg-black/20 p-6">
            <div className="text-[10px] font-bold tracking-[0.2em] text-[#7DDAFF]">
              PAGAMENTO
            </div>

            <h3 className="mt-3 text-xl font-bold">
              Pix
            </h3>

            <p className="mt-3 text-sm leading-7 text-white/45">
              O pagamento será processado de forma automática.
              Após a confirmação, o sistema liberará o
              agendamento do serviço.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-xl border border-white/10 px-6 py-3 text-xs font-bold tracking-[0.08em] text-white/60 transition-all hover:border-white/20 hover:text-white"
            >
              VOLTAR
            </button>

            <button
              type="button"
              disabled
              className="flex-1 rounded-xl bg-gradient-to-r from-[#00B8FF] to-[#8A2EFF] px-6 py-3 text-xs font-bold tracking-[0.08em] text-white opacity-50"
            >
              GERAR PAGAMENTO PIX
            </button>
          </div>
        </div>

        <div className="mx-auto mt-6 max-w-2xl text-center text-[10px] leading-5 text-white/20">
          Pedido: {order.id}
        </div>
      </section>
    </main>
  );
}

function CheckoutLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050507] text-white">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-[#00B8FF]" />

        <p className="mt-5 text-sm text-white/50">
          Preparando checkout...
        </p>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutLoading />}>
      <CheckoutContent />
    </Suspense>
  );
}

