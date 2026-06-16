import { useEffect, useState, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { useProgress } from "@/hooks/useProgress";
import { CHAPTER_ORDER } from "@/data/progression";

const SHOWN_KEY = "nossa-historia-album-celebration-shown";

interface Particle {
  id: number;
  x: number;
  size: number;
  color: string;
  rotation: number;
  duration: number;
  delay: number;
  shape: "rect" | "circle" | "star";
  drift: number;
}

const COLORS = [
  "#f0d060", "#e8a820", "#c49a3c",
  "#e84040", "#ff8080",
  "#60c0f0", "#a080ff",
  "#80e890", "#f0a060",
  "#ffffff",
];

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    size: 6 + Math.random() * 10,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    rotation: Math.random() * 360,
    duration: 2.5 + Math.random() * 2.5,
    delay: Math.random() * 1.5,
    shape: (["rect", "circle", "star"] as const)[Math.floor(Math.random() * 3)],
    drift: (Math.random() - 0.5) * 120,
  }));
}

function Particle({ p }: { p: Particle }) {
  const style: React.CSSProperties = {
    position: "absolute",
    top: "-20px",
    left: `${p.x}%`,
    width: p.shape === "circle" ? p.size : p.size * 0.8,
    height: p.shape === "circle" ? p.size : p.size * 1.2,
    background: p.shape === "star" ? "none" : p.color,
    borderRadius: p.shape === "circle" ? "50%" : "2px",
    color: p.color,
    fontSize: p.size,
    lineHeight: 1,
    opacity: 0,
    animation: `confetti-fall ${p.duration}s ease-in ${p.delay}s forwards`,
    "--drift": `${p.drift}px`,
    "--rotation-end": `${p.rotation + 360 + Math.random() * 360}deg`,
  } as React.CSSProperties;

  return (
    <div style={style}>
      {p.shape === "star" ? "✦" : null}
    </div>
  );
}

function StarBurst() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute top-1/2 left-1/2"
          style={{
            width: 2,
            height: "35vh",
            background: `linear-gradient(180deg, rgba(240,210,80,0.6) 0%, transparent 100%)`,
            transformOrigin: "top center",
            transform: `translateX(-50%) rotate(${i * 45}deg)`,
            animation: `starburst 0.8s ease-out 0.3s both`,
          }}
        />
      ))}
    </div>
  );
}

