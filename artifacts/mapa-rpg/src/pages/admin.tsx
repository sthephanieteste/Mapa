import { useState, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { MAP_MARKERS, CHAPTERS } from "@/data/chapters";

interface UploadedFile {
  objectPath: string;
  name: string;
  type: "photo" | "video";
  preview?: string;
}

interface ChapterUploads {
  photos: UploadedFile[];
  videos: UploadedFile[];
}

type AllUploads = Record<string, ChapterUploads>;

const STORAGE_KEY = "nossa-historia-uploads";

function loadUploads(): AllUploads {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveUploads(data: AllUploads) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

async function requestUploadUrl(file: File): Promise<{ uploadURL: string; objectPath: string }> {
  const res = await fetch("/api/storage/uploads/request-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type }),
  });
  if (!res.ok) throw new Error(`Failed to get upload URL: ${res.statusText}`);
  return res.json();
}

async function uploadToGCS(uploadURL: string, file: File): Promise<void> {
  const res = await fetch(uploadURL, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!res.ok) throw new Error(`Upload failed: ${res.statusText}`);
}

interface UploadState {
  uploading: boolean;
  progress: number;
  error: string | null;
}

export default function AdminPage() {
  const [, navigate] = useLocation();
  const [selectedChapter, setSelectedChapter] = useState(MAP_MARKERS[0].id);
  const [uploads, setUploads] = useState<AllUploads>(loadUploads);
  const [uploadState, setUploadState] = useState<UploadState>({ uploading: false, progress: 0, error: null });
  const [dragOver, setDragOver] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const chapter = CHAPTERS[selectedChapter];
  const chapterUploads = uploads[selectedChapter] ?? { photos: [], videos: [] };

  const handleFiles = useCallback(async (files: FileList | File[], type: "photo" | "video") => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    setUploadState({ uploading: true, progress: 0, error: null });

    try {
      const newFiles: UploadedFile[] = [];

      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        setUploadState({ uploading: true, progress: Math.round((i / fileArray.length) * 100), error: null });

        const { uploadURL, objectPath } = await requestUploadUrl(file);
        await uploadToGCS(uploadURL, file);

        const preview = type === "photo" ? URL.createObjectURL(file) : undefined;

        newFiles.push({ objectPath, name: file.name, type, preview });
      }

      setUploads((prev) => {
        const updated = {
          ...prev,
          [selectedChapter]: {
            photos: type === "photo"
              ? [...(prev[selectedChapter]?.photos ?? []), ...newFiles]
              : (prev[selectedChapter]?.photos ?? []),
            videos: type === "video"
              ? [...(prev[selectedChapter]?.videos ?? []), ...newFiles]
              : (prev[selectedChapter]?.videos ?? []),
          },
        };
        saveUploads(updated);
        return updated;
      });

      setUploadState({ uploading: false, progress: 100, error: null });

      setTimeout(() => setUploadState({ uploading: false, progress: 0, error: null }), 2000);
    } catch (err) {
      setUploadState({ uploading: false, progress: 0, error: (err as Error).message });
    }
  }, [selectedChapter]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    const photos = Array.from(files).filter((f) => f.type.startsWith("image/"));
    const videos = Array.from(files).filter((f) => f.type.startsWith("video/"));
    if (photos.length) handleFiles(photos, "photo");
    if (videos.length) handleFiles(videos, "video");
  }, [handleFiles]);

  const removeFile = (type: "photo" | "video", idx: number) => {
    setUploads((prev) => {
      const updated = {
        ...prev,
        [selectedChapter]: {
          ...prev[selectedChapter],
          [type === "photo" ? "photos" : "videos"]: (
            type === "photo" ? chapterUploads.photos : chapterUploads.videos
          ).filter((_, i) => i !== idx),
        },
      };
      saveUploads(updated);
      return updated;
    });
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(180deg, #0a0602 0%, #110c06 100%)" }}
    >
      <div
        className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between"
        style={{
          background: "rgba(10,6,2,0.95)",
          borderBottom: "1px solid rgba(200,140,40,0.2)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">⚙️</span>
          <div>
            <h1 className="text-base font-bold" style={{ color: "#e8c060", fontFamily: "Georgia, serif" }}>
              Painel de Conteúdo
            </h1>
            <p className="text-xs" style={{ color: "rgba(180,140,60,0.6)" }}>Gerencie fotos e vídeos de cada capítulo</p>
          </div>
        </div>
        <button
          onClick={() => navigate("/")}
          className="text-xs px-4 py-2 rounded-full transition-all hover:opacity-80"
          style={{
            background: "rgba(200,130,20,0.2)",
            border: "1px solid rgba(200,140,40,0.4)",
            color: "#e8c060",
            fontFamily: "Georgia, serif",
          }}
        >
          ← Ver Mapa
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex gap-6">

          {/* ── SIDEBAR DE CAPÍTULOS ── */}
          <div className="w-56 flex-shrink-0">
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "rgba(200,160,80,0.5)", fontFamily: "Georgia, serif" }}>
              Capítulos
            </p>
            <div className="space-y-1">
              {MAP_MARKERS.map((marker) => {
                const chUploads = uploads[marker.id];
                const count = (chUploads?.photos.length ?? 0) + (chUploads?.videos.length ?? 0);
                const isActive = selectedChapter === marker.id;
                return (
                  <button
                    key={marker.id}
                    onClick={() => setSelectedChapter(marker.id)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all"
                    style={{
                      background: isActive ? `${marker.color}20` : "transparent",
                      border: `1px solid ${isActive ? marker.color + "50" : "transparent"}`,
                    }}
                  >
                    <span className="text-base">{marker.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-xs font-medium truncate leading-tight"
                        style={{ color: isActive ? "#f0dfa0" : "rgba(200,160,80,0.7)", fontFamily: "Georgia, serif" }}
                      >
                        {marker.label}
                      </p>
                      {count > 0 && (
                        <p className="text-xs" style={{ color: marker.color + "99" }}>{count} arquivo{count !== 1 ? "s" : ""}</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── CONTEÚDO PRINCIPAL ── */}
          <div className="flex-1 min-w-0 space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{chapter.icon}</span>
              <div>
                <p className="text-xs" style={{ color: chapter.color, fontFamily: "Georgia, serif" }}>{chapter.subtitle}</p>
                <h2 className="text-xl font-bold" style={{ color: "#f0dfa0", fontFamily: "Georgia, serif" }}>{chapter.title}</h2>
              </div>
            </div>

            {/* ── ÁREA DE DRAG & DROP ── */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              className="rounded-2xl transition-all duration-200"
              style={{
                border: `2px dashed ${dragOver ? chapter.color : chapter.color + "40"}`,
                background: dragOver ? `${chapter.color}10` : "rgba(15,10,3,0.6)",
                padding: "32px",
              }}
            >
              <div className="text-center">
                <div className="text-4xl mb-3 opacity-60">📎</div>
                <p className="text-sm font-medium mb-1" style={{ color: "rgba(220,180,80,0.9)", fontFamily: "Georgia, serif" }}>
                  Arraste fotos e vídeos aqui
                </p>
                <p className="text-xs mb-4" style={{ color: "rgba(180,140,60,0.5)" }}>ou escolha manualmente abaixo</p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => photoInputRef.current?.click()}
                    disabled={uploadState.uploading}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all hover:scale-105 disabled:opacity-50"
                    style={{
                      background: `${chapter.color}25`,
                      border: `1px solid ${chapter.color}60`,
                      color: "#e8c060",
                      fontFamily: "Georgia, serif",
                    }}
                  >
                    📷 Adicionar Fotos
                  </button>
                  <button
                    onClick={() => videoInputRef.current?.click()}
                    disabled={uploadState.uploading}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all hover:scale-105 disabled:opacity-50"
                    style={{
                      background: "rgba(100,60,200,0.2)",
                      border: "1px solid rgba(100,60,200,0.4)",
                      color: "#e8c060",
                      fontFamily: "Georgia, serif",
                    }}
                  >
                    🎬 Adicionar Vídeos
                  </button>
                </div>
              </div>

              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => e.target.files && handleFiles(e.target.files, "photo")}
              />
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                multiple
                className="hidden"
                onChange={(e) => e.target.files && handleFiles(e.target.files, "video")}
              />
            </div>

            {/* ── PROGRESSO / ERRO ── */}
            {uploadState.uploading && (
              <div
                className="rounded-xl p-4"
                style={{ background: `${chapter.color}15`, border: `1px solid ${chapter.color}30` }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="animate-spin text-base">⏳</div>
                  <p className="text-sm" style={{ color: "#e8c060", fontFamily: "Georgia, serif" }}>
                    Enviando arquivos... {uploadState.progress}%
                  </p>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: "rgba(200,140,40,0.15)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${uploadState.progress}%`, background: chapter.color }}
                  />
                </div>
              </div>
            )}
            {uploadState.progress === 100 && !uploadState.uploading && (
              <div
                className="rounded-xl p-3 flex items-center gap-2"
                style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)" }}
              >
                <span>✅</span>
                <p className="text-sm" style={{ color: "rgba(52,211,153,0.9)", fontFamily: "Georgia, serif" }}>Upload concluído com sucesso!</p>
              </div>
            )}
            {uploadState.error && (
              <div
                className="rounded-xl p-3 flex items-center gap-2"
                style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)" }}
              >
                <span>❌</span>
                <p className="text-sm" style={{ color: "rgba(252,165,165,0.9)", fontFamily: "Georgia, serif" }}>{uploadState.error}</p>
              </div>
            )}

            {/* ── FOTOS ENVIADAS ── */}
            {chapterUploads.photos.length > 0 && (
              <section>
                <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "rgba(200,160,80,0.5)", fontFamily: "Georgia, serif" }}>
                  📷 Fotos ({chapterUploads.photos.length})
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {chapterUploads.photos.map((file, idx) => (
                    <div
                      key={idx}
                      className="relative group rounded-lg overflow-hidden aspect-video"
                      style={{ border: "1px solid rgba(200,140,40,0.2)" }}
                    >
                      {file.preview ? (
                        <img src={file.preview} alt={file.name} className="w-full h-full object-cover" />
                      ) : (
                        <img
                          src={`/api/storage${file.objectPath}`}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                        <p className="text-xs text-white text-center px-2 truncate w-full">{file.name}</p>
                        <button
                          onClick={() => removeFile("photo", idx)}
                          className="text-xs px-3 py-1 rounded-full"
                          style={{ background: "rgba(239,68,68,0.8)", color: "white" }}
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ── VÍDEOS ENVIADOS ── */}
            {chapterUploads.videos.length > 0 && (
              <section>
                <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "rgba(200,160,80,0.5)", fontFamily: "Georgia, serif" }}>
                  🎬 Vídeos ({chapterUploads.videos.length})
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {chapterUploads.videos.map((file, idx) => (
                    <div
                      key={idx}
                      className="relative group rounded-lg overflow-hidden"
                      style={{ border: "1px solid rgba(200,140,40,0.2)" }}
                    >
                      <video
                        src={`/api/storage${file.objectPath}`}
                        controls
                        className="w-full aspect-video"
                      />
                      <div className="flex items-center justify-between px-3 py-2" style={{ background: "rgba(10,6,2,0.8)" }}>
                        <p className="text-xs truncate flex-1 mr-2" style={{ color: "rgba(200,160,80,0.7)" }}>{file.name}</p>
                        <button
                          onClick={() => removeFile("video", idx)}
                          className="text-xs px-2 py-0.5 rounded"
                          style={{ background: "rgba(239,68,68,0.7)", color: "white" }}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {chapterUploads.photos.length === 0 && chapterUploads.videos.length === 0 && (
              <div
                className="rounded-xl p-8 flex flex-col items-center gap-2"
                style={{ background: "rgba(15,10,3,0.4)", border: `1px dashed ${chapter.color}20` }}
              >
                <span className="text-3xl opacity-20">🗂️</span>
                <p className="text-sm text-center" style={{ color: "rgba(180,140,60,0.4)", fontFamily: "Georgia, serif" }}>
                  Nenhum arquivo enviado ainda para este capítulo.
                </p>
              </div>
            )}

            {/* ── AVISO SOBRE INTEGRAÇÃO ── */}
            <div
              className="rounded-xl p-4"
              style={{
                background: "rgba(200,140,40,0.06)",
                border: "1px solid rgba(200,140,40,0.15)",
              }}
            >
              <p className="text-xs leading-relaxed" style={{ color: "rgba(200,160,80,0.6)", fontFamily: "Georgia, serif" }}>
                💡 Os arquivos enviados ficam salvos no cloud. Para exibi-los automaticamente nos capítulos,
                os caminhos <code className="text-xs px-1 py-0.5 rounded" style={{ background: "rgba(0,0,0,0.3)" }}>objectPath</code> precisam
                ser adicionados ao arquivo <code className="text-xs px-1 py-0.5 rounded" style={{ background: "rgba(0,0,0,0.3)" }}>src/data/chapters.ts</code>.
                Em breve isso será automático.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
