export const dynamic = "force-dynamic";

import { notFound, redirect } from "next/navigation";
import { getSession } from "@/server/auth/session";
import { getVideoLessonById } from "@/server/db/storage";
import { AppShell } from "@/components/layout/AppShell";
import { VideoPlayerClient } from "./VideoPlayerClient";

interface VideoPageProps {
  params: Promise<{ videoId: string }>;
}

export default async function VideoDetailsPage({ params }: VideoPageProps) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const { videoId } = await params;
  const video = getVideoLessonById(videoId);

  if (!video) {
    notFound();
  }

  return (
    <AppShell user={session} hideSidebar>
      <VideoPlayerClient video={video} userId={session.id} />
    </AppShell>
  );
}
