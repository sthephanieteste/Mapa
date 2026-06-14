import { useState, useEffect } from "react";

const INITIAL_HEAT = 40;
const MAX_HEAT = 100;

const ITEMS = [
  {
    key: "cobertor",
    icon: "🧣",
    name: "Cobertor",
    delta: +20,
    text: `Naquele momento qualquer fonte de calor era bem-vinda.

Talvez não resolvesse tudo.

Mas definitivamente ajudou a diminuir minhas chances de virar uma atração turística congelada de Guarapuava.`,
  },
  {
    key: "dormir",
    icon: "😴",
    name: "Dormir",
    delta: -20,
    text: `Em determinado momento você resolveu dormir.

Os registros históricos indicam que eu fui deixada praticamente ao relento da madrugada.

A acusada nega todas as acusações.`,
    isTrap: true,
  },
  {
    key: "carinho",
    icon: "💆",
    name: "Carinho",
    delta: +25,
    text: `Eu estava cansada.

Mal conseguia descansar direito.

E você ficou fazendo carinho até eu conseguir dormir.

Talvez para você tenha sido apenas um gesto simples.

Mas eu nunca esqueci.`,
  },
  {
    key: "abraco",
    icon: "🤗",
    name: "Abraço",
    delta: +35,
    text: `Entre todas as soluções daquela noite, essa foi a mais eficiente.

Não sei se existe alguma explicação científica.

Mas eu lembro que toda vez que você me abraçava eu me sentia um pouco melhor.`,
  },
];

