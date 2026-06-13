import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";

const BASE = import.meta.env.BASE_URL;

const QUESTION = "Quem é a pessoa mais estressada, mimada e debochada da relação?";

const WRONG_MESSAGES = [
  "😒 Tem certeza?",
  "🤨 Resposta suspeita...",
  "🙄 Você sabe a resposta certa.",
  "😂 Pare de insistir.",
];

const ESCAPE_POSITIONS = [
  { top: "10%",  left: "3%"  },
  { top: "6%",   left: "76%" },
  { top: "72%",  left: "3%"  },
  { top: "74%",  left: "76%" },
  { top: "42%",  left: "2%"  },
  { top: "42%",  left: "82%" },
  { top: "14%",  left: "44%" },
  { top: "78%",  left: "44%" },
];

function pickPos(exclude?: { top: string; left: string }) {
  let pos;
  do { pos = ESCAPE_POSITIONS[Math.floor(Math.random() * ESCAPE_POSITIONS.length)]; }
  while (exclude && pos.top === exclude.top && pos.left === exclude.left);
  return pos;
}

// ── Speech bubble ───────────────────────────────────────────────
function Bubble({ text, side = "top" }: { text: string; side?: "top" | "left" | "right" }) {
  return (
    <div
      style={{
        position: "absolute",
        ...(side === "top"   ? { bottom: "calc(100% + 10px)", left: "50%", transform: "translateX(-50%)" } : {}),
        ...(side === "left"  ? { right: "calc(100% + 10px)", top: "50%",   transform: "translateY(-50%)" } : {}),
        ...(side === "right" ? { left: "calc(100% + 10px)",  top: "50%",   transform: "translateY(-50%)" } : {}),
        background: "rgba(18,12,4,0.97)",
        border: "1.5px solid rgba(220,100,100,0.5)",
        borderRadius: "14px",
        padding: "8px 14px",
        whiteSpace: "nowrap",
        zIndex: 60,
        boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
        animation: "fadeIn 0.2s ease",
        pointerEvents: "none",
      }}
    >
      <p style={{ fontFamily: "Georgia, serif", fontSize: "13px", color: "rgba(240,200,140,0.95)" }}>{text}</p>
      {/* Tail */}
      {side === "top" && (
        <div style={{
          position: "absolute", bottom: "-8px", left: "50%", transform: "translateX(-50%)",
          width: 0, height: 0, borderLeft: "8px solid transparent", borderRight: "8px solid transparent",
          borderTop: "8px solid rgba(220,100,100,0.5)",
        }} />
      )}
      {side === "right" && (
        <div style={{
          position: "absolute", left: "-8px", top: "50%", transform: "translateY(-50%)",
          width: 0, height: 0, borderTop: "8px solid transparent", borderBottom: "8px solid transparent",
          borderRight: "8px solid rgba(220,100,100,0.5)",
        }} />
      )}
      {side === "left" && (
        <div style={{
          position: "absolute", right: "-8px", top: "50%", transform: "translateY(-50%)",
          width: 0, height: 0, borderTop: "8px solid transparent", borderBottom: "8px solid transparent",
          borderLeft: "8px solid rgba(220,100,100,0.5)",
        }} />
      )}
    </div>
  );
}

// ── Wrong avatar portrait ───────────────────────────────────────
function WrongAvatar({
  onClick,
  message,
  animation,
  bubbleSide = "top",
}: {
  onClick: () => void;
  message: string | null;
  animation?: string;
  bubbleSide?: "top" | "left" | "right";
}) {
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {message && <Bubble text={message} side={bubbleSide} />}
      <button
        onClick={onClick}
        style={{
          background: "none", border: "none", padding: 0, cursor: "pointer",
          display: "block", animation: animation || undefined,
        }}
      >
        <div
          style={{
            width: 120, height: 120,
            borderRadius: "50%",
            border: "3px solid rgba(220,100,100,0.5)",
            boxShadow: "0 0 20px rgba(220,100,100,0.15), 0 0 40px rgba(0,0,0,0.4)",
            overflow: "hidden",
            transition: "transform 0.15s, box-shadow 0.15s",
          }}
          className="hover:scale-105 hover:shadow-red-glow"
        >
          <img
            src={`${BASE}avatar-char2.png`}
            alt="avatar"
            style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none", userSelect: "none" }}
            draggable={false}
          />
        </div>
        <p style={{
          fontFamily: "Georgia, serif", fontSize: "11px", textAlign: "center",
          color: "rgba(220,120,120,0.6)", marginTop: "6px", letterSpacing: "0.06em",
        }}>
          ???
        </p>
      </button>
    </div>
  );
}

