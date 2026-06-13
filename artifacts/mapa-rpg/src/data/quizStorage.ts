import type { Quiz } from "./progression";
import { QUIZZES } from "./progression";

const STORAGE_KEY = "nossa-historia-quizzes";

export function loadQuizOverrides(): Record<string, Quiz> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

export function saveQuizOverrides(data: Record<string, Quiz>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export function getQuiz(chapterId: string): Quiz {
  const overrides = loadQuizOverrides();
  return overrides[chapterId] ?? QUIZZES[chapterId];
}

export function saveQuiz(chapterId: string, quiz: Quiz) {
  const current = loadQuizOverrides();
  current[chapterId] = quiz;
  saveQuizOverrides(current);
}
