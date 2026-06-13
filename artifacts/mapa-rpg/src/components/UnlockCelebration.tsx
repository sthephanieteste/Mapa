import { useEffect, useRef, useState } from "react";
import { useProgress } from "@/hooks/useProgress";
import { MAP_MARKERS } from "@/data/chapters";
import { CHAPTER_ORDER } from "@/data/progression";

// ── Pre-compute particle configs (16 directions) ──────────────────────
interface Particle { dx: number; dy: number; size: number; delay: number; dur: number; color: string; }

const GOLD_COLORS = ["#ffd700", "#ffcc30", "#ffe580", "#ffb830", "#fff0a0", "#ffd966", "#ffdf40", "#ffc820"];
const PARTICLES: Particle[] = Array.from({ length: 16 }, (_, i) => {
  const angle = (i * 360) / 16;
  const rad = (angle * Math.PI) / 180;
  const dist = 80 + [40, 65, 30, 55, 45, 70, 35, 60, 42, 68, 38, 52, 48, 64, 36, 58][i];
  return {
    dx: Math.cos(rad) * dist,
    dy: Math.sin(rad) * dist,
    size: [6, 4, 8, 5, 7, 4, 6, 5, 8, 4, 7, 5, 6, 4, 9, 5][i],
    delay: [0, 0.04, 0.02, 0.06, 0.01, 0.05, 0.03, 0.07, 0, 0.04, 0.02, 0.06, 0.03, 0.05, 0.01, 0.07][i],
    dur: [0.9, 1.1, 0.85, 1.0, 0.95, 1.15, 0.88, 1.05, 0.92, 1.1, 0.85, 1.0, 0.9, 1.05, 0.88, 1.2][i],
    color: GOLD_COLORS[i % GOLD_COLORS.length],
  };
});

// Extra star sparkles at non-uniform angles
const STARS: { angle: number; dist: number; delay: number }[] = [
  { angle: 30,  dist: 55, delay: 0.1  },
  { angle: 75,  dist: 72, delay: 0.15 },
  { angle: 140, dist: 60, delay: 0.08 },
  { angle: 210, dist: 68, delay: 0.12 },
  { angle: 270, dist: 50, delay: 0.06 },
  { angle: 330, dist: 65, delay: 0.14 },
];

// ── Burst state ────────────────────────────────────────────────────────
interface Burst { id: number; top: string; left: string; }

let _burstId = 0;

export default function UnlockCelebration() {
  const { isUnlocked } = useProgress();
  const [bursts, setBursts] = useState<Burst[]>([]);
  const prevUnlocked = useRef<Record<string, boolean>>({});

  // Compute a stable key from unlock states so the effect re-runs on change
  const unlockKey = CHAPTER_ORDER.map((id) => (isUnlocked(id) ? "1" : "0")).join("");

  useEffect(() => {
    const newBursts: Burst[] = [];
    for (const chapterId of CHAPTER_ORDER) {
      const was = prevUnlocked.current[chapterId] ?? false;
      const now = isUnlocked(chapterId);
      if (now && !was) {
        const marker = MAP_MARKERS.find((m) => m.id === chapterId);
        if (marker) {
          newBursts.push({ id: ++_burstId, top: marker.top, left: marker.left });
        }
      }
      prevUnlocked.current[chapterId] = now;
    }
    if (!newBursts.length) return;

    setBursts((p) => [...p, ...newBursts]);
    const ids = newBursts.map((b) => b.id);
    const timer = setTimeout(() => setBursts((p) => p.filter((b) => !ids.includes(b.id))), 2600);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unlockKey]);

  if (!bursts.length) return null;

  return (
    <div className="absolute inset-0" style={{ pointerEvents: "none", zIndex: 40 }}>
      {bursts.map((burst) => (
        <BurstEffect key={burst.id} top={burst.top} left={burst.left} />
      ))}
    </div>
  );
}

// ── Single burst rendered at marker position ───────────────────────────
function BurstEffect({ top, left }: { top: string; left: string }) {
  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        transform: "translate(-50%, -50%)",
        width: 0,
        height: 0,
      }}
    >
      {/* ── 1. Golden ground flash ── */}
      <div
        style={{
          position: "absolute",
          top: -60, left: -60,
          width: 120, height: 120,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,220,60,0.70) 0%, rgba(255,180,20,0.40) 40%, transparent 70%)",
          animation: "celebFlash 0.55s ease-out forwards",
        }}
      />

      {/* ── 2. Expanding golden ring ── */}
      <div
        style={{
          position: "absolute",
          top: -10, left: -10,
          width: 20, height: 20,
          borderRadius: "50%",
          border: "3px solid rgba(255,215,0,0.9)",
          boxShadow: "0 0 12px rgba(255,215,0,0.6)",
          animation: "celebRing 0.9s ease-out forwards",
        }}
      />
      {/* second ring, slightly delayed */}
      <div
        style={{
          position: "absolute",
          top: -10, left: -10,
          width: 20, height: 20,
          borderRadius: "50%",
          border: "2px solid rgba(255,220,100,0.6)",
          animation: "celebRing 0.9s 0.18s ease-out forwards",
          opacity: 0,
        }}
      />

      {/* ── 3. Particles ── */}
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: -p.size / 2,
            left: -p.size / 2,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: p.color,
            boxShadow: `0 0 ${p.size + 4}px ${p.color}`,
            animationName: "celebParticle",
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
            animationTimingFunction: "cubic-bezier(0.1, 0.7, 0.3, 1)",
            animationFillMode: "forwards",
            // CSS custom properties for direction
            ["--pdx" as string]: `${p.dx}px`,
            ["--pdy" as string]: `${p.dy}px`,
          }}
        />
      ))}

      {/* ── 4. Star sparkles ── */}
      {STARS.map((s, i) => {
        const rad = (s.angle * Math.PI) / 180;
        const tx = Math.cos(rad) * s.dist;
        const ty = Math.sin(rad) * s.dist;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: -6, left: -6,
              width: 12, height: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              lineHeight: 1,
              animationName: "celebStar",
              animationDuration: `1.1s`,
              animationDelay: `${s.delay}s`,
              animationTimingFunction: "cubic-bezier(0.1, 0.7, 0.2, 1)",
              animationFillMode: "forwards",
              ["--stx" as string]: `${tx}px`,
              ["--sty" as string]: `${ty}px`,
              filter: "drop-shadow(0 0 4px #ffd700)",
            }}
          >
            ✦
          </div>
        );
      })}

      {/* ── 5. Central lingering glow ── */}
      <div
        style={{
          position: "absolute",
          top: -40, left: -40,
          width: 80, height: 80,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,215,0,0.55) 0%, rgba(255,180,0,0.20) 50%, transparent 75%)",
          animation: "celebGlow 2.0s ease-out 0.1s forwards",
        }}
      />
    </div>
  );
}
