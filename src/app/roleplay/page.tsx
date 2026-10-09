export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getSession } from "@/server/auth/session";
import { AppShell } from "@/components/layout/AppShell";
import { PRESET_SCENARIOS } from "@/server/ai/roleplay";
import { RoleplayClient } from "./RoleplayClient";

export default async function RoleplayPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <AppShell user={session}>
      <RoleplayClient initialScenarios={PRESET_SCENARIOS} />
    </AppShell>
  );
}
