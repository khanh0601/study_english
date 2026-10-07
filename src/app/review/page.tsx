export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getSession } from "@/server/auth/session";
import { getUserReviews } from "@/server/db/storage";
import { ReviewClient } from "./ReviewClient";

export default async function ReviewPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const reviews = getUserReviews(session.id);

  return <ReviewClient initialReviews={reviews} />;
}
