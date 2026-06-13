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
        {/* ── Character 1 ── */}
        <CharBadge character={1} name="Você" color="#c49a3c" />

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

          {/* XP Bar + Level + Status */}
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
              <span
                className="text-xs font-bold"
                style={{ color: "#e8c060", fontFamily: "Georgia, serif" }}
              >
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
                    background:
                      "linear-gradient(90deg, #c49a3c 0%, #f0d060 50%, #c49a3c 100%)",
                    boxShadow: "0 0 8px rgba(200,160,40,0.6)",
                    transition: "width 1s ease",
                  }}
                />
                {/* Shimmer overlay */}
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
                <span
                  className="text-xs"
                  style={{ color: "rgba(200,160,80,0.5)", fontFamily: "Georgia, serif", fontSize: "9px" }}
                >
                  {XP_CURRENT.toLocaleString()} XP
                </span>
                <span
                  className="text-xs"
                  style={{ color: "rgba(200,160,80,0.35)", fontFamily: "Georgia, serif", fontSize: "9px" }}
                >
                  {XP_NEXT.toLocaleString()} XP
                </span>
              </div>
            </div>
          </div>

          {/* Status */}
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
              title="Ver Conquistas"
            >
              🏆 Conquistas
            </button>
          </div>
        </div>

        {/* ── Divider ── */}
        <div
          className="hidden sm:block w-px self-stretch"
          style={{ background: "rgba(200,140,40,0.2)", marginTop: 6, marginBottom: 6 }}
        />

        {/* ── Character 2 ── */}
        <CharBadge character={2} name="Ela" color="#e84040" flip />
      </div>

      {showAchievements && (
        <AchievementsPanel onClose={() => setShowAchievements(false)} />
      )}
    </>
  );
}

function CharBadge({
  character,
  name,
  color,
  flip = false,
}: {
  character: 1 | 2;
  name: string;
  color: string;
  flip?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 flex-shrink-0 ${flip ? "flex-row-reverse" : ""}`}
    >
      <div
        className="relative"
        style={{
          borderRadius: "50%",
          padding: "2px",
          background: `linear-gradient(135deg, ${color}80, ${color}20)`,
          boxShadow: `0 0 14px ${color}40`,
        }}
      >
        <Avatar character={character} size={44} style={{ display: "block" }} />
      </div>
      <div className={`flex flex-col ${flip ? "items-end" : "items-start"}`}>
        <span
          className="text-xs font-bold"
          style={{ color, fontFamily: "Georgia, serif", fontSize: "11px" }}
        >
          {name}
        </span>
        <span
          className="text-xs"
          style={{
            color: "rgba(200,160,80,0.5)",
            fontFamily: "Georgia, serif",
            fontSize: "9px",
          }}
        >
          Aventureira
        </span>
      </div>
    </div>
  );
}
