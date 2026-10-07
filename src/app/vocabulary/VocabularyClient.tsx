"use client";

import React, { useState } from "react";
import { Search, Plus, FileText } from "lucide-react";
import { SavedVocabulary } from "@/server/db/storage";
import { AudioButton } from "@/components/audio/AudioButton";

interface VocabularyClientProps {
  initialVocabulary: SavedVocabulary[];
}

export function VocabularyClient({ initialVocabulary }: VocabularyClientProps) {
  const [vocabList, setVocabList] = useState<SavedVocabulary[]>(initialVocabulary);
  const [search, setSearch] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);

  // New vocab state
  const [phrase, setPhrase] = useState("");
  const [meaningVi, setMeaningVi] = useState("");
  const [exampleEn, setExampleEn] = useState("");
  const [topic, setTopic] = useState("Work & Professional");
  const [loading, setLoading] = useState(false);

  const topics = ["all", "Work & Professional", "Developer & Tech", "Daily Conversations", "Travel & Social"];

  const filtered = vocabList.filter((v) => {
    const matchesSearch =
      v.phrase.toLowerCase().includes(search.toLowerCase()) ||
      v.meaningVi.toLowerCase().includes(search.toLowerCase()) ||
      v.exampleEn.toLowerCase().includes(search.toLowerCase());
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
          topic,
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
      alert("Unable to save phrase at this time.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--foreground)]">
            Contextual Phrase Bank
          </h1>
          <p className="text-sm text-[var(--muted)]">
            Collect and review complete phrases with real examples instead of memorizing isolated single words.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-2 px-4 h-[40px] rounded-[10px] bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold hover:bg-[#262626] transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus size={15} />
          <span>{showAddForm ? "Close Form" : "Add New Phrase"}</span>
        </button>
      </div>

      {/* Add New Phrase Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddVocab}
          className="bg-[var(--surface-raised)] border border-[var(--border-strong)] rounded-[14px] p-6 space-y-4 animate-in fade-in-50 duration-200"
        >
          <h2 className="text-base font-bold">Add Phrase to Personal Bank</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-subtle)]">
                English Phrase *
              </label>
              <input
                type="text"
                value={phrase}
                onChange={(e) => setPhrase(e.target.value)}
                placeholder="e.g. in terms of, solve the issue..."
                required
                className="w-full h-[44px] px-3.5 rounded-[10px] border border-[var(--border)] bg-transparent text-sm text-[var(--foreground)] focus:border-[var(--border-strong)] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-subtle)]">
                Meaning / Definition *
              </label>
              <input
                type="text"
                value={meaningVi}
                onChange={(e) => setMeaningVi(e.target.value)}
                placeholder="e.g. xét về mặt, giải quyết sự cố..."
                required
                className="w-full h-[44px] px-3.5 rounded-[10px] border border-[var(--border)] bg-transparent text-sm text-[var(--foreground)] focus:border-[var(--border-strong)] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-subtle)]">
                Context Example Sentence
              </label>
              <input
                type="text"
                value={exampleEn}
                onChange={(e) => setExampleEn(e.target.value)}
                placeholder="e.g. In terms of performance, Next.js is very efficient."
                className="w-full h-[44px] px-3.5 rounded-[10px] border border-[var(--border)] bg-transparent text-sm text-[var(--foreground)] focus:border-[var(--border-strong)] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-subtle)]">
                Domain Topic
              </label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full h-[44px] px-3 rounded-[10px] border border-[var(--border)] bg-[var(--surface-raised)] text-sm text-[var(--foreground)] focus:border-[var(--border-strong)] focus:outline-none"
              >
                <option value="Work & Professional">Work & Professional</option>
                <option value="Developer & Tech">Developer & Tech</option>
                <option value="Daily Conversations">Daily Conversations</option>
                <option value="Travel & Social">Travel & Social</option>
                <option value="General">General</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 h-[40px] rounded-[10px] text-xs font-semibold text-[var(--muted-subtle)] hover:bg-[var(--surface-hover)] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 h-[40px] rounded-[10px] bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold hover:bg-[#262626] cursor-pointer"
            >
              {loading ? "Saving..." : "Save Phrase"}
            </button>
          </div>
        </form>
      )}

      {/* Search & Topic Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by phrase, meaning, or sentence..."
            className="w-full h-[42px] pl-10 pr-3 rounded-[10px] border border-[var(--border)] bg-[var(--surface-raised)] text-xs text-[var(--foreground)] focus:border-[var(--border-strong)] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {topics.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTopic(t)}
              className={`px-3 py-1.5 rounded-[8px] text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedTopic === t
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : "bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--muted-subtle)] hover:text-[var(--foreground)]"
              }`}
            >
              {t === "all" ? "All Topics" : t}
            </button>
          ))}
        </div>
      </div>

      {/* Vocabulary List */}
      {filtered.length === 0 ? (
        <div className="bg-[var(--surface-raised)] border border-[var(--border)] rounded-[14px] p-12 text-center space-y-2">
          <FileText size={32} className="mx-auto text-[var(--muted)]" />
          <p className="text-sm font-semibold text-[var(--foreground)]">
            No phrases found
          </p>
          <p className="text-xs text-[var(--muted)]">
            Complete translation lessons to extract useful phrases or click "Add New Phrase".
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-[var(--surface-raised)] border border-[var(--border)] rounded-[14px] p-5 space-y-2 hover:border-[var(--border-strong)] transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-mono uppercase bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--muted-subtle)] font-medium">
                  {item.topic}
                </span>
                <span className="text-[11px] text-[var(--muted)] font-mono">
                  {new Date(item.createdAt).toLocaleDateString("en-US")}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-[var(--foreground)] leading-snug">
                    {item.phrase}
                  </h3>
                  <AudioButton text={item.phrase} compact />
                </div>
                <p className="text-xs text-[var(--muted)]">
                  → {item.meaningVi}
                </p>
              </div>

              {item.exampleEn && (
                <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between gap-2">
                  <p className="text-xs italic text-[var(--muted-subtle)] leading-relaxed">
                    "{item.exampleEn}"
                  </p>
                  <AudioButton text={item.exampleEn} compact />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
