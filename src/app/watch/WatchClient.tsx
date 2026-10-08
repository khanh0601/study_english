"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Play,
  Clock,
  Sparkles,
  Link as LinkIcon,
  Loader2,
  AlertCircle,
  Tv,
  ShieldCheck,
  Trash2,
  Edit3,
  X,
  Plus,
} from "lucide-react";
import { VideoLesson } from "@/server/db/video-seeds";
import { SessionUser } from "@/server/auth/session";
import { useLanguage } from "@/i18n/LanguageContext";

interface WatchClientProps {
  initialVideos: VideoLesson[];
  currentUser?: SessionUser;
}

export function WatchClient({ initialVideos, currentUser }: WatchClientProps) {
  const router = useRouter();
  const { t } = useLanguage();

  const isAdmin =
    currentUser?.role === "admin" ||
    currentUser?.email === "kelvin@studyenglish.local";

  const [videos, setVideos] = useState<VideoLesson[]>(initialVideos);
  const [selectedTopic, setSelectedTopic] = useState<string>("All");

  // Admin Import Form State
  const [urlInput, setUrlInput] = useState("");
  const [customTitle, setCustomTitle] = useState("");
  const [importTopic, setImportTopic] = useState<VideoLesson["topic"]>("Daily Conversations");
  const [importLevel, setImportLevel] = useState<VideoLesson["level"]>("B1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Admin Edit Modal State
  const [editingVideo, setEditingVideo] = useState<VideoLesson | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editTopic, setEditTopic] = useState<VideoLesson["topic"]>("Daily Conversations");
  const [editLevel, setEditLevel] = useState<VideoLesson["level"]>("B1");
  const [editLoading, setEditLoading] = useState(false);

  const topics: Array<VideoLesson["topic"] | "All"> = [
    "All",
    "Daily Conversations",
    "Tech & Developer",
    "Job Interview",
    "Business & Work",
    "Inspirational",
  ];

  const filteredVideos =
    selectedTopic === "All"
      ? videos
      : videos.filter((v) => v.topic === selectedTopic);

  // 1. Admin Import New Video
  async function handleImportUrl(e: React.FormEvent) {
    e.preventDefault();
    if (!urlInput.trim() || loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/videos/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: urlInput.trim(),
          title: customTitle.trim() || undefined,
          topic: importTopic,
          level: importLevel,
        }),
      });

      const data = await res.json();
      if (res.ok && data.video) {
        setVideos((prev) => [data.video, ...prev]);
        setUrlInput("");
        setCustomTitle("");
        router.push(`/watch/${data.video.slug}`);
      } else {
        setError(
          data.error ||
            "Không thể trích xuất phụ đề tiếng Anh từ video này. Vui lòng kiểm tra video có phụ đề trên YouTube."
        );
      }
    } catch {
      setError("Lỗi kết nối máy chủ. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  // 2. Admin Delete Video
  async function handleDeleteVideo(video: VideoLesson) {
    const confirmed = window.confirm(
      `Xác nhận xóa video "${video.title}" khỏi thư viện hệ thống?`
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/videos/${video.id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        setVideos((prev) => prev.filter((v) => v.id !== video.id));
      } else {
        alert(data.error || "Không thể xóa video.");
      }
    } catch {
      alert("Lỗi kết nối khi xóa video.");
    }
  }

  // 3. Admin Edit Modal Trigger
  function openEditModal(video: VideoLesson) {
    setEditingVideo(video);
    setEditTitle(video.title);
    setEditTopic(video.topic);
    setEditLevel(video.level);
  }

  // 4. Admin Save Video Edit
  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingVideo) return;

    setEditLoading(true);
    try {
      const res = await fetch(`/api/videos/${editingVideo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle.trim() || editingVideo.title,
          topic: editTopic,
          level: editLevel,
        }),
      });

      const data = await res.json();
      if (res.ok && data.video) {
        setVideos((prev) =>
          prev.map((v) => (v.id === editingVideo.id ? data.video : v))
        );
        setEditingVideo(null);
      } else {
        alert(data.error || "Không thể lưu cập nhật.");
      }
    } catch {
      alert("Lỗi mạng khi lưu chỉnh sửa.");
    } finally {
      setEditLoading(false);
    }
  }

  function formatDuration(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="space-y-1.5 border-b border-[var(--border)] pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[8px] bg-[var(--surface-hover)] border border-[var(--border)] flex items-center justify-center text-[var(--foreground)]">
              <Tv size={18} />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--foreground)]">
              {t("watchTitle")}
            </h1>
          </div>
          <p className="text-sm text-[var(--muted)] leading-relaxed max-w-3xl mt-1">
            {t("watchSubtitle")}
          </p>
        </div>

        {/* Admin Status Pill */}
        {isAdmin && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-[10px] border border-[var(--border)] bg-[var(--surface-raised)] text-xs font-mono font-medium self-start md:self-auto">
            <ShieldCheck size={14} className="text-[var(--foreground)]" />
            <span className="font-bold text-[var(--foreground)]">ADMIN ACCESS</span>
            <span className="text-[var(--muted)]">• Quản trị Video</span>
          </div>
        )}
      </div>

      {/* ADMIN ONLY: YouTube Video Importer & Subtitle Generator */}
      {isAdmin && (
        <div className="bg-[var(--surface-raised)] border border-[var(--border)] rounded-[14px] p-6 space-y-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-[var(--foreground)]" />
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--foreground)] font-bold">
                Bảng Thêm Video YouTube (Chỉ dành cho Admin)
              </span>
            </div>
            <span className="text-[11px] font-mono text-[var(--muted)] hidden sm:inline">
              Tự động bóc tách phụ đề + Gemini dịch tiếng Việt
            </span>
          </div>

          <form onSubmit={handleImportUrl} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* URL Input */}
              <div className="md:col-span-6">
                <label className="block text-xs font-mono text-[var(--muted)] mb-1 font-semibold">
                  URL Video YouTube:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    disabled={loading}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full h-[42px] px-3.5 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--border-strong)] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Optional Custom Title */}
              <div className="md:col-span-6">
                <label className="block text-xs font-mono text-[var(--muted)] mb-1 font-semibold">
                  Tiêu đề tùy chỉnh (Tùy chọn):
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  disabled={loading}
                  placeholder="Để trống để tự động lấy tiêu đề video"
                  className="w-full h-[42px] px-3.5 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--border-strong)] focus:outline-none transition-colors"
                />
              </div>

              {/* Topic Selector */}
              <div className="md:col-span-6">
                <label className="block text-xs font-mono text-[var(--muted)] mb-1 font-semibold">
                  Chủ đề (Topic):
                </label>
                <select
                  value={importTopic}
                  onChange={(e) => setImportTopic(e.target.value as VideoLesson["topic"])}
                  disabled={loading}
                  className="w-full h-[42px] px-3 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--foreground)] focus:outline-none cursor-pointer"
                >
                  <option value="Daily Conversations">Daily Conversations (Giao tiếp hàng ngày)</option>
                  <option value="Tech & Developer">Tech & Developer (Công nghệ & Lập trình)</option>
                  <option value="Job Interview">Job Interview (Phỏng vấn xin việc)</option>
                  <option value="Business & Work">Business & Work (Công sở & Doanh nghiệp)</option>
                  <option value="Inspirational">Inspirational (Truyền cảm hứng & Diễn thuyết)</option>
                </select>
              </div>

              {/* Level Selector */}
              <div className="md:col-span-3">
                <label className="block text-xs font-mono text-[var(--muted)] mb-1 font-semibold">
                  Độ khó (Level CEFR):
                </label>
                <select
                  value={importLevel}
                  onChange={(e) => setImportLevel(e.target.value as VideoLesson["level"])}
                  disabled={loading}
                  className="w-full h-[42px] px-3 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--foreground)] focus:outline-none cursor-pointer"
                >
                  <option value="A2">A2 — Cơ bản (Pre-intermediate)</option>
                  <option value="B1">B1 — Trung cấp (Intermediate)</option>
                  <option value="B2">B2 — Nâng cao (Upper-intermediate)</option>
                </select>
              </div>

              {/* Submit Button */}
              <div className="md:col-span-3 flex items-end">
                <button
                  type="submit"
                  disabled={!urlInput.trim() || loading}
                  className="w-full h-[42px] rounded-[10px] bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#262626] transition-colors disabled:opacity-50 cursor-pointer shadow-xs whitespace-nowrap"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Đang nạp & Dịch AI...</span>
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      <span>Thêm Video & Dịch</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {error && (
            <div className="p-3.5 rounded-[10px] bg-[var(--status-error-bg)]/25 border border-[var(--status-error-border)] flex items-center gap-2 text-xs text-[var(--status-error-fg)]">
              <AlertCircle size={15} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      )}

      {/* Topic Filter Tabs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono uppercase tracking-wider text-[var(--muted)] font-semibold">
            {t("curatedVideos")}
          </h2>
          <span className="text-xs font-mono text-[var(--muted)]">
            {filteredVideos.length} {filteredVideos.length === 1 ? "video" : "videos"} available
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {topics.map((top) => (
            <button
              key={top}
              type="button"
              onClick={() => setSelectedTopic(top)}
              className={`px-3.5 py-1.5 rounded-[8px] text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedTopic === top
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-xs"
                  : "bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--muted-subtle)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
              }`}
            >
              {top === "All" ? "Tất cả (All)" : top}
            </button>
          ))}
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => {
            const thumb =
              video.thumbnailUrl ||
              `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;

            return (
              <div
                key={video.id}
                className="group bg-[var(--surface-raised)] border border-[var(--border)] rounded-[14px] overflow-hidden flex flex-col justify-between hover:border-[var(--border-strong)] transition-all shadow-xs"
              >
                {/* Thumbnail Header */}
                <div className="relative aspect-video w-full bg-[var(--surface)] overflow-hidden">
                  <img
                    src={thumb}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[var(--foreground)]/90 text-[var(--background)] flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                      <Play size={20} className="ml-0.5 fill-current" />
                    </div>
                  </div>

                  {/* Badges on Thumbnail */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-[4px] bg-black/75 backdrop-blur-xs text-[10px] font-mono font-semibold text-white">
                      CEFR {video.level}
                    </span>
                    {video.isCustom && (
                      <span className="px-2 py-0.5 rounded-[4px] bg-[var(--primary)] text-[10px] font-mono font-semibold text-white">
                        Admin Added
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-[4px] bg-black/80 backdrop-blur-xs text-[11px] font-mono font-medium text-white flex items-center gap-1">
                    <Clock size={11} />
                    <span>{formatDuration(video.durationSeconds)}</span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[var(--muted)]">
                      <span>{video.topic}</span>
                      <span>
                        {video.sentences.length} {t("sentencesCount")}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-[var(--foreground)] leading-snug line-clamp-2 group-hover:text-[var(--primary)] transition-colors">
                      {video.title}
                    </h3>

                    <p className="text-xs text-[var(--muted)] line-clamp-2 leading-relaxed">
                      {video.description}
                    </p>
                  </div>

                  {/* Action Link & Admin Controls */}
                  <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between gap-2">
                    <span className="text-xs font-mono text-[var(--muted-subtle)] truncate">
                      {video.channelTitle || "YouTube"}
                    </span>

                    <div className="flex items-center gap-2">
                      {isAdmin && (
                        <>
                          <button
                            type="button"
                            onClick={() => openEditModal(video)}
                            title="Chỉnh sửa thông tin video (Admin)"
                            className="p-1.5 rounded-[6px] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
                          >
                            <Edit3 size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteVideo(video)}
                            title="Xóa video khỏi thư viện (Admin)"
                            className="p-1.5 rounded-[6px] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--status-error-fg)] hover:bg-[var(--status-error-bg)]/20 transition-colors cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </>
                      )}

                      <Link
                        href={`/watch/${video.slug}`}
                        className="px-4 py-2 rounded-[8px] bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold flex items-center gap-1.5 hover:bg-[#262626] transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <span>{t("startVideoLesson")}</span>
                        <Play size={12} className="fill-current" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ADMIN EDIT MODAL */}
      {editingVideo && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--surface-raised)] border border-[var(--border)] rounded-[14px] max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div className="flex items-center gap-2">
                <Edit3 size={16} className="text-[var(--foreground)]" />
                <h3 className="text-sm font-bold text-[var(--foreground)]">
                  Chỉnh sửa Video (Admin)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingVideo(null)}
                className="p-1 text-[var(--muted)] hover:text-[var(--foreground)] cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-mono text-[var(--muted)] mb-1 font-semibold">
                  Tiêu đề hiển thị:
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full h-[40px] px-3 rounded-[8px] border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--foreground)] focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-[var(--muted)] mb-1 font-semibold">
                    Chủ đề:
                  </label>
                  <select
                    value={editTopic}
                    onChange={(e) => setEditTopic(e.target.value as VideoLesson["topic"])}
                    className="w-full h-[40px] px-2.5 rounded-[8px] border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--foreground)] focus:outline-none cursor-pointer"
                  >
                    <option value="Daily Conversations">Daily Conversations</option>
                    <option value="Tech & Developer">Tech & Developer</option>
                    <option value="Job Interview">Job Interview</option>
                    <option value="Business & Work">Business & Work</option>
                    <option value="Inspirational">Inspirational</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[var(--muted)] mb-1 font-semibold">
                    Độ khó:
                  </label>
                  <select
                    value={editLevel}
                    onChange={(e) => setEditLevel(e.target.value as VideoLesson["level"])}
                    className="w-full h-[40px] px-2.5 rounded-[8px] border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--foreground)] focus:outline-none cursor-pointer"
                  >
                    <option value="A2">A2</option>
                    <option value="B1">B1</option>
                    <option value="B2">B2</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--border)] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingVideo(null)}
                  className="px-4 py-2 rounded-[8px] border border-[var(--border)] text-xs font-medium text-[var(--muted)] hover:text-[var(--foreground)] cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-4 py-2 rounded-[8px] bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold hover:bg-[#262626] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {editLoading ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
