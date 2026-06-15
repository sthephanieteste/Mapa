import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProgress } from "@/hooks/useProgress";

export const ENDING_SHOWN_KEY = "nossa-historia-ending-shown";
export const ENDING_UNLOCKED_KEY = "nossa-historia-ending-unlocked";

export function openFinalScroll() {
  window.dispatchEvent(new CustomEvent("open-final-scroll"));
}

type Phase = "idle" | "prompt" | "opening" | "reading";

const LETTER_PARAGRAPHS = [
  "Se você está lendo isso, significa que encontrou todos os pedaços da nossa história.",
  "Cada foto, cada mensagem, cada memória e cada capítulo me trouxeram de volta para o mesmo lugar: você.",
  "Mas antes de encerrar este livro, existe algo que eu preciso dizer.",
  "Quero que me perdoe por todas as vezes em que você não se sentiu amada o suficiente.",
  "Por todas as vezes em que você não se sentiu desejada o suficiente.",
  "Por todas as vezes em que você não se sentiu cuidada o suficiente.",
  "Me perdoe pelos momentos em que te fiz acreditar que nosso relacionamento era mais estressante do que deveria ser. Pelas vezes em que você sentiu que eu não tinha paciência para ouvir suas reclamações, seus medos ou as coisas que machucavam seu coração.",
  "Me perdoe por cada vez que você carregou culpas que nunca deveriam ter sido suas.",
  "Nós chegamos perigosamente perto de perder algo que hoje eu sei que é uma das coisas mais valiosas da minha vida.",
  "E eu teria me arrependido disso para sempre.",
  "Foi nesse momento que eu percebi que amor não é apenas estar presente nos dias felizes.",
  "É escolher ficar.\nÉ escolher ouvir.\nÉ escolher melhorar.\nÉ escolher a mesma pessoa, todos os dias.",
  "Por isso, quero que saiba que enquanto eu ainda estiver respirando, vou continuar me esforçando para ser alguém melhor para você.",
  "Vou continuar aprendendo.\nVou continuar tentando.\nVou continuar escolhendo você.",
  "Talvez eu nunca consiga retribuir exatamente tudo o que você fez e faz por mim. Mas nunca vou parar de tentar chegar perto.",
  "Porque a verdade é que, ao longo de toda esta aventura, eu descobri algo muito simples:",
  "Eu não me apaixonei por você apenas uma vez.",
  "Eu me apaixonei quando te vi.\nMe apaixonei quando ouvi sua voz.\nMe apaixonei nos nossos melhores dias.\nMe apaixonei nos nossos piores dias.\nE continuo me apaixonando por você, todos os dias.",
  "Se eu pudesse voltar no tempo e viver tudo outra vez, eu escolheria você.",
  "De novo.\nE de novo.\nE de novo.",
  "Enquanto você quiser continuar esta aventura...\nEu também vou querer.",
  "Porque este nunca foi o último capítulo.",
  "É apenas a próxima página da nossa história.",
  "Eu te amo. ❤️",
];

