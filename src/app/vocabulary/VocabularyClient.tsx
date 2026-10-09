"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  BookOpen,
  Trash2,
  BookmarkCheck,
  Calendar,
} from "lucide-react";
import { SavedVocabulary } from "@/server/db/storage";
import { AudioButton } from "@/components/audio/AudioButton";
import { useLanguage } from "@/i18n/LanguageContext";

interface VocabularyClientProps {
  initialVocabulary: SavedVocabulary[];
}

export function VocabularyClient({ initialVocabulary }: VocabularyClientProps) {
  const { t } = useLanguage();
  const [vocabList, setVocabList] = useState<SavedVocabulary[]>(initialVocabulary);
  const [search, setSearch] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // New vocab state
  const [phrase, setPhrase] = useState("");
  const [meaningVi, setMeaningVi] = useState("");
  const [exampleEn, setExampleEn] = useState("");
  const [topic, setTopic] = useState("Quick Lookup");
  const [loading, setLoading] = useState(false);

  // Dynamically compute list of unique topics from user's vocabulary
  const availableTopics = useMemo(() => {
    const topicSet = new Set<string>();
    vocabList.forEach((v) => {
      if (v.topic) topicSet.add(v.topic);
    });
    // Add common presets if empty
    if (topicSet.size === 0) {
      topicSet.add("Quick Lookup");
      topicSet.add("Work & Professional");
      topicSet.add("Daily Conversations");
    }
    return ["all", ...Array.from(topicSet)];
  }, [vocabList]);

  // Topic count helper
  function getTopicCount(topicName: string): number {
    if (topicName === "all") return vocabList.length;
    return vocabList.filter((v) => v.topic === topicName).length;
  }

  const filtered = vocabList.filter((v) => {
    const q = search.toLowerCase();
    const matchesSearch =
      v.phrase.toLowerCase().includes(q) ||
      v.meaningVi.toLowerCase().includes(q) ||
      (v.exampleEn && v.exampleEn.toLowerCase().includes(q));
    const matchesTopic = selectedTopic === "all" || v.topic === selectedTopic;
    return matchesSearch && matchesTopic;
  });

  async function handleAddVocab(e: React.FormEvent) {
    e.preventDefault();
    if (!phrase.trim() || !meaningVi.trim() || loading) return;

    setLoading(true);
    try {
      const res = await fetch("/api/vocabulary/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phrase: phrase.trim(),
          meaningVi: meaningVi.trim(),
          exampleEn: exampleEn.trim(),
          topic: topic.trim() || "Quick Lookup",
        }),
      });

      const data = await res.json();
      if (res.ok && data.vocabulary) {
        setVocabList((prev) => [data.vocabulary, ...prev]);
        setPhrase("");
        setMeaningVi("");
        setExampleEn("");
        setShowAddForm(false);
      }
    } catch {
      alert("Không thể lưu từ vựng lúc này.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(t("deleteConfirm"))) return;
    setDeletingId(id);

    try {
      const res = await fetch("/api/vocabulary/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setVocabList((prev) => prev.filter((v) => v.id !== id));
      } else {
        alert("Lỗi khi xoá từ vựng.");
      }
    } catch {
      alert("Lỗi kết nối.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--foreground)]">
              {t("vocabTitle")}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--foreground)]">
              {vocabList.length} {t("totalSavedWords")}
            </span>
          </div>
          <p className="text-sm text-[var(--muted)] max-w-2xl leading-relaxed">
            {t("vocabSubtitle")}
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-2 px-4 h-[42px] rounded-[10px] bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold hover:bg-[#262626] transition-colors cursor-pointer self-start sm:self-auto shrink-0 shadow-xs"
        >
          <Plus size={16} />
          <span>{showAddForm ? "Đóng form" : t("addNewPhrase")}</span>
        </button>
      </div>

      {/* Add New Phrase Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddVocab}
          className="bg-[var(--surface-raised)] border border-[var(--border-strong)] rounded-[14px] p-6 space-y-4 animate-in fade-in-50 duration-200 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wider">
              {t("addNewPhrase")}
            </h2>
            <span className="text-xs text-[var(--muted)] font-mono">Thêm thủ công vào sổ tay</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-subtle)]">
                Từ hoặc cụm từ tiếng Anh *
              </label>
              <input
                type="text"
                value={phrase}
                onChange={(e) => setPhrase(e.target.value)}
                placeholder="VD: warm water, in terms of, break down..."
                required
                className="w-full h-[42px] px-3.5 rounded-[10px] border border-[var(--border)] bg-transparent text-sm text-[var(--foreground)] focus:border-[var(--border-strong)] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-subtle)]">
                Nghĩa tiếng Việt *
              </label>
              <input
                type="text"
                value={meaningVi}
                onChange={(e) => setMeaningVi(e.target.value)}
                placeholder="VD: nước ấm, xét về mặt, phân tích nhỏ..."
                required
                className="w-full h-[42px] px-3.5 rounded-[10px] border border-[var(--border)] bg-transparent text-sm text-[var(--foreground)] focus:border-[var(--border-strong)] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-subtle)]">
                Câu ví dụ ngữ cảnh (tiếng Anh)
              </label>
              <input
                type="text"
                value={exampleEn}
                onChange={(e) => setExampleEn(e.target.value)}
                placeholder="VD: I usually wake up and drink a glass of warm water."
                className="w-full h-[42px] px-3.5 rounded-[10px] border border-[var(--border)] bg-transparent text-sm text-[var(--foreground)] focus:border-[var(--border-strong)] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-subtle)]">
                Chủ đề / Nhóm
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="VD: Quick Lookup, Work, Tech..."
                className="w-full h-[42px] px-3.5 rounded-[10px] border border-[var(--border)] bg-transparent text-sm text-[var(--foreground)] focus:border-[var(--border-strong)] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border)]">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 h-[38px] rounded-[8px] text-xs font-semibold text-[var(--muted-subtle)] hover:bg-[var(--surface-hover)] cursor-pointer"
            >
              Huỷ
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 h-[38px] rounded-[8px] bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold hover:bg-[#262626] cursor-pointer"
            >
              {loading ? "Đang lưu..." : "Lưu vào sổ từ"}
            </button>
          </div>
        </form>
      )}

      {/* Search Bar & Topic Filter Tabs */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("searchPhrases")}
              className="w-full h-[42px] pl-10 pr-3 rounded-[10px] border border-[var(--border)] bg-[var(--surface-raised)] text-xs text-[var(--foreground)] focus:border-[var(--border-strong)] focus:outline-none transition-colors"
            />
          </div>

          <span className="text-xs font-mono text-[var(--muted)] self-end sm:self-center">
            Hiển thị {filtered.length} / {vocabList.length} từ
          </span>
        </div>

        {/* Dynamic Topic Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {availableTopics.map((topicName) => {
            const count = getTopicCount(topicName);
            const isSelected = selectedTopic === topicName;
            return (
              <button
                key={topicName}
                onClick={() => setSelectedTopic(topicName)}
                className={`h-8 px-3 rounded-[8px] text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  isSelected
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold shadow-xs"
                    : "bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--muted-subtle)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
                }`}
              >
                <span>{topicName === "all" ? t("allTopics") : topicName}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isSelected ? "bg-white/20 text-white" : "bg-[var(--surface-hover)] text-[var(--muted)]"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Vocabulary Items Grid */}
      {filtered.length === 0 ? (
        <div className="bg-[var(--surface-raised)] border border-[var(--border)] rounded-[14px] p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[var(--surface-hover)] border border-[var(--border)] flex items-center justify-center mx-auto text-[var(--muted)]">
            <BookOpen size={24} />
          </div>
          <div className="space-y-1">
            <p className="text-base font-bold text-[var(--foreground)]">
              {vocabList.length === 0 ? t("noPhrasesTitle") : "Không tìm thấy từ phù hợp với bộ lọc"}
            </p>
            <p className="text-xs text-[var(--muted)] max-w-md mx-auto leading-relaxed">
              {vocabList.length === 0
                ? t("noPhrasesSubtitle")
                : "Hãy thử tìm kiếm với từ khóa khác hoặc chuyển sang danh mục 'Tất cả chủ đề'."}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-[var(--surface-raised)] border border-[var(--border)] rounded-[14px] p-5 space-y-3 hover:border-[var(--border-strong)] transition-all flex flex-col justify-between group shadow-xs"
            >
              <div className="space-y-3">
                {/* Card Meta: Topic badge & Date */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-mono uppercase bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--muted-subtle)] font-medium">
                    {item.topic}
                  </span>

                  <div className="flex items-center gap-1.5 text-[11px] text-[var(--muted)] font-mono">
                    <Calendar size={12} />
                    <span>{new Date(item.createdAt).toLocaleDateString("vi-VN")}</span>
                  </div>
                </div>

                {/* Phrase & Pronunciation Audio */}
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-lg font-bold text-[var(--foreground)] tracking-tight leading-snug">
                      {item.phrase}
                    </h2>
                    <AudioButton text={item.phrase} compact />
                  </div>

                  {/* Vietnamese Meaning */}
                  <div className="p-2.5 rounded-[8px] bg-[var(--surface)] border border-[var(--border)]">
                    <p className="text-xs font-medium text-[var(--foreground)] leading-relaxed">
                      {item.meaningVi}
                    </p>
                  </div>
                </div>

                {/* Context Example Sentence if exists */}
                {item.exampleEn && (
                  <div className="space-y-1 pt-1 border-t border-[var(--border)]">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--muted)] font-semibold">
                      Ngữ cảnh sử dụng:
                    </span>
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs italic text-[var(--muted-subtle)] leading-relaxed">
                        "{item.exampleEn}"
                      </p>
                      <AudioButton text={item.exampleEn} compact />
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer: Delete Action */}
              <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between">
                <span className="text-[11px] text-[var(--muted)] font-mono flex items-center gap-1">
                  <BookmarkCheck size={12} className="text-emerald-500" />
                  <span>Đã lưu</span>
                </span>

                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  disabled={deletingId === item.id}
                  title={t("deletePhrase")}
                  className="p-1.5 rounded-[6px] text-[var(--muted)] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
