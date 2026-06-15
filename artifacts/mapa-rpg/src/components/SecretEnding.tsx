import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MAP_MARKERS } from "@/data/chapters";
import { useProgress } from "@/hooks/useProgress";

export const ENDING_SHOWN_KEY = "nossa-historia-ending-shown";
export const ENDING_UNLOCKED_KEY = "nossa-historia-ending-unlocked";

export function openFinalScroll() {
  window.dispatchEvent(new CustomEvent("open-final-scroll"));
}

type Phase =
  | "idle"
  | "awakening"
  | "fragments"
  | "assembly"
  | "prompt"
  | "opening"
  | "reading";

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

interface FragmentData {
  id: string;
  icon: string;
  color: string;
  startX: number;
  startY: number;
}

export default function SecretEnding() {
  const { completedCount, totalCount, unlockEnding } = useProgress();
  const [phase, setPhase] = useState<Phase>("idle");
  const [fragments, setFragments] = useState<FragmentData[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const hasStarted = useRef(false);

  const allComplete = completedCount === totalCount && totalCount > 0;

  const buildFragments = useCallback(() => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    return MAP_MARKERS.map((m) => ({
      id: m.id,
      icon: m.icon,
      color: m.color,
      startX: (parseFloat(m.left) / 100) * window.innerWidth - cx,
      startY: (parseFloat(m.top) / 100) * window.innerHeight - cy,
    }));
  }, []);

  // Auto-trigger on first full completion
  useEffect(() => {
    if (!allComplete) return;
    if (hasStarted.current) return;
    try {
      if (localStorage.getItem(ENDING_SHOWN_KEY) === "true") return;
    } catch {}

    hasStarted.current = true;
    setFragments(buildFragments());

    const t = (ms: number, fn: () => void) => {
      const id = setTimeout(fn, ms);
      timers.current.push(id);
      return id;
    };

    try {
      localStorage.setItem(ENDING_SHOWN_KEY, "true");
    } catch {}

    setPhase("awakening");
    t(1600, () => setPhase("fragments"));
    t(1600 + 3400, () => setPhase("assembly"));
    t(1600 + 3400 + 2200, () => setPhase("prompt"));

    return () => timers.current.forEach(clearTimeout);
  }, [allComplete, buildFragments]);

  // Listen for "open from HUD" event
  useEffect(() => {
    const handler = () => {
      setFragments(buildFragments());
      setPhase("reading");
    };
    window.addEventListener("open-final-scroll", handler);
    return () => window.removeEventListener("open-final-scroll", handler);
  }, [buildFragments]);

  const handleOpenScroll = useCallback(() => {
    unlockEnding();
    setPhase("opening");
    const id = setTimeout(() => setPhase("reading"), 2200);
    timers.current.push(id);
  }, [unlockEnding]);

  const handleClose = useCallback(() => {
    setPhase("idle");
    hasStarted.current = false;
  }, []);

  if (phase === "idle") return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        pointerEvents: phase === "awakening" ? "none" : "all",
      }}
    >
      {/* ── Dim overlay ── */}
      <AnimatePresence>
        {(phase === "awakening" || phase === "fragments" || phase === "assembly" || phase === "prompt") && (
          <motion.div
            key="dim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(4,2,1,0.55)",
              pointerEvents: "none",
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Awakening: marker glows ── */}
      <AnimatePresence>
        {(phase === "awakening" || phase === "fragments") &&
          MAP_MARKERS.map((m, i) => (
            <motion.div
              key={`glow-${m.id}`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: [0, 1, 0.6, 1, 0.7], scale: [0.5, 1.8, 1.4, 1.9, 1.5] }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 1.4, delay: i * 0.12, ease: "easeOut" }}
              style={{
                position: "absolute",
                top: m.top,
                left: m.left,
                transform: "translate(-50%, -50%)",
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${m.color}90 0%, ${m.color}40 40%, transparent 70%)`,
                pointerEvents: "none",
              }}
            />
          ))}
      </AnimatePresence>

      {/* ── Fragment phase: parchment pieces fly to center ── */}
      <AnimatePresence>
        {(phase === "fragments" || phase === "assembly") &&
          fragments.map((frag, i) => (
            <motion.div
              key={`frag-${frag.id}`}
              initial={{
                x: frag.startX,
                y: frag.startY,
                rotate: (i % 2 === 0 ? 1 : -1) * (15 + i * 8),
                scale: 0,
                opacity: 0,
              }}
              animate={
                phase === "assembly"
                  ? { x: 0, y: 0, rotate: 0, scale: 0, opacity: 0 }
                  : {
                      x: [frag.startX, frag.startX * 0.4, 0],
                      y: [frag.startY, frag.startY * 0.4 - 30, 0],
                      rotate: [
                        (i % 2 === 0 ? 1 : -1) * (15 + i * 8),
                        (i % 2 === 0 ? -1 : 1) * 5,
                        0,
                      ],
                      scale: [0, 1.2, 1],
                      opacity: [0, 1, 1],
                    }
              }
              transition={
                phase === "assembly"
                  ? { duration: 0.6, delay: i * 0.06, ease: "easeIn" }
                  : {
                      duration: 1.6,
                      delay: i * 0.22,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }
              }
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                marginTop: -20,
                marginLeft: -18,
                width: 36,
                height: 28,
                borderRadius: "4px 8px 4px 8px",
                background: `linear-gradient(135deg, #e8d4a0, #d4b870, #c49840)`,
                border: `1px solid ${frag.color}80`,
                boxShadow: `0 0 10px ${frag.color}60, inset 0 0 6px rgba(0,0,0,0.15)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                filter: `drop-shadow(0 0 6px ${frag.color}80)`,
                pointerEvents: "none",
              }}
            >
              {frag.icon}
            </motion.div>
          ))}
      </AnimatePresence>

      {/* ── Assembly: scroll forms at center ── */}
      <AnimatePresence>
        {(phase === "assembly" || phase === "prompt") && (
          <motion.div
            key="scroll-form"
            initial={{ scale: 0, opacity: 0, rotate: -8 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 180,
              height: 220,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Scroll shape */}
            <ScrollShape glowing={phase === "prompt"} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Prompt: message + button ── */}
      <AnimatePresence>
        {phase === "prompt" && (
          <motion.div
            key="prompt"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
              width: "min(90vw, 380px)",
              marginTop: 140,
            }}
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 1 }}
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "clamp(13px, 2vw, 16px)",
                color: "rgba(240,215,150,0.95)",
                textAlign: "center",
                letterSpacing: "0.03em",
                lineHeight: 1.6,
                textShadow: "0 0 20px rgba(200,150,40,0.5)",
              }}
            >
              Você reuniu todos os capítulos da nossa história.
            </motion.p>
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.97 }}
              transition={{ delay: 1.1, duration: 0.5, type: "spring", stiffness: 260 }}
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

      {/* ── Opening: scroll unfurl animation ── */}
      <AnimatePresence>
        {phase === "opening" && (
          <>
            <motion.div
              key="blur-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                position: "fixed",
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
                position: "fixed",
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
          <>
            <motion.div
              key="reading-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(4,2,1,0.88)",
                backdropFilter: "blur(10px)",
              }}
            />
            <motion.div
              key="letter-parchment"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "min(92vw, 580px)",
                maxHeight: "86vh",
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
                  padding: "28px 32px 32px",
                  boxShadow: "inset 0 0 40px rgba(160,100,20,0.15), 0 8px 40px rgba(0,0,0,0.6)",
                  position: "relative",
                }}
              >
                {/* Aged paper texture overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage:
                      "radial-gradient(ellipse at 20% 30%, rgba(160,100,20,0.07) 0%, transparent 60%), radial-gradient(ellipse at 80% 70%, rgba(120,80,10,0.08) 0%, transparent 60%)",
                    pointerEvents: "none",
                  }}
                />

                {/* Title */}
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  style={{ textAlign: "center", marginBottom: "24px" }}
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
                  style={{ textAlign: "center", marginTop: "8px" }}
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

              {/* Close button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                onClick={handleClose}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  marginTop: "14px",
                  alignSelf: "center",
                  fontFamily: "Georgia, serif",
                  fontSize: "13px",
                  color: "rgba(210,175,100,0.75)",
                  background: "transparent",
                  border: "1px solid rgba(200,155,50,0.3)",
                  borderRadius: "30px",
                  padding: "8px 22px",
                  cursor: "pointer",
                  letterSpacing: "0.06em",
                }}
              >
                ✦ Fechar ✦
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function ScrollShape({ glowing }: { glowing: boolean }) {
  return (
    <div style={{ position: "relative", width: 180, height: 220 }}>
      {/* Glow backdrop */}
      {glowing && (
        <motion.div
          animate={{ opacity: [0.4, 0.9, 0.5], scale: [0.9, 1.15, 0.95] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            inset: -20,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, rgba(220,180,60,0.35) 0%, rgba(200,140,20,0.15) 50%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Scroll rod top */}
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

      {/* Scroll body */}
      <div
        style={{
          position: "absolute",
          top: 8,
          bottom: 8,
          left: "5%",
          right: "5%",
          background:
            "linear-gradient(180deg, #f0e2b8 0%, #e8d4a0 40%, #ddc888 70%, #e8d4a0 100%)",
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

      {/* Scroll rod bottom */}
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

      {/* Shine sweep */}
      {glowing && (
        <motion.div
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: 8,
            bottom: 8,
            left: "5%",
            width: "30%",
            background:
              "linear-gradient(90deg, transparent, rgba(255,240,180,0.4), transparent)",
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
}

function ScrollRod() {
  return (
    <div
      style={{
        height: 20,
        background: "linear-gradient(180deg, #d4a840 0%, #8a6020 50%, #c49840 100%)",
        borderRadius: "10px",
        boxShadow: "0 3px 12px rgba(0,0,0,0.5), inset 0 1px 3px rgba(255,220,100,0.3)",
        flexShrink: 0,
      }}
    />
  );
}
