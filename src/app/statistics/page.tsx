import { redirect } from "next/navigation";
import { Award, Flame, BookOpen, CheckCircle2 } from "lucide-react";
import { getSession } from "@/server/auth/session";
import { getUserStatistics } from "@/server/db/storage";
import { AppShell } from "@/components/layout/AppShell";

export default async function StatisticsPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const stats = getUserStatistics(session.id);

  return (
    <AppShell user={session}>
      <div className="p-4 md:p-8 space-y-8">
        {/* Header */}
        <div className="space-y-1 border-b border-[var(--border)] pb-6">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--foreground)]">
            Learning Analytics & Progress
          </h1>
          <p className="text-sm text-[var(--muted)]">
            Track authentic improvement, deliberate practice frequency, and areas needing grammatical reinforcement.
          </p>
        </div>

        {/* Core KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[var(--surface-raised)] border border-[var(--border)] rounded-[14px] p-5 space-y-1">
            <div className="flex items-center justify-between text-[var(--muted)]">
              <span className="text-xs font-medium">Practice Streak</span>
              <Flame size={16} className="text-[var(--foreground)]" />
            </div>
            <p className="text-3xl font-bold">{stats.streakDays} days</p>
            <p className="text-xs text-[var(--muted)]">Daily study habit</p>
          </div>

          <div className="bg-[var(--surface-raised)] border border-[var(--border)] rounded-[14px] p-5 space-y-1">
            <div className="flex items-center justify-between text-[var(--muted)]">
              <span className="text-xs font-medium">Sentences Practiced</span>
              <BookOpen size={16} className="text-[var(--foreground)]" />
            </div>
            <p className="text-3xl font-bold">{stats.totalSentences}</p>
            <p className="text-xs text-[var(--muted)]">Across lessons & practice</p>
          </div>

          <div className="bg-[var(--surface-raised)] border border-[var(--border)] rounded-[14px] p-5 space-y-1">
            <div className="flex items-center justify-between text-[var(--muted)]">
              <span className="text-xs font-medium">Accuracy Rate</span>
              <Award size={16} className="text-[var(--foreground)]" />
            </div>
            <p className="text-3xl font-bold">{stats.accuracy > 0 ? `${stats.accuracy}%` : "—"}</p>
            <p className="text-xs text-[var(--muted)]">Accepted by AI</p>
          </div>

          <div className="bg-[var(--surface-raised)] border border-[var(--border)] rounded-[14px] p-5 space-y-1">
            <div className="flex items-center justify-between text-[var(--muted)]">
              <span className="text-xs font-medium">Phrases Saved</span>
              <CheckCircle2 size={16} className="text-[var(--foreground)]" />
            </div>
            <p className="text-3xl font-bold">{stats.totalVocabulary}</p>
            <p className="text-xs text-[var(--muted)]">In context bank</p>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mistake Categories Breakdown */}
          <div className="bg-[var(--surface-raised)] border border-[var(--border)] rounded-[14px] p-6 space-y-4">
            <h2 className="text-base font-bold">Mistake Distribution by Grammar Category</h2>
            {Object.keys(stats.mistakeCategories).length === 0 ? (
              <p className="text-xs text-[var(--muted)] italic">
                No mistakes recorded yet. Continue practicing sentence translations to generate targeted diagnostic reports.
              </p>
            ) : (
              <div className="space-y-3">
                {Object.entries(stats.mistakeCategories).map(([cat, count]) => (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-[var(--foreground)]">{cat}</span>
                      <span className="font-mono text-[var(--muted)]">{count} times</span>
                    </div>
                    <div className="h-2 w-full bg-[var(--surface-hover)] rounded-full overflow-hidden border border-[var(--border)]">
                      <div
                        className="h-full bg-[var(--primary)] rounded-full"
                        style={{ width: `${Math.min(100, count * 25)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Retention & Spaced Review Status */}
          <div className="bg-[var(--surface-raised)] border border-[var(--border)] rounded-[14px] p-6 space-y-4">
            <h2 className="text-base font-bold">Spaced Repetition Retention Status</h2>
            <div className="space-y-3 text-xs leading-relaxed text-[var(--muted-subtle)]">
              <div className="flex items-center justify-between p-3 bg-[var(--surface)] border border-[var(--border)] rounded-[8px]">
                <span>Items due for review today:</span>
                <span className="font-bold text-sm text-[var(--foreground)]">
                  {stats.reviewsDueCount} sentences
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[var(--surface)] border border-[var(--border)] rounded-[8px]">
                <span>Total cards in spaced cycle:</span>
                <span className="font-bold text-sm text-[var(--foreground)]">
                  {stats.totalReviews} sentences
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[var(--surface)] border border-[var(--border)] rounded-[8px]">
                <span>Daily commitment pace:</span>
                <span className="font-bold text-sm text-[var(--foreground)] font-mono">
                  {session.dailyMinutes} mins/day
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
