import { useEffect, useReducer, useCallback } from "react";

export interface Track {
  src: string;
  name: string;
  artist: string;
}

const BASE = import.meta.env.BASE_URL;

export const PLAYLIST: Track[] = [
  { src: `${BASE}nossa-musica.mp3`,      name: "Aliança",             artist: "Kalvert Richard" },
  { src: `${BASE}musica-ainda-bem.mp3`,  name: "Ainda Bem",           artist: "Marisa Monte" },
  { src: `${BASE}musica-thinking.mp3`,   name: "Thinking Out Loud",   artist: "Daniel Jang" },
];

export const FUTURO_TRACK: Track = {
  src: `${BASE}chuva-de-arroz.mp3`,
  name: "Chuva de Arroz",
  artist: "Luan Santana",
};

const INITIAL_VOLUME = 0.2;
const FADE_STEPS = 40;
const FADE_MS = 25;
export const STORAGE_KEY = "nossa-historia-playlist";
export const FUTURO_UNLOCKED_KEY = "nossa-historia-futuro-music";

// ── Module-level singleton (survives SPA navigation) ──────────────────────
let _audioEl: HTMLAudioElement | null = null;
let _currentIdx = 0;
let _isPlaying = false;
let _pausedForVideo = false;
let _fadeTimer: ReturnType<typeof setInterval> | null = null;
let _futuroTimeout: ReturnType<typeof setTimeout> | null = null;
let _futuroUnlocked: boolean = (() => {
  try { return localStorage.getItem(FUTURO_UNLOCKED_KEY) === "true"; } catch { return false; }
})();
const _listeners = new Set<() => void>();

function _notify() { _listeners.forEach((l) => l()); }

/** Returns the full active playlist (includes Futuro track when unlocked). */
function _getActivePlaylist(): Track[] {
  return _futuroUnlocked ? [...PLAYLIST, FUTURO_TRACK] : PLAYLIST;
}

function _loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const s = JSON.parse(raw) as { idx: number; time: number; playing: boolean };
      _currentIdx = s.idx ?? 0;
      _isPlaying = s.playing ?? false;
      return s.time ?? 0;
    }
  } catch {}
  return 0;
}

function _saveState(time: number) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ idx: _currentIdx, time, playing: _isPlaying }));
  } catch {}
}

function _getAudio(startTime = 0): HTMLAudioElement {
  if (!_audioEl) {
    const pl = _getActivePlaylist();
    const safeIdx = _currentIdx % pl.length;
    _audioEl = new Audio(pl[safeIdx].src);
    _audioEl.volume = 0;
    _audioEl.currentTime = startTime;
  }
  return _audioEl;
}

function _clearFade() {
  if (_fadeTimer !== null) { clearInterval(_fadeTimer); _fadeTimer = null; }
  if (_futuroTimeout !== null) { clearTimeout(_futuroTimeout); _futuroTimeout = null; }
}

/** Immediately stop all playback and reset volume to zero. */
function _hardStop() {
  _clearFade();
  if (_audioEl) {
    _audioEl.pause();
    _audioEl.volume = 0;
  }
  _pausedForVideo = false;
}

function _fadeIn(audio: HTMLAudioElement, steps = FADE_STEPS, ms = FADE_MS) {
  _clearFade();
  audio.play().catch(() => {});
  const step = INITIAL_VOLUME / steps;
  _fadeTimer = setInterval(() => {
    if (audio.volume + step >= INITIAL_VOLUME) {
      audio.volume = INITIAL_VOLUME; _clearFade();
    } else { audio.volume += step; }
  }, ms);
}

function _fadeOut(
  audio: HTMLAudioElement,
  onDone: () => void,
  steps = FADE_STEPS,
  ms = FADE_MS,
) {
  _clearFade();
  const step = Math.max((audio.volume || INITIAL_VOLUME) / steps, 0.001);
  _fadeTimer = setInterval(() => {
    if (audio.volume - step <= 0) {
      audio.volume = 0; audio.pause(); _clearFade(); onDone();
    } else { audio.volume -= step; }
  }, ms);
}

function _wireEnded() {
  const audio = _getAudio();
  audio.onended = () => {
    const pl = _getActivePlaylist();
    _playTrackInternal((_currentIdx + 1) % pl.length, true);
  };
}

function _playTrackInternal(idx: number, autoplay: boolean) {
  _hardStop();
  const pl = _getActivePlaylist();
  _currentIdx = idx % pl.length;
  const audio = _getAudio();
  audio.src = pl[_currentIdx].src;
  audio.currentTime = 0;
  audio.volume = 0;
  _wireEnded();
  if (autoplay) {
    _isPlaying = true;
    _fadeIn(audio);
  }
  _saveState(0);
  _notify();
}

