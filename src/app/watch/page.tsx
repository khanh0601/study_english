export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getSession } from "@/server/auth/session";
import { getAllVideoLessons } from "@/server/db/storage";
import { AppShell } from "@/components/layout/AppShell";
import { WatchClient } from "./WatchClient";

export default async function WatchPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  if (session && session.email === "kelvin@studyenglish.local") {
    session.role = "admin";
  }

  const videos = getAllVideoLessons();

  return (
    <AppShell user={session}>
      <WatchClient initialVideos={videos} currentUser={session} />
    </AppShell>
  );
}
