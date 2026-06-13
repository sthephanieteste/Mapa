export interface Photo {
  id: string;
  src: string;
  caption: string;
}

export interface Video {
  id: string;
  title: string;
  src: string;
  thumbnail?: string;
}

export interface StoryBlock {
  id: string;
  heading?: string;
  text: string;
}

export interface Message {
  id: string;
  author: string;
  avatar: string;
  text: string;
  date: string;
}

export interface Chapter {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  accentColor: string;
  photos: Photo[];
  videos: Video[];
  story: StoryBlock[];
  messages: Message[];
}

export interface MapMarker {
  id: string;
  label: string;
  shortDesc: string;
  top: string;
  left: string;
  icon: string;
  color: string;
}

export const MAP_MARKERS: MapMarker[] = [
  {
    id: "rio-de-janeiro",
    label: "Rio de Janeiro",
    shortDesc: "Minha origem, onde tudo começou",
    top: "14%",
    left: "9%",
    icon: "🌊",
    color: "#2196f3",
  },
  {
    id: "a-viagem",
    label: "A Viagem",
    shortDesc: "O caminho que me trouxe até você",
    top: "42%",
    left: "8%",
    icon: "🚌",
    color: "#ff9800",
  },
  {
    id: "utfpr",
    label: "UTFPR Cornélio",
    shortDesc: "Nosso ponto de encontro",
    top: "24%",
    left: "52%",
    icon: "🎓",
    color: "#7c3aed",
  },
  {
    id: "della-pazetti",
    label: "Della Pazetti",
    shortDesc: "Sabores que viraram lembranças",
    top: "26%",
    left: "88%",
    icon: "🍕",
    color: "#e53935",
  },
  {
    id: "cristo-cornelio",
    label: "Cristo de Cornélio",
    shortDesc: "O pedido que mudou nossa história",
    top: "60%",
    left: "32%",
    icon: "✝️",
    color: "#f59e0b",
  },
  {
    id: "utfpr-guarapuava",
    label: "UTFPR Guarapuava",
    shortDesc: "Novos capítulos, novas conquistas",
    top: "12%",
    left: "87%",
    icon: "🏔️",
    color: "#10b981",
  },
  {
    id: "o-futuro",
    label: "O Futuro",
    shortDesc: "Ainda não sabemos, mas será incrível",
    top: "74%",
    left: "82%",
    icon: "✨",
    color: "#f59e0b",
  },
];

