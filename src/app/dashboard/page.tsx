export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getSession } from "@/server/auth/session";
import {
  getOrCreateDailyPlan,
  getUserStatistics,
  getAllLessons,
} from "@/server/db/storage";
import { AppShell } from "@/components/layout/AppShell";
import { DashboardClient } from "./DashboardClient";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const todayPlan = getOrCreateDailyPlan(session.id);
  const stats = getUserStatistics(session.id);
  const lessons = getAllLessons();

  return (
    <AppShell user={session}>
      <DashboardClient
        user={session}
        todayPlan={todayPlan}
        stats={stats}
        lessons={lessons}
      />
    </AppShell>
  );
}
