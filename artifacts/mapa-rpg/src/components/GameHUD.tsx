import { useState } from "react";
import Avatar from "./Avatar";
import AchievementsPanel from "./AchievementsPanel";

const XP_CURRENT = 2450;
const XP_NEXT = 3000;
const LEVEL = 7;

export default function GameHUD() {
  const [showAchievements, setShowAchievements] = useState(false);
  const xpPercent = Math.round((XP_CURRENT / XP_NEXT) * 100);

  return (
    <>
      <div
        className="absolute top-0 left-0 right-0 z-40 flex items-center gap-3 px-4 py-2"
        style={{
          background:
            "linear-gradient(180deg, rgba(6,3,1,0.97) 0%, rgba(10,6,2,0.92) 80%, transparent 100%)",
          borderBottom: "1px solid rgba(200,140,40,0.25)",
          backdropFilter: "blur(12px)",
          minHeight: "72px",
        }}
      >
        {/* ── Characters side by side — no labels ── */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Char 1 */}
          <div
            style={{
              borderRadius: "50%",
              padding: "2px",
              background: "linear-gradient(135deg, rgba(196,154,60,0.75), rgba(196,154,60,0.15))",
              boxShadow: "0 0 14px rgba(196,154,60,0.35)",
            }}
          >
            <Avatar character={1} size={44} />
          </div>

          {/* tiny heart between them */}
          <span
            style={{
              fontSize: "11px",
              filter: "drop-shadow(0 0 4px rgba(232,64,64,0.7))",
              animation: "pulse-heart 1.8s ease-in-out infinite",
              lineHeight: 1,
            }}
          >
            ❤️
          </span>

          {/* Char 2 */}
          <div
            style={{
              borderRadius: "50%",
              padding: "2px",
              background: "linear-gradient(135deg, rgba(232,64,64,0.75), rgba(232,64,64,0.15))",
              boxShadow: "0 0 14px rgba(232,64,64,0.3)",
            }}
          >
            <Avatar character={2} size={44} />
          </div>
        </div>

        {/* ── Divider ── */}
        <div
          className="hidden sm:block w-px self-stretch"
          style={{ background: "rgba(200,140,40,0.2)", marginTop: 6, marginBottom: 6 }}
        />

        {/* ── Center: title + XP ── */}
        <div className="flex-1 flex flex-col items-center gap-1 min-w-0">
          {/* Title */}
          <div className="flex items-center gap-2">
            <span style={{ color: "rgba(200,140,40,0.5)", fontSize: "10px" }}>✦</span>
            <h1
              className="text-base font-bold tracking-widest uppercase select-none"
              style={{
                color: "#f0d888",
                fontFamily: "Georgia, serif",
                textShadow: "0 0 20px rgba(200,160,40,0.4)",
                letterSpacing: "0.18em",
              }}
            >
              Nossa História
            </h1>
            <span style={{ color: "rgba(200,140,40,0.5)", fontSize: "10px" }}>✦</span>
          </div>

          {/* XP Bar + Level */}
          <div className="flex items-center gap-3 w-full max-w-sm">
            {/* Level badge */}
            <div
              className="flex-shrink-0 flex items-center justify-center rounded-lg px-2 py-0.5"
              style={{
                background: "rgba(200,140,20,0.18)",
                border: "1px solid rgba(200,140,40,0.45)",
                minWidth: 48,
              }}
            >
              <span className="text-xs font-bold" style={{ color: "#e8c060", fontFamily: "Georgia, serif" }}>
                Lv.{LEVEL}
              </span>
            </div>

            {/* XP bar */}
            <div className="flex-1 flex flex-col gap-0.5">
              <div
                className="relative rounded-full overflow-hidden"
                style={{
                  height: "8px",
                  background: "rgba(10,6,2,0.8)",
                  border: "1px solid rgba(200,140,40,0.25)",
                }}
              >
                <div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    width: `${xpPercent}%`,
                    background: "linear-gradient(90deg, #c49a3c 0%, #f0d060 50%, #c49a3c 100%)",
                    boxShadow: "0 0 8px rgba(200,160,40,0.6)",
                    transition: "width 1s ease",
                  }}
                />
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 2s infinite",
                  }}
                />
              </div>
              <div className="flex justify-between">
                <span style={{ color: "rgba(200,160,80,0.5)", fontFamily: "Georgia, serif", fontSize: "9px" }}>
                  {XP_CURRENT.toLocaleString()} XP
                </span>
                <span style={{ color: "rgba(200,160,80,0.35)", fontFamily: "Georgia, serif", fontSize: "9px" }}>
                  {XP_NEXT.toLocaleString()} XP
                </span>
              </div>
            </div>
          </div>

          {/* Status + Conquistas */}
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block rounded-full"
              style={{
                width: 6,
                height: 6,
                background: "#e84040",
                boxShadow: "0 0 6px #e84040",
                animation: "pulse-heart 1.5s ease-in-out infinite",
              }}
            />
            <span
              className="text-xs tracking-wider"
              style={{
                color: "rgba(230,180,120,0.7)",
                fontFamily: "Georgia, serif",
                fontSize: "10px",
                letterSpacing: "0.08em",
              }}
            >
              ❤️ Em Aventura
            </span>
            <button
              onClick={() => setShowAchievements(true)}
              className="ml-2 transition-all hover:scale-110"
              style={{
                background: "rgba(200,140,20,0.15)",
                border: "1px solid rgba(200,140,40,0.35)",
                borderRadius: "8px",
                padding: "2px 8px",
                color: "#e8c060",
                fontSize: "9px",
                fontFamily: "Georgia, serif",
                letterSpacing: "0.06em",
                cursor: "pointer",
              }}
            >
              🏆 Conquistas
            </button>
          </div>
        </div>
      </div>

      {showAchievements && (
        <AchievementsPanel onClose={() => setShowAchievements(false)} />
      )}
    </>
  );
}
