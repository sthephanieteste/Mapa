import { useEffect, useState } from "react";
import { MAP_MARKERS } from "@/data/chapters";
import MapMarkerComponent from "@/components/MapMarker";
import GameHUD from "@/components/GameHUD";
import CloudLayer from "@/components/CloudLayer";
import UnlockCelebration from "@/components/UnlockCelebration";
import SecretEnding from "@/components/SecretEnding";

const WORLD_W = 1600;
const WORLD_H = 900;

function getFit() {
  const cw = window.innerWidth;
  const ch = Math.max(1, window.innerHeight - 48);
  const zoom = Math.min(cw / WORLD_W, ch / WORLD_H);
  return {
    zoom,
    x: (cw - WORLD_W * zoom) / 2,
    y: (ch - WORLD_H * zoom) / 2,
  };
}

export default function MapPage() {
  const [fit, setFit] = useState(getFit);

  useEffect(() => {
    const onResize = () => setFit(getFit());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: "#0a0704" }}
    >
      {/* ── MAP AREA (below 48px HUD) ── */}
      <div
        className="absolute left-0 right-0 bottom-0"
        style={{ top: "48px", overflow: "hidden", background: "#0a0704" }}
      >
        {/* ── WORLD: fixed 1600×900, scaled to fit any screen ── */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${WORLD_W}px`,
            height: `${WORLD_H}px`,
            transform: `translate(${fit.x}px, ${fit.y}px) scale(${fit.zoom})`,
            transformOrigin: "0 0",
          }}
        >
          <img
            src={`${import.meta.env.BASE_URL}mapa-rpg-illustration.png`}
            alt="Mapa RPG"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              display: "block",
              userSelect: "none",
              pointerEvents: "none",
            }}
            draggable={false}
          />

          <CloudLayer />

          <div style={{ position: "absolute", inset: 0 }}>
            {MAP_MARKERS.map((marker) => (
              <MapMarkerComponent key={marker.id} marker={marker} />
            ))}
          </div>
        </div>
      </div>

      <UnlockCelebration />
      <GameHUD />
      <SecretEnding />

      <div
        className="absolute bottom-4 right-4 text-xs px-3 py-1.5 rounded-full select-none"
        style={{
          background: "rgba(10,5,2,0.82)",
          border: "1px solid rgba(200,140,40,0.35)",
          color: "rgba(210,170,80,0.8)",
          fontFamily: "Georgia, serif",
          backdropFilter: "blur(8px)",
          letterSpacing: "0.04em",
          zIndex: 40,
        }}
      >
        ✦ Clique nos locais para explorar ✦
      </div>
    </div>
  );
}
