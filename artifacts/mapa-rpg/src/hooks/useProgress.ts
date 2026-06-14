import { useEffect, useReducer, useCallback } from "react";
import { CHAPTER_ORDER } from "@/data/progression";

export const STORAGE_KEY = "nossa-historia-progress";

interface ProgressState {
  unlockedChapters: string[];
  completedChapters: string[];
}

function loadProgress(): ProgressState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as ProgressState;
      if (
        Array.isArray(parsed.unlockedChapters) &&
        Array.isArray(parsed.completedChapters)
      ) {
        return parsed;
      }
    }
  } catch {}
  return {
    unlockedChapters: [CHAPTER_ORDER[0]],
    completedChapters: [],
  };
}

function saveProgress(state: ProgressState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

// ── Module-level singleton store ──
let _state: ProgressState = loadProgress();
const _listeners = new Set<() => void>();

function setState(next: ProgressState) {
  _state = next;
  saveProgress(next);
  _listeners.forEach((l) => l());
}

export function useProgress() {
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);

  useEffect(() => {
    _listeners.add(forceUpdate);
    return () => {
      _listeners.delete(forceUpdate);
    };
  }, [forceUpdate]);

  const completeChapter = useCallback((chapterId: string) => {
    if (_state.completedChapters.includes(chapterId)) return;

    const completedChapters = [..._state.completedChapters, chapterId];
    const currentIndex = CHAPTER_ORDER.indexOf(chapterId);
    const nextId = CHAPTER_ORDER[currentIndex + 1];

    const unlockedChapters =
      nextId && !_state.unlockedChapters.includes(nextId)
        ? [..._state.unlockedChapters, nextId]
        : [..._state.unlockedChapters];

    setState({ unlockedChapters, completedChapters });
  }, []);

  // Reset a single chapter: keep it unlocked but remove it (and all after it)
  // from completed; lock all chapters that come after it.
  const resetChapter = useCallback((chapterId: string) => {
    const idx = CHAPTER_ORDER.indexOf(chapterId);
    if (idx < 0) return;

    const completedChapters = _state.completedChapters.filter(
      (id) => CHAPTER_ORDER.indexOf(id) < idx,
    );
    // Keep chapters up to AND including chapterId unlocked; lock everything after
    const unlockedChapters = _state.unlockedChapters.filter(
      (id) => CHAPTER_ORDER.indexOf(id) <= idx,
    );

    setState({ unlockedChapters, completedChapters });
  }, []);

  // Wipe everything and reload to the initial state
  const resetAll = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem("nossa-historia-playlist");
    } catch {}
    _state = { unlockedChapters: [CHAPTER_ORDER[0]], completedChapters: [] };
    _listeners.forEach((l) => l());
    window.location.href = "/";
  }, []);

  const isUnlocked = useCallback(
    (chapterId: string) => _state.unlockedChapters.includes(chapterId),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [_state],
  );

  const isCompleted = useCallback(
    (chapterId: string) => _state.completedChapters.includes(chapterId),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [_state],
  );

  const nextChapter = useCallback((afterId: string): string | null => {
    const idx = CHAPTER_ORDER.indexOf(afterId);
    return CHAPTER_ORDER[idx + 1] ?? null;
  }, []);

  return {
    isUnlocked,
    isCompleted,
    completeChapter,
    resetChapter,
    resetAll,
    completedCount: _state.completedChapters.length,
    totalCount: CHAPTER_ORDER.length,
    nextChapter,
    unlockedChapters: _state.unlockedChapters,
    completedChapters: _state.completedChapters,
  };
}
