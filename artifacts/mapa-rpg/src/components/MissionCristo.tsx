import { useState, useEffect } from "react";

type Stage =
  | "intro"
  | "etapa1a"
  | "etapa1b"
  | "etapa2"
  | "etapa3"
  | "final";

const ALIADAS = [
  {
    key: "isadora",
    icon: "🚗",
    name: "Isadora",
    role: "Transporte",
    text: `Responsável pelo transporte da operação.

Durante o trajeto tivemos sérias dúvidas se chegaríamos ao Cristo ou ao além.

Em determinado momento ela deixou bem claro que, se eu deixasse a aliança cair, ela arrastaria minha cara no asfalto.

Felizmente a aliança sobreviveu.

E eu também.`,
  },
  {
    key: "miriam",
    icon: "📸",
    name: "Miriam",
    role: "Suporte Emocional",
    text: `Responsável pelo suporte emocional.

Ou pelo menos era o plano.

Passou boa parte do tempo rindo.

Parecia mais nervosa que eu.

E quando chegou a hora das fotos...

Vamos dizer que o talento dela estava mais na torcida do que na fotografia.

PS:
Tirou fotos ruins.

Mas eu gosto delas mesmo assim. ❤️`,
  },
  {
    key: "vitoria",
    icon: "💐",
    name: "Vitória",
    role: "Itens Lendários",
    text: `Responsável pelos itens lendários da missão.

Funções:

✅ Entregar o buquê
✅ Entregar a aliança
✅ Sobreviver à direção da Isadora

Enquanto eu estava entrando em colapso emocional, ela manteve tudo sob controle.

Foi braba.`,
  },
  {
    key: "analigia",
    icon: "👑",
    name: "Ana Lígia",
    role: "Membro Remoto",
    text: `Membro remoto da operação.

Não estava presente fisicamente.

Mas esteve presente durante praticamente toda a missão.

Me ajudou desde o início.

Participou dos planos.

Acompanhou os surtos.

Apoiou as decisões.

E, pelo ritmo das sugestões dela...

Acho que ela queria que eu te pedisse em casamento antes mesmo do namoro.

Ela foi minha parceira do início ao fim.

E sinceramente?

Ainda estou devendo essa para ela. ❤️`,
  },
];

