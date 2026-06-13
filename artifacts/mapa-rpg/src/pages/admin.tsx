import { useState, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { MAP_MARKERS, CHAPTERS } from "@/data/chapters";
import { CHAPTER_ORDER } from "@/data/progression";
import { getQuiz, saveQuiz, loadQuizOverrides } from "@/data/quizStorage";
import type { Quiz } from "@/data/progression";

// ── Change this password to whatever you want ──
const ADMIN_PASSWORD = "nossa123";

// ─────────────────────────────────────────────
// Upload helpers (existing)
// ─────────────────────────────────────────────
interface UploadedFile {
  objectPath: string;
  name: string;
  type: "photo" | "video";
  preview?: string;
}
interface ChapterUploads { photos: UploadedFile[]; videos: UploadedFile[]; }
type AllUploads = Record<string, ChapterUploads>;
const UPLOADS_KEY = "nossa-historia-uploads";
function loadUploads(): AllUploads {
  try { const r = localStorage.getItem(UPLOADS_KEY); return r ? JSON.parse(r) : {}; } catch { return {}; }
}
function saveUploads(d: AllUploads) { localStorage.setItem(UPLOADS_KEY, JSON.stringify(d)); }
async function requestUploadUrl(file: File) {
  const res = await fetch("/api/storage/uploads/request-url", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type }) });
  if (!res.ok) throw new Error(`Failed: ${res.statusText}`);
  return res.json() as Promise<{ uploadURL: string; objectPath: string }>;
}
async function uploadToGCS(uploadURL: string, file: File) {
  const res = await fetch(uploadURL, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
  if (!res.ok) throw new Error(`Upload failed: ${res.statusText}`);
}

// ─────────────────────────────────────────────
// Password Gate
// ─────────────────────────────────────────────
function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (value === ADMIN_PASSWORD) { onUnlock(); }
    else { setError(true); setValue(""); setTimeout(() => setError(false), 1800); }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(180deg, #0a0602 0%, #110c06 100%)" }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-8 flex flex-col items-center gap-6"
        style={{
          background: "rgba(14,9,3,0.97)",
          border: "1px solid rgba(200,140,40,0.3)",
          boxShadow: "0 0 60px rgba(200,140,20,0.08)",
        }}
      >
        <div className="text-4xl" style={{ filter: "drop-shadow(0 0 12px rgba(200,140,20,0.5))" }}>⚙️</div>
        <div className="text-center">
          <h1 className="text-lg font-bold" style={{ color: "#e8c060", fontFamily: "Georgia, serif", letterSpacing: "0.1em" }}>
            Painel Admin
          </h1>
          <p className="text-xs mt-1" style={{ color: "rgba(180,140,60,0.5)", fontFamily: "Georgia, serif" }}>
            Nossa História
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
          <input
            type="password"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Senha de acesso"
            autoFocus
            className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
            style={{
              background: "rgba(10,6,2,0.8)",
              border: `1px solid ${error ? "rgba(220,60,60,0.6)" : "rgba(200,140,40,0.3)"}`,
              color: "#f0dfa0",
              fontFamily: "Georgia, serif",
              animation: error ? "shake 0.4s ease" : "none",
            }}
          />
          {error && (
            <p className="text-xs text-center" style={{ color: "rgba(240,100,100,0.8)", fontFamily: "Georgia, serif", animation: "fadeIn 0.2s ease" }}>
              Senha incorreta. Tente novamente.
            </p>
          )}
          <button
            type="submit"
            className="w-full py-3 rounded-xl text-sm font-medium transition-all hover:scale-[1.02]"
            style={{
              background: "linear-gradient(135deg, rgba(200,140,20,0.3), rgba(160,100,10,0.2))",
              border: "1px solid rgba(200,140,40,0.45)",
              color: "#e8c060",
              fontFamily: "Georgia, serif",
              letterSpacing: "0.06em",
              cursor: "pointer",
            }}
          >
            ✦ Entrar ✦
          </button>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Quiz Editor
// ─────────────────────────────────────────────
function QuizEditor({ chapterId }: { chapterId: string }) {
  const chapter = CHAPTERS[chapterId];
  const [quiz, setQuiz] = useState<Quiz>(() => getQuiz(chapterId));
  const [saved, setSaved] = useState(false);

  function updateQuestion(q: string) { setQuiz((p) => ({ ...p, question: q })); setSaved(false); }
  function updateOptionText(key: string, text: string) {
    setQuiz((p) => ({ ...p, options: p.options.map((o) => o.key === key ? { ...o, text } : o) })); setSaved(false);
  }
  function addOption() {
    const keys = ["A","B","C","D","E"];
    const usedKeys = quiz.options.map((o) => o.key);
    const nextKey = keys.find((k) => !usedKeys.includes(k));
    if (!nextKey) return;
    setQuiz((p) => ({ ...p, options: [...p.options, { key: nextKey, text: "" }] })); setSaved(false);
  }
  function removeOption(key: string) {
    if (quiz.options.length <= 2) return;
    setQuiz((p) => ({
      ...p,
      options: p.options.filter((o) => o.key !== key),
      correctKey: p.correctKey === key ? p.options.find((o) => o.key !== key)!.key : p.correctKey,
    })); setSaved(false);
  }
  function handleSave() {
    saveQuiz(chapterId, quiz);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const color = chapter?.color ?? "#e8c060";

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{chapter?.icon}</span>
        <div>
          <p className="text-xs" style={{ color, fontFamily: "Georgia, serif" }}>{chapter?.subtitle}</p>
          <h2 className="text-lg font-bold" style={{ color: "#f0dfa0", fontFamily: "Georgia, serif" }}>{chapter?.title}</h2>
        </div>
      </div>

      {/* Question */}
      <Field label="Pergunta">
        <textarea
          value={quiz.question}
          onChange={(e) => updateQuestion(e.target.value)}
          rows={3}
          className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none"
          style={{ background: "rgba(10,6,2,0.8)", border: `1px solid ${color}30`, color: "#f0dfa0", fontFamily: "Georgia, serif" }}
        />
      </Field>

      {/* Options */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs uppercase tracking-widest" style={{ color: "rgba(200,160,80,0.5)", fontFamily: "Georgia, serif" }}>Opções</label>
          {quiz.options.length < 5 && (
            <button onClick={addOption} className="text-xs px-3 py-1 rounded-full transition-all hover:opacity-80"
              style={{ background: `${color}20`, border: `1px solid ${color}40`, color: "#e8c060", fontFamily: "Georgia, serif", cursor: "pointer" }}>
              + Opção
            </button>
          )}
        </div>
        <div className="space-y-2">
          {quiz.options.map((opt) => (
            <div key={opt.key} className="flex items-center gap-3">
              {/* Correct radio */}
              <button
                onClick={() => { setQuiz((p) => ({ ...p, correctKey: opt.key })); setSaved(false); }}
                title="Marcar como correta"
                style={{
                  flexShrink: 0, width: 22, height: 22, borderRadius: "50%",
                  background: quiz.correctKey === opt.key ? `${color}` : "rgba(20,13,4,0.8)",
                  border: `2px solid ${color}70`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", transition: "all 0.2s",
                }}
              >
                {quiz.correctKey === opt.key && <span style={{ fontSize: 10, color: "#0a0602", fontWeight: "bold" }}>✓</span>}
              </button>
              {/* Key label */}
              <span style={{ fontFamily: "Georgia, serif", fontSize: 13, fontWeight: "bold", color: quiz.correctKey === opt.key ? color : "rgba(200,160,80,0.5)", minWidth: 20 }}>
                {opt.key})
              </span>
              {/* Text input */}
              <input
                value={opt.text}
                onChange={(e) => updateOptionText(opt.key, e.target.value)}
                placeholder={`Texto da opção ${opt.key}`}
                className="flex-1 rounded-lg px-3 py-2 text-sm outline-none"
                style={{ background: "rgba(10,6,2,0.8)", border: `1px solid ${quiz.correctKey === opt.key ? color + "50" : "rgba(200,140,40,0.15)"}`, color: "#f0dfa0", fontFamily: "Georgia, serif" }}
              />
              {/* Remove */}
              {quiz.options.length > 2 && (
                <button onClick={() => removeOption(opt.key)} style={{ color: "rgba(220,80,80,0.6)", cursor: "pointer", background: "none", border: "none", fontSize: 16, padding: "0 4px" }}>✕</button>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs mt-1.5" style={{ color: "rgba(160,120,50,0.5)", fontFamily: "Georgia, serif" }}>
          Clique no círculo para marcar a resposta correta.
        </p>
      </div>

      {/* Success message */}
      <Field label="Mensagem de Acerto">
        <input
          value={quiz.successMessage}
          onChange={(e) => { setQuiz((p) => ({ ...p, successMessage: e.target.value })); setSaved(false); }}
          className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
          style={{ background: "rgba(10,6,2,0.8)", border: "1px solid rgba(80,200,80,0.25)", color: "#a8e6a0", fontFamily: "Georgia, serif" }}
        />
      </Field>

      {/* Error message */}
      <Field label="Mensagem de Erro">
        <input
          value={quiz.errorMessage}
          onChange={(e) => { setQuiz((p) => ({ ...p, errorMessage: e.target.value })); setSaved(false); }}
          className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
          style={{ background: "rgba(10,6,2,0.8)", border: "1px solid rgba(220,80,80,0.25)", color: "rgba(240,160,160,0.9)", fontFamily: "Georgia, serif" }}
        />
      </Field>

      {/* Save */}
      <div className="flex items-center gap-3 pt-1">
        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-105"
          style={{
            background: saved ? "rgba(16,185,129,0.2)" : `linear-gradient(135deg, ${color}30, ${color}15)`,
            border: `1px solid ${saved ? "rgba(16,185,129,0.5)" : color + "55"}`,
            color: saved ? "rgba(52,211,153,0.9)" : "#e8c060",
            fontFamily: "Georgia, serif",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
        >
          {saved ? "✅ Salvo!" : "💾 Salvar Pergunta"}
        </button>
        {saved && (
          <p className="text-xs" style={{ color: "rgba(80,200,120,0.7)", fontFamily: "Georgia, serif", animation: "fadeIn 0.3s ease" }}>
            Pergunta atualizada com sucesso.
          </p>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs uppercase tracking-widest" style={{ color: "rgba(200,160,80,0.5)", fontFamily: "Georgia, serif" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Admin Page
// ─────────────────────────────────────────────
type Tab = "conteudo" | "perguntas";

export default function AdminPage() {
  const [, navigate] = useLocation();
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem("admin-unlocked") === "1");
  const [tab, setTab] = useState<Tab>("conteudo");
  const [selectedChapter, setSelectedChapter] = useState(MAP_MARKERS[0].id);

  // Upload state
  const [uploads, setUploads] = useState<AllUploads>(loadUploads);
  const [uploadState, setUploadState] = useState({ uploading: false, progress: 0, error: null as string | null });
  const [dragOver, setDragOver] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const chapter = CHAPTERS[selectedChapter];
  const chapterUploads = uploads[selectedChapter] ?? { photos: [], videos: [] };

  function handleUnlock() {
    sessionStorage.setItem("admin-unlocked", "1");
    setUnlocked(true);
  }

  const handleFiles = useCallback(async (files: FileList | File[], type: "photo" | "video") => {
    const fileArray = Array.from(files);
    if (!fileArray.length) return;
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
        const updated = { ...prev, [selectedChapter]: { photos: type === "photo" ? [...(prev[selectedChapter]?.photos ?? []), ...newFiles] : (prev[selectedChapter]?.photos ?? []), videos: type === "video" ? [...(prev[selectedChapter]?.videos ?? []), ...newFiles] : (prev[selectedChapter]?.videos ?? []) } };
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
    e.preventDefault(); setDragOver(false);
    const photos = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    const videos = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("video/"));
    if (photos.length) handleFiles(photos, "photo");
    if (videos.length) handleFiles(videos, "video");
  }, [handleFiles]);

  const removeFile = (type: "photo" | "video", idx: number) => {
    setUploads((prev) => {
      const cu = prev[selectedChapter];
      const updated = { ...prev, [selectedChapter]: { ...cu, [type === "photo" ? "photos" : "videos"]: (type === "photo" ? cu.photos : cu.videos).filter((_, i) => i !== idx) } };
      saveUploads(updated);
      return updated;
    });
  };

  if (!unlocked) return <PasswordGate onUnlock={handleUnlock} />;

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #0a0602 0%, #110c06 100%)" }}>

      {/* ── Top bar ── */}
      <div
        className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between"
        style={{ background: "rgba(10,6,2,0.97)", borderBottom: "1px solid rgba(200,140,40,0.2)", backdropFilter: "blur(12px)" }}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚙️</span>
            <div>
              <h1 className="text-base font-bold" style={{ color: "#e8c060", fontFamily: "Georgia, serif" }}>Painel Admin</h1>
              <p className="text-xs" style={{ color: "rgba(180,140,60,0.5)" }}>Nossa História</p>
            </div>
          </div>
          {/* Tabs */}
          <div className="flex gap-1 ml-4">
            {(["conteudo", "perguntas"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="px-4 py-1.5 rounded-full text-xs transition-all"
                style={{
                  background: tab === t ? "rgba(200,140,20,0.22)" : "transparent",
                  border: `1px solid ${tab === t ? "rgba(200,140,40,0.45)" : "transparent"}`,
                  color: tab === t ? "#e8c060" : "rgba(180,140,60,0.5)",
                  fontFamily: "Georgia, serif",
                  cursor: "pointer",
                }}
              >
                {t === "conteudo" ? "📁 Conteúdo" : "🗺️ Perguntas"}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={() => navigate("/map")}
          className="text-xs px-4 py-2 rounded-full transition-all hover:opacity-80"
          style={{ background: "rgba(200,130,20,0.2)", border: "1px solid rgba(200,140,40,0.4)", color: "#e8c060", fontFamily: "Georgia, serif", cursor: "pointer" }}
        >
          ← Ver Mapa
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex gap-6">

          {/* ── Sidebar ── */}
          <div className="w-56 flex-shrink-0">
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "rgba(200,160,80,0.5)", fontFamily: "Georgia, serif" }}>
              Capítulos
            </p>
            <div className="space-y-1">
              {MAP_MARKERS.map((marker, idx) => {
                const isActive = selectedChapter === marker.id;
                const overrides = loadQuizOverrides();
                const hasQuiz = tab === "perguntas" && !!overrides[marker.id];
                const uploads = tab === "conteudo" ? (loadUploads()[marker.id] ?? { photos: [], videos: [] }) : null;
                const fileCount = uploads ? uploads.photos.length + uploads.videos.length : 0;
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
                      <p className="text-xs font-medium truncate leading-tight" style={{ color: isActive ? "#f0dfa0" : "rgba(200,160,80,0.7)", fontFamily: "Georgia, serif" }}>
                        {idx + 1}. {marker.label}
                      </p>
                      {tab === "conteudo" && fileCount > 0 && (
                        <p className="text-xs" style={{ color: marker.color + "99" }}>{fileCount} arquivo{fileCount !== 1 ? "s" : ""}</p>
                      )}
                      {tab === "perguntas" && hasQuiz && (
                        <p className="text-xs" style={{ color: "rgba(80,200,120,0.7)" }}>✓ editada</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Main content ── */}
          <div className="flex-1 min-w-0">

            {/* ── PERGUNTAS TAB ── */}
            {tab === "perguntas" && (
              <QuizEditor key={selectedChapter} chapterId={selectedChapter} />
            )}

            {/* ── CONTEÚDO TAB ── */}
            {tab === "conteudo" && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{chapter.icon}</span>
                  <div>
                    <p className="text-xs" style={{ color: chapter.color, fontFamily: "Georgia, serif" }}>{chapter.subtitle}</p>
                    <h2 className="text-xl font-bold" style={{ color: "#f0dfa0", fontFamily: "Georgia, serif" }}>{chapter.title}</h2>
                  </div>
                </div>

                {/* Drag & drop */}
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  className="rounded-2xl transition-all duration-200"
                  style={{ border: `2px dashed ${dragOver ? chapter.color : chapter.color + "40"}`, background: dragOver ? `${chapter.color}10` : "rgba(15,10,3,0.6)", padding: "32px" }}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-3 opacity-60">📎</div>
                    <p className="text-sm font-medium mb-1" style={{ color: "rgba(220,180,80,0.9)", fontFamily: "Georgia, serif" }}>Arraste fotos e vídeos aqui</p>
                    <p className="text-xs mb-4" style={{ color: "rgba(180,140,60,0.5)" }}>ou escolha manualmente abaixo</p>
                    <div className="flex items-center justify-center gap-3">
                      <button onClick={() => photoInputRef.current?.click()} disabled={uploadState.uploading} className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm transition-all hover:scale-105 disabled:opacity-50" style={{ background: `${chapter.color}25`, border: `1px solid ${chapter.color}60`, color: "#e8c060", fontFamily: "Georgia, serif", cursor: "pointer" }}>📷 Fotos</button>
                      <button onClick={() => videoInputRef.current?.click()} disabled={uploadState.uploading} className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm transition-all hover:scale-105 disabled:opacity-50" style={{ background: "rgba(100,60,200,0.2)", border: "1px solid rgba(100,60,200,0.4)", color: "#e8c060", fontFamily: "Georgia, serif", cursor: "pointer" }}>🎬 Vídeos</button>
                    </div>
                  </div>
                  <input ref={photoInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && handleFiles(e.target.files, "photo")} />
                  <input ref={videoInputRef} type="file" accept="video/*" multiple className="hidden" onChange={(e) => e.target.files && handleFiles(e.target.files, "video")} />
                </div>

                {/* Upload status */}
                {uploadState.uploading && (
                  <div className="rounded-xl p-4" style={{ background: `${chapter.color}15`, border: `1px solid ${chapter.color}30` }}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="animate-spin text-base">⏳</div>
                      <p className="text-sm" style={{ color: "#e8c060", fontFamily: "Georgia, serif" }}>Enviando... {uploadState.progress}%</p>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: "rgba(200,140,40,0.15)" }}>
                      <div className="h-full rounded-full transition-all duration-300" style={{ width: `${uploadState.progress}%`, background: chapter.color }} />
                    </div>
                  </div>
                )}
                {uploadState.progress === 100 && !uploadState.uploading && (
                  <div className="rounded-xl p-3 flex items-center gap-2" style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)" }}>
                    <span>✅</span><p className="text-sm" style={{ color: "rgba(52,211,153,0.9)", fontFamily: "Georgia, serif" }}>Upload concluído!</p>
                  </div>
                )}
                {uploadState.error && (
                  <div className="rounded-xl p-3 flex items-center gap-2" style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)" }}>
                    <span>❌</span><p className="text-sm" style={{ color: "rgba(252,165,165,0.9)", fontFamily: "Georgia, serif" }}>{uploadState.error}</p>
                  </div>
                )}

                {/* Fotos */}
                {chapterUploads.photos.length > 0 && (
                  <section>
                    <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "rgba(200,160,80,0.5)", fontFamily: "Georgia, serif" }}>📷 Fotos ({chapterUploads.photos.length})</p>
                    <div className="grid grid-cols-3 gap-3">
                      {chapterUploads.photos.map((file, idx) => (
                        <div key={idx} className="relative group rounded-lg overflow-hidden aspect-video" style={{ border: "1px solid rgba(200,140,40,0.2)" }}>
                          <img src={file.preview ?? `/api/storage${file.objectPath}`} alt={file.name} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                            <p className="text-xs text-white text-center px-2 truncate w-full">{file.name}</p>
                            <button onClick={() => removeFile("photo", idx)} className="text-xs px-3 py-1 rounded-full" style={{ background: "rgba(239,68,68,0.8)", color: "white", cursor: "pointer" }}>Remover</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Vídeos */}
                {chapterUploads.videos.length > 0 && (
                  <section>
                    <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "rgba(200,160,80,0.5)", fontFamily: "Georgia, serif" }}>🎬 Vídeos ({chapterUploads.videos.length})</p>
                    <div className="grid grid-cols-2 gap-3">
                      {chapterUploads.videos.map((file, idx) => (
                        <div key={idx} className="relative group rounded-lg overflow-hidden" style={{ border: "1px solid rgba(200,140,40,0.2)" }}>
                          <video src={`/api/storage${file.objectPath}`} controls className="w-full aspect-video" />
                          <div className="flex items-center justify-between px-3 py-2" style={{ background: "rgba(10,6,2,0.8)" }}>
                            <p className="text-xs truncate flex-1 mr-2" style={{ color: "rgba(200,160,80,0.7)" }}>{file.name}</p>
                            <button onClick={() => removeFile("video", idx)} className="text-xs px-2 py-0.5 rounded" style={{ background: "rgba(239,68,68,0.7)", color: "white", cursor: "pointer" }}>✕</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {chapterUploads.photos.length === 0 && chapterUploads.videos.length === 0 && (
                  <div className="rounded-xl p-8 flex flex-col items-center gap-2" style={{ background: "rgba(15,10,3,0.4)", border: `1px dashed ${chapter.color}20` }}>
                    <span className="text-3xl opacity-20">🗂️</span>
                    <p className="text-sm text-center" style={{ color: "rgba(180,140,60,0.4)", fontFamily: "Georgia, serif" }}>Nenhum arquivo enviado ainda para este capítulo.</p>
                  </div>
                )}

                <div className="rounded-xl p-4" style={{ background: "rgba(200,140,40,0.06)", border: "1px solid rgba(200,140,40,0.15)" }}>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(200,160,80,0.6)", fontFamily: "Georgia, serif" }}>
                    💡 Os arquivos enviados ficam salvos no cloud. Para exibi-los nos capítulos, adicione os caminhos em <code className="text-xs px-1 rounded" style={{ background: "rgba(0,0,0,0.3)" }}>src/data/chapters.ts</code>.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