export default function MissionGuarapuava({
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
  const [started, setStarted] = useState(isCompleted);
  const [heat, setHeat] = useState(isCompleted ? MAX_HEAT : INITIAL_HEAT);
  const [used, setUsed] = useState<Set<string>>(isCompleted ? new Set(ITEMS.map(i => i.key)) : new Set());
  const [activeMsg, setActiveMsg] = useState<{ key: string; delta: number; text: string; isTrap?: boolean } | null>(null);
  const [showDefesa, setShowDefesa] = useState(false);
  const [heatAnim, setHeatAnim] = useState<"gain" | "loss" | null>(null);
  const [showMemoria, setShowMemoria] = useState(false);

  useEffect(() => {
    if (isCompleted) {
      setStarted(true);
      setHeat(MAX_HEAT);
    }
  }, [isCompleted]);

  const won = heat >= MAX_HEAT;

  function handleItem(item: typeof ITEMS[0]) {
    if (used.has(item.key)) return;
    const newHeat = Math.max(0, Math.min(MAX_HEAT, heat + item.delta));
    setHeat(newHeat);
    setUsed(prev => new Set([...prev, item.key]));
    setActiveMsg({ key: item.key, delta: item.delta, text: item.text, isTrap: item.isTrap });
    setShowDefesa(false);
    setHeatAnim(item.delta > 0 ? "gain" : "loss");
    setTimeout(() => setHeatAnim(null), 900);
  }

  function handleComplete() {
    if (!isCompleted) completeChapter(chapterId);
    setShowMemoria(true);
    setTimeout(() => {
      setShowMemoria(false);
      if (nextChapterId) onNavigateNext(nextChapterId);
    }, 2200);
  }

  const heatColor =
    heat >= 80 ? "#f59e0b" :
    heat >= 50 ? "#e97c30" :
    heat >= 30 ? "#e05050" :
    "#8090c0";

  const heatBg =
    heat >= 80 ? "linear-gradient(90deg, #c47000, #f59e0b, #ffe080)" :
    heat >= 50 ? "linear-gradient(90deg, #c05010, #e97c30, #ffb060)" :
    heat >= 30 ? "linear-gradient(90deg, #801818, #e05050, #ff8080)" :
    "linear-gradient(90deg, #304080, #4060b0, #80a0e0)";

  return (
    <section style={{ position: "relative" }}>
      {/* Section header */}
      <div className="flex items-center gap-3 mb-6">
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: `${chapterColor}25`, border: `1.5px solid ${chapterColor}50`,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px",
        }}>
          🌨️
        </div>
        <h2 style={{
          fontFamily: "Georgia, serif", fontSize: "13px", letterSpacing: "0.14em",
          textTransform: "uppercase", color: `${chapterColor}cc`,
        }}>
          Missão Especial
        </h2>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${chapterColor}40, transparent)` }} />
      </div>

      {/* ── INTRO ── */}
      {!started && (
        <div style={{ animation: "fadeIn 0.4s ease" }}>
          <div style={{
            borderRadius: "20px", overflow: "hidden",
            background: "linear-gradient(135deg, rgba(8,12,20,0.99) 0%, rgba(14,18,28,0.99) 100%)",
            border: `1px solid ${chapterColor}35`,
            boxShadow: `0 0 60px rgba(80,130,220,0.08)`,
          }}>
            <div style={{
              background: "linear-gradient(135deg, rgba(80,130,220,0.12), transparent)",
              borderBottom: `1px solid rgba(80,130,220,0.18)`,
              padding: "28px 28px 20px", textAlign: "center",
            }}>
              <p style={{ fontFamily: "Georgia, serif", fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: `${chapterColor}80`, marginBottom: "8px" }}>
                📍 UTFPR Guarapuava
              </p>
              <p style={{ fontFamily: "Georgia, serif", fontSize: "14px", color: "rgba(160,200,255,0.7)", marginBottom: "6px" }}>
                🌨️ Uma das noites mais frias da nossa aventura.
              </p>
              <h3 style={{ fontFamily: "Georgia, serif", fontSize: "21px", color: "#f0d888", fontWeight: "bold", textShadow: `0 0 24px ${chapterColor}40` }}>
                ❤️ Missão: Sobreviver ao Frio de Guarapuava
              </h3>
            </div>

            <div style={{ padding: "24px 28px 28px" }}>
              <div style={{
                borderRadius: "12px", background: `${chapterColor}10`,
                border: `1px solid ${chapterColor}25`, padding: "14px 20px",
                marginBottom: "20px",
              }}>
                <p style={{ fontFamily: "Georgia, serif", fontSize: "12px", color: "rgba(220,190,130,0.8)", lineHeight: 1.7 }}>
                  <span style={{ color: `${chapterColor}cc`, fontWeight: "bold" }}>Objetivo: </span>Sobreviver ao frio.
                  <br />
                  <span style={{ color: "rgba(180,140,60,0.5)", fontWeight: "bold" }}>Objetivo secundário: </span>
                  <span style={{ color: "rgba(200,170,100,0.6)" }}>Tentar não morrer congelada.</span>
                </p>
              </div>

              {/* Preview bar */}
              <div style={{ marginBottom: "28px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontFamily: "Georgia, serif", fontSize: "11px", color: "rgba(160,200,255,0.7)", letterSpacing: "0.08em" }}>
                    🌡️ Calor
                  </span>
                  <span style={{ fontFamily: "Georgia, serif", fontSize: "11px", color: "rgba(160,200,255,0.7)" }}>
                    {INITIAL_HEAT}%
                  </span>
                </div>
                <div style={{
                  height: "12px", borderRadius: "6px",
                  background: "rgba(20,30,50,0.8)", border: "1px solid rgba(80,130,220,0.2)", overflow: "hidden",
                }}>
                  <div style={{
                    height: "100%", borderRadius: "6px",
                    background: "linear-gradient(90deg, #304080, #4060b0, #80a0e0)",
                    width: `${INITIAL_HEAT}%`,
                    boxShadow: "0 0 10px rgba(80,130,220,0.4)",
                    transition: "width 0.8s ease",
                  }} />
                </div>
              </div>

              <div style={{ textAlign: "center" }}>
                <button
                  onClick={() => setStarted(true)}
                  className="hover:scale-105 transition-all"
                  style={{
                    background: `linear-gradient(135deg, ${chapterColor}30, ${chapterColor}15)`,
                    border: `1px solid ${chapterColor}60`, borderRadius: "50px",
                    padding: "14px 40px", color: "#f0d888",
                    fontFamily: "Georgia, serif", fontSize: "15px",
                    cursor: "pointer", letterSpacing: "0.08em",
                    boxShadow: `0 0 30px ${chapterColor}20`,
                  }}
                >
                  ✨ Iniciar Missão
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── GAME ── */}
      {started && !won && (
        <div style={{ animation: "fadeIn 0.35s ease" }}>
          <div style={{
            borderRadius: "20px", overflow: "hidden",
            background: "linear-gradient(135deg, rgba(8,12,20,0.99) 0%, rgba(14,18,28,0.99) 100%)",
            border: `1px solid ${chapterColor}30`,
            boxShadow: `0 0 60px ${chapterColor}08`,
          }}>
            {/* Heat bar */}
            <div style={{
              background: "linear-gradient(135deg, rgba(80,130,220,0.10), transparent)",
              borderBottom: `1px solid rgba(80,130,220,0.15)`,
              padding: "20px 28px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", alignItems: "center" }}>
                <span style={{ fontFamily: "Georgia, serif", fontSize: "12px", color: "rgba(160,200,255,0.8)", letterSpacing: "0.08em" }}>
                  🌡️ Calor
                </span>
                <span style={{
                  fontFamily: "Georgia, serif", fontSize: "14px", fontWeight: "bold",
                  color: heatColor,
                  transition: "color 0.4s",
                  animation: heatAnim === "gain" ? "gainPop 0.6s ease" : heatAnim === "loss" ? "lossPop 0.6s ease" : "none",
                }}>
                  {heatAnim === "gain" && <span style={{ color: "#80e080", marginRight: "6px" }}>▲</span>}
                  {heatAnim === "loss" && <span style={{ color: "#e06060", marginRight: "6px" }}>▼</span>}
                  {heat}%
                </span>
              </div>
              <div style={{
                height: "14px", borderRadius: "7px",
                background: "rgba(20,30,50,0.8)", border: "1px solid rgba(80,130,220,0.2)", overflow: "hidden",
              }}>
                <div style={{
                  height: "100%", borderRadius: "7px",
                  background: heatBg,
                  width: `${heat}%`,
                  boxShadow: `0 0 12px ${heatColor}60`,
                  transition: "width 0.6s ease, background 0.4s ease",
                }} />
              </div>
              <p style={{
                fontFamily: "Georgia, serif", fontSize: "10px", letterSpacing: "0.06em",
                color: "rgba(160,180,220,0.4)", textAlign: "right", marginTop: "6px",
              }}>
                Objetivo: 100%
              </p>
            </div>

            {/* Items grid */}
            <div style={{ padding: "24px 28px 8px" }}>
              <p style={{
                fontFamily: "Georgia, serif", fontSize: "11px", letterSpacing: "0.1em",
                color: "rgba(160,200,255,0.4)", textAlign: "center", marginBottom: "16px",
              }}>
                ✦ Itens disponíveis — clique para usar ✦
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
                {ITEMS.map((item) => {
                  const isUsed = used.has(item.key);
                  const isActive = activeMsg?.key === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => handleItem(item)}
                      disabled={isUsed}
                      style={{
                        background: isActive
                          ? item.isTrap
                            ? "rgba(200,50,50,0.18)"
                            : `${chapterColor}20`
                          : isUsed
                          ? "rgba(14,10,3,0.5)"
                          : "rgba(20,28,44,0.8)",
                        border: isActive
                          ? item.isTrap ? "1.5px solid rgba(200,80,80,0.5)" : `1.5px solid ${chapterColor}60`
                          : isUsed
                          ? "1px solid rgba(80,80,80,0.2)"
                          : "1px solid rgba(80,130,220,0.25)",
                        borderRadius: "14px", padding: "16px 10px",
                        cursor: isUsed ? "default" : "pointer", textAlign: "center",
                        opacity: isUsed ? 0.45 : 1,
                        transition: "all 0.2s",
                      }}
                      className={isUsed ? "" : "hover:scale-105"}
                    >
                      <div style={{ fontSize: "26px", marginBottom: "6px" }}>{item.icon}</div>
                      <p style={{
                        fontFamily: "Georgia, serif", fontSize: "12px", fontWeight: "bold",
                        color: isUsed ? "rgba(140,120,80,0.5)"
                          : item.isTrap ? "rgba(220,120,120,0.8)"
                          : "rgba(220,190,130,0.85)",
                        marginBottom: "4px",
                      }}>
                        {item.name}
                      </p>
                      {isUsed && (
                        <p style={{ fontFamily: "Georgia, serif", fontSize: "10px", color: "rgba(120,100,60,0.4)" }}>
                          Usado
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Active message */}
              {activeMsg && (
                <div
                  key={activeMsg.key}
                  style={{
                    borderRadius: "14px", padding: "18px 20px",
                    background: activeMsg.isTrap
                      ? "linear-gradient(135deg, rgba(30,8,8,0.98), rgba(48,12,12,0.98))"
                      : "linear-gradient(135deg, rgba(10,14,24,0.98), rgba(16,22,36,0.98))",
                    border: activeMsg.isTrap
                      ? "1px solid rgba(200,60,60,0.35)"
                      : `1px solid ${chapterColor}25`,
                    marginBottom: "20px",
                    animation: "fadeIn 0.3s ease",
                  }}
                >
                  {activeMsg.isTrap && (
                    <p style={{
                      fontFamily: "Georgia, serif", fontSize: "11px", fontWeight: "bold",
                      color: "rgba(220,80,80,0.9)", letterSpacing: "0.1em",
                      marginBottom: "10px",
                    }}>
                      ⚠️ Evento inesperado
                    </p>
                  )}
                  {activeMsg.text.split("\n\n").map((p, i) => (
                    <p key={i} style={{
                      fontFamily: "Georgia, serif", fontSize: "13px", lineHeight: 1.8,
                      color: "rgba(220,195,140,0.9)", fontStyle: "italic", marginBottom: "8px",
                    }}>
                      {p}
                    </p>
                  ))}
                  {activeMsg.isTrap && !showDefesa && (
                    <button
                      onClick={() => setShowDefesa(true)}
                      className="hover:scale-105 transition-all"
                      style={{
                        background: "rgba(200,60,60,0.15)", border: "1px solid rgba(200,60,60,0.4)",
                        borderRadius: "50px", padding: "8px 20px", marginTop: "8px",
                        color: "rgba(220,140,140,0.9)", fontFamily: "Georgia, serif", fontSize: "12px",
                        cursor: "pointer",
                      }}
                    >
                      📢 Ouvir Defesa
                    </button>
                  )}
                  {activeMsg.isTrap && showDefesa && (
                    <div style={{
                      marginTop: "12px", borderRadius: "10px", padding: "12px 16px",
                      background: "rgba(200,60,60,0.10)", border: "1px solid rgba(200,60,60,0.2)",
                      animation: "fadeIn 0.3s ease",
                    }}>
                      <p style={{ fontFamily: "Georgia, serif", fontSize: "13px", color: "rgba(220,160,160,0.9)", fontStyle: "italic" }}>
                        "Eu estava cansadinha."
                      </p>
                    </div>
                  )}
                </div>
              )}

              {heat <= 0 && (
                <p style={{
                  textAlign: "center", fontFamily: "Georgia, serif", fontSize: "12px",
                  color: "rgba(200,80,80,0.6)", marginBottom: "16px",
                }}>
                  ❄️ Situação crítica! Use os itens restantes para aquecer.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── FINAL / WON ── */}
      {won && (
        <div style={{ animation: "fadeIn 0.5s ease" }}>
          <div style={{
            borderRadius: "20px", overflow: "hidden",
            background: "linear-gradient(135deg, rgba(14,9,2,0.98) 0%, rgba(22,14,4,0.98) 100%)",
            border: `1px solid ${chapterColor}40`,
            boxShadow: `0 0 60px ${chapterColor}15`,
          }}>
            <div style={{
              background: `linear-gradient(135deg, ${chapterColor}20, transparent)`,
              borderBottom: `1px solid ${chapterColor}25`,
              padding: "20px 28px", textAlign: "center",
            }}>
              <p style={{ fontFamily: "Georgia, serif", fontSize: "13px", fontWeight: "bold", color: "#a8e6a0", marginBottom: "4px" }}>
                🏆 Missão Concluída
              </p>
              <p style={{ fontFamily: "Georgia, serif", fontSize: "12px", color: "rgba(180,220,180,0.6)" }}>
                Paciente estabilizada.
              </p>
            </div>

            <div style={{ padding: "28px" }}>
              {`Quando lembro daquela viagem, não lembro da doença.