export const CHAPTERS: Record<string, Chapter> = {
  "rio-de-janeiro": {
    id: "rio-de-janeiro",
    title: "Rio de Janeiro",
    subtitle: "Capítulo I — A Origem",
    description:
      "A cidade que me formou. Entre praias, morros e o olhar do Cristo, foi aqui que eu cresci, sonhei e me preparei para uma jornada que ainda não sabia que estava por vir. O Rio não é só uma cidade — é a raiz de quem eu sou.",
    icon: "🌊",
    color: "#2196f3",
    accentColor: "#bbdefb",
    photos: [
      { id: "p1", src: "/assets/fotos/rio-de-janeiro/foto1.jpg", caption: "Vista da Baía de Guanabara" },
      { id: "p2", src: "/assets/fotos/rio-de-janeiro/foto2.jpg", caption: "Minha cidade" },
      { id: "p3", src: "/assets/fotos/rio-de-janeiro/foto3.jpg", caption: "O Cristo nos olha de cima" },
      { id: "p4", src: "/assets/fotos/rio-de-janeiro/foto4.jpg", caption: "A praia que sinto falta" },
    ],
    videos: [
      { id: "v1", title: "Um dia no Rio", src: "", thumbnail: "" },
    ],
    story: [
      {
        id: "s1",
        heading: "Onde tudo começou",
        text: "Nasci e cresci com o barulho do mar como trilha sonora. O Rio de Janeiro me ensinou que a vida pode ser intensa, colorida e cheia de contrastes — exatamente como a nossa história.",
      },
      {
        id: "s2",
        text: "Antes de te conhecer, eu não sabia que uma cidade inteira poderia caber em um só capítulo. Mas foi daqui que parti, com uma mochila nas costas e algo me dizendo que o melhor estava por vir.",
      },
    ],
    messages: [
      {
        id: "m1",
        author: "Você",
        avatar: "🌊",
        text: "Cada vez que penso no Rio, lembro que ele foi o começo de tudo. De mim. E de nós.",
        date: "13 de junho de 2026",
      },
    ],
  },

  "a-viagem": {
    id: "a-viagem",
    title: "A Viagem",
    subtitle: "Capítulo II — A Mudança",
    description:
      "Quilômetros de estrada entre o Rio e o Paraná. Uma janela de ônibus, músicas no fone, e a sensação de que algo grande estava prestes a acontecer. Cada curva da estrada era um passo em direção a você.",
    icon: "🚌",
    color: "#ff9800",
    accentColor: "#ffe0b2",
    photos: [
      { id: "p1", src: "/assets/fotos/a-viagem/foto1.jpg", caption: "A partida" },
      { id: "p2", src: "/assets/fotos/a-viagem/foto2.jpg", caption: "Pelo caminho" },
      { id: "p3", src: "/assets/fotos/a-viagem/foto3.jpg", caption: "As montanhas que cruzei" },
    ],
    videos: [
      { id: "v1", title: "A chegada ao Paraná", src: "", thumbnail: "" },
    ],
    story: [
      {
        id: "s1",
        heading: "A estrada como metáfora",
        text: "Mudar de cidade é assustador. Mas tem uma magia nisso — o desconhecido à frente, o familiar ficando para trás, e você ali no meio, se tornando alguém novo a cada quilômetro.",
      },
      {
        id: "s2",
        text: "Eu não sabia o que me esperava no Paraná. Não sabia que um campus de universidade podia ser o cenário de uma história de amor. Não sabia que você existia. E então, de repente, você existiu.",
      },
    ],
    messages: [
      {
        id: "m1",
        author: "Você",
        avatar: "🚌",
        text: "Aquela viagem foi a melhor decisão que já tomei sem saber que estava tomando.",
        date: "13 de junho de 2026",
      },
    ],
  },

  "utfpr": {
    id: "utfpr",
    title: "UTFPR Cornélio Procópio",
    subtitle: "Capítulo III — O Encontro",
    description:
      "Foi aqui, entre os corredores da UTFPR, que o destino nos colocou no mesmo caminho. Um olhar, uma conversa, e o que era desconhecido virou o começo da nossa história. O campus que será para sempre o cenário do nosso primeiro capítulo.",
    icon: "🎓",
    color: "#7c3aed",
    accentColor: "#ede9fe",
    photos: [
      { id: "p1", src: "/assets/fotos/utfpr/foto1.jpg", caption: "O primeiro encontro ✨" },
      { id: "p2", src: "/assets/fotos/utfpr/foto2.jpg", caption: "Nos corredores da UTFPR" },
      { id: "p3", src: "/assets/fotos/utfpr/foto3.jpg", caption: "Uma tarde inesquecível" },
      { id: "p4", src: "/assets/fotos/utfpr/foto4.jpg", caption: "Mais uma memória" },
    ],
    videos: [
      { id: "v1", title: "Um dia no campus", src: "", thumbnail: "" },
    ],
    story: [
      {
        id: "s1",
        heading: "Onde nos conhecemos",
        text: "Tem lugares que parecem comuns até o dia em que se tornam especiais para sempre. A UTFPR era só uma universidade. Até que você apareceu.",
      },
      {
        id: "s2",
        text: "Primeiras impressões, primeiras conversas, primeiros sorrisos. É curioso como a gente pode estar no mesmo espaço por dias e de repente — num instante — tudo muda.",
      },
    ],
    messages: [
      {
        id: "m1",
        author: "Você",
        avatar: "🎓",
        text: "Se eu pudesse voltar a qualquer momento, escolheria aquele corredor. Aquele exato segundo.",
        date: "13 de junho de 2026",
      },
    ],
  },

  "della-pazetti": {
    id: "della-pazetti",
    title: "Della Pazetti",
    subtitle: "Capítulo IV — Nossas Saídas",
    description:
      "Nossas risadas, conversas e pizzas. O lugar onde a gente virou 'nós'. Cada visita era um novo capítulo — às vezes curto, às vezes longo, mas sempre com um final bom.",
    icon: "🍕",
    color: "#e53935",
    accentColor: "#ffebee",
    photos: [
      { id: "p1", src: "/assets/fotos/della-pazetti/foto1.jpg", caption: "Nossa mesa favorita" },
      { id: "p2", src: "/assets/fotos/della-pazetti/foto2.jpg", caption: "A melhor pizza" },
      { id: "p3", src: "/assets/fotos/della-pazetti/foto3.jpg", caption: "Uma noite especial" },
    ],
    videos: [
      { id: "v1", title: "Aquela noite no Della", src: "", thumbnail: "" },
    ],
    story: [
      {
        id: "s1",
        heading: "Mais que um restaurante",
        text: "O Della Pazetti virou nosso lugar. A mesa que a gente sempre pedia, o garçom que já nos conhecia, a pizza que a gente dividia mesmo sem precisar dividir.",
      },
      {
        id: "s2",
        text: "Tem conversas que não acabam. A gente ficava horas lá, até o lugar fechar, sem perceber o tempo passar. Porque quando a companhia é certa, o tempo não existe.",
      },
    ],
    messages: [
      {
        id: "m1",
        author: "Você",
        avatar: "🍕",
        text: "Sinto falta das nossas pizzas. E das nossas conversas que nunca terminavam.",
        date: "13 de junho de 2026",
      },
    ],
  },

  "cristo-cornelio": {
    id: "cristo-cornelio",
    title: "Cristo de Cornélio Procópio",
    subtitle: "Capítulo V — O Pedido",
    description:
      "Foi aqui, aos pés desta estátua, que nossa história mudou para sempre. O lugar onde o pedido aconteceu — um momento que a gente nunca vai esquecer. O Cristo nos assistiu, e o mundo parou por um segundo.",
    icon: "✝️",
    color: "#f59e0b",
    accentColor: "#fef3c7",
    photos: [
      { id: "p1", src: "/assets/fotos/cristo-cornelio/foto1.jpg", caption: "O dia do pedido ❤️" },
      { id: "p2", src: "/assets/fotos/cristo-cornelio/foto2.jpg", caption: "Cornélio Procópio" },
      { id: "p3", src: "/assets/fotos/cristo-cornelio/foto3.jpg", caption: "O momento mais especial" },
    ],
    videos: [
      { id: "v1", title: "O dia que mudou tudo", src: "", thumbnail: "" },
    ],
    story: [
      {
        id: "s1",
        heading: "O momento mais especial",
        text: "Tem momentos que a gente ensaia na cabeça mil vezes. E quando chegam, são completamente diferentes do que imaginou — e ainda mais perfeitos.",
      },
      {
        id: "s2",
        text: "Embaixo do Cristo de Cornélio, com a cidade ao fundo e o coração acelerado, o que parecia difícil de dizer saiu naturalmente. E a sua resposta foi a melhor coisa que já ouvi.",
      },
    ],
    messages: [
      {
        id: "m1",
        author: "Você",
        avatar: "✝️",
        text: "Aquele sim mudou tudo. Obrigado por ele. Para sempre.",
        date: "13 de junho de 2026",
      },
    ],
  },

  "utfpr-guarapuava": {
    id: "utfpr-guarapuava",
    title: "UTFPR Guarapuava",
    subtitle: "Capítulo VI — Uma Jornada Além",
    description:
      "A UTFPR Guarapuava representa novos horizontes. Uma jornada além do campus principal — novos desafios, novas histórias, mas a mesma parceria de sempre.",
    icon: "🏔️",
    color: "#10b981",
    accentColor: "#d1fae5",
    photos: [
      { id: "p1", src: "/assets/fotos/utfpr-guarapuava/foto1.jpg", caption: "Campus Guarapuava" },
      { id: "p2", src: "/assets/fotos/utfpr-guarapuava/foto2.jpg", caption: "A cidade entre montanhas" },
    ],
    videos: [
      { id: "v1", title: "A jornada a Guarapuava", src: "", thumbnail: "" },
    ],
    story: [
      {
        id: "s1",
        heading: "Novos horizontes",
        text: "Guarapuava fica mais longe. Mas distância é só física. A gente aprendeu cedo que o que importa não pode ser medido em quilômetros.",
      },
      {
        id: "s2",
        text: "Cada visita era uma aventura própria. Uma nova cidade, uma nova sensação, mas sempre o mesmo sentimento de estar no lugar certo quando a gente estava junto.",
      },
    ],
    messages: [
      {
        id: "m1",
        author: "Você",
        avatar: "🏔️",
        text: "Guarapuava nunca foi longe. Você estava lá.",
        date: "13 de junho de 2026",
      },
    ],
  },

  "o-futuro": {
    id: "o-futuro",
    title: "O Futuro",
    subtitle: "Capítulo ∞ — O que Ainda Está por Vir",
    description:
      "Área ainda não explorada. Os próximos capítulos estão sendo escritos agora — em tempo real, um dia de cada vez, por dois aventureiros que decidiram continuar essa jornada juntos.",
    icon: "✨",
    color: "#f59e0b",
    accentColor: "#fef9c3",
    photos: [],
    videos: [],
    story: [
      {
        id: "s1",
        heading: "A aventura continua",
        text: "Toda grande história tem páginas em branco. As nossas são as mais empolgantes — porque ainda vamos preenchê-las.",
      },
      {
        id: "s2",
        text: "Não sabemos o que vem por aí. Mas sabemos que vem junto. E isso é suficiente para transformar qualquer caminho desconhecido em aventura.",
      },
    ],
    messages: [
      {
        id: "m1",
        author: "Os Dois",
        avatar: "✨",
        text: "Nossa próxima grande aventura ainda está sendo escrita. E mal podemos esperar.",
        date: "13 de junho de 2026",
      },
    ],
  },
};
