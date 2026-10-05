"use client";

import { useEffect, useRef, useState } from "react";
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
  DiagnosticResult,
} from "@/domain/diagnostic/diagnostic.types";

type Screen = "diagnostic" | "analyzing" | "registration" | "confirmation";

type FormData = {
  name: string;
  email: string;
  whatsapp: string;
  birthDate: string;
  role: string;
  cnpj: string;
};

export default function DiagnosticoPage() {
  const router = useRouter();

  const musicRef = useRef<HTMLAudioElement | null>(null);

  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<AnswerValue[]>([]);
  const [isAnswering, setIsAnswering] = useState(false);

  const [screen, setScreen] = useState<Screen>("diagnostic");

  const [diagnosticResult, setDiagnosticResult] =
    useState<DiagnosticResult | null>(null);

  const [diagnosticAnswers, setDiagnosticAnswers] =
    useState<DiagnosticAnswers | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    whatsapp: "",
    birthDate: "",
    role: "",
    cnpj: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

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

  useEffect(() => {
    const music = musicRef.current;

    if (!music) return;

    music.volume = 0.02;

    const startMusic = async () => {
      try {
        await music.play();
        setIsMusicPlaying(true);
      } catch {
        console.log(
          "A reprodução automática foi bloqueada pelo navegador.",
        );
      }
    };

    startMusic();

    return () => {
      music.pause();
      music.currentTime = 0;
    };
  }, []);

  function toggleMusic() {
    const music = musicRef.current;

    if (!music) return;

    if (music.paused) {
      music
        .play()
        .then(() => setIsMusicPlaying(true))
        .catch(() => setIsMusicPlaying(false));
    } else {
      music.pause();
      setIsMusicPlaying(false);
    }
  }

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

  function stopMusic() {
    if (musicRef.current) {
      musicRef.current.pause();
      musicRef.current.currentTime = 0;
    }

    setIsMusicPlaying(false);
  }

  function handleAnswer(value: AnswerValue) {
    if (
      isAnswering ||
      screen !== "diagnostic"
    ) {
      return;
    }

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

      const builtAnswers =
        buildDiagnosticAnswers(newAnswers);

      const result =
        calculateDiagnostic(builtAnswers);

      setDiagnosticAnswers(builtAnswers);
      setDiagnosticResult(result);

      stopMusic();

      setScreen("analyzing");

      window.setTimeout(() => {
        setScreen("registration");
      }, 1800);

      setIsAnswering(false);
    }, 350);
  }

  function handlePrevious() {
    if (
      currentQuestion === 0 ||
      isAnswering ||
      screen !== "diagnostic"
    ) {
      return;
    }

    setCurrentQuestion((previous) => previous - 1);
  }

  function updateForm(
    field: keyof FormData,
    value: string,
  ) {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));

    if (formError) {
      setFormError("");
    }
  }

  async function handleRegistration(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      !diagnosticResult ||
      !diagnosticAnswers
    ) {
      setFormError(
        "Não foi possível localizar os dados do diagnóstico. Refaça o Raio-X.",
      );
      return;
    }

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.whatsapp.trim()
    ) {
      setFormError(
        "Preencha nome, e-mail e WhatsApp para continuar.",
      );
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    try {
      const response = await fetch(
        "/api/clients",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            whatsapp: formData.whatsapp,
            birthDate:
              formData.birthDate || null,
            role: formData.role || null,
            cnpj: formData.cnpj || null,
            diagnostic: {
              overallScore: diagnosticResult.totalScore,
              maxScore:
                diagnosticResult.maxScore,
              percentage:
                diagnosticResult.percentage,
              priorityArea: diagnosticResult.priorities[0]?.areaId ?? null,
              answers: diagnosticAnswers,
              areas:
                diagnosticResult.areas ?? [],
            },
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Não foi possível salvar seu cadastro.",
        );
      }

      sessionStorage.setItem(
        "enplica-client-id",
        data.clientId,
      );

      sessionStorage.setItem(
        "enplica-diagnostic-id",
        data.diagnosticId,
      );

      setScreen("confirmation");
    } catch (error) {
      console.error(error);

      setFormError(
        error instanceof Error
          ? error.message
          : "Não foi possível concluir o cadastro. Tente novamente.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function releaseDiagnostic() {
    if (!diagnosticResult) return;

    sessionStorage.setItem(
      "enplica-diagnostic-result",
      JSON.stringify(diagnosticResult),
    );

    router.push("/resultado");
  }

  if (screen === "analyzing") {
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

  if (screen === "registration") {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#050507] text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[5%] top-[5%] h-[520px] w-[520px] rounded-full bg-[#00B8FF]/10 blur-[160px]" />

          <div className="absolute bottom-0 right-[-5%] h-[520px] w-[520px] rounded-full bg-[#8A2EFF]/10 blur-[160px]" />

          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:70px_70px]" />
        </div>

        <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-3xl flex-col px-5 py-8 sm:px-8 sm:py-12">
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

                <div className="mt-1 text-[9px] tracking-[0.2em] text-white/25">
                  RAIO-X EMPRESARIAL
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] font-semibold tracking-[0.2em] text-[#7DDAFF]">
                DIAGNÓSTICO PRONTO
              </div>
            </div>
          </header>

          <div className="flex flex-1 flex-col justify-center py-12">
            <div className="mx-auto w-full max-w-2xl">
              <div className="text-[10px] font-bold tracking-[0.3em] text-[#7DDAFF]">
                LIBERE SEU RESULTADO
              </div>

              <h1 className="mt-5 text-3xl font-bold leading-tight tracking-[-0.035em] sm:text-5xl">
                Seu Raio-X está pronto.
              </h1>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/40 sm:text-lg">
                Preencha seus dados para registrarmos seu diagnóstico
                e liberar seu resultado completo.
              </p>

              <form
                onSubmit={handleRegistration}
                className="mt-10 grid gap-4"
              >
                <div>
                  <label className="mb-2 block text-[10px] font-semibold tracking-[0.18em] text-white/40">
                    NOME *
                  </label>

                  <input
                    type="text"
                    value={formData.name}
                    onChange={(event) =>
                      updateForm(
                        "name",
                        event.target.value,
                      )
                    }
                    placeholder="Seu nome completo"
                    autoComplete="name"
                    required
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-4 text-white outline-none transition placeholder:text-white/20 focus:border-[#00B8FF]/50 focus:bg-[#00B8FF]/[0.04]"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-[10px] font-semibold tracking-[0.18em] text-white/40">
                      E-MAIL *
                    </label>

                    <input
                      type="email"
                      value={formData.email}
                      onChange={(event) =>
                        updateForm(
                          "email",
                          event.target.value,
                        )
                      }
                      placeholder="voce@empresa.com"
                      autoComplete="email"
                      required
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-4 text-white outline-none transition placeholder:text-white/20 focus:border-[#00B8FF]/50 focus:bg-[#00B8FF]/[0.04]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-[10px] font-semibold tracking-[0.18em] text-white/40">
                      CELULAR / WHATSAPP *
                    </label>

                    <input
                      type="tel"
                      value={formData.whatsapp}
                      onChange={(event) =>
                        updateForm(
                          "whatsapp",
                          event.target.value,
                        )
                      }
                      placeholder="(35) 99999-9999"
                      autoComplete="tel"
                      required
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-4 text-white outline-none transition placeholder:text-white/20 focus:border-[#00B8FF]/50 focus:bg-[#00B8FF]/[0.04]"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-[10px] font-semibold tracking-[0.18em] text-white/40">
                      DATA DE NASCIMENTO
                    </label>

                    <input
                      type="date"
                      value={formData.birthDate}
                      onChange={(event) =>
                        updateForm(
                          "birthDate",
                          event.target.value,
                        )
                      }
                      autoComplete="bday"
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-4 text-white outline-none transition focus:border-[#00B8FF]/50 focus:bg-[#00B8FF]/[0.04]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-[10px] font-semibold tracking-[0.18em] text-white/40">
                      CARGO
                    </label>

                    <input
                      type="text"
                      value={formData.role}
                      onChange={(event) =>
                        updateForm(
                          "role",
                          event.target.value,
                        )
                      }
                      placeholder="Ex.: Sócio, Diretor, Gestor"
                      autoComplete="organization-title"
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-4 text-white outline-none transition placeholder:text-white/20 focus:border-[#00B8FF]/50 focus:bg-[#00B8FF]/[0.04]"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-semibold tracking-[0.18em] text-white/40">
                    CNPJ <span className="text-white/20">(OPCIONAL)</span>
                  </label>

                  <input
                    type="text"
                    value={formData.cnpj}
                    onChange={(event) =>
                      updateForm(
                        "cnpj",
                        event.target.value,
                      )
                    }
                    placeholder="00.000.000/0000-00"
                    inputMode="numeric"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-4 text-white outline-none transition placeholder:text-white/20 focus:border-[#00B8FF]/50 focus:bg-[#00B8FF]/[0.04]"
                  />
                </div>

                {formError ? (
                  <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.06] px-5 py-4 text-sm text-red-300">
                    {formError}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-3 flex min-h-[62px] items-center justify-center rounded-2xl bg-gradient-to-r from-[#00B8FF] to-[#8A2EFF] px-6 text-sm font-bold tracking-[0.08em] text-white shadow-[0_15px_50px_rgba(0,184,255,0.15)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_60px_rgba(138,46,255,0.2)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting
                    ? "REGISTRANDO SEU DIAGNÓSTICO..."
                    : "CONTINUAR"}
                </button>

                <p className="text-center text-[10px] leading-relaxed text-white/20">
                  Seus dados serão utilizados para registrar seu
                  diagnóstico e permitir o atendimento relacionado
                  ao ENPLICA.
                </p>
              </form>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (screen === "confirmation") {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050507] text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-[35%] h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00B8FF]/10 blur-[180px]" />

          <div className="absolute bottom-[-10%] right-[-5%] h-[520px] w-[520px] rounded-full bg-[#8A2EFF]/10 blur-[160px]" />

          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:70px_70px]" />
        </div>

        <section className="relative z-10 w-full max-w-2xl px-6 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-green-500/30 bg-green-500/10 shadow-[0_0_70px_rgba(34,197,94,0.12)]">
            <div className="text-3xl text-green-300">
              ✓
            </div>
          </div>

          <div className="mt-10 text-[11px] font-bold tracking-[0.35em] text-[#7DDAFF]">
            RAIO-X CONCLUÍDO
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-5xl">
            Seu diagnóstico está pronto.
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/40 sm:text-lg">
            Suas respostas foram registradas e sua análise
            empresarial foi preparada.
          </p>

          <div className="mx-auto mt-8 max-w-md rounded-2xl border border-white/10 bg-white/[0.025] p-5">
            <div className="text-[10px] font-semibold tracking-[0.2em] text-white/25">
              PRÓXIMO PASSO
            </div>

            <div className="mt-2 text-sm text-white/60">
              Libere agora seu Raio-X completo com pontuação,
              radar das sete áreas e prioridades de evolução.
            </div>
          </div>

          <button
            type="button"
            onClick={releaseDiagnostic}
            className="mx-auto mt-8 flex min-h-[64px] w-full max-w-md items-center justify-center rounded-2xl bg-gradient-to-r from-[#00B8FF] to-[#8A2EFF] px-6 text-sm font-bold tracking-[0.08em] text-white shadow-[0_15px_50px_rgba(0,184,255,0.15)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_60px_rgba(138,46,255,0.2)]"
          >
            SIM, QUERO RECEBER MEU DIAGNÓSTICO
          </button>

          <p className="mt-5 text-[10px] text-white/20">
            Seu resultado será liberado imediatamente.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050507] text-white">
      <audio
        ref={musicRef}
        src="/sounds/trilha-enplica.mp3"
        loop
        preload="auto"
      />

      <button
        type="button"
        onClick={toggleMusic}
        className="fixed bottom-5 right-5 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/40 text-lg text-white/60 backdrop-blur-xl transition-all hover:border-[#00B8FF]/40 hover:bg-[#00B8FF]/10 hover:text-[#7DDAFF]"
        aria-label={
          isMusicPlaying
            ? "Pausar música"
            : "Reproduzir música"
        }
      >
        {isMusicPlaying ? "🔊" : "🔇"}
      </button>

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[5%] top-[5%] h-[520px] w-[520px] rounded-full bg-[#00B8FF]/10 blur-[160px]" />

        <div className="absolute bottom-0 right-[-5%] h-[520px] w-[520px] rounded-full bg-[#8A2EFF]/10 blur-[160px]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:70px_70px]" />
      </div>

      <section className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col px-5 py-7 sm:px-8 sm:py-10">
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

        <div
          key={currentQuestion}
          className="flex flex-1 flex-col justify-center py-14"
        >
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

          <div className="mt-8">
            <div className="mb-4 text-[10px] font-semibold tracking-[0.25em] text-white/25">
              ANÁLISE EMPRESARIAL
            </div>

            <h1 className="max-w-3xl text-3xl font-bold leading-[1.1] tracking-[-0.035em] sm:text-5xl">
              {current.question}
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/40 sm:text-lg">
              Responda de acordo com a realidade atual do seu negócio.
              Não existem respostas certas ou erradas.
            </p>
          </div>

          <div className="mt-10 grid gap-3">
            {ANSWER_OPTIONS.map((option, index) => (
              <button
                key={option.value}
                type="button"
                disabled={isAnswering}
                onClick={() =>
                  handleAnswer(option.value as AnswerValue)
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

          <div className="mt-8 flex min-h-8 items-center justify-between">
            {currentQuestion > 0 ? (
              <button
                type="button"
                disabled={isAnswering}
                onClick={handlePrevious}
                className="text-xs font-semibold tracking-[0.15em] text-white/30 transition-colors hover:text-white/70 disabled:opacity-30"
              >
                ← VOLTAR
              </button>
            ) : (
              <div />
            )}

            <div className="text-[10px] font-semibold tracking-[0.2em] text-white/20">
              RESPOSTA {currentQuestion + 1}
            </div>
          </div>
        </div>

        <footer className="border-t border-white/[0.06] pt-6 text-center">
          <div className="text-[9px] font-semibold tracking-[0.28em] text-white/20">
            DIAGNÓSTICO ESTRATÉGICO EMPRESARIAL
          </div>
        </footer>
      </section>
    </main>
  );
}

