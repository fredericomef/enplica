"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { ENPLICA_AREAS } from "@/domain/diagnostic/enplica.config";
import { AREA_RECOMMENDATIONS } from "@/domain/diagnostic/area-recommendations";
import type {
  AreaResult,
  DiagnosticResult,
} from "@/domain/diagnostic/diagnostic.types";
import { createActionPlan } from "@/domain/diagnostic/action-plan";
import { DiagnosticRadarChart } from "@/components/diagnostic/DiagnosticRadarChart";

export default function ResultadoPage() {
  const router = useRouter();

  const [result, setResult] = useState<DiagnosticResult | null>(null);

  useEffect(() => {
    const storedResult = sessionStorage.getItem(
      "enplica-diagnostic-result",
    );

    if (!storedResult) {
      router.replace("/diagnostico");
      return;
    }

    try {
      const parsedResult = JSON.parse(
        storedResult,
      ) as DiagnosticResult;

      setResult(parsedResult);
    } catch {
      sessionStorage.removeItem("enplica-diagnostic-result");
      router.replace("/diagnostico");
    }
  }, [router]);

  function getArea(areaId: AreaResult["areaId"]) {
    return ENPLICA_AREAS.find(
      (area) => area.id === areaId,
    );
  }

  function getStatusStyle(status: AreaResult["status"]) {
    if (status === "TRATAR") {
      return {
        label: "TRATAR",
        className:
          "border-red-500/30 bg-red-500/10 text-red-300",
        dot: "bg-red-500",
        bar: "from-red-500 to-red-400",
        card:
          "border-red-500/20 bg-red-500/[0.045]",
        icon:
          "border-red-500/20 bg-red-500/10 text-red-300",
        score: "text-red-300",
      };
    }

    if (status === "ATENCAO") {
      return {
        label: "ATENÇÃO",
        className:
          "border-yellow-400/30 bg-yellow-400/10 text-yellow-300",
        dot: "bg-yellow-400",
        bar: "from-yellow-400 to-yellow-300",
        card:
          "border-yellow-400/20 bg-yellow-400/[0.035]",
        icon:
          "border-yellow-400/20 bg-yellow-400/10 text-yellow-300",
        score: "text-yellow-300",
      };
    }

    return {
      label: "SAUDÁVEL",
      className:
        "border-green-500/30 bg-green-500/10 text-green-300",
      dot: "bg-green-500",
      bar: "from-green-500 to-emerald-400",
      card:
        "border-green-500/20 bg-green-500/[0.035]",
      icon:
        "border-green-500/20 bg-green-500/10 text-green-300",
      score: "text-green-300",
    };
  }

  function getOverallHealth(percentage: number) {
    if (percentage <= 33) {
      return {
        label: "PRECISA DE ATENÇÃO",
        text: "text-red-300",
        bg: "bg-red-500/10",
        border: "border-red-500/30",
        ring: "border-red-500/40",
        dot: "bg-red-500",
        glow:
          "shadow-[0_0_70px_rgba(239,68,68,0.12)]",
      };
    }

    if (percentage <= 66) {
      return {
        label: "EM DESENVOLVIMENTO",
        text: "text-yellow-300",
        bg: "bg-yellow-400/10",
        border: "border-yellow-400/30",
        ring: "border-yellow-400/40",
        dot: "bg-yellow-400",
        glow:
          "shadow-[0_0_70px_rgba(250,204,21,0.12)]",
      };
    }

    return {
      label: "SAUDÁVEL",
      text: "text-green-300",
      bg: "bg-green-500/10",
      border: "border-green-500/30",
      ring: "border-green-500/40",
      dot: "bg-green-500",
      glow:
        "shadow-[0_0_70px_rgba(34,197,94,0.12)]",
    };
  }

  function handleConsultationRequest() {
    const message =
      "Olá! Fiz o Raio-X Empresarial da ENPLICA e quero agendar minha Consulta de Gestão de R$ 220.";

    const whatsappUrl =
      `https://wa.me/553592183654?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  if (!result) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050507] text-white">
        <div className="text-center">
          <div className="mx-auto h-3 w-3 animate-pulse rounded-full bg-[#00B8FF] shadow-[0_0_25px_#00B8FF]" />

          <p className="mt-6 text-sm tracking-[0.3em] text-white/50">
            ANALISANDO SEU NEGÓCIO
          </p>
        </div>
      </main>
    );
  }

  const overallHealth = getOverallHealth(result.percentage);

  const priority = result.priorities[0];

  const priorityRecommendation = priority
    ? AREA_RECOMMENDATIONS[priority.areaId]
    : null;

  const priorityArea = priority
    ? getArea(priority.areaId)
    : null;

  const actionPlan = createActionPlan(result);

  const improveGroup = actionPlan.groups.find(
    (group) => group.status === "ATENCAO",
  );

  const healthyGroup = actionPlan.groups.find(
    (group) => group.status === "SAUDAVEL",
  );

  const treatGroup = actionPlan.groups.find(
    (group) => group.status === "TRATAR",
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050507] text-white">
      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[5%] top-[-5%] h-[520px] w-[520px] rounded-full bg-[#00B8FF]/10 blur-[160px]" />

        <div className="absolute right-[-8%] top-[35%] h-[500px] w-[500px] rounded-full bg-[#8A2EFF]/10 blur-[160px]" />

        <div className="absolute bottom-[-10%] left-[25%] h-[450px] w-[450px] rounded-full bg-[#00B8FF]/5 blur-[150px]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:70px_70px]" />
      </div>

      <section className="relative z-10 mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12 lg:px-10">
        {/* HEADER */}
        <header className="flex items-center justify-end border-b border-white/[0.06] pb-6">
          <span className="hidden text-[10px] font-medium tracking-[0.25em] text-white/30 sm:block">
            RAIO-X EMPRESARIAL
          </span>
        </header>

        {/* LOGOS — PAINEL DE RAIO-X */}
        <div className="pointer-events-none fixed inset-x-0 top-5 z-50 flex items-start justify-between px-4 sm:px-7 lg:px-10">

          {/* NEXA — LADO ESQUERDO */}
          <div className="group pointer-events-auto relative -translate-x-[4mm]">
            <div className="absolute -inset-3 rounded-2xl border border-[#00B8FF]/0 bg-[#00B8FF]/0 opacity-0 blur-xl transition-all duration-500 group-hover:border-[#00B8FF]/30 group-hover:bg-[#00B8FF]/10 group-hover:opacity-100" />

            <div className="relative flex h-[88px] w-[160px] items-center justify-center overflow-hidden rounded-2xl border border-white/[0.025] bg-white/[0.008] opacity-[0.06] backdrop-blur-md transition-all duration-500 group-hover:border-[#00B8FF]/40 group-hover:bg-black/60 group-hover:opacity-100 group-hover:shadow-[0_0_35px_rgba(0,184,255,0.18)] sm:h-[88px] sm:w-[160px]">

              <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-[#00B8FF] to-transparent" />
                <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#8A2EFF] to-transparent" />
                <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-[#00B8FF] via-transparent to-[#8A2EFF]" />
              </div>

              <Image
                src="/logos/nexa.png"
                alt="Nexa"
                width={150}
                height={80}
                priority
                className="relative h-auto w-[86px] object-contain transition-all duration-500 group-hover:w-[96px] sm:w-[103px] sm:group-hover:w-[114px]"
              />

              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[7px] font-bold tracking-[0.25em] text-[#7DDAFF] opacity-0 transition-all duration-300 group-hover:bottom-1 group-hover:opacity-80">
                NEXA · IA
              </span>
            </div>
          </div>

          {/* SIM — LADO DIREITO */}
          <div className="group pointer-events-auto relative">
            <div className="absolute -inset-3 rounded-2xl border border-[#8A2EFF]/0 bg-[#8A2EFF]/0 opacity-0 blur-xl transition-all duration-500 group-hover:border-[#8A2EFF]/30 group-hover:bg-[#8A2EFF]/10 group-hover:opacity-100" />

            <div className="relative flex h-[88px] w-[160px] items-center justify-center overflow-hidden rounded-2xl border border-white/[0.025] bg-white/[0.008] opacity-[0.06] backdrop-blur-md transition-all duration-500 group-hover:border-[#8A2EFF]/40 group-hover:bg-black/60 group-hover:opacity-100 group-hover:shadow-[0_0_35px_rgba(138,46,255,0.18)] sm:h-[88px] sm:w-[160px]">

              <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-[#8A2EFF] to-transparent" />
                <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#00B8FF] to-transparent" />
                <div className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-[#8A2EFF] via-transparent to-[#00B8FF]" />
              </div>

              <Image
                src="/logos/sim.png"
                alt="SIM Gestão"
                width={150}
                height={80}
                priority
                className="relative -translate-y-[4mm] h-auto w-[66px] object-contain transition-all duration-500 group-hover:w-[74px] sm:w-[80px] sm:group-hover:w-[88px]"
              />

              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[7px] font-bold tracking-[0.25em] text-[#C69CFF] opacity-0 transition-all duration-300 group-hover:bottom-1 group-hover:opacity-80">
                SIM · GESTÃO
              </span>
            </div>
          </div>

        </div>

        {/* HERO */}
        <section className="pt-20 text-center sm:pt-28">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#00B8FF]/20 bg-[#00B8FF]/5 px-4 py-2 text-[11px] font-semibold tracking-[0.2em] text-[#7DDAFF]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00B8FF]" />
            DIAGNÓSTICO CONCLUÍDO
          </div>

          <h1 className="mx-auto mt-9 max-w-4xl font-bold tracking-[-0.045em]">
            <span className="block text-3xl leading-tight text-white/90 sm:text-5xl lg:text-6xl">
              Seu negócio está em
            </span>

            <span
              className={`mt-6 block text-7xl leading-none font-bold sm:text-8xl lg:text-9xl ${overallHealth.text}`}
            >
              {result.percentage}%
            </span>
          </h1>

          <div
            className={`mx-auto mt-7 inline-flex items-center gap-2 rounded-full border px-4 py-2 ${overallHealth.border} ${overallHealth.bg} ${overallHealth.text}`}
          >
            <span
              className={`h-2 w-2 rounded-full ${overallHealth.dot}`}
            />

            <span className="text-[10px] font-bold tracking-[0.2em] sm:text-[11px]">
              SAÚDE GERAL · {overallHealth.label}
            </span>
          </div>

          <p className="mx-auto mt-8 max-w-xl text-base leading-8 text-white/50 sm:text-lg">
            O Raio-X identificou onde seu negócio está forte,
            onde existe atenção e qual é a principal oportunidade
            de evolução.
          </p>
        </section>

        {/* SCORE */}
        <section className="mx-auto mt-16 max-w-3xl">
          <div
            className={`relative overflow-hidden rounded-[2rem] border ${overallHealth.border} bg-white/[0.035] p-7 ${overallHealth.glow} backdrop-blur-xl sm:p-10`}
          >
            <div
              className={`absolute -right-20 -top-20 h-48 w-48 rounded-full ${overallHealth.bg} blur-3xl`}
            />

            <div className="relative flex flex-col items-center gap-10 sm:flex-row sm:justify-between">
              <div className="text-center sm:text-left">
                <div className="text-[11px] font-semibold tracking-[0.25em] text-white/40">
                  PONTUAÇÃO GERAL
                </div>

                <div
  className={`mt-4 text-5xl font-bold tracking-tight sm:text-6xl ${overallHealth.text}`}
>
                  {result.totalScore}
                  <span className="text-white/25">
                    /{result.maxScore}
                  </span>
                </div>

                <div className="mt-4 text-sm text-white/45">
                  Resultado consolidado das 7 áreas
                </div>
              </div>

              <div
                className={`relative flex h-32 w-32 shrink-0 items-center justify-center rounded-full border-2 ${overallHealth.ring} ${overallHealth.bg} shadow-[0_0_60px_rgba(255,255,255,0.04)]`}
              >
                <div className="absolute inset-2 rounded-full border border-white/[0.07]" />

                <div className="text-center">
                  <div
                    className={`text-3xl font-bold ${overallHealth.text}`}
                  >
                    {result.percentage}%
                  </div>

                  <div
                    className={`mt-2 text-[9px] font-bold tracking-[0.2em] ${overallHealth.text}`}
                  >
                    SAÚDE
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RADAR */}
        <section className="mt-24">
          <div className="text-center">
            <div className="text-[11px] font-semibold tracking-[0.3em] text-[#7DDAFF]">
              VISÃO GERAL
            </div>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
  Veja seu negócio por inteiro.
</h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/45 sm:text-lg">
              As sete áreas mostram onde sua empresa está saudável
              e onde existe espaço para evolução.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-4xl rounded-[2rem] border border-white/10 bg-white/[0.025] px-3 py-6 backdrop-blur-xl sm:px-8 sm:py-8">
            <DiagnosticRadarChart areas={result.areas} />
          </div>
        </section>

        {/* PRIORIDADE */}
        {priority && priorityRecommendation && priorityArea && (
          <section className="mt-24">
            <div className="relative overflow-hidden rounded-[2rem] border border-red-500/25 bg-gradient-to-br from-red-500/[0.08] via-white/[0.025] to-[#8A2EFF]/[0.05] p-7 sm:p-10 lg:p-12">
              <div className="absolute right-[-100px] top-[-100px] h-72 w-72 rounded-full bg-red-500/10 blur-[100px]" />

              <div className="relative">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.7)]" />

                      <span className="text-[11px] font-bold tracking-[0.25em] text-red-300">
                        SUA PRINCIPAL PRIORIDADE
                      </span>
                    </div>

                    <div className="mt-6 flex flex-wrap items-end gap-4">
                      <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
                        {priorityArea.name}
                      </h2>

                      <span className="mb-1 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-sm font-bold text-red-300">
                        {priority.score}/{priority.maxScore}
                      </span>
                    </div>

                    <p className="mt-5 max-w-2xl text-base leading-8 text-white/55">
                      Sua pontuação indica que esta é a área que
                      merece ser investigada primeiro.
                    </p>
                  </div>

                  <div className="shrink-0 rounded-2xl border border-red-500/15 bg-black/25 px-6 py-4 text-center">
                    <div className="text-[9px] font-bold tracking-[0.2em] text-white/35">
                      ÁREA
                    </div>

                    <div className="mt-2 text-3xl font-bold text-red-300">
                      {priority.areaId}
                    </div>
                  </div>
                </div>

                <div className="mt-10 grid gap-5 lg:grid-cols-2">
                  <div className="rounded-2xl border border-[#00B8FF]/20 bg-[#00B8FF]/[0.045] p-6 sm:p-7">
                    <div className="text-[10px] font-bold tracking-[0.2em] text-[#7DDAFF]">
                      O QUE IDENTIFICAMOS
                    </div>

                    <p className="mt-5 text-sm leading-8 text-white/70 sm:text-base">
                      {priorityRecommendation.diagnosis}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/[0.045] p-6 sm:p-7">
                    <div className="text-[10px] font-bold tracking-[0.2em] text-yellow-300">
                      IMPACTO NO NEGÓCIO
                    </div>

                    <p className="mt-5 text-sm leading-8 text-white/70 sm:text-base">
                      {priorityRecommendation.impact}
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-red-500/15 bg-red-500/[0.035] p-6 sm:p-7">
                  <div className="text-center">
                    <p className="text-sm font-semibold leading-7 text-white/75 sm:text-base">
                      O próximo passo não é construir uma solução.
                    </p>

                    <p className="mt-2 text-sm font-semibold leading-7 text-red-300 sm:text-base">
                      É entender exatamente onde está o problema.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* MAPA */}
        <section className="mt-24">
          <div className="text-center">
            <div className="text-[11px] font-semibold tracking-[0.3em] text-white/40">
              MAPA DO SEU NEGÓCIO
            </div>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
              As 7 áreas analisadas
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/45">
              Cada área recebe uma pontuação de 0 a 9 e um nível
              de prioridade.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {result.areas.map((areaResult) => {
              const area = getArea(areaResult.areaId);

              if (!area) return null;

              const status = getStatusStyle(areaResult.status);

              const percentage =
                (areaResult.score / areaResult.maxScore) * 100;

              return (
                <div
                  key={areaResult.areaId}
                  className={`group rounded-2xl border p-6 transition-all duration-300 hover:brightness-110 ${status.card}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-lg font-bold ${status.icon}`}
                      >
                        {areaResult.areaId}
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-white/90">
                          {area.name}
                        </h3>

                        <div
                          className={`mt-2 text-xs font-semibold ${status.score}`}
                        >
                          {areaResult.score}/{areaResult.maxScore} pontos
                        </div>
                      </div>
                    </div>

                    <span
                      className={`rounded-full border px-3 py-1 text-[10px] font-bold tracking-wider ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </div>

                  <div className="mt-6">
                    <div className="h-2 overflow-hidden rounded-full bg-white/[0.07]">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${status.bar}`}
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div
                    className={`mt-4 flex items-center justify-between rounded-lg border px-3 py-2 ${status.className}`}
                  >
                    <span className="text-[10px] font-semibold tracking-[0.15em] text-white/50">
                      NÍVEL DA ÁREA
                    </span>

                    <span
                      className={`text-sm font-extrabold ${status.score}`}
                    >
                      {areaResult.score}/9
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* DIREÇÃO ENPLICA */}
        <section className="mt-24">
          <div className="text-center">
            <div className="text-[11px] font-semibold tracking-[0.3em] text-[#C69CFF]">
              DIREÇÃO ENPLICA
            </div>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
              Saiba por onde começar.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/45 sm:text-lg">
              O diagnóstico organiza suas áreas em uma sequência
              simples de evolução.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-4xl space-y-5">
            {/* TRATAR */}
            {treatGroup && (
              <div className="rounded-2xl border border-red-500/25 bg-red-500/[0.045] p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-[10px] font-bold tracking-[0.2em] text-red-300">
                      TRATAR PRIMEIRO
                    </div>

                    <p className="mt-2 text-xs text-white/45">
                      Comece aqui.
                    </p>
                  </div>

                  <span className="text-xs font-medium text-red-300/70">
                    {treatGroup.areas.length}{" "}
                    {treatGroup.areas.length === 1
                      ? "área"
                      : "áreas"}
                  </span>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {treatGroup.areas.map((areaResult) => {
                    const area = getArea(areaResult.areaId);

                    if (!area) return null;

                    return (
                      <div
                        key={areaResult.areaId}
                        className="flex items-center justify-between rounded-xl border border-red-500/15 bg-black/20 px-4 py-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-xs font-bold text-red-300">
                            {areaResult.areaId}
                          </div>

                          <span className="text-sm font-medium text-white/75">
                            {area.name}
                          </span>
                        </div>

                        <span className="text-sm font-bold text-red-300">
                          {areaResult.score}/{areaResult.maxScore}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ATENÇÃO */}
            {improveGroup && (
              <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/[0.035] p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-[10px] font-bold tracking-[0.2em] text-yellow-300">
                      MELHORAR EM SEGUIDA
                    </div>

                    <p className="mt-2 text-xs text-white/45">
                      Possuem base, mas ainda podem evoluir.
                    </p>
                  </div>

                  <span className="text-xs font-medium text-yellow-300/70">
                    {improveGroup.areas.length}{" "}
                    {improveGroup.areas.length === 1
                      ? "área"
                      : "áreas"}
                  </span>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {improveGroup.areas.map((areaResult) => {
                    const area = getArea(areaResult.areaId);

                    if (!area) return null;

                    return (
                      <div
                        key={areaResult.areaId}
                        className="flex items-center justify-between rounded-xl border border-yellow-400/15 bg-black/20 px-4 py-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-400/10 text-xs font-bold text-yellow-300">
                            {areaResult.areaId}
                          </div>

                          <span className="text-sm font-medium text-white/75">
                            {area.name}
                          </span>
                        </div>

                        <span className="text-sm font-bold text-yellow-300">
                          {areaResult.score}/{areaResult.maxScore}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SAUDÁVEL */}
            {healthyGroup && (
              <div className="rounded-2xl border border-green-500/20 bg-green-500/[0.035] p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-[10px] font-bold tracking-[0.2em] text-green-300">
                      POTENCIALIZAR
                    </div>

                    <p className="mt-2 text-xs text-white/45">
                      Mantenha a base e busque novas oportunidades.
                    </p>
                  </div>

                  <span className="text-xs font-medium text-green-300/70">
                    {healthyGroup.areas.length}{" "}
                    {healthyGroup.areas.length === 1
                      ? "área"
                      : "áreas"}
                  </span>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {healthyGroup.areas.map((areaResult) => {
                    const area = getArea(areaResult.areaId);

                    if (!area) return null;

                    return (
                      <div
                        key={areaResult.areaId}
                        className="flex items-center justify-between rounded-xl border border-green-500/15 bg-black/20 px-4 py-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10 text-xs font-bold text-green-300">
                            {areaResult.areaId}
                          </div>

                          <span className="text-sm font-medium text-white/75">
                            {area.name}
                          </span>
                        </div>

                        <span className="text-sm font-bold text-green-300">
                          {areaResult.score}/{areaResult.maxScore}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* CONSULTA */}
        <section
          id="consulta"
          className="mt-24"
        >
          <div className="relative overflow-hidden rounded-[2rem] border border-[#00B8FF]/25 bg-gradient-to-br from-[#00B8FF]/10 via-white/[0.025] to-[#8A2EFF]/10 p-8 text-center shadow-[0_0_80px_rgba(0,184,255,0.06)] sm:p-12 lg:p-16">
            <div className="absolute left-1/2 top-[-180px] h-[350px] w-[350px] -translate-x-1/2 rounded-full bg-[#00B8FF]/10 blur-[100px]" />

            <div className="relative">
              <div className="inline-flex items-center rounded-full border border-[#00B8FF]/20 bg-[#00B8FF]/5 px-4 py-2 text-[10px] font-bold tracking-[0.25em] text-[#7DDAFF]">
                PRÓXIMO PASSO
              </div>

              <h2 className="mx-auto mt-7 max-w-3xl text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
                O Raio-X mostrou o sintoma.

                <span className="mt-3 block text-white/45">
                  Agora vamos entender a causa.
                </span>
              </h2>

              <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-white/55 sm:text-lg">
                Não construímos antes de entender.
                <br className="hidden sm:block" />
                A consulta transforma o diagnóstico em uma decisão
                específica para o seu negócio.
              </p>

              <div className="mx-auto mt-10 max-w-md rounded-[1.5rem] border border-white/10 bg-black/25 p-7 shadow-2xl">
                <div className="text-[10px] font-bold tracking-[0.25em] text-[#7DDAFF]">
                  CONSULTA DE GESTÃO
                </div>

                <div className="mt-4 text-5xl font-bold tracking-tight">
                  R$ 220
                </div>

                <div className="mt-3 text-sm text-white/40">
                  60 minutos · orientação específica
                </div>

                <div className="mt-7 space-y-3 text-left text-sm text-white/65">
                  <div className="flex gap-3 py-1">
                    <span className="mr-1 text-[#00B8FF]">?</span>
                    <span>Aprofundamento da principal dor</span>
                  </div>

                  <div className="flex gap-3 py-1">
                    <span className="mr-1 text-[#00B8FF]">?</span>
                    <span>Identificação do processo envolvido</span>
                  </div>

                  <div className="flex gap-3 py-1">
                    <span className="mr-1 text-[#00B8FF]">?</span>
                    <span>Definição do próximo procedimento</span>
                  </div>

                  <div className="flex gap-3 py-1">
                    <span className="mr-1 text-[#00B8FF]">?</span>
                    <span>Dados para uma solução específica</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleConsultationRequest}
                className="mt-8 rounded-2xl bg-gradient-to-r from-[#00B8FF] to-[#8A2EFF] px-8 py-4 text-sm font-bold text-white shadow-[0_10px_40px_rgba(0,184,255,0.15)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_15px_50px_rgba(0,184,255,0.22)]"
              >
                QUERO AGENDAR MINHA CONSULTA
              </button>

              <p className="mx-auto mt-5 max-w-lg text-xs leading-6 text-white/30">
                Ao solicitar a consulta, você recebe orientação
                específica sobre o próximo passo. Nenhuma solução é
                construída antes dessa etapa.
              </p>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-12 pb-8 text-center">
          <button
            type="button"
            onClick={() => router.push("/diagnostico")}
            className="text-xs font-medium tracking-[0.15em] text-white/30 transition-colors hover:text-white/60"
          >
            REFAZER DIAGNÓSTICO
          </button>

          <div className="mt-6 text-[10px] tracking-[0.3em] text-white/15">
            ENPLICA · RAIO-X EMPRESARIAL
          </div>
        </footer>
      </section>
    </main>
  );
}















