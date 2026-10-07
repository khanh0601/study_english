export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getSession } from "@/server/auth/session";
import { getUserMistakes } from "@/server/db/storage";
import { AppShell } from "@/components/layout/AppShell";
import { MistakesClient } from "./MistakesClient";

export default async function MistakesPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const mistakes = getUserMistakes(session.id);

  return (
    <AppShell user={session}>
      <MistakesClient initialMistakes={mistakes} />
    </AppShell>
  );
}
