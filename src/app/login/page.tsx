"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Mail, AlertCircle, CheckCircle2 } from "lucide-react";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useLanguage } from "@/i18n/LanguageContext";

export default function LoginPage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [email, setEmail] = useState("kelvin@studyenglish.local");
  const [password, setPassword] = useState("study123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || (language === "vi" ? "Đăng nhập không thành công." : "Authentication failed."));
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError(language === "vi" ? "Không thể kết nối đến máy chủ." : "Unable to connect to the server.");
      setLoading(false);
    }
  }

  function handleFillDemo() {
    setEmail("kelvin@studyenglish.local");
    setPassword("study123");
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col justify-center items-center px-4 py-12 relative">
      {/* Top right language switch */}
      <div className="absolute top-6 right-6">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-[400px] space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-11 h-11 rounded-[12px] bg-[var(--primary)] text-[var(--primary-foreground)] items-center justify-center font-bold text-lg mb-2">
            SL
          </div>
          <h1 className="text-[26px] md:text-[30px] font-bold tracking-tight text-[var(--foreground)]">
            SentenceLab
          </h1>
          <p className="text-sm text-[var(--muted)] max-w-xs mx-auto">
            Learn English through complete sentences with AI feedback and Spaced Repetition.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[var(--surface-raised)] border border-[var(--border)] rounded-[14px] p-6 shadow-xs space-y-5">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold tracking-tight">Sign in to your account</h2>
            <p className="text-xs text-[var(--muted)]">
              Personal learning workspace. Authorized session required.
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 p-3 rounded-[8px] bg-[var(--status-error-bg)] border border-[var(--status-error-border)] text-[var(--status-error-fg)] text-xs">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-subtle)]">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full h-[44px] pl-10 pr-3 rounded-[10px] border border-[var(--border)] bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--border-strong)] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-subtle)]">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-[44px] pl-10 pr-3 rounded-[10px] border border-[var(--border)] bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--border-strong)] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[44px] rounded-[10px] bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#262626] transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Fill Helper */}
          <div className="pt-2 border-t border-[var(--border)]">
            <button
              type="button"
              onClick={handleFillDemo}
              className="w-full text-xs text-[var(--muted-subtle)] hover:text-[var(--foreground)] py-1.5 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <CheckCircle2 size={13} className="text-[var(--status-success-fg)]" />
              <span>Use default demo credentials (Kelvin)</span>
            </button>
          </div>
        </div>

        {/* Security Note */}
        <p className="text-center text-xs text-[var(--muted)]">
          Protected with HTTP-only secure cookie session & JWT.
        </p>
      </div>
    </div>
  );
}