// ── Correct avatar portrait ─────────────────────────────────────
function CorrectAvatar({
  onClick,
  color,
  victory,
}: {
  onClick: () => void;
  color: string;
  victory: boolean;
}) {
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={onClick}
        style={{
          background: "none", border: "none", padding: 0, cursor: "pointer", display: "block",
          animation: victory ? "avatarVictory 0.7s ease" : undefined,
        }}
      >
        {/* Glow ring on victory */}
        {victory && (
          <div style={{
            position: "absolute", inset: -8, borderRadius: "50%",
            border: `3px solid ${color}`,
            animation: "celebRing 1.2s ease-out forwards",
            pointerEvents: "none",
          }} />
        )}
        <div
          style={{
            width: 120, height: 120,
            borderRadius: "50%",
            border: `3px solid ${victory ? color : color + "80"}`,
            boxShadow: victory
              ? `0 0 30px ${color}70, 0 0 60px ${color}30`
              : `0 0 20px ${color}25, 0 0 40px rgba(0,0,0,0.4)`,
            overflow: "hidden",
            transition: "transform 0.15s, box-shadow 0.3s",
          }}
          className="hover:scale-105"
        >
          <img
            src={`${BASE}avatar-char1.png`}
            alt="avatar"
            style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none", userSelect: "none" }}
            draggable={false}
          />
        </div>
        <p style={{
          fontFamily: "Georgia, serif", fontSize: "11px", textAlign: "center",
          color: victory ? color : color + "99", marginTop: "6px", letterSpacing: "0.06em",
          animation: victory ? "fadeIn 0.4s ease" : undefined,
        }}>
          {victory ? "✓ Correto!" : "???"}
        </p>
      </button>
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────
export default function AvatarQuiz({
  chapterId,
  chapterColor,
  isCompleted,
  completeChapter,
  nextChapterId,
  onNavigateNext,
  onNavigateMap,
}: {
  chapterId: string;
  chapterColor: string;
  isCompleted: boolean;
  completeChapter: (id: string) => void;
  nextChapterId: string | null;
  onNavigateNext: (id: string) => void;
  onNavigateMap: () => void;
}) {
  const [wrongClicks, setWrongClicks] = useState(0);
  const [msgText, setMsgText] = useState<string | null>(null);
  const [escaped, setEscaped] = useState(false);
  const [isEscaping, setIsEscaping] = useState(false);
  const [escapedPos, setEscapedPos] = useState<{ top: string; left: string }>(ESCAPE_POSITIONS[1]);
  const [solved, setSolved] = useState(isCompleted);
  const [victory, setVictory] = useState(false);
  const msgTimer = useRef<ReturnType<typeof setTimeout>>();
  const escapeTimer = useRef<ReturnType<typeof setTimeout>>();

  // sync from parent if already completed
  useEffect(() => { if (isCompleted) setSolved(true); }, [isCompleted]);

  function showMsg(text: string) {
    clearTimeout(msgTimer.current);
    setMsgText(text);
    msgTimer.current = setTimeout(() => setMsgText(null), 2400);
  }

  function handleWrongClick() {
    if (solved) return;
    const clicks = wrongClicks + 1;
    setWrongClicks(clicks);
    showMsg(WRONG_MESSAGES[(clicks - 1) % WRONG_MESSAGES.length]);

    if (!escaped && clicks >= 2) {
      // First escape
      clearTimeout(escapeTimer.current);
      setIsEscaping(true);
      escapeTimer.current = setTimeout(() => {
        setIsEscaping(false);
        setEscaped(true);
        setEscapedPos(pickPos());
      }, 700);
    } else if (escaped) {
      // Re-escape to new position
      clearTimeout(escapeTimer.current);
      setIsEscaping(true);
      escapeTimer.current = setTimeout(() => {
        setIsEscaping(false);
        setEscapedPos(pickPos(escapedPos));
      }, 450);
    }
  }

  function handleCorrectClick() {
    if (solved) return;
    setSolved(true);
    setVictory(true);
    completeChapter(chapterId);
  }

  // Determine bubble side for escaped avatar based on horizontal position
  function escapedBubbleSide(): "left" | "right" {
    const leftPct = parseFloat(escapedPos.left);
    return leftPct > 50 ? "left" : "right";
  }

  return (
    <section style={{ position: "relative" }}>
      {/* Section header */}
      <div className="flex items-center gap-3 mb-6">
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: `${chapterColor}25`, border: `1.5px solid ${chapterColor}50`,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px",
        }}>
          🗺️
        </div>
        <h2 style={{ fontFamily: "Georgia, serif", fontSize: "13px", letterSpacing: "0.14em",
          textTransform: "uppercase", color: `${chapterColor}cc` }}>
          Desafio do Capítulo
        </h2>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${chapterColor}40, transparent)` }} />
      </div>

      <div style={{
        borderRadius: "20px", overflow: "hidden",
        background: "linear-gradient(135deg, rgba(14,9,2,0.97) 0%, rgba(22,14,4,0.97) 100%)",
        border: `1px solid ${chapterColor}35`,
        boxShadow: `0 0 40px ${chapterColor}0a`,
      }}>

        {/* ── SOLVED STATE ── */}
        {solved ? (
          <div className="flex flex-col items-center gap-5 px-6 py-10 text-center">
            <div style={{ fontSize: "42px", filter: "drop-shadow(0 0 16px rgba(80,220,80,0.6))", animation: "float 3s ease-in-out infinite" }}>
              ✅
            </div>
            <p style={{ fontFamily: "Georgia, serif", fontSize: "16px", color: "#a8e6a0",
              textShadow: "0 0 20px rgba(80,220,80,0.4)", fontWeight: "bold", lineHeight: 1.5 }}>
              ✅ Correto! Você claramente conhece esta aventura.
            </p>
            <div className="flex gap-3 mt-2 flex-wrap justify-center">
              {nextChapterId && (
                <button
                  onClick={() => onNavigateNext(nextChapterId)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm transition-all hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${chapterColor}35, ${chapterColor}18)`,
                    border: `1px solid ${chapterColor}60`, color: "#f0d888",
                    fontFamily: "Georgia, serif", cursor: "pointer", letterSpacing: "0.05em",
                  }}
                >
                  Próximo Capítulo →
                </button>
              )}
              <button
                onClick={onNavigateMap}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm transition-all hover:scale-105"
                style={{
                  background: "rgba(40,25,8,0.7)", border: "1px solid rgba(200,140,40,0.3)",
                  color: "rgba(220,180,80,0.8)", fontFamily: "Georgia, serif", cursor: "pointer",
                }}
              >
                ← Ver Mapa
              </button>
            </div>
          </div>
        ) : (
          /* ── QUIZ STATE ── */
          <div className="px-6 py-8 flex flex-col items-center gap-8">

            {/* Question */}
            <div style={{
              background: `${chapterColor}0f`, border: `1px solid ${chapterColor}25`,
              borderRadius: "14px", padding: "18px 24px", maxWidth: "480px", textAlign: "center",
            }}>
              <p style={{
                fontFamily: "Georgia, serif", fontSize: "16px", color: "rgba(240,215,150,0.95)",
                lineHeight: 1.6, fontStyle: "italic",
              }}>
                "{QUESTION}"
              </p>
            </div>

            {/* Instruction */}
            <p style={{ fontFamily: "Georgia, serif", fontSize: "12px",
              color: "rgba(180,140,60,0.5)", letterSpacing: "0.06em" }}>
              ✦ Clique no avatar da resposta correta ✦
            </p>

            {/* Avatars row */}
            <div style={{ display: "flex", gap: "64px", alignItems: "flex-start", justifyContent: "center", minHeight: "160px" }}>

              {/* LEFT — wrong avatar (in normal flow when not escaped) */}
              {!escaped && (
                <div style={{ opacity: isEscaping ? 0 : 1, transition: "opacity 0.1s" }}>
                  <WrongAvatar
                    onClick={handleWrongClick}
                    message={msgText}
                    animation={isEscaping ? "avatarEscape 0.7s ease forwards" : undefined}
                    bubbleSide="top"
                  />
                </div>
              )}

              {/* RIGHT — correct avatar */}
              <CorrectAvatar
                onClick={handleCorrectClick}
                color={chapterColor}
                victory={victory}
              />
            </div>

            {/* Hint after escape */}
            {escaped && (
              <p style={{ fontFamily: "Georgia, serif", fontSize: "12px",
                color: "rgba(220,100,100,0.5)", animation: "fadeIn 0.4s ease" }}>
                👀 Ela fugiu... mas a resposta certa ainda está aqui!
              </p>
            )}
          </div>
        )}
      </div>

      {/* ── ESCAPED AVATAR (fixed position anywhere on screen) ── */}
      {escaped && !solved && (
        <div
          style={{
            position: "fixed",
            top: escapedPos.top,
            left: escapedPos.left,
            zIndex: 55,
            animation: isEscaping ? "avatarLand 0.45s ease" : "avatarFloat 4s ease-in-out infinite",
            pointerEvents: "auto",
          }}
        >
          <WrongAvatar
            onClick={handleWrongClick}
            message={msgText}
            animation={isEscaping ? "avatarEscape 0.45s ease forwards" : undefined}
            bubbleSide={escapedBubbleSide()}
          />
        </div>
      )}
    </section>
  );
}
