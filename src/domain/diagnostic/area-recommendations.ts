import type { AreaId } from "@/domain/diagnostic/diagnostic.types";

export interface AreaRecommendation {
  diagnosis: string;
  impact: string;
  actions: string[];
  ctaTitle: string;
  ctaDescription: string;
  ctaButton: string;
}

export const AREA_RECOMMENDATIONS: Record<
  AreaId,
  AreaRecommendation
> = {
  E: {
    diagnosis:
      "Sua operação pode estar dependendo demais de conhecimento informal e processos que vivem apenas na cabeça das pessoas.",
    impact:
      "Isso pode gerar retrabalho, perda de tempo, dificuldade para crescer e dependência excessiva de pessoas específicas.",
    actions: [
      "Mapear os três processos mais importantes da empresa.",
      "Identificar tarefas repetitivas e gargalos.",
      "Documentar processos que hoje dependem apenas de pessoas.",
    ],
    ctaTitle: "Transforme estratégia em processos claros.",
    ctaDescription:
      "Organize a operação, elimine gargalos e crie uma base mais sólida para o crescimento do negócio.",
    ctaButton: "ESTRUTURAR PROCESSOS",
  },

  N: {
    diagnosis:
      "A área de negócios precisa de mais clareza sobre dinheiro, custos, clientes e oportunidades.",
    impact:
      "Sem visibilidade dos números e das negociações, decisões importantes podem ser tomadas com base em percepção em vez de dados.",
    actions: [
      "Mapear receitas, custos e principais fontes de lucro.",
      "Criar uma visão simples do fluxo de caixa.",
      "Organizar indicadores importantes para acompanhar o negócio.",
    ],
    ctaTitle: "Tenha clareza sobre os números do negócio.",
    ctaDescription:
      "Visualize receitas, custos e oportunidades para tomar decisões com mais segurança.",
    ctaButton: "ORGANIZAR MEUS INDICADORES",
  },

  P: {
    diagnosis:
      "O planejamento pode estar sendo substituído pela urgência do dia a dia.",
    impact:
      "Quando tudo parece urgente, decisões importantes ficam para depois e o negócio passa a operar apenas reagindo aos problemas.",
    actions: [
      "Reservar um horário fixo semanal para planejamento.",
      "Definir o principal objetivo do próximo ciclo.",
      "Transformar objetivos em prioridades e rotinas práticas.",
    ],
    ctaTitle: "Pare de apenas reagir ao dia a dia.",
    ctaDescription:
      "Crie prioridades claras e transforme objetivos em ações práticas para o crescimento.",
    ctaButton: "ESTRUTURAR MEU PLANEJAMENTO",
  },

  L: {
    diagnosis:
      "A liderança pode estar concentrando decisões e responsabilidades demais em poucas pessoas.",
    impact:
      "Isso pode dificultar o crescimento da equipe e aumentar a dependência do líder para o funcionamento diário.",
    actions: [
      "Definir claramente responsabilidades da equipe.",
      "Criar uma rotina de feedback.",
      "Alinhar a missão e os objetivos do negócio.",
    ],
    ctaTitle: "Construa uma equipe mais autônoma.",
    ctaDescription:
      "Distribua responsabilidades e desenvolva uma liderança capaz de sustentar o crescimento.",
    ctaButton: "FORTALECER A LIDERANÇA",
  },

  I: {
    diagnosis:
      "Existe uma oportunidade importante de usar tecnologia e inteligência artificial para melhorar a operação.",
    impact:
      "Processos manuais e informações dispersas podem consumir tempo que poderia ser usado em decisões e crescimento.",
    actions: [
      "Identificar tarefas repetitivas que podem ser automatizadas.",
      "Escolher uma ferramenta de IA para uso recorrente.",
      "Centralizar informações importantes para tomada de decisão.",
    ],
    ctaTitle: "Use tecnologia para ganhar tempo.",
    ctaDescription:
      "Automatize processos e utilize inteligência artificial para aumentar a produtividade do negócio.",
    ctaButton: "EXPLORAR SOLUÇÕES DE IA",
  },

  C: {
    diagnosis:
      "A comunicação pode estar criando ruídos entre decisões, pessoas e execução.",
    impact:
      "Informações mal transmitidas podem gerar retrabalho, interpretações diferentes e perda de alinhamento.",
    actions: [
      "Padronizar como decisões importantes são comunicadas.",
      "Preparar pautas para reuniões importantes.",
      "Confirmar o entendimento das pessoas após decisões relevantes.",
    ],
    ctaTitle: "Transforme comunicação em alinhamento.",
    ctaDescription:
      "Reduza ruídos, retrabalho e desalinhamentos dentro da operação.",
    ctaButton: "MELHORAR A COMUNICAÇÃO",
  },

  A: {
    diagnosis:
      "A percepção da marca pode não estar sendo trabalhada de forma consistente.",
    impact:
      "Uma identidade pouco clara pode dificultar reconhecimento, diferenciação e conexão com os clientes.",
    actions: [
      "Revisar a identidade e o posicionamento da marca.",
      "Definir uma mensagem clara sobre o que o negócio representa.",
      "Criar uma rotina consistente de comunicação visual e conteúdo.",
    ],
    ctaTitle: "Faça sua marca ser lembrada.",
    ctaDescription:
      "Construa uma identidade consistente e uma comunicação capaz de gerar reconhecimento.",
    ctaButton: "FORTALECER MINHA MARCA",
  },
};