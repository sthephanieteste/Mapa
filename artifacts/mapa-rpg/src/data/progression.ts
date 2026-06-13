export const CHAPTER_ORDER: string[] = [
  "rio-de-janeiro",
  "a-viagem",
  "utfpr",
  "della-pazetti",
  "cristo-cornelio",
  "utfpr-guarapuava",
  "o-futuro",
];

export interface QuizOption {
  key: string;
  text: string;
}

export interface Quiz {
  question: string;
  options: QuizOption[];
  correctKey: string;
  successMessage: string;
  errorMessage: string;
}

export const QUIZZES: Record<string, Quiz> = {
  "rio-de-janeiro": {
    question: "Pergunta sobre o Capítulo I — edite em src/data/progression.ts",
    options: [
      { key: "A", text: "Opção A — edite aqui" },
      { key: "B", text: "Opção B — edite aqui" },
      { key: "C", text: "Opção C — edite aqui" },
    ],
    correctKey: "A",
    successMessage: "✨ Capítulo concluído! A Viagem aguarda você.",
    errorMessage: "Tente novamente. Você consegue! 💪",
  },

  "a-viagem": {
    question: "Pergunta sobre o Capítulo II — edite em src/data/progression.ts",
    options: [
      { key: "A", text: "Opção A — edite aqui" },
      { key: "B", text: "Opção B — edite aqui" },
      { key: "C", text: "Opção C — edite aqui" },
    ],
    correctKey: "A",
    successMessage: "✨ Capítulo concluído! A UTFPR Cornélio aguarda você.",
    errorMessage: "Tente novamente. Você consegue! 💪",
  },

  "utfpr": {
    question: "Pergunta sobre o Capítulo III — edite em src/data/progression.ts",
    options: [
      { key: "A", text: "Opção A — edite aqui" },
      { key: "B", text: "Opção B — edite aqui" },
      { key: "C", text: "Opção C — edite aqui" },
    ],
    correctKey: "A",
    successMessage: "✨ Capítulo concluído! A Della Pazetti aguarda você.",
    errorMessage: "Tente novamente. Você consegue! 💪",
  },

  "della-pazetti": {
    question: "Pergunta sobre o Capítulo IV — edite em src/data/progression.ts",
    options: [
      { key: "A", text: "Opção A — edite aqui" },
      { key: "B", text: "Opção B — edite aqui" },
      { key: "C", text: "Opção C — edite aqui" },
    ],
    correctKey: "A",
    successMessage: "✨ Capítulo concluído! O Cristo de Cornélio aguarda você.",
    errorMessage: "Tente novamente. Você consegue! 💪",
  },

  "cristo-cornelio": {
    question: "Pergunta sobre o Capítulo V — edite em src/data/progression.ts",
    options: [
      { key: "A", text: "Opção A — edite aqui" },
      { key: "B", text: "Opção B — edite aqui" },
      { key: "C", text: "Opção C — edite aqui" },
    ],
    correctKey: "A",
    successMessage: "✨ Capítulo concluído! UTFPR Guarapuava aguarda você.",
    errorMessage: "Tente novamente. Você consegue! 💪",
  },

  "utfpr-guarapuava": {
    question: "Pergunta sobre o Capítulo VI — edite em src/data/progression.ts",
    options: [
      { key: "A", text: "Opção A — edite aqui" },
      { key: "B", text: "Opção B — edite aqui" },
      { key: "C", text: "Opção C — edite aqui" },
    ],
    correctKey: "A",
    successMessage: "✨ Capítulo concluído! O último capítulo aguarda você.",
    errorMessage: "Tente novamente. Você consegue! 💪",
  },

  "o-futuro": {
    question: "Pergunta sobre o Capítulo VII — edite em src/data/progression.ts",
    options: [
      { key: "A", text: "Opção A — edite aqui" },
      { key: "B", text: "Opção B — edite aqui" },
      { key: "C", text: "Opção C — edite aqui" },
    ],
    correctKey: "A",
    successMessage: "✨ Aventura concluída! Nossa história está completa. ❤️",
    errorMessage: "Tente novamente. Você consegue! 💪",
  },
};
