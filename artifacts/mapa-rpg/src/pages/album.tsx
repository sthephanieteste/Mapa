import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { CHAPTERS } from "@/data/chapters";
import { CHAPTER_ORDER } from "@/data/progression";
import { useProgress } from "@/hooks/useProgress";
import { musicControls } from "@/hooks/useMusicPlayer";

interface MediaPhoto {
  type: "photo";
  id: string;
  src: string;
  caption: string;
  chapterId: string;
  chapterTitle: string;
  chapterIcon: string;
  globalPhotoIdx: number;
}

interface MediaVideo {
  type: "video";
  id: string;
  title: string;
  src: string;
  chapterId: string;
  chapterTitle: string;
  chapterIcon: string;
}

type MediaItem = MediaPhoto | MediaVideo;

// Collect all media in chronological chapter order
const ALL_MEDIA: MediaItem[] = [];
let photoIdx = 0;
for (const id of CHAPTER_ORDER) {
  const ch = CHAPTERS[id];
  if (!ch) continue;
  for (const p of ch.photos) {
    ALL_MEDIA.push({ type: "photo", ...p, chapterId: id, chapterTitle: ch.title, chapterIcon: ch.icon, globalPhotoIdx: photoIdx++ });
  }
  for (const v of ch.videos) {
    ALL_MEDIA.push({ type: "video", ...v, chapterId: id, chapterTitle: ch.title, chapterIcon: ch.icon });
  }
}

const ALL_PHOTOS = ALL_MEDIA.filter((m): m is MediaPhoto => m.type === "photo");
const ALL_VIDEOS = ALL_MEDIA.filter((m): m is MediaVideo => m.type === "video");

// Group media by chapter for display
const CHAPTERS_WITH_MEDIA = CHAPTER_ORDER
  .map((id) => ({
    id,
    ch: CHAPTERS[id],
    photos: ALL_MEDIA.filter((m): m is MediaPhoto => m.type === "photo" && m.chapterId === id),
    videos: ALL_MEDIA.filter((m): m is MediaVideo => m.type === "video" && m.chapterId === id),
  }))
  .filter(({ photos, videos }) => photos.length > 0 || videos.length > 0);

function Lightbox({
  photos,
  currentIdx,
  onClose,
  onPrev,
  onNext,
}: {
  photos: MediaPhoto[];
  currentIdx: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const photo = photos[currentIdx];

  useEffect(() => {
    if (!photo) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [photo, onClose, onPrev, onNext]);

  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(8px)", animation: "fadeIn 0.2s ease" }}
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 flex items-center justify-center rounded-full transition-all hover:scale-110"
        style={{ width: 40, height: 40, background: "rgba(30,15,5,0.8)", border: "1px solid rgba(200,140,40,0.35)", color: "#e8c060", fontSize: 18 }}
      >
        ×
      </button>

      {/* Counter */}
      <div
        className="absolute top-4 left-1/2 -translate-x-1/2 text-xs px-3 py-1 rounded-full"
        style={{ background: "rgba(10,6,2,0.85)", border: "1px solid rgba(200,140,40,0.25)", color: "rgba(200,160,80,0.8)", fontFamily: "Georgia, serif" }}
      >
        {currentIdx + 1} / {photos.length}
      </div>

      {/* Prev */}
      {currentIdx > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full transition-all hover:scale-110"
          style={{ width: 44, height: 44, background: "rgba(20,10,3,0.85)", border: "1px solid rgba(200,140,40,0.35)", color: "#e8c060", fontSize: 18 }}
        >
          ‹
        </button>
      )}

      {/* Next */}
      {currentIdx < photos.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full transition-all hover:scale-110"
          style={{ width: 44, height: 44, background: "rgba(20,10,3,0.85)", border: "1px solid rgba(200,140,40,0.35)", color: "#e8c060", fontSize: 18 }}
        >
          ›
        </button>
      )}

      {/* Image */}
      <div
        className="relative max-w-5xl w-full max-h-[85vh] mx-16 flex flex-col items-center gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={photo.src}
          alt={photo.caption}
          className="rounded-xl object-contain"
          style={{ maxHeight: "75vh", maxWidth: "100%", boxShadow: "0 0 60px rgba(0,0,0,0.8), 0 0 30px rgba(200,140,40,0.1)" }}
          draggable={false}
        />
        {photo.caption && (
          <div
            className="text-sm text-center px-4 py-1.5 rounded-full"
            style={{ color: "rgba(220,185,100,0.85)", fontFamily: "Georgia, serif", background: "rgba(10,6,2,0.7)", border: "1px solid rgba(200,140,40,0.2)" }}
          >
            {photo.chapterIcon} {photo.caption} · {photo.chapterTitle}
          </div>
        )}
      </div>
    </div>
  );
}

