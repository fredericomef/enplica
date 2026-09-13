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
    ctaTitle: "Organize sua operação para crescer.",
    ctaDescription:
      "O próximo passo é transformar processos informais em uma operação mais clara, eficiente e escalável.",
    ctaButton: "QUERO ESTRUTURAR MEUS PROCESSOS",
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
    ctaTitle: "Transforme números em decisões melhores.",
    ctaDescription:
      "O próximo passo é criar uma visão clara do seu negócio para acompanhar resultados, dinheiro e oportunidades.",
    ctaButton: "QUERO APLICAR O IMPLANTE DE PAINEL",
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
      "O próximo passo é criar uma rotina estratégica para que seu negócio tenha direção, prioridades e objetivos claros.",
    ctaButton: "QUERO ORGANIZAR MEU PLANEJAMENTO",
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
    ctaTitle: "Construa uma equipe mais independente.",
    ctaDescription:
      "O próximo passo é estruturar responsabilidades, comunicação e liderança para reduzir a dependência excessiva do gestor.",
    ctaButton: "QUERO FORTALECER MINHA LIDERANÇA",
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
      "O próximo passo é identificar onde inteligência artificial, automações e sistemas podem gerar mais resultado para sua empresa.",
    ctaButton: "QUERO EVOLUIR COM IA E TECNOLOGIA",
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
    ctaTitle: "Faça sua equipe entender na primeira vez.",
    ctaDescription:
      "O próximo passo é criar uma comunicação mais clara para reduzir ruídos, retrabalho e desalinhamento.",
    ctaButton: "QUERO MELHORAR MINHA COMUNICAÇÃO",
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
    ctaTitle: "Transforme sua marca em uma experiência memorável.",
    ctaDescription:
      "O próximo passo é fortalecer sua identidade, posicionamento e comunicação para criar mais reconhecimento.",
    ctaButton: "QUERO FORTALECER MINHA MARCA",
  },
};