export default function MissionCristo({
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
  const [stage, setStage] = useState<Stage>(isCompleted ? "final" : "intro");
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [activeAliada, setActiveAliada] = useState<string | null>(null);
  const [showMemoria, setShowMemoria] = useState(false);

  useEffect(() => {
    if (isCompleted) setStage("final");
  }, [isCompleted]);

  function advance(to: Stage) {
    setStage(to);
  }

  function handleAliadaClick(key: string) {
    setActiveAliada(activeAliada === key ? null : key);
    setVisited((prev) => new Set([...prev, key]));
  }

  function handleComplete() {
    if (!isCompleted) completeChapter(chapterId);
    setShowMemoria(true);
    setTimeout(() => {
      setShowMemoria(false);
      if (nextChapterId) onNavigateNext(nextChapterId);
    }, 2400);
  }

  const allVisited = ALIADAS.every((a) => visited.has(a.key));
  const activeAliadaData = ALIADAS.find((a) => a.key === activeAliada);

  return (
    <section style={{ position: "relative" }}>
      {/* Section header */}
      <div className="flex items-center gap-3 mb-6">
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: `${chapterColor}25`, border: `1.5px solid ${chapterColor}50`,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px",
        }}>
          ❤️
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
      {stage === "intro" && (
        <div style={{ animation: "fadeIn 0.4s ease" }}>
          <div style={{
            borderRadius: "20px", overflow: "hidden",
            background: "linear-gradient(135deg, rgba(14,9,2,0.98) 0%, rgba(22,14,4,0.98) 100%)",
            border: `1px solid ${chapterColor}35`,
            boxShadow: `0 0 60px ${chapterColor}10`,
          }}>
            <div style={{
              background: `linear-gradient(135deg, ${chapterColor}20, transparent)`,
              borderBottom: `1px solid ${chapterColor}20`,
              padding: "28px 28px 20px",
              textAlign: "center",
            }}>
              <p style={{ fontFamily: "Georgia, serif", fontSize: "11px", letterSpacing: "0.16em", textTransform: "uppercase", color: `${chapterColor}80`, marginBottom: "8px" }}>
                📍 Cristo de Cornélio
              </p>
              <p style={{ fontFamily: "Georgia, serif", fontSize: "13px", letterSpacing: "0.1em", color: "rgba(220,180,100,0.6)", marginBottom: "4px" }}>
                Missão Especial Detectada
              </p>
              <h3 style={{ fontFamily: "Georgia, serif", fontSize: "22px", color: "#f0d888", fontWeight: "bold", textShadow: `0 0 24px ${chapterColor}50` }}>
                ❤️ Missão: O Pedido
              </h3>
            </div>

            <div style={{ padding: "24px 28px", textAlign: "center" }}>
              <div style={{
                display: "inline-block", borderRadius: "12px",
                background: `${chapterColor}12`, border: `1px solid ${chapterColor}25`,
                padding: "12px 24px", marginBottom: "28px",
              }}>
                <p style={{ fontFamily: "Georgia, serif", fontSize: "13px", color: "rgba(220,190,130,0.85)", lineHeight: 1.6 }}>
                  <span style={{ color: `${chapterColor}cc`, fontWeight: "bold" }}>Objetivo: </span>
                  Realizar um pedido de namoro.
                </p>
              </div>

              <br />

              <button
                onClick={() => advance("etapa1a")}
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
      )}

      {/* ── ETAPA 1A ── */}
      {stage === "etapa1a" && (
        <div style={{ animation: "fadeIn 0.4s ease" }}>
          <StageCard color={chapterColor} label="Etapa 1" title="⚔️ A Guerra da Aliança">
            <div style={{
              borderRadius: "12px", overflow: "hidden", marginBottom: "20px",
              border: `1px solid ${chapterColor}25`,
            }}>
              <img
                src="/alianca-quebrada.jpg"
                alt="A aliança quebrada"
                style={{
                  width: "100%",
                  display: "block",
                  objectFit: "contain",
                  maxHeight: "420px",
                  background: "rgba(0,0,0,0.6)",
                }}
              />
            </div>

            <NarrativeText color={chapterColor} paragraphs={[
              "Tudo estava pronto.",
              "Ou pelo menos era o que eu pensava.",
              "A aliança chegou.",
              "Quebrada.",
              "Completamente destruída.",
              "Foi nesse momento que começou uma missão paralela que eu definitivamente não tinha planejado.",
            ]} />

            <ActionButton color={chapterColor} onClick={() => advance("etapa1b")}>
              ⚔️ Continuar
            </ActionButton>
          </StageCard>
        </div>
      )}

      {/* ── ETAPA 1B ── */}
      {stage === "etapa1b" && (
        <div style={{ animation: "fadeIn 0.4s ease" }}>
          <StageCard color={chapterColor} label="Etapa 1" title="⚔️ A Guerra da Aliança">
            <NarrativeText color={chapterColor} paragraphs={[
              "Briguei com o carteiro.",
              "Briguei com a chefe do carteiro.",
              "Briguei com a atendente da loja.",
              "Briguei com o carteiro de novo.",
              "E terminei brigando até com a gerente.",
              "Expliquei calmamente que faria o pedido em 3 dias.",
              "Também perguntei, de forma extremamente educada, se eles preferiam que eu fosse até São Paulo buscar pessoalmente ou se eles dariam um jeito de fazer a aliança chegar.",
              "Acho que eles não gostaram muito de algumas pequenas ameaças.",
              "Mas funcionou.",
              "A previsão era muito maior. A nova aliança chegou em apenas dois dias.",
            ]} />

            <div style={{
              borderRadius: "12px", padding: "16px 20px", marginBottom: "24px",
              background: `${chapterColor}12`, border: `1px solid ${chapterColor}30`,
              display: "flex", gap: "24px", justifyContent: "center", flexWrap: "wrap",
            }}>
              <StatusBadge icon="💍" text="Aliança recuperada." />
              <StatusBadge icon="🏆" text="Vitória da carioca." />
            </div>

            <ActionButton color={chapterColor} onClick={() => advance("etapa2")}>
              ➡️ Próxima Etapa
            </ActionButton>
          </StageCard>
        </div>
      )}

      {/* ── ETAPA 2 ── */}
      {stage === "etapa2" && (
        <div style={{ animation: "fadeIn 0.4s ease" }}>
          <StageCard color={chapterColor} label="Etapa 2" title="👥 Recrutando as Aliadas">
            <p style={{
              fontFamily: "Georgia, serif", fontSize: "12px",
              color: "rgba(180,140,60,0.5)", letterSpacing: "0.06em",
              textAlign: "center", marginBottom: "24px",
            }}>
              ✦ Conheça cada aliada da missão ✦
            </p>

            {/* 2x2 grid */}
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px",
              marginBottom: "20px",
            }}>
              {ALIADAS.map((a) => {
                const isVisited = visited.has(a.key);
                const isActive = activeAliada === a.key;
                return (
                  <button
                    key={a.key}
                    onClick={() => handleAliadaClick(a.key)}
                    style={{
                      background: isActive
                        ? `linear-gradient(135deg, ${chapterColor}25, ${chapterColor}10)`
                        : isVisited
                        ? "rgba(20,14,4,0.8)"
                        : "rgba(14,9,2,0.95)",
                      border: isActive
                        ? `1.5px solid ${chapterColor}70`
                        : isVisited
                        ? `1px solid ${chapterColor}35`
                        : `1px solid rgba(180,140,60,0.2)`,
                      borderRadius: "14px", padding: "16px 12px",
                      cursor: "pointer", textAlign: "center",
                      transition: "all 0.2s",
                      boxShadow: isActive ? `0 0 20px ${chapterColor}20` : "none",
                    }}
                    className="hover:scale-105"
                  >
                    <div style={{ fontSize: "28px", marginBottom: "6px" }}>{a.icon}</div>
                    <p style={{
                      fontFamily: "Georgia, serif", fontSize: "13px", fontWeight: "bold",
                      color: isVisited ? chapterColor : "rgba(220,190,130,0.8)",
                      marginBottom: "2px",
                    }}>
                      {a.name}
                    </p>
                    <p style={{
                      fontFamily: "Georgia, serif", fontSize: "10px",
                      color: "rgba(180,140,60,0.5)", letterSpacing: "0.06em",
                    }}>
                      {a.role}
                    </p>
                    {isVisited && (
                      <div style={{ marginTop: "6px", fontSize: "10px", color: `${chapterColor}cc` }}>
                        ✓ Conhecida
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Active aliada panel */}
            {activeAliadaData && (
              <div style={{
                borderRadius: "14px", padding: "20px",
                background: `linear-gradient(135deg, rgba(18,11,3,0.98) 0%, rgba(28,18,5,0.98) 100%)`,
                border: `1px solid ${chapterColor}30`,
                marginBottom: "20px",
                animation: "fadeIn 0.25s ease",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                  <span style={{ fontSize: "22px" }}>{activeAliadaData.icon}</span>
                  <div>
                    <p style={{ fontFamily: "Georgia, serif", fontSize: "14px", fontWeight: "bold", color: chapterColor }}>
                      {activeAliadaData.name}
                    </p>
                    <p style={{ fontFamily: "Georgia, serif", fontSize: "10px", color: "rgba(180,140,60,0.5)" }}>
                      {activeAliadaData.role}
                    </p>
                  </div>
                </div>
                {activeAliadaData.text.split("\n\n").map((para, i) => (
                  <p key={i} style={{
                    fontFamily: "Georgia, serif", fontSize: "13px", lineHeight: 1.75,
                    color: "rgba(225,195,140,0.88)", fontStyle: "italic", marginBottom: "10px",
                    whiteSpace: "pre-line",
                  }}>
                    {para}
                  </p>
                ))}
              </div>
            )}

            {/* Progress */}
            <div style={{
              textAlign: "center", marginBottom: "20px",
              fontFamily: "Georgia, serif", fontSize: "12px",
              color: `${chapterColor}80`,
            }}>
              {visited.size} / {ALIADAS.length} aliadas conhecidas
            </div>

            {allVisited ? (
              <div style={{ animation: "fadeIn 0.4s ease" }}>
                <div style={{
                  textAlign: "center", marginBottom: "20px",
                  padding: "14px 20px", borderRadius: "12px",
                  background: `${chapterColor}15`, border: `1px solid ${chapterColor}40`,
                }}>
                  <p style={{ fontFamily: "Georgia, serif", fontSize: "14px", color: "#f0d888", fontWeight: "bold" }}>
                    🎯 Equipe reunida
                  </p>
                  <p style={{ fontFamily: "Georgia, serif", fontSize: "12px", color: "rgba(220,190,130,0.7)", marginTop: "4px" }}>
                    A missão agora pode prosseguir.
                  </p>
                </div>
                <ActionButton color={chapterColor} onClick={() => advance("etapa3")}>
                  ➡️ Continuar
                </ActionButton>
              </div>
            ) : (
              <p style={{
                textAlign: "center", fontFamily: "Georgia, serif", fontSize: "11px",
                color: "rgba(180,140,60,0.35)", letterSpacing: "0.06em",
              }}>
                Conheça todas as aliadas para continuar
              </p>
            )}
          </StageCard>
        </div>
      )}

      {/* ── ETAPA 3 ── */}
      {stage === "etapa3" && (
        <div style={{ animation: "fadeIn 0.5s ease" }}>
          <div style={{
            borderRadius: "20px", overflow: "hidden",
            background: "linear-gradient(135deg, rgba(6,3,1,0.99) 0%, rgba(12,7,2,0.99) 100%)",
            border: `1px solid ${chapterColor}25`,
            boxShadow: `0 0 80px ${chapterColor}08`,
          }}>
            <div style={{
              background: `linear-gradient(135deg, rgba(180,30,30,0.12), transparent)`,
              borderBottom: `1px solid rgba(200,60,60,0.15)`,
              padding: "20px 28px",
              textAlign: "center",
            }}>
              <p style={{ fontFamily: "Georgia, serif", fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(200,60,60,0.6)", marginBottom: "6px" }}>
                Objetivo Atual
              </p>
              <h3 style={{ fontFamily: "Georgia, serif", fontSize: "20px", color: "#f0d888", fontWeight: "bold" }}>
                ❤️ Fazer o Pedido
              </h3>
            </div>

            <div style={{ padding: "28px 28px 24px" }}>
              {/* Nervousness bar */}
              <div style={{ marginBottom: "28px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontFamily: "Georgia, serif", fontSize: "11px", color: "rgba(200,80,80,0.7)", letterSpacing: "0.08em" }}>
                    Nervosismo
                  </span>
                  <span style={{ fontFamily: "Georgia, serif", fontSize: "11px", color: "rgba(200,80,80,0.7)" }}>
                    100%
                  </span>
                </div>
                <div style={{
                  height: "10px", borderRadius: "5px",
                  background: "rgba(40,20,10,0.8)",
                  border: "1px solid rgba(200,80,80,0.2)",
                  overflow: "hidden",
                }}>
                  <div style={{
                    height: "100%", borderRadius: "5px",
                    background: "linear-gradient(90deg, #c04040, #e05050, #ff6060)",
                    width: "100%",
                    boxShadow: "0 0 12px rgba(200,60,60,0.5)",
                    animation: "nervBar 1.5s ease-out",
                  }} />
                </div>
              </div>

              <NarrativeText color={chapterColor} paragraphs={[
                "Mãos tremendo.",
                "Coração acelerado.",
                "Nenhuma frase funcionando direito.",
                "O mais engraçado é que eu já sabia da resposta.",
                "Mesmo assim eu estava com medo.",
                "Porque quando algo é importante de verdade...",
                "A gente sempre fica com medo de perder.",
              ]} />

              <div style={{ textAlign: "center", marginTop: "8px" }}>
                <button
                  onClick={() => advance("final")}
                  className="hover:scale-105 transition-all"
                  style={{
                    background: "linear-gradient(135deg, rgba(200,30,30,0.35), rgba(200,30,30,0.18))",
                    border: "1px solid rgba(220,60,60,0.6)", borderRadius: "50px",
                    padding: "14px 44px", color: "#f8c0c0",
                    fontFamily: "Georgia, serif", fontSize: "15px",
                    cursor: "pointer", letterSpacing: "0.08em",
                    boxShadow: "0 0 30px rgba(200,60,60,0.18)",
                    animation: "heartbeat 1.8s ease-in-out infinite",
                  }}
                >
                  ❤️ Fazer o Pedido
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── FINAL ── */}
      {stage === "final" && (
        <div style={{ animation: "fadeIn 0.5s ease" }}>
          <div style={{
            borderRadius: "20px", overflow: "hidden",
            background: "linear-gradient(135deg, rgba(14,9,2,0.98) 0%, rgba(22,14,4,0.98) 100%)",
            border: `1px solid ${chapterColor}35`,
            boxShadow: `0 0 60px ${chapterColor}15`,
          }}>
            {/* Photo do pedido */}
            <div style={{
              borderBottom: `1px solid ${chapterColor}20`,
              overflow: "hidden",
            }}>
              <img
                src="/foto-pedido.jpg"
                alt="O pedido ❤️"
                style={{
                  width: "100%",
                  display: "block",
                  objectFit: "cover",
                  maxHeight: "480px",
                }}
              />
            </div>

            <div style={{ padding: "28px 28px 24px", textAlign: "center" }}>
              <p style={{
                fontFamily: "Georgia, serif", fontSize: "15px", fontStyle: "italic",
                color: "rgba(230,200,145,0.9)", lineHeight: 1.7, marginBottom: "24px",
              }}>
                "Foi aqui que nossa história ganhou um novo capítulo."
              </p>

              <div style={{
                borderRadius: "12px", padding: "16px 24px", marginBottom: "28px",
                background: `${chapterColor}12`, border: `1px solid ${chapterColor}30`,
                display: "inline-block",
              }}>
                <p style={{ fontFamily: "Georgia, serif", fontSize: "14px", fontWeight: "bold", color: "#f0d888", marginBottom: "6px" }}>
                  🏆 Missão Concluída
                </p>
                <p style={{ fontFamily: "Georgia, serif", fontSize: "16px", color: "#f8b0b0" }}>
                  ❤️ Ela disse sim.
                </p>
              </div>

              <br />

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
        @keyframes nervBar {
          from { width: 0%; }
          to   { width: 100%; }
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.04); }
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

/* ── Helpers ─────────────────────────────────────── */

function StageCard({
  color, label, title, children,
}: {
  color: string; label: string; title: string; children: React.ReactNode;
}) {
  return (
    <div style={{
      borderRadius: "20px", overflow: "hidden",
      background: "linear-gradient(135deg, rgba(14,9,2,0.98) 0%, rgba(22,14,4,0.98) 100%)",
      border: `1px solid ${color}35`,
      boxShadow: `0 0 40px ${color}08`,
    }}>
      <div style={{
        background: `linear-gradient(135deg, ${color}18, transparent)`,
        borderBottom: `1px solid ${color}20`,
        padding: "18px 28px",
      }}>
        <p style={{ fontFamily: "Georgia, serif", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: `${color}70`, marginBottom: "4px" }}>
          {label}
        </p>
        <h3 style={{ fontFamily: "Georgia, serif", fontSize: "17px", color: "#f0d888", fontWeight: "bold" }}>
          {title}
        </h3>
      </div>
      <div style={{ padding: "24px 28px" }}>
        {children}
      </div>
    </div>
  );
}

function NarrativeText({ paragraphs, color }: { paragraphs: string[]; color: string }) {
  return (
    <div style={{ marginBottom: "24px" }}>
      {paragraphs.map((p, i) => (
        <p key={i} style={{
          fontFamily: "Georgia, serif", fontSize: "14px", lineHeight: 1.85,
          color: "rgba(225,195,140,0.9)", fontStyle: "italic",
          marginBottom: "10px",
          paddingLeft: "12px",
          borderLeft: i === 0 ? `2px solid ${color}40` : "2px solid transparent",
        }}>
          {p}
        </p>
      ))}
    </div>
  );
}

function ActionButton({ children, color, onClick }: { children: React.ReactNode; color: string; onClick: () => void }) {
  return (
    <div style={{ textAlign: "center" }}>
      <button
        onClick={onClick}
        className="hover:scale-105 transition-all"
        style={{
          background: `linear-gradient(135deg, ${color}28, ${color}12)`,
          border: `1px solid ${color}55`, borderRadius: "50px",
          padding: "12px 36px", color: "#f0d888",
          fontFamily: "Georgia, serif", fontSize: "14px",
          cursor: "pointer", letterSpacing: "0.07em",
          boxShadow: `0 0 20px ${color}12`,
        }}
      >
        {children}
      </button>
    </div>
  );
}

function StatusBadge({ icon, text }: { icon: string; text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <span style={{ fontSize: "18px" }}>{icon}</span>
      <span style={{ fontFamily: "Georgia, serif", fontSize: "13px", color: "rgba(220,190,130,0.85)", fontStyle: "italic" }}>
        {text}
      </span>
    </div>
  );
}
