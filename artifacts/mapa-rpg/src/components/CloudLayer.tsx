import { useEffect, useRef, useState } from "react";
import { useProgress } from "@/hooks/useProgress";
import { CHAPTER_ORDER } from "@/data/progression";

interface CloudBlob {
  left: string;
  top: string;
  w: string;
  h: string;
  opacity: number;
}

interface CloudRegion {
  id: string;
  top: string;
  left: string;
  width: string;
  height: string;
  blobs: CloudBlob[];
}

const CLOUDS: CloudRegion[] = [
  {
    id: "a-viagem",
    top: "18%", left: "-3%", width: "26%", height: "40%",
    blobs: [
      { left: "5%",  top: "10%", w: "75%", h: "65%", opacity: 0.82 },
      { left: "25%", top: "30%", w: "65%", h: "60%", opacity: 0.72 },
      { left: "0%",  top: "42%", w: "60%", h: "52%", opacity: 0.68 },
      { left: "30%", top: "5%",  w: "55%", h: "50%", opacity: 0.60 },
      { left: "10%", top: "58%", w: "70%", h: "42%", opacity: 0.55 },
    ],
  },
  {
    id: "utfpr",
    top: "4%", left: "30%", width: "40%", height: "30%",
    blobs: [
      { left: "5%",  top: "15%", w: "70%", h: "72%", opacity: 0.80 },
      { left: "30%", top: "5%",  w: "65%", h: "65%", opacity: 0.75 },
      { left: "50%", top: "25%", w: "48%", h: "68%", opacity: 0.65 },
      { left: "15%", top: "40%", w: "60%", h: "55%", opacity: 0.58 },
      { left: "0%",  top: "8%",  w: "42%", h: "50%", opacity: 0.50 },
    ],
  },
  {
    id: "utfpr-guarapuava",
    top: "-2%", left: "68%", width: "36%", height: "28%",
    blobs: [
      { left: "5%",  top: "20%", w: "72%", h: "70%", opacity: 0.82 },
      { left: "28%", top: "8%",  w: "68%", h: "68%", opacity: 0.74 },
      { left: "50%", top: "28%", w: "50%", h: "65%", opacity: 0.62 },
      { left: "10%", top: "45%", w: "55%", h: "50%", opacity: 0.55 },
    ],
  },
  {
    id: "della-pazetti",
    top: "10%", left: "70%", width: "34%", height: "32%",
    blobs: [
      { left: "8%",  top: "12%", w: "70%", h: "70%", opacity: 0.80 },
      { left: "30%", top: "5%",  w: "65%", h: "62%", opacity: 0.72 },
      { left: "18%", top: "38%", w: "72%", h: "58%", opacity: 0.65 },
      { left: "50%", top: "20%", w: "48%", h: "65%", opacity: 0.55 },
    ],
  },
  {
    id: "cristo-cornelio",
    top: "44%", left: "8%", width: "46%", height: "38%",
    blobs: [
      { left: "5%",  top: "10%", w: "68%", h: "70%", opacity: 0.82 },
      { left: "30%", top: "5%",  w: "62%", h: "65%", opacity: 0.75 },
      { left: "55%", top: "20%", w: "44%", h: "72%", opacity: 0.65 },
      { left: "15%", top: "45%", w: "60%", h: "52%", opacity: 0.58 },
      { left: "0%",  top: "28%", w: "44%", h: "60%", opacity: 0.50 },
    ],
  },
  {
    id: "o-futuro",
    top: "58%", left: "58%", width: "46%", height: "46%",
    blobs: [
      { left: "5%",  top: "8%",  w: "68%", h: "68%", opacity: 0.84 },
      { left: "30%", top: "5%",  w: "65%", h: "62%", opacity: 0.76 },
      { left: "52%", top: "18%", w: "48%", h: "70%", opacity: 0.68 },
      { left: "12%", top: "42%", w: "62%", h: "56%", opacity: 0.60 },
      { left: "38%", top: "52%", w: "58%", h: "48%", opacity: 0.52 },
    ],
  },
];

type CloudState = "visible" | "dispersing" | "gone";

function CloudBlob({ blob, color }: { blob: CloudBlob; color: string }) {
  return (
    <div
      style={{
        position: "absolute",
        left: blob.left,
        top: blob.top,
        width: blob.w,
        height: blob.h,
        borderRadius: "50%",
        background: `radial-gradient(ellipse at 40% 40%, ${color} 0%, rgba(150,152,165,${blob.opacity * 0.45}) 45%, transparent 72%)`,
        filter: "blur(22px)",
        pointerEvents: "none",
      }}
    />
  );
}

function Cloud({ region }: { region: CloudRegion }) {
  const { isUnlocked } = useProgress();
  const [state, setState] = useState<CloudState>(() =>
    isUnlocked(region.id) ? "gone" : "visible"
  );
  const prevUnlocked = useRef(isUnlocked(region.id));

  useEffect(() => {
    const unlocked = isUnlocked(region.id);
    if (unlocked && !prevUnlocked.current) {
      prevUnlocked.current = true;
      setState("dispersing");
      setTimeout(() => setState("gone"), 1800);
    }
  }, [isUnlocked, region.id]);

  if (state === "gone") return null;

  const blobColor = `rgba(155,158,175,${state === "dispersing" ? 0.6 : 0.88})`;

  return (
    <div
      style={{
        position: "absolute",
        top: region.top,
        left: region.left,
        width: region.width,
        height: region.height,
        pointerEvents: "none",
        zIndex: 15,
        animation:
          state === "dispersing"
            ? "cloudDissipate 1.8s ease-out forwards"
            : "cloudDrift 8s ease-in-out infinite",
      }}
    >
      {/* Base fill for thick coverage */}
      <div
        style={{
          position: "absolute",
          inset: "8%",
          borderRadius: "45% 55% 48% 52% / 42% 48% 52% 45%",
          background: `rgba(148,150,168,${state === "dispersing" ? 0.45 : 0.72})`,
          filter: "blur(28px)",
        }}
      />
      {/* Organic puff blobs */}
      {region.blobs.map((blob, i) => (
        <CloudBlob key={i} blob={blob} color={blobColor} />
      ))}
      {/* Top highlight for volumetric feel */}
      <div
        style={{
          position: "absolute",
          top: "5%",
          left: "15%",
          width: "55%",
          height: "35%",
          borderRadius: "50%",
          background: `rgba(210,212,225,${state === "dispersing" ? 0.15 : 0.28})`,
          filter: "blur(16px)",
        }}
      />
    </div>
  );
}

export default function CloudLayer() {
  const { isUnlocked } = useProgress();

  const visibleClouds = CLOUDS.filter(
    (c) => CHAPTER_ORDER.includes(c.id)
  );

  return (
    <div className="absolute inset-0" style={{ pointerEvents: "none", zIndex: 15 }}>
      {visibleClouds.map((region) => (
        <Cloud key={region.id} region={region} />
      ))}
    </div>
  );
}
