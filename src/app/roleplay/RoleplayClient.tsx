"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Send,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Bookmark,
  Check,
  ChevronDown,
  ChevronUp,
  User,
  Bot,
  Lightbulb,
  Award,
  Layers,
  HelpCircle,
  Plus,
} from "lucide-react";
import {
  RoleplayScenario,
  RoleplayTurnFeedback,
  RoleplayDebrief,
  RoleplayTurnResponse,
} from "@/server/ai/roleplay";
import { useLanguage } from "@/i18n/LanguageContext";
import { AudioButton } from "@/components/audio/AudioButton";
import { MicButton } from "@/components/audio/MicButton";

interface MessageItem {
  id: string;
  role: "ai" | "user";
  content: string;
  contentVi?: string;
  feedback?: RoleplayTurnFeedback;
}

interface RoleplayClientProps {
  initialScenarios: RoleplayScenario[];
}

export function RoleplayClient({ initialScenarios }: RoleplayClientProps) {
  const { t } = useLanguage();
  const [scenarios] = useState<RoleplayScenario[]>(initialScenarios);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeScenario, setActiveScenario] = useState<RoleplayScenario | null>(null);

  // Conversation state
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [currentTurn, setCurrentTurn] = useState(1);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showTranslationMap, setShowTranslationMap] = useState<Record<string, boolean>>({});

  // Debrief / Completion state
  const [isFinished, setIsFinished] = useState(false);
  const [debrief, setDebrief] = useState<RoleplayDebrief | null>(null);
  const [savedPhrases, setSavedPhrases] = useState<Record<string, boolean>>({});
  const [savingPhrase, setSavingPhrase] = useState<Record<string, boolean>>({});

  // Custom scenario modal
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customTitle, setCustomTitle] = useState("");
  const [customContext, setCustomContext] = useState("");
  const [customPartnerRole, setCustomPartnerRole] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const categories = ["all", "Engineering", "Workplace", "Career"];

  const filteredScenarios = scenarios.filter(
    (s) => selectedCategory === "all" || s.category === selectedCategory
  );

  // Start scenario
  function handleStartScenario(scenario: RoleplayScenario) {
    setActiveScenario(scenario);
    setCurrentTurn(1);
    setIsFinished(false);
    setDebrief(null);
    setUserInput("");
    setShowHint(false);
    setMessages([
      {
        id: `ai-init-${Date.now()}`,
        role: "ai",
        content: scenario.firstMessageEn,
        contentVi: scenario.firstMessageVi,
      },
    ]);
  }

  // Handle user send message in roleplay
  async function handleSendMessage(overrideText?: string) {
    const text = (overrideText || userInput).trim();
    if (!text || !activeScenario || loading || isFinished) return;

    const userMessageId = `user-${Date.now()}`;
    const newMessages: MessageItem[] = [
      ...messages,
      { id: userMessageId, role: "user", content: text },
    ];

    setMessages(newMessages);
    setUserInput("");
    setLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/ai/roleplay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenario: activeScenario,
          history: historyPayload,
          userReply: text,
          turnIndex: currentTurn,
        }),
      });

      const resJson = await res.json();
      if (res.ok && resJson.data) {
        const turnData: RoleplayTurnResponse = resJson.data;

        // Attach feedback to the user message
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === userMessageId ? { ...msg, feedback: turnData.feedback } : msg
          )
        );

        // Add partner reply
        const aiMessageId = `ai-${Date.now()}`;
        setMessages((prev) => [
          ...prev,
          {
            id: aiMessageId,
            role: "ai",
            content: turnData.reply,
            contentVi: turnData.replyVi,
          },
        ]);

        if (turnData.isFinished || currentTurn >= activeScenario.targetTurns) {
          setIsFinished(true);
          if (turnData.debrief) {
            setDebrief(turnData.debrief);
          }
        } else {
          setCurrentTurn((prev) => prev + 1);
          setShowHint(false);
        }
      } else {
        alert("Không nhận được phản hồi từ AI. Vui lòng thử lại.");
      }
    } catch {
      alert("Lỗi kết nối khi gửi phản hồi.");
    } finally {
      setLoading(false);
    }
  }

  // Finish early and get debrief
  async function handleFinishEarly() {
    if (!activeScenario || loading) return;
    setLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/ai/roleplay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenario: activeScenario,
          history: historyPayload,
          userReply: "Thank you for the discussion. Let's summarize our takeaways.",
          turnIndex: activeScenario.targetTurns,
        }),
      });

      const resJson = await res.json();
      if (res.ok && resJson.data?.debrief) {
        setDebrief(resJson.data.debrief);
        setIsFinished(true);
      } else {
        setIsFinished(true);
      }
    } catch {
      setIsFinished(true);
    } finally {
      setLoading(false);
    }
  }

  // Save collocation directly to Vocabulary Bank
  async function handleSavePhrase(phrase: string, meaningVi: string, exampleEn: string) {
    if (savedPhrases[phrase] || savingPhrase[phrase]) return;
    setSavingPhrase((prev) => ({ ...prev, [phrase]: true }));

    try {
      const res = await fetch("/api/vocabulary/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phrase,
          meaningVi,
          exampleEn,
          topic: activeScenario ? `Roleplay: ${activeScenario.titleVi}` : "Roleplay",
        }),
      });

      if (res.ok) {
        setSavedPhrases((prev) => ({ ...prev, [phrase]: true }));
      } else {
        alert("Lỗi khi lưu cụm từ vào sổ tay.");
      }
    } catch {
      alert("Lỗi kết nối mạng.");
    } finally {
      setSavingPhrase((prev) => ({ ...prev, [phrase]: false }));
    }
  }

  // Start custom scenario
  function handleStartCustomScenario(e: React.FormEvent) {
    e.preventDefault();
    if (!customTitle.trim() || !customContext.trim()) return;

    const custom: RoleplayScenario = {
      id: `custom-${Date.now()}`,
      title: customTitle.trim(),
      titleVi: customTitle.trim(),
      category: "Workplace",
      difficulty: "B1-B2",
      partnerName: "Alex",
      partnerRole: customPartnerRole.trim() || "Colleague / Partner",
      contextVi: customContext.trim(),
      contextEn: customContext.trim(),
      targetTurns: 4,
      firstMessageEn: `Hi there! Thanks for meeting with me today regarding ${customTitle.trim()}. Could you walk me through your perspective on this?`,
      firstMessageVi: `Chào bạn! Rất vui được trao đổi với bạn hôm nay về vấn đề này. Bạn có thể chia sẻ góc nhìn hoặc tình hình hiện tại không?`,
      turnHints: [
        "Trình bày ngắn gọn bối cảnh và mục tiêu chính của bạn.",
        "Đưa ra lập luận hoặc chi tiết cụ thể để thuyết phục đối tác.",
        "Đề xuất giải pháp hoặc phương án tiếp theo.",
        "Tổng kết và chốt lại thống nhất giữa hai bên.",
      ],
    };

    setShowCustomModal(false);
    handleStartScenario(custom);
  }

  // -------------------------------------------------------------
  // VIEW 1: SCENARIO SELECTION DIRECTORY
  // -------------------------------------------------------------
  if (!activeScenario) {
    return (
      <div className="p-4 md:p-8 space-y-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--foreground)]">
                {t("roleplayTitle")}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--foreground)]">
                3–5 Lượt giao tiếp
              </span>
            </div>
            <p className="text-sm text-[var(--muted)] max-w-2xl leading-relaxed">
              {t("roleplaySubtitle")}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowCustomModal(true)}
            className="inline-flex items-center gap-2 px-4 h-[42px] rounded-[10px] bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold hover:bg-[#262626] transition-colors cursor-pointer self-start sm:self-auto shrink-0 shadow-xs"
          >
            <Plus size={16} />
            <span>{t("customScenario")}</span>
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`h-8 px-3.5 rounded-[8px] text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold shadow-xs"
                  : "bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--muted-subtle)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
              }`}
            >
              {cat === "all" ? "Tất cả chủ đề" : cat}
            </button>
          ))}
        </div>

        {/* Scenario Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredScenarios.map((scenario) => (
            <div
              key={scenario.id}
              className="bg-[var(--surface-raised)] border border-[var(--border)] rounded-[14px] p-5 space-y-4 hover:border-[var(--border-strong)] transition-all flex flex-col justify-between group shadow-xs"
            >
              <div className="space-y-3">
                {/* Meta Badges */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-mono uppercase bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--muted-subtle)] font-medium">
                    {scenario.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-mono bg-[var(--surface)] border border-[var(--border)] text-[var(--muted)]">
                      {scenario.difficulty}
                    </span>
                    <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-mono bg-[var(--surface)] border border-[var(--border)] text-[var(--muted)]">
                      {scenario.targetTurns} lượt
                    </span>
                  </div>
                </div>

                {/* Scenario Titles */}
                <div className="space-y-1">
                  <h2 className="text-base font-bold text-[var(--foreground)] leading-snug group-hover:text-[var(--primary)]">
                    {scenario.titleVi}
                  </h2>
                  <p className="text-xs text-[var(--muted)] font-mono">
                    "{scenario.title}"
                  </p>
                </div>

                {/* Partner Persona */}
                <div className="flex items-center gap-2.5 p-2.5 rounded-[8px] bg-[var(--surface)] border border-[var(--border)]">
                  <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center font-bold text-xs shrink-0">
                    {scenario.partnerName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-[var(--foreground)] block truncate">
                      {scenario.partnerName}
                    </span>
                    <span className="text-[11px] text-[var(--muted)] block truncate">
                      {scenario.partnerRole}
                    </span>
                  </div>
                </div>

                {/* Context Description */}
                <p className="text-xs text-[var(--muted-subtle)] leading-relaxed line-clamp-3">
                  {scenario.contextVi}
                </p>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => handleStartScenario(scenario)}
                className="w-full h-[40px] rounded-[10px] bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold flex items-center justify-center gap-2 hover:bg-[#262626] transition-colors cursor-pointer mt-2"
              >
                <span>{t("startRoleplay")}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Custom Scenario Modal */}
        {showCustomModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-[var(--surface-raised)] border border-[var(--border-strong)] rounded-[16px] shadow-2xl p-6 space-y-4 animate-in fade-in-50 zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-[var(--foreground)]" />
                  <h2 className="text-base font-bold text-[var(--foreground)]">
                    {t("customScenario")}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] p-1 rounded-[6px]"
                >
                  Đóng
                </button>
              </div>

              <form onSubmit={handleStartCustomScenario} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold uppercase tracking-wider text-[var(--muted-subtle)]">
                    Tên tình huống *
                  </label>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="VD: Phỏng vấn vị trí Senior Backend Developer, Báo cáo rủi ro dự án..."
                    required
                    className="w-full h-[40px] px-3 rounded-[8px] border border-[var(--border)] bg-transparent text-sm text-[var(--foreground)] focus:border-[var(--border-strong)] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold uppercase tracking-wider text-[var(--muted-subtle)]">
                    Đối tác AI đóng vai ai?
                  </label>
                  <input
                    type="text"
                    value={customPartnerRole}
                    onChange={(e) => setCustomPartnerRole(e.target.value)}
                    placeholder="VD: Tech Lead người Mỹ, Product Manager khó tính, Khách hàng..."
                    className="w-full h-[40px] px-3 rounded-[8px] border border-[var(--border)] bg-transparent text-sm text-[var(--foreground)] focus:border-[var(--border-strong)] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold uppercase tracking-wider text-[var(--muted-subtle)]">
                    Mô tả bối cảnh & Mục tiêu của bạn *
                  </label>
                  <textarea
                    value={customContext}
                    onChange={(e) => setCustomContext(e.target.value)}
                    rows={4}
                    placeholder="Mô tả cụ thể: Bạn là ai, cần trao đổi vấn đề gì, mục tiêu muốn đạt được sau buổi nói chuyện là gì..."
                    required
                    className="w-full p-3 rounded-[8px] border border-[var(--border)] bg-transparent text-sm text-[var(--foreground)] focus:border-[var(--border-strong)] focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border)]">
                  <button
                    type="button"
                    onClick={() => setShowCustomModal(false)}
                    className="px-4 h-[38px] rounded-[8px] text-xs font-semibold text-[var(--muted-subtle)] hover:bg-[var(--surface-hover)] cursor-pointer"
                  >
                    Huỷ
                  </button>
                  <button
                    type="submit"
                    className="px-5 h-[38px] rounded-[8px] bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold hover:bg-[#262626] transition-colors cursor-pointer"
                  >
                    Tạo & Bắt đầu hội thoại
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: ACTIVE CONVERSATION OR DEBRIEF
  // -------------------------------------------------------------
  const progressPercent = Math.min(100, Math.round((currentTurn / activeScenario.targetTurns) * 100));
  const currentHint = activeScenario.turnHints[currentTurn - 1];

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      {/* Session Top Bar */}
      <div className="border-b border-[var(--border)] bg-[var(--surface-raised)] sticky top-0 z-20 px-4 sm:px-8 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setActiveScenario(null)}
              className="p-1.5 rounded-[8px] border border-[var(--border)] hover:bg-[var(--surface-hover)] text-[var(--foreground)] transition-colors cursor-pointer shrink-0"
              title="Thoát phiên hội thoại"
            >
              <ArrowLeft size={16} />
            </button>

            <div className="min-w-0">
              <h2 className="text-sm font-bold text-[var(--foreground)] truncate">
                {activeScenario.titleVi}
              </h2>
              <div className="flex items-center gap-2 text-[11px] text-[var(--muted)] font-mono truncate">
                <span>{activeScenario.partnerName}</span>
                <span>•</span>
                <span className="truncate">{activeScenario.partnerRole}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Turn Stepper Badge */}
            <div className="text-right">
              <span className="text-xs font-mono font-semibold text-[var(--foreground)]">
                {t("turnLabel")} {Math.min(currentTurn, activeScenario.targetTurns)} / {activeScenario.targetTurns}
              </span>
              <div className="w-24 h-1.5 bg-[var(--border)] rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-[var(--primary)] transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {!isFinished && (
              <button
                type="button"
                onClick={handleFinishEarly}
                disabled={loading || messages.length <= 1}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 h-[34px] rounded-[8px] border border-[var(--border)] text-xs text-[var(--muted-subtle)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
              >
                <span>{t("finishEarly")}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-5">
        {/* Scenario Context Banner */}
        <div className="p-3.5 rounded-[12px] bg-[var(--surface)] border border-[var(--border)] space-y-1 text-xs">
          <span className="font-semibold text-[var(--foreground)]">Bối cảnh của bạn: </span>
          <span className="text-[var(--muted-subtle)] leading-relaxed">
            {activeScenario.contextVi}
          </span>
        </div>

        {/* Message Stream */}
        <div className="space-y-4 pb-4">
          {messages.map((msg) => {
            const isAI = msg.role === "ai";
            const showTrans = Boolean(showTranslationMap[msg.id]);

            return (
              <div
                key={msg.id}
                className={`flex gap-3 animate-in fade-in-50 duration-200 ${
                  isAI ? "justify-start" : "justify-end"
                }`}
              >
                {/* AI Avatar */}
                {isAI && (
                  <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-xs">
                    {activeScenario.partnerName.charAt(0)}
                  </div>
                )}

                <div
                  className={`space-y-2 max-w-[85%] sm:max-w-[78%] ${
                    isAI ? "" : "items-end flex flex-col"
                  }`}
                >
                  {/* Sender Name */}
                  <span className="text-[11px] font-mono text-[var(--muted)] px-1">
                    {isAI ? activeScenario.partnerName : "Bạn (Learner)"}
                  </span>

                  {/* Message Bubble */}
                  <div
                    className={`p-4 rounded-[14px] leading-relaxed text-sm shadow-xs ${
                      isAI
                        ? "bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--foreground)]"
                        : "bg-[var(--primary)] text-[var(--primary-foreground)] font-medium"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="flex-1 whitespace-pre-line">{msg.content}</p>
                      {isAI && <AudioButton text={msg.content} compact />}
                    </div>

                    {/* Vietnamese Translation Accordion for AI message */}
                    {isAI && msg.contentVi && (
                      <div className="pt-2 mt-2 border-t border-[var(--border)] text-xs">
                        <button
                          type="button"
                          onClick={() =>
                            setShowTranslationMap((prev) => ({
                              ...prev,
                              [msg.id]: !prev[msg.id],
                            }))
                          }
                          className="inline-flex items-center gap-1 text-[11px] text-[var(--muted)] hover:text-[var(--foreground)] font-mono transition-colors cursor-pointer"
                        >
                          <span>{showTrans ? "Ẩn dịch" : "Xem dịch tiếng Việt"}</span>
                          {showTrans ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        </button>

                        {showTrans && (
                          <p className="text-xs text-[var(--muted-subtle)] italic pt-1 leading-relaxed">
                            {msg.contentVi}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Attached Coach Feedback for user messages */}
                  {!isAI && msg.feedback && (
                    <div className="w-full bg-[var(--surface-raised)] border border-[var(--border-strong)] rounded-[12px] p-3.5 space-y-2 text-xs text-[var(--foreground)] shadow-sm animate-in fade-in-50">
                      <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                        <div className="flex items-center gap-1.5">
                          <Sparkles size={14} className="text-amber-500" />
                          <span className="font-semibold text-xs text-[var(--foreground)]">
                            {t("coachFeedback")}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 rounded-[4px] text-[10px] font-mono bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--muted-subtle)]">
                            {msg.feedback.politeness}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            {msg.feedback.score}/100
                          </span>
                        </div>
                      </div>

                      {/* Natural Native Alternative */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--muted)] font-semibold">
                          {t("nativeAlternativeLabel")}:
                        </span>
                        <div className="flex items-center justify-between p-2 rounded-[6px] bg-[var(--surface-hover)] border border-[var(--border)]">
                          <p className="font-medium text-xs text-[var(--foreground)] leading-snug">
                            {msg.feedback.naturalAlternative}
                          </p>
                          <AudioButton text={msg.feedback.naturalAlternative} compact />
                        </div>
                      </div>

                      {/* Feedback Note in Vietnamese */}
                      <p className="text-xs text-[var(--muted-subtle)] leading-relaxed">
                        {msg.feedback.feedbackVi}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* AI Thinking Animation */}
          {loading && (
            <div className="flex gap-3 justify-start items-center animate-in fade-in-50">
              <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center font-bold text-xs shrink-0">
                {activeScenario.partnerName.charAt(0)}
              </div>
              <div className="bg-[var(--surface-raised)] border border-[var(--border)] p-3.5 rounded-[14px] text-xs text-[var(--muted)] flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--muted)] animate-bounce" />
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--muted)] animate-bounce delay-150" />
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--muted)] animate-bounce delay-300" />
                <span className="ml-1">
                  {activeScenario.partnerName} đang soạn câu trả lời & chấm điểm câu của bạn...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ------------------------------------------------------------- */}
        {/* VIEW 3: ROLEPLAY DEBRIEF SUMMARY (AFTER FINISHING) */}
        {/* ------------------------------------------------------------- */}
        {isFinished && (
          <div className="bg-[var(--surface-raised)] border border-[var(--border-strong)] rounded-[16px] p-6 space-y-6 shadow-sm animate-in fade-in-50 duration-300">
            <div className="text-center space-y-2 border-b border-[var(--border)] pb-5">
              <div className="w-12 h-12 rounded-full bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--foreground)] flex items-center justify-center mx-auto">
                <CheckCircle2 size={28} className="text-[var(--status-success-fg)]" />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)]">
                {t("roleplayCompletedTitle")}
              </h2>
              <p className="text-xs text-[var(--muted)] max-w-lg mx-auto leading-relaxed">
                Bạn đã hoàn tất toàn bộ các lượt đối thoại trong tình huống "{activeScenario.titleVi}". Dưới đây là nhận xét tổng quan và các cụm từ đắt giá bạn nên lưu lại.
              </p>
            </div>

            {/* Score Breakdown Cards */}
            {debrief && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-[10px] bg-[var(--surface)] border border-[var(--border)] text-center space-y-1">
                  <span className="text-[11px] font-mono text-[var(--muted)] uppercase">
                    Tổng điểm
                  </span>
                  <p className="text-2xl font-bold font-mono text-[var(--foreground)]">
                    {debrief.overallScore}/100
                  </p>
                </div>
                <div className="p-3.5 rounded-[10px] bg-[var(--surface)] border border-[var(--border)] text-center space-y-1">
                  <span className="text-[11px] font-mono text-[var(--muted)] uppercase">
                    Độ lưu loát
                  </span>
                  <p className="text-2xl font-bold font-mono text-[var(--foreground)]">
                    {debrief.fluencyScore}%
                  </p>
                </div>
                <div className="p-3.5 rounded-[10px] bg-[var(--surface)] border border-[var(--border)] text-center space-y-1">
                  <span className="text-[11px] font-mono text-[var(--muted)] uppercase">
                    Vốn từ vựng
                  </span>
                  <p className="text-2xl font-bold font-mono text-[var(--foreground)]">
                    {debrief.vocabularyScore}%
                  </p>
                </div>
                <div className="p-3.5 rounded-[10px] bg-[var(--surface)] border border-[var(--border)] text-center space-y-1">
                  <span className="text-[11px] font-mono text-[var(--muted)] uppercase">
                    Sắc thái & Lịch sự
                  </span>
                  <p className="text-2xl font-bold font-mono text-[var(--foreground)]">
                    {debrief.toneScore}%
                  </p>
                </div>
              </div>
            )}

            {/* Evaluation Highlights */}
            {debrief && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-[12px] bg-[var(--surface)] border border-[var(--border)] space-y-2">
                  <span className="font-bold text-[var(--foreground)] uppercase tracking-wider block">
                    {t("strongPointsLabel")}
                  </span>
                  <ul className="space-y-1.5 text-[var(--muted-subtle)] list-disc list-inside leading-relaxed">
                    {debrief.strongPoints.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-[12px] bg-[var(--surface)] border border-[var(--border)] space-y-2">
                  <span className="font-bold text-[var(--foreground)] uppercase tracking-wider block">
                    {t("improvementsLabel")}
                  </span>
                  <ul className="space-y-1.5 text-[var(--muted-subtle)] list-disc list-inside leading-relaxed">
                    {debrief.improvementSuggestions.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Key Collocations to Save */}
            {debrief?.keyCollocations && debrief.keyCollocations.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
                    {t("keyCollocationsLearned")}
                  </h3>
                  <Link
                    href="/vocabulary"
                    className="text-[11px] font-mono text-[var(--muted-subtle)] hover:text-[var(--foreground)] hover:underline"
                  >
                    Xem Sổ từ vựng ↗
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {debrief.keyCollocations.map((col, idx) => {
                    const isSaved = Boolean(savedPhrases[col.phrase]);
                    const isSaving = Boolean(savingPhrase[col.phrase]);

                    return (
                      <div
                        key={idx}
                        className="p-3.5 rounded-[12px] bg-[var(--surface)] border border-[var(--border)] flex flex-col justify-between space-y-2 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-start justify-between gap-1.5">
                            <span className="font-bold text-sm text-[var(--foreground)]">
                              {col.phrase}
                            </span>
                            <AudioButton text={col.phrase} compact />
                          </div>
                          <p className="text-[11px] text-[var(--muted-subtle)] font-medium">
                            → {col.meaningVi}
                          </p>
                          <p className="text-[11px] text-[var(--muted)] italic pt-1 border-t border-[var(--border)] leading-relaxed">
                            "{col.exampleEn}"
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            handleSavePhrase(col.phrase, col.meaningVi, col.exampleEn)
                          }
                          disabled={isSaved || isSaving}
                          className={`w-full h-[32px] rounded-[6px] text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer mt-1 ${
                            isSaved
                              ? "bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--foreground)]"
                              : "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[#262626]"
                          }`}
                        >
                          {isSaved ? (
                            <>
                              <Check size={12} className="text-emerald-500" />
                              <span>{t("savedToBank")}</span>
                            </>
                          ) : (
                            <>
                              <Bookmark size={11} />
                              <span>{t("saveToPhraseBank")}</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => handleStartScenario(activeScenario)}
                className="w-full sm:w-auto px-5 h-[42px] rounded-[10px] border border-[var(--border)] text-[var(--foreground)] text-xs font-semibold flex items-center justify-center gap-2 hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
              >
                <RotateCcw size={14} />
                <span>{t("practiceAgain")}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveScenario(null)}
                className="w-full sm:w-auto px-6 h-[42px] rounded-[10px] bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold flex items-center justify-center gap-2 hover:bg-[#262626] transition-colors cursor-pointer"
              >
                <span>{t("chooseAnotherScenario")}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Input Bar (Only when active and not finished) */}
      {!isFinished && (
        <div className="sticky bottom-0 z-20 border-t border-[var(--border)] bg-[var(--surface-raised)] p-3 sm:p-4">
          <div className="max-w-4xl mx-auto space-y-2.5">
            {/* Hint Trigger & Accordion */}
            {currentHint && (
              <div className="text-xs">
                {!showHint ? (
                  <button
                    type="button"
                    onClick={() => setShowHint(true)}
                    className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[var(--muted-subtle)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
                  >
                    <Lightbulb size={13} className="text-amber-500" />
                    <span>Xem gợi ý ý tứ cho lượt này</span>
                  </button>
                ) : (
                  <div className="p-3 rounded-[8px] bg-[var(--surface)] border border-[var(--border)] flex items-start justify-between gap-2 animate-in fade-in-50">
                    <div className="flex items-start gap-2">
                      <Lightbulb size={14} className="text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-[var(--foreground)] leading-relaxed">
                        <strong className="font-semibold">Gợi ý phản hồi: </strong>
                        {currentHint}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowHint(false)}
                      className="text-[11px] text-[var(--muted)] hover:text-[var(--foreground)] shrink-0"
                    >
                      Ẩn
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Input & Voice Controls */}
            <div className="relative flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Gõ câu trả lời tiếng Anh của bạn (hoặc bấm Mic để nói)..."
                  disabled={loading}
                  className="w-full h-[46px] pl-4 pr-12 rounded-[10px] border border-[var(--border)] bg-[var(--surface-raised)] text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--border-strong)] focus:outline-none transition-colors"
                />

                <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                  <MicButton
                    onTranscript={(spoken) => {
                      setUserInput((prev) => (prev ? `${prev} ${spoken}` : spoken));
                    }}
                    label=""
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!userInput.trim() || loading}
                title="Gửi phản hồi"
                className="h-[46px] px-4 rounded-[10px] bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[#262626] transition-colors disabled:opacity-40 flex items-center justify-center gap-1.5 text-xs font-semibold shrink-0 cursor-pointer shadow-xs"
              >
                <span>Gửi</span>
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
