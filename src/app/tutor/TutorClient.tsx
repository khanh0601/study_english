"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  HelpCircle,
  BookOpen,
  Briefcase,
  Code2,
  Plane,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function TutorClient() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello Kelvin! I am your SentenceLab AI English Tutor. \n\nI can help you with:\n- Explaining grammar rules & subtle differences in usage\n- Polishing your work emails, Slack messages, or pull request descriptions\n- Breaking down tricky sentences into natural native expressions\n- Answering any questions as you study your daily curriculum\n\nWhat would you like to explore or practice right now?",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const presetTopics = [
    {
      icon: Briefcase,
      title: "Work & Email Phrasing",
      prompt: "How can I politely decline a meeting invite and propose another time next week?",
    },
    {
      icon: Code2,
      title: "Tech PR & Code Review",
      prompt: "How to write a constructive, polite code review comment asking to handle API error states?",
    },
    {
      icon: BookOpen,
      title: "Grammar: For vs. Since",
      prompt: "What is the rule for using 'for' versus 'since' with Present Perfect? Give 3 work examples.",
    },
    {
      icon: Plane,
      title: "Travel & Airport Inquiries",
      prompt: "What are polite ways to ask a flight attendant if window seats are available?",
    },
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
            content: "Sorry, I had trouble formulating a reply. Please try asking again.",
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Network connection error. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-65px)] md:h-screen max-w-[900px] mx-auto p-4 md:p-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[var(--border)] shrink-0">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--foreground)]">
              AI English Coach & Tutor
            </h1>
            <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-mono uppercase bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--muted-subtle)] font-medium">
              Powered by Gemini
            </span>
          </div>
          <p className="text-xs text-[var(--muted)]">
            Ask questions, polish sentence phrasing, or discuss grammar nuances anytime.
          </p>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                role: "assistant",
                content:
                  "Conversation reset. How else can I help your English practice today?",
              },
            ])
          }
          className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] border border-[var(--border)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
        >
          <RotateCcw size={13} />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-6 space-y-4">
        {/* Preset Cards on fresh conversation */}
        {messages.length <= 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2">
            {presetTopics.map((topic, i) => {
              const Icon = topic.icon;
              return (
                <button
                  key={i}
                  onClick={() => handleSend(topic.prompt)}
                  disabled={loading}
                  className="bg-[var(--surface-raised)] border border-[var(--border)] hover:border-[var(--border-strong)] rounded-[12px] p-4 text-left transition-colors cursor-pointer space-y-1.5 group"
                >
                  <div className="flex items-center gap-2 text-xs font-semibold text-[var(--foreground)]">
                    <Icon size={14} className="text-[var(--muted-subtle)] group-hover:text-[var(--foreground)]" />
                    <span>{topic.title}</span>
                  </div>
                  <p className="text-xs text-[var(--muted)] line-clamp-2 leading-relaxed">
                    "{topic.prompt}"
                  </p>
                </button>
              );
            })}
          </div>
        )}

        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {m.role === "assistant" && (
              <div className="w-8 h-8 rounded-[8px] bg-[var(--surface-hover)] border border-[var(--border)] flex items-center justify-center text-[var(--foreground)] shrink-0 mt-0.5">
                <Sparkles size={15} className="text-amber-500" />
              </div>
            )}

            <div
              className={`max-w-[85%] md:max-w-[75%] p-4 rounded-[14px] text-sm leading-relaxed whitespace-pre-line ${
                m.role === "user"
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)] font-medium"
                  : "bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--foreground)] shadow-xs"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-[8px] bg-[var(--surface-hover)] border border-[var(--border)] flex items-center justify-center text-[var(--foreground)] shrink-0">
              <Sparkles size={15} className="text-amber-500 animate-spin" />
            </div>
            <div className="bg-[var(--surface-raised)] border border-[var(--border)] p-4 rounded-[14px] text-xs text-[var(--muted)] flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--muted)] animate-bounce" />
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--muted)] animate-bounce delay-150" />
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--muted)] animate-bounce delay-300" />
              <span className="ml-1">AI Tutor is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="pt-3 border-t border-[var(--border)] shrink-0">
        <div className="relative bg-[var(--surface-raised)] border border-[var(--border)] rounded-[12px] p-2 focus-within:border-[var(--border-strong)] transition-colors">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
            placeholder="Ask a question or paste a sentence to polish (Shift+Enter for new line)..."
            disabled={loading}
            className="w-full p-2 bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none resize-none"
          />
          <div className="flex items-center justify-between pt-1 px-1">
            <span className="text-[11px] text-[var(--muted)] font-mono">
              Press Enter to send
            </span>
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="px-4 h-[36px] rounded-[8px] bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold flex items-center gap-1.5 hover:bg-[#262626] transition-colors disabled:opacity-40 cursor-pointer"
            >
              <span>Send</span>
              <Send size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
