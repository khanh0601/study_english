"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  X,
  Send,
  HelpCircle,
  Minimize2,
  Bot,
  User,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AITutorWidgetProps {
  currentContext?: string;
}

export function AITutorWidget({ currentContext }: AITutorWidgetProps) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: t("tutorWelcome"),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    t("quickPrompt1"),
    t("quickPrompt2"),
    t("quickPrompt3"),
  ];

  async function handleSend(textToSend?: string) {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          context: currentContext,
        }),
      });

      const data = await res.json();
      if (res.ok && data.message) {
        setMessages((prev) => [...prev, data.message]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Sorry, I encountered an issue replying. Please try asking again.",
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Network error. Please check your connection and try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          title="Open AI English Tutor"
          className="fixed bottom-6 right-6 z-50 h-12 px-4 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] shadow-lg hover:bg-[#262626] transition-all flex items-center gap-2 font-medium text-xs cursor-pointer group hover:scale-105 active:scale-95"
        >
          <Sparkles size={16} className="text-amber-400 group-hover:rotate-12 transition-transform" />
          <span>Ask AI Coach</span>
        </button>
      )}

      {/* Floating Chat Drawer / Popover (380px desktop, full width mobile) */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-[calc(100vw-32px)] sm:w-[390px] h-[540px] max-h-[85vh] bg-[var(--surface-raised)] border border-[var(--border-strong)] rounded-[16px] shadow-2xl flex flex-col overflow-hidden animate-in fade-in-50 slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="p-3.5 border-b border-[var(--border)] bg-[var(--surface)] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-[8px] bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center font-bold text-xs">
                SL
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-xs text-[var(--foreground)]">
                    SentenceLab Tutor
                  </span>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </div>
                <p className="text-[10px] text-[var(--muted)] font-mono">
                  Gemini 3.5 Flash Coach
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] rounded-[6px] transition-colors cursor-pointer"
            >
              <Minimize2 size={15} />
            </button>
          </div>

          {/* Message History */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "assistant" && (
                  <div className="w-6 h-6 rounded-full bg-[var(--surface-hover)] border border-[var(--border)] flex items-center justify-center text-[var(--foreground)] shrink-0 mt-0.5">
                    <Sparkles size={12} className="text-amber-500" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] p-3 rounded-[12px] leading-relaxed whitespace-pre-line ${
                    m.role === "user"
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)] font-medium"
                      : "bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)]"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-6 h-6 rounded-full bg-[var(--surface-hover)] border border-[var(--border)] flex items-center justify-center text-[var(--foreground)] shrink-0">
                  <Sparkles size={12} className="text-amber-500 animate-spin" />
                </div>
                <div className="bg-[var(--surface)] border border-[var(--border)] p-3 rounded-[12px] text-xs text-[var(--muted)] flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--muted)] animate-bounce" />
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--muted)] animate-bounce delay-150" />
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--muted)] animate-bounce delay-300" />
                  <span className="ml-1">Analyzing...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar (when only initial message exists) */}
          {messages.length <= 2 && (
            <div className="px-3 pb-2 flex gap-1.5 overflow-x-auto no-scrollbar">
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(prompt)}
                  disabled={loading}
                  className="px-2.5 py-1 rounded-full border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[11px] text-[var(--muted-subtle)] whitespace-nowrap transition-colors cursor-pointer shrink-0"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input Bar */}
          <div className="p-3 border-t border-[var(--border)] bg-[var(--surface-raised)]">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("askInputPlaceholder")}
                disabled={loading}
                className="w-full h-[40px] pl-3.5 pr-10 rounded-[10px] border border-[var(--border)] bg-transparent text-xs text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--border-strong)] focus:outline-none transition-colors"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                title={t("send")}
                className="absolute right-2 p-1.5 rounded-[6px] bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[#262626] transition-colors disabled:opacity-40 cursor-pointer"
              >
                <Send size={13} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