function AlbumVideo({ src, title }: { src: string; title: string }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(200,140,40,0.2)" }}>
      <video
        controls
        src={src}
        className="w-full aspect-video block"
        style={{ background: "#0a0704" }}
        onPlay={() => { musicControls.pauseForVideo(); }}
        onPause={() => musicControls.resumeFromVideo()}
        onEnded={() => musicControls.resumeFromVideo()}
      />
      <div className="px-3 py-2" style={{ background: "rgba(12,8,3,0.95)" }}>
        <p className="text-xs" style={{ color: "rgba(200,160,80,0.7)", fontFamily: "Georgia, serif" }}>{title}</p>
      </div>
    </div>
  );
}

function LockedAlbum() {
  const [, navigate] = useLocation();
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center"
      style={{ background: "linear-gradient(180deg, #0d0905 0%, #110c06 100%)" }}
    >
      <div style={{ fontSize: 64, filter: "drop-shadow(0 0 24px rgba(200,140,40,0.3))" }}>🔒</div>
      <h2 className="text-2xl font-bold" style={{ color: "#f0d888", fontFamily: "Georgia, serif", textShadow: "0 0 30px rgba(200,150,30,0.4)" }}>
        Álbum de Memórias
      </h2>
      <p className="text-sm max-w-xs leading-relaxed" style={{ color: "rgba(200,160,80,0.6)", fontFamily: "Georgia, serif" }}>
        Conclua todos os capítulos da aventura para desbloquear o álbum completo com todas as memórias reunidas.
      </p>
      <button
        onClick={() => navigate("/map")}
        className="px-6 py-2.5 rounded-full text-sm transition-all hover:scale-105"
        style={{ background: "rgba(200,130,20,0.2)", border: "1px solid rgba(200,140,40,0.4)", color: "#e8c060", fontFamily: "Georgia, serif" }}
      >
        ← Voltar ao Mapa
      </button>
    </div>
  );
}

