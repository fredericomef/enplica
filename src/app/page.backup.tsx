"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [isStarting, setIsStarting] = useState(false);
const flashSoundRef = useRef<HTMLAudioElement | null>(null);
  function handleStartDiagnostic() {
  if (isStarting) return;

  setIsStarting(true);

  if (flashSoundRef.current) {
    flashSoundRef.current.currentTime = 0;
    flashSoundRef.current.play().catch((error) => {
      console.error("Erro ao reproduzir o som do flash:", error);
    });
  }

  window.setTimeout(() => {
  router.push("/diagnostico");
}, 900);
}

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050507] text-white">
      <audio
  ref={flashSoundRef}
  src="/sounds/flash.mp3"
  preload="auto"
/>
      {/* Fundo tecnológico */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-20%] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#00B8FF]/15 blur-[140px]" />

        <div className="absolute bottom-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-[#8A2EFF]/15 blur-[140px]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:70px_70px]" />
      </div>

      {/* Conteúdo */}
      <section className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-16 text-center">
        {/* Marca */}
        <div className="mb-10 flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-[#00B8FF] shadow-[0_0_20px_#00B8FF]" />

          <span className="text-sm font-semibold tracking-[0.35em] text-white/60">
            ENPLICA
          </span>
        </div>

        {/* Badge */}
        <div className="mb-8 rounded-full border border-[#00B8FF]/30 bg-[#00B8FF]/5 px-5 py-2 text-sm font-medium text-[#7DDAFF] backdrop-blur-xl">
          DIAGNÓSTICO ESTRATÉGICO EMPRESARIAL
        </div>

        {/* Título */}
        <h1 className="max-w-4xl text-5xl font-bold leading-[0.95] tracking-[-0.04em] sm:text-7xl lg:text-8xl">
          Faça um
          <span className="block bg-gradient-to-r from-[#00B8FF] via-white to-[#8A2EFF] bg-clip-text text-transparent">
            RAIO-X
          </span>
          do seu negócio.
        </h1>

        {/* Descrição */}
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/60 sm:text-xl">
          Descubra onde sua empresa está perdendo{" "}
          <span className="font-semibold text-white">tempo</span>,{" "}
          <span className="font-semibold text-white">dinheiro</span> e{" "}
          <span className="font-semibold text-white">oportunidades</span>.
        </p>

        <p className="mt-4 max-w-xl text-base leading-relaxed text-white/40">
          Um diagnóstico estratégico baseado em sete áreas fundamentais
          para entender onde agir primeiro.
        </p>

        {/* Indicadores */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-8 py-5 backdrop-blur-xl">
            <div className="text-2xl font-bold text-[#00B8FF]">7</div>

            <div className="mt-1 text-sm text-white/50">
              Áreas analisadas
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-8 py-5 backdrop-blur-xl">
            <div className="text-2xl font-bold text-white">21</div>

            <div className="mt-1 text-sm text-white/50">
              Perguntas estratégicas
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-8 py-5 backdrop-blur-xl">
            <div className="text-2xl font-bold text-[#8A2EFF]">∞</div>

            <div className="mt-1 text-sm text-white/50">
              Possibilidades de evolução
            </div>
          </div>
        </div>

        {/* Botão */}
        <button
          type="button"
          onClick={handleStartDiagnostic}
          disabled={isStarting}
          className="group relative mt-12 overflow-hidden rounded-2xl bg-gradient-to-r from-[#00B8FF] to-[#8A2EFF] px-10 py-5 text-base font-bold text-white shadow-[0_0_50px_rgba(0,184,255,0.25)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_80px_rgba(138,46,255,0.35)] active:scale-[0.98] disabled:cursor-not-allowed"
        >
          <span className="relative z-10">
            {isStarting
              ? "INICIANDO ANÁLISE..."
              : "INICIAR MEU DIAGNÓSTICO"}
          </span>

          <span className="absolute inset-0 translate-x-[-100%] bg-white/20 transition-transform duration-700 group-hover:translate-x-[100%]" />
        </button>

        <p className="mt-5 text-xs tracking-wide text-white/30">
          LEVA APENAS ALGUNS MINUTOS
        </p>
      </section>

      {/* FLASH CINEMATOGRÁFICO */}
      {isStarting && (
  <div className="enplica-flash pointer-events-none fixed inset-0 z-50" />
)}
    </main>
  );
}