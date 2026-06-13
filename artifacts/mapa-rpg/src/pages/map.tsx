import { MAP_MARKERS } from "@/data/chapters";
import MapMarkerComponent from "@/components/MapMarker";
import GameHUD from "@/components/GameHUD";
import CloudLayer from "@/components/CloudLayer";
import UnlockCelebration from "@/components/UnlockCelebration";

export default function MapPage() {
  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: "#0a0704" }}
    >
      {/* ── BACKGROUND MAP — UNTOUCHED ── */}
      <img
        src={`${import.meta.env.BASE_URL}mapa-rpg-illustration.png`}
        alt="Mapa RPG"
        className="w-full h-full object-cover select-none"
        draggable={false}
      />

      {/* ── CLOUD LAYER — locked regions covered with fog ── */}
      <CloudLayer />

      {/* ── MAP MARKERS — UNTOUCHED ── */}
      <div className="absolute inset-0">
        {MAP_MARKERS.map((marker) => (
          <MapMarkerComponent key={marker.id} marker={marker} />
        ))}
      </div>

      {/* ── UNLOCK CELEBRATION — particles + glow burst ── */}
      <UnlockCelebration />

      {/* ── GAME HUD — NEW LAYER ON TOP ── */}
      <GameHUD />

      {/* ── HINT LABEL ── */}
      <div
        className="absolute bottom-4 right-4 text-xs px-3 py-1.5 rounded-full select-none"
        style={{
          background: "rgba(10,5,2,0.82)",
          border: "1px solid rgba(200,140,40,0.35)",
          color: "rgba(210,170,80,0.8)",
          fontFamily: "Georgia, serif",
          backdropFilter: "blur(8px)",
          letterSpacing: "0.04em",
        }}
      >
        ✦ Clique nos locais para explorar ✦
      </div>
    </div>
  );
}