export default function AlbumCelebration() {
  const { completedChapters } = useProgress();
  const [, navigate] = useLocation();
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<"in" | "idle" | "out">("in");
  const [particles] = useState(() => generateParticles(80));
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shownRef = useRef(false);

  const isAllComplete = completedChapters.length >= CHAPTER_ORDER.length;

  useEffect(() => {
    if (!isAllComplete) return;
    if (shownRef.current) return;

    // Check localStorage
    try {
      if (localStorage.getItem(SHOWN_KEY) === "true") return;
    } catch {}

    shownRef.current = true;

    // Small delay for the chapter completion UX to settle
    timerRef.current = setTimeout(() => {
      setVisible(true);
      setPhase("in");
      // Auto-dismiss after 8 seconds
      timerRef.current = setTimeout(() => dismiss(), 8000);
    }, 800);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAllComplete]);

  const dismiss = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPhase("out");
    try { localStorage.setItem(SHOWN_KEY, "true"); } catch {}
    timerRef.current = setTimeout(() => setVisible(false), 600);
  }, []);

  const goToAlbum = useCallback(() => {
    dismiss();
    setTimeout(() => navigate("/album"), 300);
  }, [dismiss, navigate]);

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes confetti-fall {
          0%   { opacity: 1; transform: translateY(0) translateX(0) rotate(0deg); }
          100% { opacity: 0; transform: translateY(100vh) translateX(var(--drift)) rotate(var(--rotation-end)); }
        }
        @keyframes starburst {
          0%   { opacity: 0; transform: translateX(-50%) rotate(var(--r)) scaleY(0); }
          40%  { opacity: 1; transform: translateX(-50%) rotate(var(--r)) scaleY(1); }
          100% { opacity: 0; transform: translateX(-50%) rotate(var(--r)) scaleY(1.2); }
        }
        @keyframes album-icon-pop {
          0%   { transform: scale(0) rotate(-20deg); opacity: 0; }
          60%  { transform: scale(1.2) rotate(5deg); opacity: 1; }
          80%  { transform: scale(0.9) rotate(-2deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes celebration-title {
          0%   { opacity: 0; transform: translateY(24px) scale(0.85); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes celebration-glow {
          0%, 100% { box-shadow: 0 0 40px rgba(200,150,30,0.4), 0 0 80px rgba(200,150,30,0.15); }
          50%       { box-shadow: 0 0 60px rgba(200,150,30,0.7), 0 0 120px rgba(200,150,30,0.3); }
        }
        @keyframes shimmer-line {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      <div
        className="fixed inset-0 z-[200] flex items-center justify-center"
        style={{
          background: "rgba(4,2,1,0.88)",
          backdropFilter: "blur(6px)",
          opacity: phase === "out" ? 0 : 1,
          transition: "opacity 0.6s ease",
        }}
        onClick={dismiss}
      >
        {/* Confetti layer */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((p) => <Particle key={p.id} p={p} />)}
        </div>

        {/* Star burst rays */}
        <StarBurst />

        {/* Card */}
        <div
          className="relative z-10 flex flex-col items-center text-center mx-4"
          style={{
            background: "linear-gradient(160deg, rgba(18,10,3,0.98) 0%, rgba(28,16,4,0.98) 100%)",
            border: "1px solid rgba(200,150,30,0.5)",
            borderRadius: 24,
            padding: "clamp(32px, 5vw, 52px) clamp(28px, 6vw, 60px)",
            maxWidth: 420,
            width: "100%",
            animation: "celebration-glow 2.5s ease-in-out infinite",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Shimmer bar top */}
          <div
            className="absolute top-0 left-0 right-0 h-0.5 rounded-t-3xl overflow-hidden"
          >
            <div style={{
              height: "100%",
              background: "linear-gradient(90deg, transparent, rgba(240,210,80,0.9), rgba(255,255,255,0.6), rgba(240,210,80,0.9), transparent)",
              backgroundSize: "200% 100%",
              animation: "shimmer-line 2s linear infinite",
            }} />
          </div>

          {/* Icon */}
          <div
            style={{
              fontSize: "clamp(56px, 10vw, 80px)",
              lineHeight: 1,
              marginBottom: 20,
              filter: "drop-shadow(0 0 30px rgba(240,180,40,0.7))",
              animation: "album-icon-pop 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.2s both",
            }}
          >
            📸
          </div>

          {/* Title */}
          <h2
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(22px, 4vw, 30px)",
              fontWeight: "bold",
              color: "#f8e880",
              textShadow: "0 0 40px rgba(240,200,60,0.6), 0 2px 10px rgba(0,0,0,0.8)",
              marginBottom: 10,
              animation: "celebration-title 0.6s ease 0.5s both",
            }}
          >
            Álbum Desbloqueado!
          </h2>

          {/* Divider */}
          <div
            style={{
              width: 80,
              height: 1,
              background: "linear-gradient(90deg, transparent, rgba(220,170,50,0.6), transparent)",
              marginBottom: 14,
              animation: "celebration-title 0.6s ease 0.6s both",
            }}
          />

          {/* Subtitle */}
          <p
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(13px, 1.8vw, 15px)",
              color: "rgba(220,185,100,0.75)",
              lineHeight: 1.6,
              marginBottom: 28,
              maxWidth: 300,
              animation: "celebration-title 0.6s ease 0.7s both",
            }}
          >
            Todas as memórias da aventura estão agora reunidas em um único lugar.
          </p>

          {/* Buttons */}
          <div
            className="flex gap-3 w-full"
            style={{ animation: "celebration-title 0.6s ease 0.8s both" }}
          >
            <button
              onClick={goToAlbum}
              className="flex-1 py-3 rounded-full text-sm font-medium transition-all hover:scale-105 hover:brightness-110"
              style={{
                background: "linear-gradient(135deg, rgba(200,140,20,0.5), rgba(160,100,10,0.35))",
                border: "1px solid rgba(220,170,50,0.6)",
                color: "#f8e880",
                fontFamily: "Georgia, serif",
                letterSpacing: "0.06em",
                boxShadow: "0 0 20px rgba(200,150,30,0.2)",
              }}
            >
              📸 Ver Álbum
            </button>
            <button
              onClick={dismiss}
              className="py-3 px-4 rounded-full text-sm transition-all hover:scale-105"
              style={{
                background: "rgba(20,12,4,0.8)",
                border: "1px solid rgba(160,120,50,0.25)",
                color: "rgba(180,140,70,0.65)",
                fontFamily: "Georgia, serif",
              }}
            >
              ✦ Fechar
            </button>
          </div>

          {/* Shimmer bar bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-3xl overflow-hidden">
            <div style={{
              height: "100%",
              background: "linear-gradient(90deg, transparent, rgba(240,210,80,0.6), transparent)",
              backgroundSize: "200% 100%",
              animation: "shimmer-line 2s linear infinite reverse",
            }} />
          </div>
        </div>
      </div>
    </>
  );
}
