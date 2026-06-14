import { useState, useEffect } from "react";

const PAGES = [
  {
    title: "Página I",
    content: `Eu não sei como era a sua vida antes de eu chegar nela.

Mas eu sei muito bem como era a minha.

Eu nunca tinha sentido exatamente o que sinto hoje. É difícil explicar. É uma mistura de paixão, empolgação, saudade, felicidade e, às vezes, até um pouco de medo.

Medo de perder algo que se tornou tão importante para mim.

Antes de você, eu achava que algumas coisas só existiam em filmes, músicas ou nas histórias que as pessoas contam.

Mas aí você apareceu.

E, de repente, tudo aquilo começou a fazer sentido.

Talvez o amor seja exatamente isso.

Encontrar alguém que faz o mundo parecer um lugar diferente sem mudar de lugar nenhum.`,
  },
  {
    title: "Página II",
    content: `Quando olho para tudo que vivemos até aqui, percebo que as melhores memórias nunca foram os grandes acontecimentos.

Foram os momentos simples.

As conversas sem assunto.

As risadas inesperadas.

Os encontros que pareciam durar pouco demais.

Os dias comuns que acabaram se tornando especiais simplesmente porque você estava neles.

Você entrou na minha vida de uma forma tão natural que hoje é difícil imaginar como ela era antes.

E talvez essa seja uma das coisas mais bonitas de todas.

Porque algumas pessoas passam pela nossa vida.

Mas outras passam a fazer parte dela.`,
  },
  {
    title: "Página III",
    content: `Dizem que a felicidade precisa ser conquistada.

Mas eu, como uma boa carioca, encontrei um método alternativo...

Eu roubei.

E foi o maior roubo da minha vida.

Roubei seu tempo.

Roubei seus abraços.

Roubei seus beijos.

Roubei um espaço no seu coração.

E sinceramente?

Não me arrependo nem um pouco.

Por isso, deixo aqui meus sentimentos ao antigo dono desse coração:

⚰️ Descanse em paz, falecido.

Você foi forte. Você resistiu. Você lutou bravamente.

Mas acabou sendo derrotado por uma carioca determinada.

Sempre será lembrado.

Com carinho, respeito e absolutamente nenhuma intenção de devolver o que foi roubado. ❤️`,
  },
];