export default function SecretEnding() {
  const { completedCount, totalCount, unlockEnding } = useProgress();
  const [phase, setPhase] = useState<Phase>("idle");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const hasStarted = useRef(false);

  const allComplete = completedCount === totalCount && totalCount > 0;

  useEffect(() => {
    if (!allComplete) return;
    if (hasStarted.current) return;
    try {
      if (localStorage.getItem(ENDING_SHOWN_KEY) === "true") return;
    } catch {}

    hasStarted.current = true;
    try { localStorage.setItem(ENDING_SHOWN_KEY, "true"); } catch {}
    setPhase("prompt");

    return () => timers.current.forEach(clearTimeout);
  }, [allComplete]);

  useEffect(() => {
    const handler = () => setPhase("reading");
    window.addEventListener("open-final-scroll", handler);
    return () => window.removeEventListener("open-final-scroll", handler);
  }, []);

  const handleOpenScroll = useCallback(() => {
    unlockEnding();
    setPhase("opening");
    const id = setTimeout(() => setPhase("reading"), 2000);
    timers.current.push(id);
  }, [unlockEnding]);

  const handleClose = useCallback(() => {
    setPhase("idle");
    hasStarted.current = false;
  }, []);

  if (phase === "idle") return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, pointerEvents: "all" }}>

      {/* ── Dim backdrop ── */}
      <AnimatePresence>
        {(phase === "prompt" || phase === "reading") && (
          <motion.div
            key="dim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(4,2,1,0.88)",
              backdropFilter: "blur(10px)",
              pointerEvents: "none",
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Prompt: scroll shape + open button ── */}
      <AnimatePresence>
        {phase === "prompt" && (
          <motion.div
            key="prompt"
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "28px",
              padding: "24px",
            }}
          >
            <ScrollShape glowing />
            <p
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "clamp(13px, 2vw, 16px)",
                color: "rgba(240,215,150,0.95)",
                textAlign: "center",
                letterSpacing: "0.03em",
                lineHeight: 1.6,
                textShadow: "0 0 20px rgba(200,150,40,0.5)",
                maxWidth: "360px",
              }}
            >
              Você reuniu todos os capítulos da nossa história.
            </p>
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleOpenScroll}
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "15px",
                color: "#f0d888",
                background: "rgba(180,130,30,0.22)",
                border: "1.5px solid rgba(210,165,60,0.7)",
                borderRadius: "40px",
                padding: "12px 28px",
                cursor: "pointer",
                letterSpacing: "0.08em",
                boxShadow: "0 0 20px rgba(200,150,40,0.3), inset 0 0 12px rgba(200,150,40,0.1)",
                backdropFilter: "blur(8px)",
              }}
            >
              📜 Abrir Pergaminho
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Opening: unfurl animation ── */}
      <AnimatePresence>
        {phase === "opening" && (
          <>
            <motion.div
              key="blur-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(4,2,1,0.85)",
                backdropFilter: "blur(8px)",
              }}
            />
            <motion.div
              key="unfurl"
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ duration: 1.8, ease: [0.25, 0.1, 0.25, 1] }}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transformOrigin: "top center",
                transform: "translate(-50%, -50%)",
                width: "min(90vw, 560px)",
                background: "linear-gradient(180deg, #f5e6c0 0%, #ead5a0 30%, #e0c880 70%, #d4b860 100%)",
                borderRadius: "8px",
                boxShadow: "0 20px 80px rgba(0,0,0,0.7), 0 0 40px rgba(200,150,40,0.2)",
                height: "75vh",
                maxHeight: "680px",
                overflow: "hidden",
              }}
            />
          </>
        )}
      </AnimatePresence>

      {/* ── Reading: full letter ── */}
      <AnimatePresence>
        {phase === "reading" && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px",
              overflowY: "auto",
            }}
          >
            <motion.div
              key="letter-parchment"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              style={{
                width: "min(92vw, 580px)",
                maxHeight: "calc(100dvh - 32px)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Scroll rod top */}
              <ScrollRod />

              {/* Parchment body */}
              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  background: "linear-gradient(180deg, #f5e6c0 0%, #ead5a0 50%, #f0dfa8 100%)",
                  padding: "20px 28px 32px",
                  boxShadow: "inset 0 0 40px rgba(160,100,20,0.15), 0 8px 40px rgba(0,0,0,0.6)",
                  position: "relative",
                }}
              >
                {/* Aged paper texture */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage:
                      "radial-gradient(ellipse at 20% 30%, rgba(160,100,20,0.07) 0%, transparent 60%), radial-gradient(ellipse at 80% 70%, rgba(120,80,10,0.08) 0%, transparent 60%)",
                    pointerEvents: "none",
                  }}
                />

                {/* Close button — top-right of parchment */}
                <button
                  onClick={handleClose}
                  title="Fechar pergaminho"
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: "rgba(90,50,10,0.12)",
                    border: "1px solid rgba(90,53,10,0.35)",
                    color: "#7a4a18",
                    fontSize: "15px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 10,
                    lineHeight: 1,
                  }}
                >
                  ✕
                </button>

                {/* Title */}
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  style={{ textAlign: "center", marginBottom: "24px", paddingTop: "8px" }}
                >
                  <p
                    style={{
                      fontFamily: "Georgia, serif",
                      fontSize: "clamp(18px, 3vw, 24px)",
                      fontWeight: "bold",
                      color: "#5a3510",
                      letterSpacing: "0.06em",
                      marginBottom: "4px",
                    }}
                  >
                    O Último Capítulo
                  </p>
                  <div
                    style={{
                      width: "60%",
                      height: "1px",
                      margin: "0 auto",
                      background: "linear-gradient(90deg, transparent, rgba(140,90,20,0.5), transparent)",
                    }}
                  />
                </motion.div>

                {/* Letter body */}
                <div style={{ position: "relative", zIndex: 1 }}>
                  {LETTER_PARAGRAPHS.map((para, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 + i * 0.06, duration: 0.5 }}
                      style={{
                        fontFamily: "Georgia, serif",
                        fontSize: "clamp(12px, 1.8vw, 14.5px)",
                        color: "#3d2008",
                        lineHeight: 1.85,
                        marginBottom: "14px",
                        whiteSpace: "pre-line",
                      }}
                    >
                      {para}
                    </motion.p>
                  ))}
                </div>

                {/* Wax seal */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.8, duration: 0.5, type: "spring", stiffness: 200 }}
                  style={{ textAlign: "center", marginTop: "8px", paddingBottom: "8px" }}
                >
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 52,
                      height: 52,
                      borderRadius: "50%",
                      background: "radial-gradient(circle, #c0392b, #922b21)",
                      boxShadow: "0 3px 12px rgba(180,40,20,0.5), inset 0 1px 4px rgba(255,255,255,0.2)",
                      fontSize: "22px",
                    }}
                  >
                    ❤️
                  </div>
                </motion.div>
              </div>

              {/* Scroll rod bottom */}
              <ScrollRod />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ScrollRod() {
  return (
    <div
      style={{
        width: "100%",
        height: 20,
        borderRadius: "10px",
        background: "linear-gradient(180deg, #d4aa50 0%, #a07828 50%, #c49840 100%)",
        boxShadow: "0 3px 10px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,220,100,0.3)",
        flexShrink: 0,
        position: "relative",
      }}
    >
      {/* End knobs */}
      {([-1, 1] as const).map((side) => (
        <div
          key={side}
          style={{
            position: "absolute",
            top: "50%",
            [side === -1 ? "left" : "right"]: -4,
            transform: "translateY(-50%)",
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "radial-gradient(circle at 35% 35%, #e8c060, #a07828)",
            boxShadow: "0 2px 6px rgba(0,0,0,0.5)",
          }}
        />
      ))}
    </div>
  );
}

