import { MAP_MARKERS } from "@/data/chapters";
import MapMarkerComponent from "@/components/MapMarker";
import GameHUD from "@/components/GameHUD";
import CloudLayer from "@/components/CloudLayer";
import UnlockCelebration from "@/components/UnlockCelebration";
import SecretEnding from "@/components/SecretEnding";

export default function MapPage() {
  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: "#0a0704" }}
    >
      {/* ── BACKGROUND MAP — starts below the 48px HUD ── */}
      <img
        src={`${import.meta.env.BASE_URL}mapa-rpg-illustration.png`}
        alt="Mapa RPG"
        className="absolute left-0 right-0 bottom-0 w-full object-cover select-none"
        style={{ top: "48px", height: "calc(100% - 48px)" }}
        draggable={false}
      />

      {/* ── CLOUD LAYER ── */}
      <CloudLayer />

      {/* ── MAP MARKERS — same offset so percentages align with the map image ── */}
      <div className="absolute left-0 right-0 bottom-0" style={{ top: "48px" }}>
        {MAP_MARKERS.map((marker) => (
          <MapMarkerComponent key={marker.id} marker={marker} />
        ))}
      </div>

      {/* ── UNLOCK CELEBRATION ── */}
      <UnlockCelebration />

      {/* ── GAME HUD — solid 48px bar, gradient below is pointer-events:none ── */}
      <GameHUD />

      {/* ── SECRET ENDING ── */}
      <SecretEnding />

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
