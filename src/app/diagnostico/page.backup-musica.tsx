"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  ANSWER_OPTIONS,
  ENPLICA_AREAS,
} from "@/domain/diagnostic/enplica.config";

import { calculateDiagnostic } from "@/domain/diagnostic/diagnostic.engine";

import type {
  AnswerValue,
  AreaId,
  DiagnosticAnswers,
} from "@/domain/diagnostic/diagnostic.types";

export default function DiagnosticoPage() {
  const router = useRouter();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<AnswerValue[]>([]);
  const [isAnswering, setIsAnswering] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const allQuestions = ENPLICA_AREAS.flatMap((area) =>
    area.questions.map((question) => ({
      areaId: area.id,
      areaName: area.name,
      question,
    })),
  );

  const totalQuestions = allQuestions.length;
  const current = allQuestions[currentQuestion];

  const progress =
    ((currentQuestion + 1) / totalQuestions) * 100;

  function buildDiagnosticAnswers(
    allAnswers: AnswerValue[],
  ): DiagnosticAnswers {
    const diagnosticAnswers = {} as DiagnosticAnswers;

    ENPLICA_AREAS.forEach((area) => {
      diagnosticAnswers[area.id as AreaId] = [];
    });

    allQuestions.forEach((question, index) => {
      diagnosticAnswers[question.areaId].push(
        allAnswers[index],
      );
    });

    return diagnosticAnswers;
  }

  function handleAnswer(value: AnswerValue) {
    if (isAnswering || isAnalyzing) return;

    setIsAnswering(true);

    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;

    setAnswers(newAnswers);

    window.setTimeout(() => {
      if (currentQuestion < totalQuestions - 1) {
        setCurrentQuestion((previous) => previous + 1);
        setIsAnswering(false);
        return;
      }

      const diagnosticAnswers =
        buildDiagnosticAnswers(newAnswers);

      const result =
        calculateDiagnostic(diagnosticAnswers);

      sessionStorage.setItem(
        "enplica-diagnostic-result",
        JSON.stringify(result),
      );

      setIsAnalyzing(true);

      window.setTimeout(() => {
        router.push("/resultado");
      }, 1800);
    }, 350);
  }

  function handlePrevious() {
    if (
      currentQuestion === 0 ||
      isAnswering ||
      isAnalyzing
    ) {
      return;
    }

    setCurrentQuestion((previous) => previous - 1);
  }

  if (isAnalyzing) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050507] text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00B8FF]/10 blur-[180px]" />

          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:70px_70px]" />
        </div>

        <section className="relative z-10 w-full max-w-xl px-6 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#00B8FF]/30 bg-[#00B8FF]/5 shadow-[0_0_70px_rgba(0,184,255,0.12)]">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-[#00B8FF]" />
          </div>

          <div className="mt-10 text-[11px] font-bold tracking-[0.35em] text-[#7DDAFF]">
            RAIO-X EMPRESARIAL
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-5xl">
            Analisando seu negócio.
          </h1>

          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-white/40">
            Estamos cruzando suas respostas para identificar
            pontos fortes, pontos de atenção e sua principal
            oportunidade de evolução.
          </p>

          <div className="mx-auto mt-10 max-w-sm">
            <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
              <div className="h-full w-[88%] animate-pulse rounded-full bg-gradient-to-r from-[#00B8FF] to-[#8A2EFF]" />
            </div>

            <div className="mt-5 text-xs text-white/30">
              Analisando estrutura, processos e oportunidades...
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050507] text-white">
      {/* FUNDO */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[5%] top-[5%] h-[520px] w-[520px] rounded-full bg-[#00B8FF]/10 blur-[160px]" />

        <div className="absolute bottom-0 right-[-5%] h-[520px] w-[520px] rounded-full bg-[#8A2EFF]/10 blur-[160px]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:70px_70px]" />
      </div>

      <section className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col px-5 py-7 sm:px-8 sm:py-10">

        {/* HEADER */}
        <header className="flex items-center justify-between border-b border-white/[0.06] pb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-2.5 w-2.5 rounded-full bg-[#00B8FF] shadow-[0_0_20px_#00B8FF]" />

              <div className="absolute inset-0 h-2.5 w-2.5 animate-ping rounded-full bg-[#00B8FF]/30" />
            </div>

            <div>
              <div className="text-sm font-bold tracking-[0.35em] text-white/70">
                ENPLICA
              </div>

              <div className="mt-1 hidden text-[9px] tracking-[0.2em] text-white/25 sm:block">
                RAIO-X EMPRESARIAL
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] font-semibold tracking-[0.2em] text-white/25">
              RAIO-X EM ANDAMENTO
            </div>
          </div>
        </header>

        {/* PROGRESSO */}
        <div className="mt-7">
          <div className="grid grid-cols-[1fr_auto] items-center gap-8">
            <div className="text-[10px] font-semibold tracking-[0.15em] text-[#7DDAFF]">
              PERGUNTA {currentQuestion + 1} DE {totalQuestions}
            </div>

            <div className="whitespace-nowrap text-right text-[10px] font-semibold tracking-[0.15em] text-white/25">
              {Math.round(progress)}%
            </div>
          </div>

          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#00B8FF] to-[#8A2EFF] transition-all duration-500 ease-out"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>

        {/* CONTEÚDO */}
        <div
          key={currentQuestion}
          className="flex flex-1 flex-col justify-center py-14"
        >

          {/* ÁREA */}
          <div>
            <div className="inline-flex items-center rounded-full border border-[#00B8FF]/20 bg-[#00B8FF]/5 px-4 py-2">

              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#00B8FF]/10 text-[10px] font-bold text-[#7DDAFF]">
                {current.areaId}
              </span>

              <span className="ml-3 whitespace-nowrap text-[10px] font-bold tracking-[0.18em] text-[#7DDAFF]">
                {current.areaName.toUpperCase()}
              </span>

            </div>
          </div>

          {/* PERGUNTA */}
          <div className="mt-8">
            <div className="mb-4 text-[10px] font-semibold tracking-[0.25em] text-white/25">
              ANÁLISE EMPRESARIAL
            </div>

            <h1 className="max-w-3xl text-3xl font-bold leading-[1.1] tracking-[-0.035em] sm:text-5xl">
              {current.question}
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/40 sm:text-lg">
              Responda de acordo com a realidade atual do seu
              negócio. Não existem respostas certas ou erradas.
            </p>
          </div>

          {/* RESPOSTAS */}
          <div className="mt-10 grid gap-3">
            {ANSWER_OPTIONS.map((option, index) => (
              <button
                key={option.value}
                type="button"
                disabled={isAnswering}
                onClick={() =>
                  handleAnswer(
                    option.value as AnswerValue,
                  )
                }
                className="group relative flex min-h-[68px] items-center gap-5 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] px-5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-[#00B8FF]/40 hover:bg-[#00B8FF]/[0.07] hover:shadow-[0_15px_45px_rgba(0,184,255,0.07)] disabled:cursor-not-allowed disabled:opacity-50 sm:px-6"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/20 text-xs font-bold text-white/30 transition-all group-hover:border-[#00B8FF]/40 group-hover:bg-[#00B8FF]/10 group-hover:text-[#7DDAFF]">
                  {index + 1}
                </div>

                <span className="flex-1 text-base font-medium text-white/70 transition-colors group-hover:text-white sm:text-lg">
                  {option.label}
                </span>

                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-sm text-white/25 transition-all group-hover:border-[#00B8FF]/50 group-hover:text-[#7DDAFF]">
                  →
                </span>
              </button>
            ))}
          </div>

          {/* NAVEGAÇÃO */}
          <div className="mt-8 flex min-h-8 items-center justify-between">
            {currentQuestion > 0 ? (
              <button
                type="button"
                disabled={isAnswering}
                onClick={handlePrevious}
                className="text-xs font-semibold tracking-[0.15em] text-white/30 transition-colors hover:text-white/70 disabled:opacity-30"
              >
                ← ANTERIOR
              </button>
            ) : (
              <span />
            )}

            <div className="text-[10px] tracking-[0.18em] text-white/20">
              RESPOSTA {currentQuestion + 1}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="border-t border-white/[0.05] pt-5 text-center text-[9px] tracking-[0.25em] text-white/20">
          DIAGNÓSTICO ESTRATÉGICO EMPRESARIAL
        </footer>

      </section>
    </main>
  );
}