import type { AreaId, AreaStatus } from "./diagnostic.types";

export interface RecommendationContent {
  diagnosis: string;
  impact: string;
  nextAction: string;
}

export type AreaRecommendations = Record<
  AreaStatus,
  RecommendationContent
>;

export const ENPLICA_RECOMMENDATIONS: Record<
  AreaId,
  AreaRecommendations
> = {
  E: {
    TRATAR: {
      diagnosis:
        "A estratégia do negócio ainda depende demais de decisões improvisadas e de processos que existem apenas na cabeça das pessoas.",
      impact:
        "Isso aumenta retrabalho, dificulta o crescimento e cria dependência excessiva de pessoas específicas.",
      nextAction:
        "Mapear os principais processos da operação e identificar onde existem gargalos, retrabalho e perda de tempo.",
    },

    ATENCAO: {
      diagnosis:
        "O negócio já possui alguns processos organizados, mas ainda existem oportunidades importantes para ganhar eficiência e previsibilidade.",
      impact:
        "Sem uma estratégia de melhoria contínua, o crescimento pode aumentar a complexidade e os custos da operação.",
      nextAction:
        "Escolher um processo importante e redesenhá-lo para reduzir etapas, tempo e desperdícios.",
    },

    SAUDAVEL: {
      diagnosis:
        "A empresa demonstra uma boa capacidade de organizar processos e pensar estrategicamente sobre sua evolução.",
      impact:
        "Isso cria uma base sólida para crescer com mais consistência e menos improviso.",
      nextAction:
        "Continuar revisando processos periodicamente e buscar oportunidades de automação e otimização.",
    },
  },

  N: {
    TRATAR: {
      diagnosis:
        "Existem fragilidades importantes na visão financeira e na compreensão do caminho do dinheiro dentro do negócio.",
      impact:
        "Isso pode gerar decisões sem dados, perda de margem, problemas de caixa e oportunidades comerciais desperdiçadas.",
      nextAction:
        "Mapear custos, receitas e fluxo de caixa para criar uma visão clara da situação financeira do negócio.",
    },

    ATENCAO: {
      diagnosis:
        "O negócio possui alguma organização comercial e financeira, mas ainda existem pontos importantes que precisam ganhar mais clareza.",
      impact:
        "A falta de indicadores consolidados pode dificultar decisões sobre preços, investimentos e crescimento.",
      nextAction:
        "Definir os principais indicadores financeiros e comerciais e acompanhá-los regularmente em um único lugar.",
    },

    SAUDAVEL: {
      diagnosis:
        "A empresa demonstra boa compreensão dos seus números e da importância de entender o problema do cliente antes de negociar.",
      impact:
        "Isso favorece decisões mais inteligentes, negociações mais estratégicas e crescimento sustentável.",
      nextAction:
        "Aprofundar a análise dos indicadores para identificar tendências e oportunidades de crescimento.",
    },
  },

  P: {
    TRATAR: {
      diagnosis:
        "O planejamento ainda acontece de forma reativa, com pouco espaço reservado para pensar estrategicamente sobre o futuro.",
      impact:
        "Isso faz com que urgências dominem a rotina e objetivos importantes sejam constantemente adiados.",
      nextAction:
        "Reservar um horário fixo semanal para planejamento e definir claramente os próximos objetivos prioritários.",
    },

    ATENCAO: {
      diagnosis:
        "Existe alguma preocupação com planejamento, mas a rotina ainda pode estar consumindo o tempo necessário para pensar estrategicamente.",
      impact:
        "Sem consistência no planejamento, prioridades podem mudar constantemente e reduzir a velocidade de execução.",
      nextAction:
        "Criar uma rotina semanal de planejamento e revisar objetivos, prioridades e agenda.",
    },

    SAUDAVEL: {
      diagnosis:
        "A empresa demonstra disciplina para planejar e transformar objetivos em rotinas de execução.",
      impact:
        "Isso aumenta previsibilidade e ajuda a manter o foco mesmo em períodos mais intensos.",
      nextAction:
        "Manter a rotina de planejamento e revisar periodicamente se os objetivos continuam alinhados à estratégia.",
    },
  },

  L: {
    TRATAR: {
      diagnosis:
        "A liderança ainda pode estar excessivamente centralizada, fazendo com que a equipe dependa constantemente de direcionamento.",
      impact:
        "Isso reduz autonomia, sobrecarrega líderes e dificulta o crescimento da operação.",
      nextAction:
        "Definir expectativas claras para a equipe e criar uma rotina consistente de feedback individual.",
    },

    ATENCAO: {
      diagnosis:
        "Existem práticas positivas de liderança, mas ainda há espaço para melhorar clareza, autonomia e alinhamento da equipe.",
      impact:
        "Pequenas falhas de comunicação podem gerar retrabalho e dependência desnecessária dos líderes.",
      nextAction:
        "Fortalecer a comunicação de expectativas e criar momentos regulares de feedback.",
    },

    SAUDAVEL: {
      diagnosis:
        "A empresa demonstra uma boa base de liderança, com preocupação em alinhamento, exemplo e desenvolvimento da equipe.",
      impact:
        "Isso favorece autonomia e cria uma operação menos dependente de decisões centralizadas.",
      nextAction:
        "Continuar desenvolvendo líderes e ampliar progressivamente a autonomia da equipe.",
    },
  },

  I: {
    TRATAR: {
      diagnosis:
        "A tecnologia e a inteligência artificial ainda estão pouco integradas à rotina do negócio.",
      impact:
        "Isso pode manter tarefas repetitivas manuais e colocar a empresa em desvantagem frente a concorrentes mais eficientes.",
      nextAction:
        "Identificar uma tarefa repetitiva da operação e implementar uma solução de automação ou IA.",
    },

    ATENCAO: {
      diagnosis:
        "A empresa já utiliza algumas ferramentas tecnológicas, mas ainda existem oportunidades importantes para integrar automação e IA aos processos.",
      impact:
        "A utilização pontual da tecnologia limita o potencial de ganho de produtividade.",
      nextAction:
        "Mapear tarefas repetitivas e selecionar os processos com maior potencial de automação.",
    },

    SAUDAVEL: {
      diagnosis:
        "A empresa demonstra uma boa abertura para tecnologia e já utiliza ferramentas digitais para apoiar decisões e produtividade.",
      impact:
        "Isso cria vantagem competitiva e aumenta a capacidade de evolução da operação.",
      nextAction:
        "Explorar novas aplicações de IA e automação para potencializar ainda mais os processos existentes.",
    },
  },

  C: {
    TRATAR: {
      diagnosis:
        "A comunicação interna pode estar gerando ruídos e interpretações diferentes sobre decisões e responsabilidades.",
      impact:
        "Isso aumenta retrabalho, conflitos e perda de velocidade na execução.",
      nextAction:
        "Criar processos simples para registrar decisões importantes e confirmar o entendimento das pessoas envolvidas.",
    },

    ATENCAO: {
      diagnosis:
        "A comunicação possui uma base funcional, mas alguns ruídos ainda podem comprometer alinhamento e execução.",
      impact:
        "Informações importantes podem ser interpretadas de maneiras diferentes dentro da equipe.",
      nextAction:
        "Padronizar a comunicação de decisões importantes e criar o hábito de confirmar entendimento.",
    },

    SAUDAVEL: {
      diagnosis:
        "A empresa demonstra preocupação com clareza e alinhamento na comunicação.",
      impact:
        "Isso reduz ruídos e facilita a execução coordenada das decisões.",
      nextAction:
        "Manter boas práticas de comunicação e aperfeiçoar continuamente reuniões e processos de alinhamento.",
    },
  },

  A: {
    TRATAR: {
      diagnosis:
        "A identidade da marca e a forma como o negócio se apresenta ainda podem estar pouco estruturadas.",
      impact:
        "Isso dificulta reconhecimento, diferenciação e conexão emocional com os clientes.",
      nextAction:
        "Definir os principais elementos da identidade da marca e criar um padrão visual e de comunicação.",
    },

    ATENCAO: {
      diagnosis:
        "A marca possui alguns elementos definidos, mas ainda existem oportunidades para aumentar consistência e reconhecimento.",
      impact:
        "Uma comunicação inconsistente pode reduzir a percepção de valor do negócio.",
      nextAction:
        "Organizar identidade visual, posicionamento e frequência de comunicação da marca.",
    },

    SAUDAVEL: {
      diagnosis:
        "A empresa demonstra uma boa preocupação com identidade, posicionamento e apresentação da marca.",
      impact:
        "Isso fortalece reconhecimento e ajuda o cliente a entender o valor do negócio.",
      nextAction:
        "Continuar fortalecendo a marca e buscando novas formas de comunicar seu diferencial.",
    },
  },
};