export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSession } from "@/server/auth/session";
import { getOrCreateDailyPlan, getVietnamLocalDate } from "@/server/db/storage";
import { AppShell } from "@/components/layout/AppShell";
import { PlannerClient } from "./PlannerClient";

export default async function PlannerPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const plan = getOrCreateDailyPlan(session.id);
  const localDate = getVietnamLocalDate();

  return (
    <AppShell user={session}>
      <PlannerClient initialPlan={plan} localDate={localDate} />
    </AppShell>
  );
}