// ── Public API callable without a React component ─────────────────────────
export const musicControls = {
  init() {
    const savedTime = _loadState();
    const audio = _getAudio(savedTime);
    _wireEnded();
    const tryPlay = () => { _isPlaying = true; _fadeIn(audio); _notify(); };
    if (_isPlaying) {
      audio.play().then(() => { _fadeIn(audio); _notify(); }).catch(() => {
        document.addEventListener("click", tryPlay, { once: true });
      });
    } else {
      audio.play().then(tryPlay).catch(() => {
        document.addEventListener("click", tryPlay, { once: true });
      });
    }
    const saveInterval = setInterval(() => { if (_audioEl) _saveState(_audioEl.currentTime); }, 5000);
    return () => { _clearFade(); clearInterval(saveInterval); };
  },

  toggle() {
    const audio = _getAudio();
    if (_isPlaying) {
      _fadeOut(audio, () => { _isPlaying = false; _saveState(audio.currentTime); _notify(); });
      _isPlaying = false;
    } else {
      _isPlaying = true;
      _fadeIn(audio);
    }
    _notify();
  },

  next() {
    const pl = _getActivePlaylist();
    _playTrackInternal((_currentIdx + 1) % pl.length, _isPlaying);
  },

  playTrack(idx: number) {
    _playTrackInternal(idx, true);
  },

  /**
   * Enter the Futuro chapter.
   * – First time ever: cinematic fade-out (2.5 s) → pause (0.5 s) → fade-in (3 s),
   *   unlocks the track in the library.
   * – Subsequent visits: does nothing (preserves whatever music is playing).
   */
  playFuturoTrack() {
    if (_futuroUnlocked) return; // already experienced — do nothing

    // Mark as unlocked immediately so the library updates
    _futuroUnlocked = true;
    try { localStorage.setItem(FUTURO_UNLOCKED_KEY, "true"); } catch {}
    _notify(); // update library UI right away

    const audio = _getAudio();

    // Slow fade-out: ~2.5 s (40 steps × 62 ms)
    _fadeOut(audio, () => {
      // Brief cinematic pause before the new track begins
      _futuroTimeout = setTimeout(() => {
        _futuroTimeout = null;

        const pl = _getActivePlaylist();
        const futuroIdx = pl.length - 1; // FUTURO_TRACK is last
        _currentIdx = futuroIdx;
        audio.src = FUTURO_TRACK.src;
        audio.currentTime = 0;
        audio.volume = 0;
        // When Chuva de Arroz ends, return to first track
        audio.onended = () => { _playTrackInternal(0, true); };
        _isPlaying = true;

        // Slow fade-in: ~3 s (40 steps × 75 ms)
        _fadeIn(audio, 40, 75);
        _saveState(0);
        _notify();
      }, 500);
    }, 40, 62);
  },

  /** Call when a video starts playing — fades out music. */
  pauseForVideo() {
    if (_pausedForVideo) return;
    _pausedForVideo = true;
    if (_isPlaying) {
      _fadeOut(_getAudio(), () => {});
    }
  },

  /** Call when a video stops/pauses/ends — restores music. */
  resumeFromVideo() {
    if (!_pausedForVideo) return;
    _pausedForVideo = false;
    if (_isPlaying) {
      _fadeIn(_getAudio());
    }
  },

  /** Force-clear the video-pause flag (call on chapter unmount). */
  clearVideoState() {
    if (_pausedForVideo) {
      _pausedForVideo = false;
      if (_isPlaying) _fadeIn(_getAudio());
    }
  },

  /** Remove the Futuro music unlock (called on full reset). */
  resetFuturoUnlock() {
    _futuroUnlocked = false;
    try { localStorage.removeItem(FUTURO_UNLOCKED_KEY); } catch {}
    _notify();
  },

  isFuturoUnlocked(): boolean { return _futuroUnlocked; },

  getState() {
    return { playing: _isPlaying, currentIdx: _currentIdx, futuroUnlocked: _futuroUnlocked };
  },
};

// ── React hook ────────────────────────────────────────────────────────────
export function useMusicPlayer() {
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);

  useEffect(() => {
    _listeners.add(forceUpdate);
    return () => { _listeners.delete(forceUpdate); };
  }, [forceUpdate]);

  const toggle = useCallback(() => musicControls.toggle(), []);
  const next = useCallback(() => musicControls.next(), []);
  const playTrack = useCallback((idx: number) => musicControls.playTrack(idx), []);

  const playlist = _getActivePlaylist();

  return {
    playing: _isPlaying,
    currentIdx: _currentIdx,
    playlist,
    futuroUnlocked: _futuroUnlocked,
    toggle,
    next,
    playTrack,
  };
}
