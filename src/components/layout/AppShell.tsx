"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  RotateCcw,
  BookMarked,
  FileText,
  BarChart3,
  LogOut,
  Menu,
  X,
  Sparkles,
  Video,
  MessagesSquare,
} from "lucide-react";
import { SessionUser } from "@/server/auth/session";
import { AITutorWidget } from "@/components/chat/AITutorWidget";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useLanguage } from "@/i18n/LanguageContext";

interface AppShellProps {
  user: SessionUser;
  children: React.ReactNode;
  hideSidebar?: boolean;
}

export function AppShell({ user, children, hideSidebar = false }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  const navItems = [
    { label: t("navDashboard"), href: "/dashboard", icon: LayoutDashboard },
    { label: t("navPlanner"), href: "/planner", icon: Calendar },
    { label: t("navLessons"), href: "/learn", icon: BookOpen },
    {label: t("navVideoShadowing"), href: "/watch", icon: Video },
    { label: t("navRoleplay"), href: "/roleplay", icon: MessagesSquare },
    { label: t("navReview"), href: "/review", icon: RotateCcw },
    { label: t("navMistakes"), href: "/mistakes", icon: BookMarked },
    { label: t("navVocabulary"), href: "/vocabulary", icon: FileText },
    { label: t("navTutor"), href: "/tutor", icon: Sparkles },
    { label: t("navStatistics"), href: "/statistics", icon: BarChart3 },
  ];

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  function getPageTitle() {
    if (pathname === "/dashboard") return t("navDashboard");
    if (pathname.startsWith("/planner")) return t("navPlanner");
    if (pathname.startsWith("/learn")) return t("navLessons");
    if (pathname.startsWith("/watch")) return t("navVideoShadowing");
    if (pathname.startsWith("/roleplay")) return t("navRoleplay");
    if (pathname.startsWith("/review")) return t("navReview");
    if (pathname.startsWith("/mistakes")) return t("navMistakes");
    if (pathname.startsWith("/vocabulary")) return t("navVocabulary");
    if (pathname.startsWith("/tutor")) return t("navTutor");
    if (pathname.startsWith("/statistics")) return t("navStatistics");
    return "";
  }

  if (hideSidebar) {
    return (
      <main className="min-h-screen bg-[var(--background)]">
        <header className="flex items-center justify-between px-4 sm:px-8 py-3.5 border-b border-[var(--border)] bg-[var(--surface-raised)] sticky top-0 z-20">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[8px] bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center font-bold text-xs">
              SL
            </div>
            <span className="font-semibold text-sm tracking-tight">{t("brandName")}</span>
          </Link>
          <LanguageSwitcher />
        </header>
        {children}
        <AITutorWidget />
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col md:flex-row relative">
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--surface-raised)] sticky top-0 z-30">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-[8px] bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center font-bold text-sm">
            SL
          </div>
          <span className="font-semibold text-base tracking-tight">{t("brandName")}</span>
        </Link>
        <div className="flex items-center gap-2">
          <LanguageSwitcher compact />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[var(--muted-subtle)] hover:text-[var(--foreground)]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[53px] bg-[var(--background)] z-40 p-4 flex flex-col justify-between border-b border-[var(--border)]">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                      : "text-[var(--muted-subtle)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between">
            <div className="text-sm">
              <p className="font-semibold">{user.name}</p>
              <p className="text-xs text-[var(--muted)]">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[var(--muted-subtle)] hover:text-[var(--status-error-fg)] border border-[var(--border)] rounded-[8px]"
            >
              <LogOut size={14} />
              {t("navLogout")}
            </button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar (248px per design.md) */}
      <aside className="hidden md:flex w-[248px] shrink-0 border-r border-[var(--border)] bg-[var(--surface-raised)] flex-col justify-between p-4 min-h-screen sticky top-0 h-screen">
        <div className="space-y-6">
          {/* Logo & Brand */}
          <Link href="/dashboard" className="flex items-center gap-2.5 px-2 py-1">
            <div className="w-8 h-8 rounded-[8px] bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center font-bold text-sm">
              SL
            </div>
            <div>
              <span className="font-semibold text-base tracking-tight block leading-tight">
                {t("brandName")}
              </span>
              <span className="text-[11px] text-[var(--muted)] uppercase tracking-wider font-mono">
                {t("brandSubtitle")}
              </span>
            </div>
          </Link>

          {/* Navigation links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-[10px] text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                      : "text-[var(--muted-subtle)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
                  }`}
                >
                  <Icon size={18} strokeWidth={1.8} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="pt-4 border-t border-[var(--border)] space-y-3">
          <div className="flex items-center justify-between px-2">
            <div className="truncate">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-semibold truncate leading-tight">{user.name}</p>
                {user.role === "admin" && (
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-[var(--foreground)] text-[var(--background)]">
                    ADMIN
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="inline-block px-1.5 py-0.5 text-[10px] font-mono bg-[var(--surface-hover)] border border-[var(--border)] rounded-[4px] text-[var(--muted-subtle)] font-medium">
                  {t("level")} {user.level}
                </span>
                <span className="text-[11px] text-[var(--muted)]">
                  {user.dailyMinutes}{t("minsPerDay")}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title={t("navLogout")}
              className="p-1.5 text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] rounded-[8px] transition-colors cursor-pointer"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop Top Header Bar with Language Switcher */}
        <header className="hidden md:flex items-center justify-between px-8 py-3.5 border-b border-[var(--border)] bg-[var(--surface-raised)] sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--muted)]">
              {getPageTitle()}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />

            <div className="h-4 w-px bg-[var(--border)]" />

            <div className="flex items-center gap-2 text-xs font-mono text-[var(--muted)]">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-medium text-[var(--foreground)]">{user.name}</span>
              {user.role === "admin" && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[var(--foreground)] text-[var(--background)]">
                  ADMIN
                </span>
              )}
              <span className="px-1.5 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] text-[10px]">
                {user.level}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 w-full max-w-[1200px] mx-auto overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Floating AI Tutor Assistant (accessible on any page except when already on /tutor) */}
      {pathname !== "/tutor" && <AITutorWidget />}
    </div>
  );
}
