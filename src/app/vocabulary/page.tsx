export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSession } from "@/server/auth/session";
import { getUserVocabulary } from "@/server/db/storage";
import { AppShell } from "@/components/layout/AppShell";
import { VocabularyClient } from "./VocabularyClient";

export default async function VocabularyPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const vocab = getUserVocabulary(session.id);

  return (
    <AppShell user={session}>
      <VocabularyClient initialVocabulary={vocab} />
    </AppShell>
  );
}
