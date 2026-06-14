import { useEffect, useRef, useState, useCallback } from "react";

const BASE = import.meta.env.BASE_URL;

const PLAYLIST = [
  { src: `${BASE}nossa-musica.mp3`,       name: "Aliança — Kalvert Richard" },
  { src: `${BASE}musica-ainda-bem.mp3`,   name: "Ainda Bem — Marisa Monte" },
  { src: `${BASE}musica-lisboa.mp3`,      name: "Lisboa — AnaVitória & Lenine" },
  { src: `${BASE}musica-thinking.mp3`,    name: "Thinking Out Loud — Daniel Jang" },
];

const INITIAL_VOLUME = 0.2;
const FADE_STEPS     = 40;
const FADE_MS        = 25;
const STORAGE_KEY    = "nossa-historia-playlist";

// ── Module-level singletons (survive SPA navigation) ──────────────────────
let audioEl: HTMLAudioElement | null = null;
let currentIdx = 0;
let isPlaying  = false;

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const s = JSON.parse(raw) as { idx: number; time: number; playing: boolean };
      currentIdx = s.idx ?? 0;
      isPlaying  = s.playing ?? false;
      return s.time ?? 0;
    }
  } catch {}
  return 0;
}

function saveState(time: number) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      idx:     currentIdx,
      time,
      playing: isPlaying,
    }));
  } catch {}
}

function getAudio(startTime = 0): HTMLAudioElement {
  if (!audioEl) {
    audioEl = new Audio(PLAYLIST[currentIdx].src);
    audioEl.volume = 0;
    audioEl.currentTime = startTime;
  }
  return audioEl;
}

// ── Fade helpers ──────────────────────────────────────────────────────────
let fadeTimer: ReturnType<typeof setInterval> | null = null;

function clearFade() {
  if (fadeTimer !== null) { clearInterval(fadeTimer); fadeTimer = null; }
}

function fadeIn(audio: HTMLAudioElement, onDone?: () => void) {
  clearFade();
  audio.play().catch(() => {});
  const step = INITIAL_VOLUME / FADE_STEPS;
  fadeTimer = setInterval(() => {
    if (audio.volume + step >= INITIAL_VOLUME) {
      audio.volume = INITIAL_VOLUME;
      clearFade();
      onDone?.();
    } else {
      audio.volume += step;
    }
  }, FADE_MS);
}

function fadeOut(audio: HTMLAudioElement, onDone: () => void) {
  clearFade();
  const step = Math.max(audio.volume / FADE_STEPS, 0.001);
  fadeTimer = setInterval(() => {
    if (audio.volume - step <= 0) {
      audio.volume = 0;
      audio.pause();
      clearFade();
      onDone();
    } else {
      audio.volume -= step;
    }
  }, FADE_MS);
}