Não lembro do desconforto.

Nem do frio.

Eu lembro de você acordando para ver se eu estava respirando direito.

Lembro dos abraços.

Dos carinhos.

Da preocupação.

E da forma como você cuidou de mim quando eu mais precisava.

Foi ali que eu percebi que amor também é isso.

É cuidar de alguém mesmo quando ninguém está vendo.`.split("\n\n").map((p, i) => (
                <p key={i} style={{
                  fontFamily: "Georgia, serif", fontSize: "14px", lineHeight: 1.85,
                  color: "rgba(225,195,140,0.9)", fontStyle: "italic",
                  marginBottom: "14px",
                }}>
                  {p}
                </p>
              ))}

              <div style={{
                borderRadius: "14px", padding: "18px 20px",
                background: `${chapterColor}12`, border: `1px solid ${chapterColor}35`,
                textAlign: "center", marginBottom: "24px", marginTop: "8px",
              }}>
                <p style={{ fontFamily: "Georgia, serif", fontSize: "12px", color: `${chapterColor}80`, letterSpacing: "0.1em", marginBottom: "6px" }}>
                  🏆 Conquista Desbloqueada
                </p>
                <p style={{ fontFamily: "Georgia, serif", fontSize: "16px", fontWeight: "bold", color: "#f0d888" }}>
                  ❤️ Guardiã do Inverno
                </p>
              </div>

              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
                {nextChapterId && (
                  <button
                    onClick={handleComplete}
                    className="hover:scale-105 transition-all"
                    style={{
                      background: `linear-gradient(135deg, ${chapterColor}35, ${chapterColor}18)`,
                      border: `1px solid ${chapterColor}70`, borderRadius: "50px",
                      padding: "12px 36px", color: "#f0d888",
                      fontFamily: "Georgia, serif", fontSize: "14px",
                      cursor: "pointer", letterSpacing: "0.06em",
                      boxShadow: `0 0 30px ${chapterColor}20`,
                    }}
                  >
                    ❤️ Continuar a Aventura
                  </button>
                )}
                <button
                  onClick={onNavigateMap}
                  className="hover:scale-105 transition-all"
                  style={{
                    background: "rgba(40,25,8,0.7)", border: "1px solid rgba(200,140,40,0.3)",
                    borderRadius: "50px", padding: "12px 24px",
                    color: "rgba(220,180,80,0.8)", fontFamily: "Georgia, serif", fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  ← Ver Mapa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MEMÓRIA REGISTRADA ── */}
      {showMemoria && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "center",
          pointerEvents: "none",
        }}>
          <div style={{
            background: "rgba(10,5,2,0.92)",
            border: `1.5px solid ${chapterColor}70`,
            borderRadius: "20px", padding: "28px 48px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "10px",
            boxShadow: `0 0 60px ${chapterColor}30`,
            animation: "memoriaIn 0.4s ease forwards",
          }}>
            <span style={{ fontSize: "32px", filter: "drop-shadow(0 0 12px #ffd700)" }}>✨</span>
            <p style={{
              fontFamily: "Georgia, serif", fontSize: "16px", fontWeight: "bold",
              color: "#f0d888", letterSpacing: "0.1em",
            }}>
              Memória registrada
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes gainPop {
          0%   { transform: scale(1); }
          40%  { transform: scale(1.15); color: #80e080; }
          100% { transform: scale(1); }
        }
        @keyframes lossPop {
          0%   { transform: scale(1); }
          40%  { transform: scale(1.15); color: #e06060; }
          100% { transform: scale(1); }
        }
        @keyframes memoriaIn {
          0%   { opacity: 0; transform: scale(0.8) translateY(10px); }
          40%  { opacity: 1; transform: scale(1.05) translateY(0); }
          70%  { transform: scale(1); }
          85%  { opacity: 1; }
          100% { opacity: 0; transform: scale(0.95); }
        }
      `}</style>
    </section>
  );
}