export default function AlbumPage() {
  const [, navigate] = useLocation();
  const { completedChapters } = useProgress();
  const [lightboxPhotoIdx, setLightboxPhotoIdx] = useState<number | null>(null);

  const isUnlocked = completedChapters.length >= CHAPTER_ORDER.length;

  if (!isUnlocked) return <LockedAlbum />;

  function openPhoto(globalPhotoIdx: number) {
    setLightboxPhotoIdx(globalPhotoIdx);
  }

  function closeLightbox() {
    setLightboxPhotoIdx(null);
  }

  function prevPhoto() {
    setLightboxPhotoIdx((i) => (i !== null && i > 0 ? i - 1 : i));
  }

  function nextPhoto() {
    setLightboxPhotoIdx((i) => (i !== null && i < ALL_PHOTOS.length - 1 ? i + 1 : i));
  }

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #0d0905 0%, #110c06 100%)" }}>

      {/* Header */}
      <div
        className="sticky top-0 z-30 px-4 sm:px-6 py-3 flex items-center gap-4"
        style={{ background: "rgba(8,5,2,0.97)", borderBottom: "1px solid rgba(200,140,40,0.18)", backdropFilter: "blur(12px)" }}
      >
        <button
          onClick={() => navigate("/map")}
          className="flex items-center gap-1.5 text-sm transition-opacity hover:opacity-70 flex-shrink-0"
          style={{ color: "rgba(200,160,80,0.7)", fontFamily: "Georgia, serif" }}
        >
          <span>←</span>
          <span className="hidden sm:inline">Mapa</span>
        </button>

        <div className="flex-1 flex items-center justify-center gap-2">
          <span style={{ color: "rgba(200,140,40,0.5)", fontSize: 9 }}>✦</span>
          <h1 className="text-sm font-bold uppercase tracking-widest" style={{ color: "#f0d888", fontFamily: "Georgia, serif" }}>
            Álbum de Memórias
          </h1>
          <span style={{ color: "rgba(200,140,40,0.5)", fontSize: 9 }}>✦</span>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(200,140,20,0.12)", border: "1px solid rgba(200,140,40,0.22)", color: "rgba(200,160,60,0.8)", fontFamily: "Georgia, serif" }}>
            📷 {ALL_PHOTOS.length}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(200,140,20,0.12)", border: "1px solid rgba(200,140,40,0.22)", color: "rgba(200,160,60,0.8)", fontFamily: "Georgia, serif" }}>
            🎬 {ALL_VIDEOS.length}
          </span>
        </div>
      </div>

      {/* Hero banner */}
      <div
        className="relative py-10 px-6 text-center overflow-hidden"
        style={{ borderBottom: "1px solid rgba(200,140,40,0.12)" }}
      >
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, #c49a3c 0%, transparent 70%)" }} />
        <div className="relative z-10">
          <div style={{ fontSize: 40, marginBottom: 12, filter: "drop-shadow(0 0 20px rgba(200,140,40,0.4))" }}>📸</div>
          <h2 className="text-xl font-bold mb-2" style={{ color: "#f0d888", fontFamily: "Georgia, serif", textShadow: "0 0 30px rgba(200,150,30,0.35)" }}>
            Todas as Memórias
          </h2>
          <p className="text-xs" style={{ color: "rgba(200,160,80,0.5)", fontFamily: "Georgia, serif", letterSpacing: "0.12em" }}>
            {ALL_PHOTOS.length} fotos &nbsp;·&nbsp; {ALL_VIDEOS.length} vídeos &nbsp;·&nbsp; {CHAPTERS_WITH_MEDIA.length} capítulos
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-12">
        {CHAPTERS_WITH_MEDIA.map(({ id, ch, photos, videos }) => (
          <section key={id}>
            {/* Chapter divider */}
            <div className="flex items-center gap-3 mb-5">
              <div
                className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-base"
                style={{ background: `${ch.color}18`, border: `1px solid ${ch.color}40` }}
              >
                {ch.icon}
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-widest mb-0.5" style={{ color: `${ch.color}80`, fontFamily: "Georgia, serif" }}>
                  {ch.subtitle}
                </p>
                <h3 className="text-sm font-bold" style={{ color: "#e8c060", fontFamily: "Georgia, serif" }}>
                  {ch.title}
                </h3>
              </div>
              <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${ch.color}30, transparent)` }} />
            </div>

            {/* Photos grid */}
            {photos.length > 0 && (
              <div className="grid gap-3 mb-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}>
                {photos.map((photo) => (
                  <button
                    key={photo.id}
                    onClick={() => openPhoto(photo.globalPhotoIdx)}
                    className="relative group overflow-hidden rounded-xl block w-full aspect-square transition-all hover:scale-[1.02]"
                    style={{ border: "1px solid rgba(200,140,40,0.18)", boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}
                  >
                    <img
                      src={photo.src}
                      alt={photo.caption}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2"
                      style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.7) 0%, transparent 60%)" }}
                    >
                      <span className="text-xs" style={{ color: "rgba(220,185,100,0.9)", fontFamily: "Georgia, serif" }}>
                        {photo.caption}
                      </span>
                    </div>
                    <div
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs px-1.5 py-0.5 rounded"
                      style={{ background: "rgba(200,140,40,0.7)", color: "#fff" }}
                    >
                      ⤢
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Videos */}
            {videos.length > 0 && (
              <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
                {videos.map((video) => (
                  <AlbumVideo key={video.id} src={video.src} title={video.title} />
                ))}
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Footer */}
      <div
        className="py-8 text-center"
        style={{ borderTop: "1px solid rgba(200,140,40,0.1)" }}
      >
        <p className="text-xs" style={{ color: "rgba(200,160,60,0.3)", fontFamily: "Georgia, serif", letterSpacing: "0.12em" }}>
          ✦ &nbsp; Nossa História &nbsp; ✦
        </p>
      </div>

      {/* Lightbox */}
      {lightboxPhotoIdx !== null && (
        <Lightbox
          photos={ALL_PHOTOS}
          currentIdx={lightboxPhotoIdx}
          onClose={closeLightbox}
          onPrev={prevPhoto}
          onNext={nextPhoto}
        />
      )}
    </div>
  );
}