export default function BookExperienceDella({
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
  const [bookOpen, setBookOpen] = useState(isCompleted);
  const [pageIndex, setPageIndex] = useState(isCompleted ? PAGES.length - 1 : 0);
  const [flipping, setFlipping] = useState(false);
  const [flipDir, setFlipDir] = useState<"next" | "prev">("next");
  const [showMemoria, setShowMemoria] = useState(false);
  const [reachedEnd, setReachedEnd] = useState(isCompleted);

  useEffect(() => {
    if (isCompleted) {
      setBookOpen(true);
      setReachedEnd(true);
      setPageIndex(PAGES.length - 1);
    }
  }, [isCompleted]);

  function openBook() {
    setBookOpen(true);
  }

  function goNext() {
    if (flipping || pageIndex >= PAGES.length - 1) return;
    setFlipDir("next");
    setFlipping(true);
    setTimeout(() => {
      const next = pageIndex + 1;
      setPageIndex(next);
      setFlipping(false);
      if (next === PAGES.length - 1) {
        setReachedEnd(true);
      }
    }, 350);
  }

  function goPrev() {
    if (flipping || pageIndex <= 0) return;
    setFlipDir("prev");
    setFlipping(true);
    setTimeout(() => {
      setPageIndex((p) => p - 1);
      setFlipping(false);
    }, 350);
  }

  function handleComplete() {
    if (!isCompleted) {
      completeChapter(chapterId);
    }
    setShowMemoria(true);
    setTimeout(() => setShowMemoria(false), 2200);
  }

  const page = PAGES[pageIndex];

  return (
    <section style={{ position: "relative" }}>
      <div className="flex items-center gap-3 mb-6">
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: `${chapterColor}25`, border: `1.5px solid ${chapterColor}50`,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px",
        }}>
          📖
        </div>
        <h2 style={{
          fontFamily: "Georgia, serif", fontSize: "13px", letterSpacing: "0.14em",
          textTransform: "uppercase", color: `${chapterColor}cc`,
        }}>
          Memória Especial
        </h2>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${chapterColor}40, transparent)` }} />
      </div>

      {/* ── CLOSED BOOK ── */}
      {!bookOpen && (
        <div
          className="flex flex-col items-center gap-6 py-12"
          style={{ animation: "fadeIn 0.5s ease" }}
        >
          <p style={{
            fontFamily: "Georgia, serif", fontSize: "14px",
            color: "rgba(220,180,100,0.7)", letterSpacing: "0.08em",
          }}>
            📖 Um diário foi encontrado.
          </p>

          <button
            onClick={openBook}
            style={{
              background: "none", border: "none", padding: 0, cursor: "pointer",
              animation: "float 3s ease-in-out infinite",
            }}
            title="Abrir o diário"
          >
            <div style={{
              width: 140, height: 180,
              borderRadius: "4px 16px 16px 4px",
              background: "linear-gradient(135deg, #5a1a1a 0%, #3d0f0f 50%, #2a0a0a 100%)",
              border: `2px solid ${chapterColor}60`,
              boxShadow: `
                -6px 0 0 #1a0505,
                -8px 0 12px rgba(0,0,0,0.6),
                0 0 40px ${chapterColor}20,
                inset 2px 0 8px rgba(255,255,255,0.04)
              `,
              position: "relative",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexDirection: "column", gap: "12px",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
              className="hover:scale-105"
            >
              <div style={{
                position: "absolute", left: 0, top: 0, bottom: 0,
                width: "10px",
                background: "linear-gradient(90deg, #1a0505, #2a0a0a)",
                borderRadius: "4px 0 0 4px",
                boxShadow: "inset -2px 0 4px rgba(0,0,0,0.5)",
              }} />
              <div style={{
                fontSize: "32px",
                filter: `drop-shadow(0 0 8px ${chapterColor}80)`,
              }}>
                ❤️
              </div>
              <div style={{
                fontFamily: "Georgia, serif", fontSize: "11px", textAlign: "center",
                color: `${chapterColor}cc`, letterSpacing: "0.1em", lineHeight: 1.5,
                padding: "0 16px",
              }}>
                Diário
                <br />
                <span style={{ fontSize: "9px", opacity: 0.6 }}>Toque para abrir</span>
              </div>
              <div style={{
                position: "absolute", top: "18px", right: "18px",
                width: "30px", height: "2px", borderRadius: "1px",
                background: `${chapterColor}40`,
              }} />
              <div style={{
                position: "absolute", top: "26px", right: "18px",
                width: "20px", height: "2px", borderRadius: "1px",
                background: `${chapterColor}25`,
              }} />
            </div>
          </button>

          <p style={{
            fontFamily: "Georgia, serif", fontSize: "12px",
            color: "rgba(180,140,60,0.4)", letterSpacing: "0.06em",
          }}>
            ✦ Toque no diário para ler ✦
          </p>
        </div>
      )}

      {/* ── OPEN BOOK ── */}
      {bookOpen && (
        <div style={{ animation: "fadeIn 0.4s ease" }}>

          {/* Book container */}
          <div style={{
            borderRadius: "12px", overflow: "hidden",
            background: "linear-gradient(135deg, rgba(18,8,4,0.98) 0%, rgba(28,12,6,0.98) 100%)",
            border: `1px solid ${chapterColor}35`,
            boxShadow: `0 0 60px ${chapterColor}10, 0 8px 40px rgba(0,0,0,0.5)`,
          }}>

            {/* Page header */}
            <div style={{
              padding: "20px 28px 0",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              borderBottom: `1px solid ${chapterColor}15`,
              paddingBottom: "16px",
            }}>
              <span style={{
                fontFamily: "Georgia, serif", fontSize: "11px",
                color: `${chapterColor}80`, letterSpacing: "0.12em", textTransform: "uppercase",
              }}>
                {page.title}
              </span>
              <div style={{ display: "flex", gap: "6px" }}>
                {PAGES.map((_, i) => (
                  <div key={i} style={{
                    width: i === pageIndex ? "20px" : "6px", height: "6px",
                    borderRadius: "3px",
                    background: i === pageIndex ? chapterColor : `${chapterColor}30`,
                    transition: "all 0.3s ease",
                  }} />
                ))}
              </div>
            </div>

            {/* Page content */}
            <div style={{
              padding: "28px 28px 24px",
              minHeight: "320px",
              position: "relative",
              overflow: "hidden",
            }}>
              <div
                key={pageIndex}
                style={{
                  animation: flipping
                    ? flipDir === "next"
                      ? "pageFlipOut 0.35s ease forwards"
                      : "pageFlipIn 0.35s ease forwards"
                    : "pageSlideIn 0.35s ease forwards",
                }}
              >
                {page.content.split("\n\n").map((para, i) => (
                  <p key={i} style={{
                    fontFamily: "Georgia, serif",
                    fontSize: "14px",
                    lineHeight: 1.85,
                    color: "rgba(230,200,145,0.92)",
                    marginBottom: "16px",
                    fontStyle: "italic",
                    whiteSpace: "pre-line",
                  }}>
                    {para}
                  </p>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div style={{
              padding: "16px 28px 24px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              borderTop: `1px solid ${chapterColor}15`,
            }}>
              <button
                onClick={goPrev}
                disabled={pageIndex === 0}
                style={{
                  background: pageIndex === 0 ? "transparent" : `${chapterColor}15`,
                  border: `1px solid ${pageIndex === 0 ? "transparent" : chapterColor + "40"}`,
                  borderRadius: "50px", padding: "8px 20px",
                  color: pageIndex === 0 ? "rgba(180,140,60,0.2)" : `${chapterColor}cc`,
                  fontFamily: "Georgia, serif", fontSize: "12px",
                  cursor: pageIndex === 0 ? "default" : "pointer",
                  transition: "all 0.2s",
                  letterSpacing: "0.06em",
                }}
              >
                ‹ Página Anterior
              </button>

              <span style={{
                fontFamily: "Georgia, serif", fontSize: "11px",
                color: "rgba(180,140,60,0.4)",
              }}>
                {pageIndex + 1} / {PAGES.length}
              </span>

              {pageIndex < PAGES.length - 1 ? (
                <button
                  onClick={goNext}
                  style={{
                    background: `${chapterColor}20`,
                    border: `1px solid ${chapterColor}50`,
                    borderRadius: "50px", padding: "8px 20px",
                    color: `${chapterColor}ee`,
                    fontFamily: "Georgia, serif", fontSize: "12px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    letterSpacing: "0.06em",
                  }}
                  className="hover:scale-105"
                >
                  Próxima Página ›
                </button>
              ) : (
                <div style={{ width: "120px" }} />
              )}
            </div>

            {/* ── LAST PAGE — complete button ── */}
            {reachedEnd && (
              <div
                style={{
                  padding: "0 28px 32px",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: "16px",
                  animation: "fadeIn 0.6s ease",
                }}
              >
                <div style={{
                  width: "100%", height: "1px",
                  background: `linear-gradient(90deg, transparent, ${chapterColor}40, transparent)`,
                  marginBottom: "8px",
                }} />

                {isCompleted ? (
                  <>
                    <p style={{
                      fontFamily: "Georgia, serif", fontSize: "15px", color: "#a8e6a0",
                      textShadow: "0 0 20px rgba(80,220,80,0.4)", fontWeight: "bold",
                      textAlign: "center",
                    }}>
                      ❤️ Você concluiu este capítulo.
                    </p>
                    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
                      {nextChapterId && (
                        <button
                          onClick={() => onNavigateNext(nextChapterId)}
                          className="hover:scale-105 transition-all"
                          style={{
                            background: `linear-gradient(135deg, ${chapterColor}30, ${chapterColor}15)`,
                            border: `1px solid ${chapterColor}60`,
                            borderRadius: "50px", padding: "10px 28px",
                            color: "#f0d888", fontFamily: "Georgia, serif", fontSize: "13px",
                            cursor: "pointer",
                          }}
                        >
                          Continuar a aventura →
                        </button>
                      )}
                      <button
                        onClick={onNavigateMap}
                        className="hover:scale-105 transition-all"
                        style={{
                          background: "rgba(40,25,8,0.7)", border: "1px solid rgba(200,140,40,0.3)",
                          borderRadius: "50px", padding: "10px 24px",
                          color: "rgba(220,180,80,0.8)", fontFamily: "Georgia, serif", fontSize: "13px",
                          cursor: "pointer",
                        }}
                      >
                        ← Ver Mapa
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p style={{
                      fontFamily: "Georgia, serif", fontSize: "15px",
                      color: "rgba(230,195,140,0.9)", textAlign: "center", lineHeight: 1.6,
                    }}>
                      ❤️ Você chegou ao fim do diário.
                    </p>
                    <button
                      onClick={handleComplete}
                      className="hover:scale-105 transition-all"
                      style={{
                        background: `linear-gradient(135deg, ${chapterColor}35, ${chapterColor}18)`,
                        border: `1px solid ${chapterColor}70`,
                        borderRadius: "50px", padding: "12px 36px",
                        color: "#f0d888", fontFamily: "Georgia, serif", fontSize: "14px",
                        cursor: "pointer",
                        boxShadow: `0 0 24px ${chapterColor}20`,
                        letterSpacing: "0.06em",
                      }}
                    >
                      Continuar a aventura ✨
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── MEMÓRIA REGISTRADA OVERLAY ── */}
      {showMemoria && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 100,
            display: "flex", alignItems: "center", justifyContent: "center",
            pointerEvents: "none",
          }}
        >
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
        @keyframes pageSlideIn {
          from { opacity: 0; transform: translateX(16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes pageFlipOut {
          from { opacity: 1; transform: rotateY(0deg) translateX(0); }
          to   { opacity: 0; transform: rotateY(-20deg) translateX(-20px); }
        }
        @keyframes pageFlipIn {
          from { opacity: 0; transform: rotateY(20deg) translateX(20px); }
          to   { opacity: 1; transform: rotateY(0deg) translateX(0); }
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