function ScrollShape({ glowing }: { glowing: boolean }) {
  return (
    <div style={{ position: "relative", width: 180, height: 220 }}>
      {glowing && (
        <motion.div
          animate={{ opacity: [0.4, 0.9, 0.5], scale: [0.9, 1.15, 0.95] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            inset: -20,
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(220,180,60,0.35) 0%, rgba(200,140,20,0.15) 50%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "110%",
          height: 18,
          borderRadius: "9px",
          background: "linear-gradient(180deg, #c49840, #a07828, #c49840)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 8,
          bottom: 8,
          left: "5%",
          right: "5%",
          background: "linear-gradient(180deg, #f0e2b8 0%, #e8d4a0 40%, #ddc888 70%, #e8d4a0 100%)",
          borderRadius: "3px",
          boxShadow: "inset 0 0 20px rgba(160,100,20,0.2), 0 4px 20px rgba(0,0,0,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {glowing && (
          <motion.span
            animate={{ opacity: [0.6, 1, 0.7], scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ fontSize: "36px" }}
          >
            📜
          </motion.span>
        )}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "110%",
          height: 18,
          borderRadius: "9px",
          background: "linear-gradient(180deg, #c49840, #a07828, #c49840)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
        }}
      />
      {glowing && (
        <motion.div
          initial={{ x: "-100%", opacity: 0.6 }}
          animate={{ x: "200%", opacity: 0 }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 1, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: 8,
            bottom: 8,
            left: "5%",
            width: "30%",
            background: "linear-gradient(90deg, transparent, rgba(255,240,180,0.4), transparent)",
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
}
