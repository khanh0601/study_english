export const dynamic = "force-dynamic";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/server/auth/session";
import { getLessonBySlug } from "@/server/db/storage";
import { LessonClient } from "./LessonClient";

interface PageProps {
  params: Promise<{ lessonId: string }>;
}

export default async function LessonPage({ params }: PageProps) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const { lessonId } = await params;
  const lesson = getLessonBySlug(lessonId);

  if (!lesson) {
    notFound();
  }

  return <LessonClient lesson={lesson} userId={session.id} />;
}
