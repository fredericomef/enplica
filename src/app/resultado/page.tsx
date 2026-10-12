"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { ENPLICA_AREAS } from "@/domain/diagnostic/enplica.config";
import { AREA_RECOMMENDATIONS } from "@/domain/diagnostic/area-recommendations";
import type {
  AreaResult,
  DiagnosticResult,
} from "@/domain/diagnostic/diagnostic.types";
import { DiagnosticRadarChart } from "@/components/diagnostic/DiagnosticRadarChart";
import {
  ENPLICA_SERVICES
} from "@/domain/services/services.config";

export default function ResultadoPage() {
  const router = useRouter();

  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [expandedArea, setExpandedArea] = useState<string | null>(null);
  const [catalogOpen, setCatalogOpen] = useState<"NEXA" | "SIM" | null>(null);

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
        glow: "shadow-[0_0_35px_rgba(239,68,68,0.08)]",
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
        glow: "shadow-[0_0_35px_rgba(250,204,21,0.06)]",
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
      glow: "shadow-[0_0_35px_rgba(34,197,94,0.05)]",
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

  function getAreaStartMessage(
    status: AreaResult["status"],
    isPriority: boolean,
  ) {
    if (isPriority) {
      return "Esta é a área que merece sua atenção primeiro. Comece entendendo a causa do problema antes de partir para uma solução.";
    }

    if (status === "TRATAR") {
      return "Comece investigando os principais pontos desta área e organize uma ação prática para corrigir a base.";
    }

    if (status === "ATENCAO") {
      return "A base existe, mas há pontos que merecem atenção. O próximo passo é fortalecer o que já funciona.";
    }

    return "Esta área apresenta uma base saudável. Mantenha o que funciona e procure oportunidades para potencializar os resultados.";
  }

  function handleConsultationRequest() {
    const message =
      "Olá! Fiz o Raio-X Empresarial da ENPLICA e quero agendar minha Consulta de Gestão de R$ 220.";

    const whatsappUrl =
      `https://wa.me/553592183654?text=${encodeURIComponent(message)}`;

    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer",
    );
  }

  const sortedAreas = useMemo(() => {
    if (!result) return [];

    const areaOrder = ENPLICA_AREAS.map((area) => area.id);
    const orderIndex = (areaId: AreaResult["areaId"]) =>
      areaOrder.indexOf(areaId);

    return [...result.areas].sort(
      (a, b) => orderIndex(a.areaId) - orderIndex(b.areaId),
    );
  }, [result]);

  const priorityScore = useMemo(() => {
    if (!result) return null;

    const treat = result.areas.filter(
      (area) => area.status === "TRATAR",
    );

    if (treat.length > 0) {
      return Math.min(
        ...treat.map((area) => area.score),
      );
    }

    const attention = result.areas.filter(
      (area) => area.status === "ATENCAO",
    );

    if (attention.length > 0) {
      return Math.min(
        ...attention.map((area) => area.score),
      );
    }

    return null;
  }, [result]);

  function isPriorityArea(areaResult: AreaResult) {
    if (priorityScore === null) return false;

    return (
      areaResult.score === priorityScore &&
      (areaResult.status === "TRATAR" ||
        areaResult.status === "ATENCAO")
    );
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

  const overallHealth = getOverallHealth(
    result.percentage,
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

      {/* LOGOS */}
      <div className="pointer-events-none fixed inset-x-0 top-5 z-50 flex items-start justify-between px-4 sm:px-7 lg:px-10">

        <button
          type="button"
          onClick={() => setCatalogOpen("NEXA")}
          aria-label="Abrir catálogo NEXA"
          className="group pointer-events-auto relative -translate-x-[4mm] cursor-pointer"
        >
          <div className="absolute -inset-3 rounded-2xl border border-[#00B8FF]/0 bg-[#00B8FF]/0 opacity-0 blur-xl transition-all duration-500 group-hover:border-[#00B8FF]/30 group-hover:bg-[#00B8FF]/10 group-hover:opacity-100" />

          <div className="relative flex h-[88px] w-[160px] items-center justify-center overflow-hidden rounded-2xl border border-white/[0.025] bg-white/[0.008] opacity-[0.06] backdrop-blur-md transition-all duration-500 group-hover:border-[#00B8FF]/40 group-hover:bg-black/60 group-hover:opacity-100 group-hover:shadow-[0_0_35px_rgba(0,184,255,0.18)]">

            <Image
              src="/logos/nexa.png"
              alt="Nexa"
              width={150}
              height={80}
              priority
              className="relative h-auto w-[86px] object-contain transition-all duration-500 group-hover:w-[96px] sm:w-[103px] sm:group-hover:w-[114px]"
            />

            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[7px] font-bold tracking-[0.25em] text-[#7DDAFF] opacity-0 transition-all duration-300 group-hover:bottom-1 group-hover:opacity-80">
              NEXA · CATÁLOGO
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setCatalogOpen("SIM")}
          aria-label="Abrir catálogo SIM Gestão"
          className="group pointer-events-auto relative cursor-pointer"
        >
          <div className="absolute -inset-3 rounded-2xl border border-[#8A2EFF]/0 bg-[#8A2EFF]/0 opacity-0 blur-xl transition-all duration-500 group-hover:border-[#8A2EFF]/30 group-hover:bg-[#8A2EFF]/10 group-hover:opacity-100" />

          <div className="relative flex h-[88px] w-[160px] items-center justify-center overflow-hidden rounded-2xl border border-white/[0.025] bg-white/[0.008] opacity-[0.06] backdrop-blur-md transition-all duration-500 group-hover:border-[#8A2EFF]/40 group-hover:bg-black/60 group-hover:opacity-100 group-hover:shadow-[0_0_35px_rgba(138,46,255,0.18)]">

            <Image
              src="/logos/sim.png"
              alt="SIM Gestão"
              width={150}
              height={80}
              priority
              className="relative -translate-y-[4mm] h-auto w-[66px] object-contain transition-all duration-500 group-hover:w-[74px] sm:w-[80px] sm:group-hover:w-[88px]"
            />

            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[7px] font-bold tracking-[0.25em] text-[#C69CFF] opacity-0 transition-all duration-300 group-hover:bottom-1 group-hover:opacity-80">
              SIM · CATÁLOGO
            </span>
          </div>
        </button>

      </div>

      <section className="relative z-10 mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12 lg:px-10">

        {/* HEADER */}
        <header className="flex items-center justify-end border-b border-white/[0.06] pb-6">
          <span className="hidden text-[10px] font-medium tracking-[0.25em] text-white/30 sm:block">
            RAIO-X EMPRESARIAL
          </span>
        </header>

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
                className={`relative flex h-32 w-32 shrink-0 items-center justify-center rounded-full border-2 ${overallHealth.ring} ${overallHealth.bg}`}
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

        {/* AS 7 ÁREAS */}
        <section className="mt-24">
          <div className="text-center">
            <div className="text-[11px] font-semibold tracking-[0.3em] text-[#C69CFF]">
              MAPA DO SEU NEGÓCIO
            </div>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
              As 7 áreas analisadas
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/45 sm:text-lg">
              Sua análise está organizada por prioridade. Clique
              em uma área para entender o resultado e descobrir
              por onde começar.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-5xl space-y-4">
            {sortedAreas.map((areaResult) => {
              const area = getArea(areaResult.areaId);

              if (!area) return null;

              const status = getStatusStyle(areaResult.status);
              const percentage =
                (areaResult.score / areaResult.maxScore) * 100;
              const priority = isPriorityArea(areaResult);
              const isExpanded =
                expandedArea === areaResult.areaId;

              const recommendation =
                AREA_RECOMMENDATIONS[areaResult.areaId];

              return (
                <div
                  key={areaResult.areaId}
                  className={`overflow-hidden rounded-[1.5rem] border transition-all duration-300 ${status.card} ${isExpanded ? status.glow : ""}`}
                >
                  {/* AREA HEADER */}
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedArea(
                        isExpanded
                          ? null
                          : areaResult.areaId,
                      )
                    }
                    className="w-full p-5 text-left sm:p-7"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border text-lg font-bold ${status.icon}`}
                      >
                        {areaResult.areaId}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-bold text-white/90 sm:text-xl">
                            {area.name}
                          </h3>

                          {priority && (
                            <span className="rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-[9px] font-bold tracking-[0.12em] text-red-300">
                              SUA PRINCIPAL PRIORIDADE
                            </span>
                          )}
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-3">
                          <span
                            className={`text-sm font-bold ${status.score}`}
                          >
                            {areaResult.score}/
                            {areaResult.maxScore}
                          </span>

                          <span
                            className={`rounded-full border px-2.5 py-1 text-[9px] font-bold tracking-wider ${status.className}`}
                          >
                            {status.label}
                          </span>
                        </div>
                      </div>

                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-lg transition-transform duration-300 ${
                          isExpanded
                            ? "rotate-180 border-white/20 bg-white/[0.06] text-white"
                            : "border-white/10 bg-white/[0.025] text-white/40"
                        }`}
                      >
                        ↓
                      </div>
                    </div>

                    <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/[0.07]">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${status.bar}`}
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[9px] font-semibold tracking-[0.18em] text-white/30">
                        CLIQUE PARA VER SUA ANÁLISE
                      </span>

                      <span
                        className={`text-xs font-bold ${status.score}`}
                      >
                        {areaResult.score}/9
                      </span>
                    </div>
                  </button>

                  {/* AREA DETAILS */}
                  {isExpanded && (
                    <div className="border-t border-white/[0.07] px-5 pb-7 sm:px-7 sm:pb-8">

                      {/* SUA NOTA + SITUAÇÃO */}
                      <div className="mt-6 grid gap-4 sm:grid-cols-2">

                        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                          <div className="text-[9px] font-bold tracking-[0.2em] text-white/35">
                            SUA NOTA
                          </div>

                          <div
                            className={`mt-3 text-4xl font-bold ${status.score}`}
                          >
                            {areaResult.score}
                            <span className="text-lg text-white/25">
                              /{areaResult.maxScore}
                            </span>
                          </div>
                        </div>

                        <div
                          className={`rounded-2xl border p-5 ${status.className}`}
                        >
                          <div className="text-[9px] font-bold tracking-[0.2em] text-white/45">
                            SITUAÇÃO
                          </div>

                          <div className="mt-3 text-2xl font-bold">
                            {status.label}
                          </div>
                        </div>

                      </div>

                      {/* O QUE REVELA */}
                      {recommendation && (
                        <div className="mt-4 rounded-2xl border border-[#00B8FF]/20 bg-[#00B8FF]/[0.035] p-5 sm:p-6">
                          <div className="text-[10px] font-bold tracking-[0.2em] text-[#7DDAFF]">
                            O QUE ISSO REVELA
                          </div>

                          <p className="mt-4 text-sm leading-8 text-white/70 sm:text-base">
                            {recommendation.diagnosis}
                          </p>
                        </div>
                      )}

                      {/* IMPACTO */}
                      {recommendation && (
                        <div className="mt-4 rounded-2xl border border-yellow-400/20 bg-yellow-400/[0.035] p-5 sm:p-6">
                          <div className="text-[10px] font-bold tracking-[0.2em] text-yellow-300">
                            POR QUE ISSO IMPORTA
                          </div>

                          <p className="mt-4 text-sm leading-8 text-white/70 sm:text-base">
                            {recommendation.impact}
                          </p>
                        </div>
                      )}

                      {/* PRINCIPAL PRIORIDADE */}
                      {priority && (
                        <div className="mt-4 rounded-2xl border border-red-500/25 bg-red-500/[0.05] p-5 sm:p-6">
                          <div className="flex items-center gap-3">
                            <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.7)]" />

                            <span className="text-[10px] font-bold tracking-[0.2em] text-red-300">
                              SUA PRINCIPAL PRIORIDADE
                            </span>
                          </div>

                          <p className="mt-4 text-sm leading-8 text-white/70 sm:text-base">
                            Esta é a área que deve receber sua atenção
                            primeiro. Antes de investir em novas
                            soluções, comece entendendo e tratando
                            este ponto.
                          </p>
                        </div>
                      )}

                      {/* POR ONDE COMEÇAR */}
                      <div className="mt-4 rounded-2xl border border-[#8A2EFF]/25 bg-[#8A2EFF]/[0.045] p-5 sm:p-6">
                        <div className="text-[10px] font-bold tracking-[0.2em] text-[#C69CFF]">
                          SAIBA POR ONDE COMEÇAR
                        </div>

                        <p className="mt-4 text-sm leading-8 text-white/70 sm:text-base">
                          {getAreaStartMessage(
                            areaResult.status,
                            priority,
                          )}
                        </p>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* DIREÇÃO ENPLICA */}
        <section className="mt-24 pb-16">
          <div className="mx-auto max-w-4xl">

            <div className="text-center">
              <div className="text-[10px] font-bold tracking-[0.3em] text-[#7DDAFF]">
                DIREÇÃO ENPLICA
              </div>

              <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-4xl">
                Agora você sabe por onde começar.
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/45 sm:text-base">
                Seu Raio-X foi organizado para transformar o diagnóstico
                em direção prática. O próximo passo é entender seu cenário
                com mais profundidade e definir a melhor estratégia de ação.
              </p>
            </div>

            <div className="relative mt-10 overflow-hidden rounded-[2rem] border border-[#00B8FF]/25 bg-gradient-to-br from-[#00B8FF]/[0.07] via-white/[0.025] to-[#8A2EFF]/[0.07] p-6 shadow-[0_0_70px_rgba(0,184,255,0.08)] backdrop-blur-xl sm:p-9">

              <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[#00B8FF]/10 blur-[90px]" />
              <div className="absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-[#8A2EFF]/10 blur-[90px]" />

              <div className="relative">

                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">

                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#00B8FF]/25 bg-[#00B8FF]/10 px-3 py-1.5 text-[9px] font-bold tracking-[0.2em] text-[#7DDAFF]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#00B8FF]" />
                      PRIMEIRO PASSO
                    </div>

                    <h3 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">
                      Consulta de Gestão
                    </h3>

                    <p className="mt-2 text-sm font-medium text-[#7DDAFF]">
                      Transforme seu diagnóstico em um plano de ação.
                    </p>
                  </div>



                </div>

                <div className="mt-7 grid gap-3 sm:grid-cols-3">

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="text-[9px] font-bold tracking-[0.15em] text-[#7DDAFF]">
                      01
                    </div>

                    <p className="mt-2 text-xs leading-6 text-white/60">
                      Analisamos seu resultado e suas principais prioridades.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="text-[9px] font-bold tracking-[0.15em] text-[#C69CFF]">
                      02
                    </div>

                    <p className="mt-2 text-xs leading-6 text-white/60">
                      Entendemos o que está por trás dos pontos identificados.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="text-[9px] font-bold tracking-[0.15em] text-green-300">
                      03
                    </div>

                    <p className="mt-2 text-xs leading-6 text-white/60">
                      Definimos os próximos passos para o seu negócio.
                    </p>
                  </div>

                </div>

                <div className="mt-7 rounded-2xl border border-white/10 bg-black/20 p-5">
                  <p className="text-sm leading-7 text-white/60 sm:text-base">
                    O diagnóstico mostra <strong className="text-white/85">onde</strong> estão as oportunidades. A Consulta de Gestão ajuda a entender <strong className="text-white/85">o que fazer primeiro</strong>, evitando investir em uma solução antes de compreender completamente o problema.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleConsultationRequest}
                  className="mt-7 w-full rounded-2xl bg-gradient-to-r from-[#00B8FF] to-[#8A2EFF] px-6 py-4 text-sm font-bold tracking-wide text-white shadow-[0_0_35px_rgba(0,184,255,0.18)] transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_45px_rgba(0,184,255,0.28)]"
                >
                  QUERO AGENDAR MINHA CONSULTA DE GESTÃO · R$ 220
                </button>

                <p className="mt-4 text-center text-[10px] leading-5 text-white/30">
                  Atendimento inicial de 60 minutos · Agendamento pelo WhatsApp
                </p>

              </div>
            </div>

          </div>
        </section>

      </section>

      {/* CATÁLOGO */}
      {catalogOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
          onClick={() => setCatalogOpen(null)}
        >
          <div
            className={`relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-[2rem] border p-6 shadow-[0_0_100px_rgba(0,0,0,0.5)] sm:p-8 ${
              catalogOpen === "NEXA"
                ? "border-[#00B8FF]/25 bg-[#06090d]"
                : "border-[#8A2EFF]/25 bg-[#09060d]"
            }`}
            onClick={(event) => event.stopPropagation()}
          >

            <button
              type="button"
              onClick={() => setCatalogOpen(null)}
              aria-label="Fechar catálogo"
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-xl text-white/50 transition hover:border-white/20 hover:text-white"
            >
              ×
            </button>

            <div className="pr-12">
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${
                    catalogOpen === "NEXA"
                      ? "border-[#00B8FF]/25 bg-[#00B8FF]/10"
                      : "border-[#8A2EFF]/25 bg-[#8A2EFF]/10"
                  }`}
                >
                  <Image
                    src={
                      catalogOpen === "NEXA"
                        ? "/logos/nexa.png"
                        : "/logos/sim.png"
                    }
                    alt={catalogOpen === "NEXA" ? "Nexa" : "SIM Gestão"}
                    width={80}
                    height={60}
                    className="h-auto w-10 object-contain"
                  />
                </div>

                <div>
                  <div
                    className={`text-[9px] font-bold tracking-[0.25em] ${
                      catalogOpen === "NEXA"
                        ? "text-[#7DDAFF]"
                        : "text-[#C69CFF]"
                    }`}
                  >
                    CATÁLOGO
                  </div>

                  <h2 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
                    {catalogOpen === "NEXA"
                      ? "Serviços NEXA"
                      : "Serviços SIM"}
                  </h2>
                </div>
              </div>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/45">
                {catalogOpen === "NEXA"
                  ? "Soluções em inteligência artificial, automação, sistemas e tecnologia para transformar processos e acelerar negócios."
                  : "Soluções de gestão e desenvolvimento empresarial para organizar processos e melhorar os resultados do negócio."}
              </p>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {ENPLICA_SERVICES
                .filter(
                  (service) =>
                    service.provider === catalogOpen &&
                    !["CON-00", "CON-01", "MNT-01", "MNT-02"].includes(
                      service.code,
                    ),
                )
                .map((service) => (
                  <div
                    key={service.code}
                    className={`rounded-2xl border bg-white/[0.02] p-5 transition ${
                      catalogOpen === "NEXA"
                        ? "border-[#00B8FF]/15 hover:border-[#00B8FF]/35"
                        : "border-[#8A2EFF]/15 hover:border-[#8A2EFF]/35"
                    }`}
                  >
                    <div
                      className={`text-[9px] font-bold tracking-[0.18em] ${
                        catalogOpen === "NEXA"
                          ? "text-[#7DDAFF]"
                          : "text-[#C69CFF]"
                      }`}
                    >
                      {service.code}
                    </div>

                    <h3 className="mt-2 text-base font-bold text-white/90">
                      {service.name}
                    </h3>

                    <p className="mt-3 text-xs leading-6 text-white/45">
                      {service.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[9px] text-white/45">
                        {service.duration}
                      </span>

                      <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[9px] text-white/45">
                        {service.modality}
                      </span>
                    </div>
                  </div>
                ))}
            </div>

          </div>
        </div>
      )}
    </main>
  );
}
