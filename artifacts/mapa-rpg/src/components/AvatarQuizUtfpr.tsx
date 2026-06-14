import { useState, useEffect } from "react";

const BASE = import.meta.env.BASE_URL;

const QUESTION = "QUEM CURTIUUUUU A FOTO DE OUTRAAA MULHERRRR QUE SÓ APARECIA O PEITO NA TELA ???";

function Bubble({
  text,
  side = "top",
  success = false,
}: {
  text: string;
  side?: "top" | "left" | "right";
  success?: boolean;
}) {
  const borderColor = success ? "rgba(80,220,80,0.55)" : "rgba(220,100,100,0.55)";
  const bgColor = success ? "rgba(8,22,8,0.97)" : "rgba(22,8,8,0.97)";
  return (
    <div
      style={{
        position: "absolute",
        ...(side === "top"
          ? { bottom: "calc(100% + 10px)", left: "50%", transform: "translateX(-50%)" }
          : {}),
        ...(side === "left"
          ? { right: "calc(100% + 10px)", top: "50%", transform: "translateY(-50%)" }
          : {}),
        ...(side === "right"
          ? { left: "calc(100% + 10px)", top: "50%", transform: "translateY(-50%)" }
          : {}),
        background: bgColor,
        border: `1.5px solid ${borderColor}`,
        borderRadius: "14px",
        padding: "8px 14px",
        whiteSpace: "normal",
        zIndex: 60,
        boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
        animation: "fadeIn 0.2s ease",
        pointerEvents: "none",
        maxWidth: "240px",
        textAlign: "center",
      }}
    >
      <p style={{ fontFamily: "Georgia, serif", fontSize: "13px", color: "rgba(240,215,150,0.95)", lineHeight: 1.4 }}>
        {text}
      </p>
      {side === "top" && (
        <div style={{
          position: "absolute", bottom: "-8px", left: "50%", transform: "translateX(-50%)",
          width: 0, height: 0,
          borderLeft: "8px solid transparent", borderRight: "8px solid transparent",
          borderTop: `8px solid ${borderColor}`,
        }} />
      )}
    </div>
  );
}

export default function AvatarQuizUtfpr({
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
  const [solved, setSolved] = useState(isCompleted);
  const [locked, setLocked] = useState(isCompleted);
  const [char2Msg, setChar2Msg] = useState<string | null>(null);
  const [char2Success, setChar2Success] = useState(false);

  useEffect(() => {
    if (isCompleted) {
      setSolved(true);
      setLocked(true);
    }
  }, [isCompleted]);

  function handleChar1Click() {
    if (locked) return;
    setLocked(true);
    setChar2Success(true);
    setChar2Msg("eu não vou falar nada pprt 😶");
    setTimeout(() => {
      setSolved(true);
      completeChapter(chapterId);
    }, 2000);
  }

  function handleChar2Click() {
    if (locked) return;
    // Wrong answer — show message but DON'T lock so she can still click the correct avatar
    setChar2Success(false);
    setChar2Msg("Eu nao sou nem louca, estaria morta só de pensar nisso 💀");
    setTimeout(() => setChar2Msg(null), 2800);
  }

  return (
    <section style={{ position: "relative" }}>
      <div className="flex items-center gap-3 mb-6">
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: `${chapterColor}25`, border: `1.5px solid ${chapterColor}50`,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px",
        }}>
          🗺️
        </div>
        <h2 style={{
          fontFamily: "Georgia, serif", fontSize: "13px", letterSpacing: "0.14em",
          textTransform: "uppercase", color: `${chapterColor}cc`,
        }}>
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

        {solved ? (
          <div className="flex flex-col items-center gap-5 px-6 py-10 text-center">
            <div style={{
              fontSize: "42px",
              filter: "drop-shadow(0 0 16px rgba(80,220,80,0.6))",
              animation: "float 3s ease-in-out infinite",
            }}>
              ✅
            </div>
            <p style={{
              fontFamily: "Georgia, serif", fontSize: "16px", color: "#a8e6a0",
              textShadow: "0 0 20px rgba(80,220,80,0.4)", fontWeight: "bold", lineHeight: 1.5,
            }}>
              Capítulo desbloqueado! 🔓
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
          <div className="px-6 py-8 flex flex-col items-center gap-8">

            <div style={{
              background: `${chapterColor}0f`, border: `1px solid ${chapterColor}25`,
              borderRadius: "14px", padding: "18px 24px", maxWidth: "520px", textAlign: "center",
            }}>
              <p style={{
                fontFamily: "Georgia, serif", fontSize: "15px", color: "rgba(240,215,150,0.95)",
                lineHeight: 1.6, fontWeight: "bold", letterSpacing: "0.03em",
              }}>
                {QUESTION}
              </p>
            </div>

            <p style={{
              fontFamily: "Georgia, serif", fontSize: "12px",
              color: "rgba(180,140,60,0.5)", letterSpacing: "0.06em",
            }}>
              ✦ Clique no avatar da resposta correta ✦
            </p>

            <div style={{
              display: "flex", gap: "64px", alignItems: "flex-start",
              justifyContent: "center", minHeight: "160px",
            }}>

              {/* LEFT — char1 (dela) — resposta correta */}
              <div style={{ position: "relative", display: "inline-block" }}>
                <button
                  onClick={handleChar1Click}
                  disabled={locked}
                  style={{
                    background: "none", border: "none", padding: 0,
                    cursor: locked ? "default" : "pointer", display: "block",
                  }}
                >
                  <div style={{
                    width: 120, height: 120, borderRadius: "50%",
                    border: `3px solid ${chapterColor}80`,
                    boxShadow: `0 0 20px ${chapterColor}25, 0 0 40px rgba(0,0,0,0.4)`,
                    overflow: "hidden",
                    transition: "transform 0.15s, box-shadow 0.3s",
                  }}
                    className={locked ? "" : "hover:scale-105"}
                  >
                    <img
                      src={`${BASE}avatar-char1.png`}
                      alt="avatar dela"
                      style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none", userSelect: "none" }}
                      draggable={false}
                    />
                  </div>
                  <p style={{
                    fontFamily: "Georgia, serif", fontSize: "11px", textAlign: "center",
                    color: `${chapterColor}99`, marginTop: "6px", letterSpacing: "0.06em",
                  }}>
                    ???
                  </p>
                </button>
              </div>

              {/* RIGHT — char2 (meu avatar) — errado, balão sai dele */}
              <div style={{ position: "relative", display: "inline-block" }}>
                {char2Msg && <Bubble text={char2Msg} side="top" success={char2Success} />}
                <button
                  onClick={handleChar2Click}
                  disabled={locked}
                  style={{
                    background: "none", border: "none", padding: 0,
                    cursor: locked ? "default" : "pointer", display: "block",
                  }}
                >
                  <div style={{
                    width: 120, height: 120, borderRadius: "50%",
                    border: "3px solid rgba(220,100,100,0.4)",
                    boxShadow: "0 0 20px rgba(220,100,100,0.12), 0 0 40px rgba(0,0,0,0.4)",
                    overflow: "hidden",
                    transition: "transform 0.15s, box-shadow 0.15s",
                  }}
                    className={locked ? "" : "hover:scale-105"}
                  >
                    <img
                      src={`${BASE}avatar-char2.png`}
                      alt="avatar dele"
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

            </div>
          </div>
        )}
      </div>
    </section>
  );
}
