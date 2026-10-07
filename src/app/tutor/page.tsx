export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getSession } from "@/server/auth/session";
import { AppShell } from "@/components/layout/AppShell";
import { TutorClient } from "./TutorClient";

export default async function TutorPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <AppShell user={session}>
      <TutorClient />
    </AppShell>
  );
}
