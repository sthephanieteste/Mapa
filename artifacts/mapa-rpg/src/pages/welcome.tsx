import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Avatar from "@/components/Avatar";

export default function WelcomePage() {
  const [, navigate] = useLocation();
  const [phase, setPhase] = useState<"intro" | "chars" | "ready">("intro");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("chars"), 900);
    const t2 = setTimeout(() => setPhase("ready"), 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div
      className="relative w-screen h-screen overflow-hidden flex flex-col items-center justify-center"
      style={{ background: "#06030100" }}
    >
      {/* ── MAP BEHIND — blurred ── */}
      <img
        src={`${import.meta.env.BASE_URL}mapa-rpg-illustration.png`}
        alt=""
        className="absolute inset-0 w-full h-full object-cover select-none"
        draggable={false}
        style={{ filter: "brightness(0.28) saturate(0.7)", transform: "scale(1.04)" }}
      />

      {/* ── DARK VIGNETTE ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 50% 50%, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.82) 100%)",
        }}
      />

      {/* ── GOLDEN GROUND GLOW ── */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: "35%",
          background:
            "linear-gradient(0deg, rgba(180,110,10,0.22) 0%, transparent 100%)",
        }}
      />

      {/* ── CONTENT ── */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-6">

        {/* ── TOP ORNAMENT ── */}
        <div
          className="flex items-center gap-3"
          style={{
            opacity: phase !== "intro" ? 1 : 0,
            transform: phase !== "intro" ? "translateY(0)" : "translateY(-10px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
          }}
        >
          <div style={{ width: 60, height: 1, background: "linear-gradient(90deg, transparent, rgba(200,160,40,0.6))" }} />
          <span style={{ color: "rgba(200,160,40,0.7)", fontSize: 11, fontFamily: "Georgia, serif", letterSpacing: "0.22em" }}>
            UMA HISTÓRIA DE AMOR
          </span>
          <div style={{ width: 60, height: 1, background: "linear-gradient(90deg, rgba(200,160,40,0.6), transparent)" }} />
        </div>

        {/* ── TITLE ── */}
        <div className="text-center" style={{ lineHeight: 1 }}>
          <h1
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "clamp(42px, 7vw, 80px)",
              fontWeight: "bold",
              color: "#f8e8a0",
              letterSpacing: "0.12em",
              textShadow:
                "0 0 60px rgba(200,150,20,0.6), 0 0 20px rgba(200,150,20,0.3), 0 4px 20px rgba(0,0,0,0.8)",
              opacity: 1,
              transform: "translateY(0)",
              transition: "opacity 1s ease, transform 1s ease",
            }}
          >
            Nossa História
          </h1>
          <p
            style={{
              fontFamily: "Georgia, serif",
              color: "rgba(220,185,100,0.6)",
              fontSize: "clamp(12px, 1.6vw, 16px)",
              letterSpacing: "0.28em",
              marginTop: 10,
              opacity: phase !== "intro" ? 1 : 0,
              transform: phase !== "intro" ? "translateY(0)" : "translateY(6px)",
              transition: "opacity 1s ease 0.3s, transform 1s ease 0.3s",
            }}
          >
            UM MAPA DE MEMÓRIAS
          </p>
        </div>

        {/* ── CHARACTERS SIDE BY SIDE ── */}
        <div
          className="flex items-end justify-center"
          style={{
            gap: "clamp(8px, 2vw, 24px)",
            opacity: phase === "chars" || phase === "ready" ? 1 : 0,
            transform: phase === "chars" || phase === "ready" ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)",
            transition: "opacity 0.8s ease, transform 0.8s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        >
          {/* Char 1 */}
          <div className="flex flex-col items-center" style={{ gap: 6 }}>
            <div
              style={{
                borderRadius: "50%",
                padding: "3px",
                background: "linear-gradient(135deg, rgba(196,154,60,0.8), rgba(196,154,60,0.2))",
                boxShadow: "0 0 32px rgba(196,154,60,0.35), 0 8px 32px rgba(0,0,0,0.6)",
                animation: phase === "ready" ? "float 3.5s ease-in-out infinite" : "none",
              }}
            >
              <Avatar
                character={1}
                size={Math.min(window.innerWidth * 0.14, 120)}
                style={{ display: "block" }}
              />
            </div>
            <span
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "clamp(10px, 1.2vw, 13px)",
                color: "rgba(196,154,60,0.75)",
                letterSpacing: "0.12em",
                opacity: phase === "ready" ? 1 : 0,
                transition: "opacity 0.6s ease 0.5s",
              }}
            >
              mozinho
            </span>
          </div>

          {/* Heart between characters */}
          <div
            className="flex flex-col items-center justify-center"
            style={{
              paddingBottom: "clamp(10px, 2vw, 24px)",
              opacity: phase === "ready" ? 1 : 0,
              transform: phase === "ready" ? "scale(1)" : "scale(0.5)",
              transition: "opacity 0.5s ease 0.4s, transform 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.4s",
            }}
          >
            <span
              style={{
                fontSize: "clamp(24px, 3.5vw, 38px)",
                filter: "drop-shadow(0 0 12px rgba(230,60,60,0.7))",
                animation: "pulse-heart 1.8s ease-in-out infinite",
              }}
            >
              ❤️
            </span>
          </div>

          {/* Char 2 */}
          <div className="flex flex-col items-center" style={{ gap: 6 }}>
            <div
              style={{
                borderRadius: "50%",
                padding: "3px",
                background: "linear-gradient(135deg, rgba(232,64,64,0.8), rgba(232,64,64,0.2))",
                boxShadow: "0 0 32px rgba(232,64,64,0.3), 0 8px 32px rgba(0,0,0,0.6)",
                animation: phase === "ready" ? "float 3.5s ease-in-out infinite 0.4s" : "none",
              }}
            >
              <Avatar
                character={2}
                size={Math.min(window.innerWidth * 0.14, 120)}
                style={{ display: "block" }}
              />
            </div>
            <span
              style={{
                fontFamily: "Georgia, serif",
                fontSize: "clamp(10px, 1.2vw, 13px)",
                color: "rgba(232,64,64,0.75)",
                letterSpacing: "0.12em",
                opacity: phase === "ready" ? 1 : 0,
                transition: "opacity 0.6s ease 0.5s",
              }}
            >
              vidoca
            </span>
          </div>
        </div>

        {/* ── START BUTTON ── */}
        <div
          style={{
            opacity: phase === "ready" ? 1 : 0,
            transform: phase === "ready" ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s",
          }}
        >
          <button
            onClick={() => navigate("/map")}
            className="group relative overflow-hidden"
            style={{
              padding: "clamp(12px, 1.5vw, 16px) clamp(32px, 5vw, 64px)",
              borderRadius: "50px",
              background: "linear-gradient(135deg, rgba(180,110,10,0.25), rgba(140,80,5,0.15))",
              border: "1.5px solid rgba(200,150,30,0.6)",
              color: "#f0d878",
              fontFamily: "Georgia, serif",
              fontSize: "clamp(14px, 1.8vw, 18px)",
              letterSpacing: "0.2em",
              cursor: "pointer",
              boxShadow: "0 0 30px rgba(180,120,10,0.25), 0 8px 32px rgba(0,0,0,0.5)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "linear-gradient(135deg, rgba(200,140,20,0.4), rgba(160,100,10,0.25))";
              e.currentTarget.style.boxShadow = "0 0 50px rgba(200,150,20,0.5), 0 8px 40px rgba(0,0,0,0.6)";
              e.currentTarget.style.transform = "scale(1.04)";
              e.currentTarget.style.borderColor = "rgba(220,170,50,0.9)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "linear-gradient(135deg, rgba(180,110,10,0.25), rgba(140,80,5,0.15))";
              e.currentTarget.style.boxShadow = "0 0 30px rgba(180,120,10,0.25), 0 8px 32px rgba(0,0,0,0.5)";
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.borderColor = "rgba(200,150,30,0.6)";
            }}
          >
            {/* shimmer sweep */}
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100"
              style={{
                background: "linear-gradient(105deg, transparent 20%, rgba(255,220,80,0.08) 50%, transparent 80%)",
                transition: "opacity 0.4s",
              }}
            />
            <span className="relative">✦ &nbsp;Iniciar Aventura &nbsp;✦</span>
          </button>
        </div>

        {/* ── BOTTOM HINT ── */}
        <p
          style={{
            fontFamily: "Georgia, serif",
            color: "rgba(200,160,60,0.35)",
            fontSize: "clamp(9px, 1.1vw, 11px)",
            letterSpacing: "0.14em",
            opacity: phase === "ready" ? 1 : 0,
            transition: "opacity 0.8s ease 0.6s",
          }}
        >
          ✦ &nbsp; 7 locais para explorar &nbsp; · &nbsp; 6 conquistas &nbsp; · &nbsp; Nossa história &nbsp; ✦
        </p>
      </div>
    </div>
  );
}
