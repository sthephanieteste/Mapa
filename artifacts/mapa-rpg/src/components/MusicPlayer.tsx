import { useEffect, useRef, useState } from "react";

const MUSIC_SRC = `${import.meta.env.BASE_URL}nossa-musica.mp3`;
const INITIAL_VOLUME = 0.2;
const FADE_STEPS = 40;
const FADE_INTERVAL_MS = 30;

let audioInstance: HTMLAudioElement | null = null;

function getAudio(): HTMLAudioElement {
  if (!audioInstance) {
    audioInstance = new Audio(MUSIC_SRC);
    audioInstance.loop = true;
    audioInstance.volume = 0;
  }
  return audioInstance;
}

export default function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const [hover, setHover] = useState(false);
  const fadeRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedRef = useRef(false);

  function clearFade() {
    if (fadeRef.current !== null) {
      clearInterval(fadeRef.current);
      fadeRef.current = null;
    }
  }

  function fadeIn(audio: HTMLAudioElement) {
    clearFade();
    audio.play().catch(() => {});
    const step = INITIAL_VOLUME / FADE_STEPS;
    fadeRef.current = setInterval(() => {
      if (audio.volume + step >= INITIAL_VOLUME) {
        audio.volume = INITIAL_VOLUME;
        clearFade();
      } else {
        audio.volume = Math.min(audio.volume + step, INITIAL_VOLUME);
      }
    }, FADE_INTERVAL_MS);
  }

  function fadeOut(audio: HTMLAudioElement) {
    clearFade();
    const step = audio.volume / FADE_STEPS;
    fadeRef.current = setInterval(() => {
      if (audio.volume - step <= 0.001) {
        audio.volume = 0;
        audio.pause();
        clearFade();
      } else {
        audio.volume = Math.max(audio.volume - step, 0);
      }
    }, FADE_INTERVAL_MS);
  }

  useEffect(() => {
    if (!startedRef.current) {
      startedRef.current = true;
      const audio = getAudio();
      const tryAutoplay = () => {
        fadeIn(audio);
        setPlaying(true);
      };
      const onInteraction = () => {
        tryAutoplay();
        document.removeEventListener("click", onInteraction);
        document.removeEventListener("keydown", onInteraction);
      };
      audio.play()
        .then(() => {
          setPlaying(true);
          clearFade();
          const step = INITIAL_VOLUME / FADE_STEPS;
          fadeRef.current = setInterval(() => {
            if (audio.volume + step >= INITIAL_VOLUME) {
              audio.volume = INITIAL_VOLUME;
              clearFade();
            } else {
              audio.volume = Math.min(audio.volume + step, INITIAL_VOLUME);
            }
          }, FADE_INTERVAL_MS);
        })
        .catch(() => {
          document.addEventListener("click", onInteraction, { once: true });
          document.addEventListener("keydown", onInteraction, { once: true });
        });
    }
    return () => {
      clearFade();
    };
  }, []);

  function toggle() {
    const audio = getAudio();
    if (playing) {
      fadeOut(audio);
      setPlaying(false);
    } else {
      fadeIn(audio);
      setPlaying(true);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        top: "14px",
        right: "16px",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        gap: "6px",
      }}
    >
      {hover && (
        <span
          style={{
            color: "rgba(230,180,100,0.75)",
            fontFamily: "Georgia, serif",
            fontSize: "10px",
            letterSpacing: "0.06em",
            whiteSpace: "nowrap",
            textShadow: "0 0 8px rgba(200,140,20,0.5)",
            animation: "fadeIn 0.2s ease",
            pointerEvents: "none",
          }}
        >
          🎵 Nossa Música
        </span>
      )}

      <button
        onClick={toggle}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        title={playing ? "Pausar música" : "Tocar música"}
        style={{
          background: playing
            ? "rgba(200,140,20,0.18)"
            : "rgba(30,15,5,0.55)",
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
          boxShadow: playing
            ? "0 0 12px rgba(200,140,20,0.25)"
            : "none",
          backdropFilter: "blur(8px)",
          lineHeight: 1,
        }}
      >
        {playing ? "🔊" : "🔇"}
      </button>
    </div>
  );
}
