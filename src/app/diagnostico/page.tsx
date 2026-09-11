"use client";

import { useState } from "react";
import {
  ANSWER_OPTIONS,
  ENPLICA_AREAS,
} from "@/domain/diagnostic/enplica.config";
import { calculateDiagnostic } from "@/domain/diagnostic/diagnostic.engine";
import type {
  AnswerValue,
  DiagnosticAnswers,
} from "@/domain/diagnostic/diagnostic.types";

export default function DiagnosticoPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<AnswerValue[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const allQuestions = ENPLICA_AREAS.flatMap((area) =>
    area.questions.map((question) => ({
      areaId: area.id,
      areaName: area.name,
      question,
    }))
  );

  const totalQuestions = allQuestions.length;
  const current = allQuestions[currentQuestion];

  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  function buildDiagnosticAnswers(
    allAnswers: AnswerValue[],
  ): DiagnosticAnswers {
    return {
      E: allAnswers.slice(0, 3),
      N: allAnswers.slice(3, 6),
      P: allAnswers.slice(6, 9),
      L: allAnswers.slice(9, 12),
      I: allAnswers.slice(12, 15),
      C: allAnswers.slice(15, 18),
      A: allAnswers.slice(18, 21),
    };
  }

  function handleAnswer(value: AnswerValue) {
    if (isFinished) return;

    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;

    setAnswers(newAnswers);

    window.setTimeout(() => {
      if (currentQuestion < totalQuestions - 1) {
        setCurrentQuestion((previous) => previous + 1);
        return;
      }

      const diagnosticAnswers = buildDiagnosticAnswers(newAnswers);

      const result = calculateDiagnostic(diagnosticAnswers);

      console.log("══════════════════════════════════");
      console.log("DIAGNÓSTICO ENPLICA CONCLUÍDO");
      console.log("══════════════════════════════════");
      console.log("Pontuação:", result.totalScore, "/", result.maxScore);
      console.log("Percentual:", result.percentage + "%");
      console.log("Áreas:", result.areas);
      console.log("Prioridades:", result.priorities);

      setIsFinished(true);
    }, 350);
  }

  if (isFinished) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050507] px-6 text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[20%] top-[10%] h-[500px] w-[500px] rounded-full bg-[#00B8FF]/15 blur-[150px]" />

          <div className="absolute bottom-[10%] right-[10%] h-[500px] w-[500px] rounded-full bg-[#8A2EFF]/15 blur-[150px]" />
        </div>

        <section className="relative z-10 text-center">
          <div className="mb-8 text-sm font-semibold tracking-[0.35em] text-[#00B8FF]">
            ENPLICA
          </div>

          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-[#00B8FF]/30 bg-[#00B8FF]/10 text-4xl shadow-[0_0_60px_rgba(0,184,255,0.25)]">
            ✓
          </div>

          <h1 className="text-4xl font-bold sm:text-6xl">
            Diagnóstico
            <span className="block bg-gradient-to-r from-[#00B8FF] to-[#8A2EFF] bg-clip-text text-transparent">
              concluído.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/50">
            Estamos organizando o raio-X estratégico do seu negócio.
          </p>

          <p className="mt-3 text-sm text-white/30">
            Seu resultado está pronto para análise.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050507] text-white">
      {/* Fundo tecnológico */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[10%] top-[10%] h-[500px] w-[500px] rounded-full bg-[#00B8FF]/10 blur-[150px]" />

        <div className="absolute bottom-[5%] right-[5%] h-[500px] w-[500px] rounded-full bg-[#8A2EFF]/10 blur-[150px]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:70px_70px]" />
      </div>

      <section className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col px-6 py-10">
        {/* Cabeçalho */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-[#00B8FF] shadow-[0_0_20px_#00B8FF]" />

            <span className="text-sm font-semibold tracking-[0.35em] text-white/60">
              ENPLICA
            </span>
          </div>

          <div className="text-sm text-white/40">
            {currentQuestion + 1} / {totalQuestions}
          </div>
        </header>

        {/* Progresso */}
        <div className="mt-8">
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#00B8FF] to-[#8A2EFF] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Conteúdo */}
        <div className="flex flex-1 flex-col justify-center py-16">
          {/* Área */}
          <div className="mb-8">
            <div className="inline-flex rounded-full border border-[#00B8FF]/20 bg-[#00B8FF]/5 px-4 py-2 text-sm font-medium text-[#7DDAFF]">
              ÁREA {current.areaId} — {current.areaName.toUpperCase()}
            </div>
          </div>

          {/* Pergunta */}
          <h1 className="max-w-3xl text-3xl font-bold leading-tight tracking-[-0.03em] sm:text-5xl">
            {current.question}
          </h1>

          <p className="mt-6 text-lg text-white/45">
            Responda com sinceridade. Não existem respostas certas ou erradas.
          </p>

          {/* Respostas */}
          <div className="mt-12 grid gap-4">
            {ANSWER_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleAnswer(option.value)}
                className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-5 text-left transition-all duration-300 hover:border-[#00B8FF]/50 hover:bg-[#00B8FF]/10 hover:shadow-[0_0_40px_rgba(0,184,255,0.08)]"
              >
                <span className="text-lg font-medium text-white/80 group-hover:text-white">
                  {option.label}
                </span>

                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-sm text-white/40 transition-all group-hover:border-[#00B8FF] group-hover:text-[#00B8FF]">
                  →
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Rodapé */}
        <footer className="text-center text-xs tracking-wide text-white/25">
          DIAGNÓSTICO ESTRATÉGICO EMPRESARIAL
        </footer>
      </section>
    </main>
  );
}