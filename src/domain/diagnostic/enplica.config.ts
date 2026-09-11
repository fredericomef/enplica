export const ENPLICA_AREAS = [
{
id: "E",
name: "Estratégia",
description:
"Mapear os processos, enxergar os padrões e desenhar otimizações. É o que faz o negócio crescer de forma coordenada em vez de por impulso.",
treatment: "Restauração de Processo",
questions: [
"Os processos principais da minha operação estão escritos em algum lugar, não só na cabeça das pessoas.",
"Quando alguém tira férias ou sai da equipe, o trabalho continua sem depender de resgatar informação com essa pessoa.",
"Nos últimos três meses eu mudei algum processo de propósito, para ficar mais rápido ou mais barato.",
],
},

{
id: "N",
name: "Negócios",
description:
"Ganha e ganha: entender o problema do cliente e resolver junto. E conhecer o caminho do dinheiro, porque ele vem em troca do seu tempo.",
treatment: "Implante de Painel",
questions: [
"Eu sei quanto custa, em dinheiro e em horas, cada serviço que eu vendo.",
"Tenho fluxo de caixa e provisões desenhados, e consigo dizer hoje como estará o caixa daqui a noventa dias.",
"Entro nas negociações entendendo o problema do cliente antes de falar de preço.",
],
},

{
id: "P",
name: "Planejamento",
description:
"Travar na agenda um tempo para pensar. Pensar é o trabalho mais difícil, e é o primeiro a ser sacrificado quando a semana aperta.",
treatment: "Limpeza de Agenda",
questions: [
"Tenho na agenda um bloco fixo para pensar e planejar, e ele sobrevive à semana.",
"Sei dizer qual é o meu próximo objetivo grande e quais rotinas me levam até ele.",
"Termino a semana com a próxima já planejada, em vez de começar a segunda decidindo o que fazer.",
],
},

{
id: "L",
name: "Liderança",
description:
"Ninguém nasce líder, o líder é forjado dia após dia. E não há outro modo de ensinar que não seja pelo exemplo.",
treatment: "Restauração de Reunião",
questions: [
"Minha equipe sabe o que se espera dela sem precisar me perguntar a cada tarefa.",
"Dou retorno individual para a equipe com regularidade, não só quando algo dá errado.",
"Consigo dizer em uma frase qual é a missão do meu negócio, e a equipe diria a mesma coisa.",
],
},

{
id: "I",
name: "IA e Tecnologia",
description:
"As ferramentas já estão disponíveis, muitas delas gratuitas. Se você ainda não as usa, provavelmente seu concorrente já usa.",
treatment: "Implante de IA",
questions: [
"Uso alguma ferramenta de IA no meu trabalho toda semana, não só por curiosidade.",
"Pelo menos uma tarefa repetitiva da minha operação já está automatizada ou apoiada por tecnologia.",
"As informações de que preciso para decidir estão em um sistema que eu consulto, não espalhadas em conversas.",
],
},

{
id: "C",
name: "Comunicação",
description:
"Você é responsável por cem por cento do que diz e corresponsável por aquilo que os outros entenderam.",
treatment: "Clareamento de Comunicação",
questions: [
"As decisões importantes que eu comunico chegam à equipe sem virar telefone sem fio.",
"Preparo o que vou dizer antes das reuniões e apresentações que importam.",
"Confirmo o que o outro entendeu, em vez de assumir que fui claro.",
],
},

{
id: "A",
name: "Artes",
description:
"Aquilo que é belo encanta. É pela marca que o cliente se identifica com você e reconhece o que você defende.",
treatment: "Restauração de Marca",
questions: [
"Minha marca tem identidade definida, com cores, aplicação e tom, e é usada de forma consistente.",
"Um cliente conseguiria explicar, com as palavras dele, o que meu negócio defende.",
"Produzo com regularidade material que mostra o que eu faço, não só quando estou vendendo.",
],
},
] as const;

export const ANSWER_OPTIONS = [
{
label: "Nada a ver comigo",
value: 0,
},
{
label: "Às vezes",
value: 1,
},
{
label: "Quase sempre",
value: 2,
},
{
label: "Exatamente assim",
value: 3,
},
] as const;