// ── Component ─────────────────────────────────────────────────────────────
export default function MusicPlayer() {
  const [playing, setPlaying]     = useState(false);
  const [trackIdx, setTrackIdx]   = useState(0);
  const [toast, setToast]         = useState<string | null>(null);
  const toastTimer                = useRef<ReturnType<typeof setTimeout>>();
  const startedRef                = useRef(false);

  function showToast(name: string) {
    clearTimeout(toastTimer.current);
    setToast(name);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }

  // ── Load track n, fade in, wire ended handler ────────────────────────
  const loadTrack = useCallback((idx: number, autoplay: boolean, displayToast = true) => {
    currentIdx = idx;
    const audio = getAudio();
    clearFade();
    audio.pause();
    audio.src = PLAYLIST[idx].src;
    audio.currentTime = 0;
    audio.volume = 0;
    setTrackIdx(idx);

    // Re-attach ended handler (src changed)
    audio.onended = () => {
      const next = (currentIdx + 1) % PLAYLIST.length;
      loadTrack(next, true, true);
    };

    if (autoplay) {
      isPlaying = true;
      fadeIn(audio);
      setPlaying(true);
    }

    if (displayToast) showToast(PLAYLIST[idx].name);
    saveState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Initial mount ─────────────────────────────────────────────────────
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const savedTime = loadState();
    const audio = getAudio(savedTime);

    // Restore track index into audio src if needed
    if (audio.src !== PLAYLIST[currentIdx].src && !audio.src.endsWith(PLAYLIST[currentIdx].src.replace(BASE, ""))) {
      audio.src = PLAYLIST[currentIdx].src;
      audio.currentTime = savedTime;
    }

    setTrackIdx(currentIdx);

    // Wire ended handler
    audio.onended = () => {
      const next = (currentIdx + 1) % PLAYLIST.length;
      loadTrack(next, true, true);
    };

    // Save position periodically
    const saveInterval = setInterval(() => {
      if (audioEl) saveState(audioEl.currentTime);
    }, 5000);

    const tryAutoplay = () => {
      isPlaying = true;
      fadeIn(audio);
      setPlaying(true);
    };

    if (isPlaying) {
      // Was playing before page change — resume
      audio.play()
        .then(() => { fadeIn(audio); setPlaying(true); })
        .catch(() => {
          document.addEventListener("click", () => { tryAutoplay(); }, { once: true });
        });
    } else {
      audio.play()
        .then(() => { isPlaying = true; fadeIn(audio); setPlaying(true); })
        .catch(() => {
          document.addEventListener("click", () => { tryAutoplay(); }, { once: true });
        });
    }

    return () => {
      clearFade();
      clearInterval(saveInterval);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Toggle play/pause ─────────────────────────────────────────────────
  function toggle() {
    const audio = getAudio();
    if (playing) {
      fadeOut(audio, () => { isPlaying = false; saveState(audio.currentTime); });
      setPlaying(false);
    } else {
      isPlaying = true;
      fadeIn(audio);
      setPlaying(true);
    }
  }

  // ── Skip to next track ────────────────────────────────────────────────
  function nextTrack() {
    const next = (currentIdx + 1) % PLAYLIST.length;
    loadTrack(next, playing, true);
  }

  return (
    <>
      {/* Song name toast */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: "58px",
            right: "16px",
            zIndex: 200,
            maxWidth: "220px",
            background: "rgba(14,9,2,0.95)",
            border: "1px solid rgba(200,140,40,0.45)",
            borderRadius: "12px",
            padding: "8px 14px",
            backdropFilter: "blur(10px)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
            animation: "toastSlide 0.25s ease",
            pointerEvents: "none",
          }}
        >
          <p style={{
            fontFamily: "Georgia, serif",
            fontSize: "11px",
            color: "rgba(200,160,60,0.5)",
            letterSpacing: "0.08em",
            marginBottom: "2px",
          }}>
            ♪ Tocando agora
          </p>
          <p style={{
            fontFamily: "Georgia, serif",
            fontSize: "12px",
            color: "rgba(240,215,150,0.95)",
            lineHeight: 1.4,
          }}>
            {toast}
          </p>
        </div>
      )}

      {/* Controls — top right */}
      <div
        style={{
          position: "fixed",
          top: "14px",
          right: "16px",
          zIndex: 100,
          display: "flex",
          gap: "8px",
          alignItems: "center",
        }}
      >
        {/* Next track button */}
        <button
          onClick={nextTrack}
          title={`Próxima: ${PLAYLIST[(trackIdx + 1) % PLAYLIST.length].name}`}
          style={{
            background: "rgba(30,15,5,0.55)",
            border: "1px solid rgba(200,140,40,0.2)",
            borderRadius: "50%",
            width: "34px",
            height: "34px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: "14px",
            transition: "all 0.25s ease",
            backdropFilter: "blur(8px)",
            lineHeight: 1,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(200,140,20,0.18)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(200,140,40,0.45)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(30,15,5,0.55)";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(200,140,40,0.2)";
          }}
        >
          ⏭
        </button>

        {/* Mute / unmute button */}
        <button
          onClick={toggle}
          title={playing ? "Pausar música" : "Tocar música"}
          style={{
            background: playing ? "rgba(200,140,20,0.18)" : "rgba(30,15,5,0.55)",
            border: `1px solid ${playing ? "rgba(200,140,40,0.45)" : "rgba(200,140,40,0.2)"}`,
            borderRadius: "50%",
            width: "34px",
            height: "34px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: "15px",
            transition: "all 0.3s ease",
            boxShadow: playing ? "0 0 12px rgba(200,140,20,0.25)" : "none",
            backdropFilter: "blur(8px)",
            lineHeight: 1,
          }}
        >
          {playing ? "🔊" : "🔇"}
        </button>
      </div>

      <style>{`
        @keyframes toastSlide {
          from { opacity: 0; transform: translateX(12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
