import AppLayout from "@/components/layout/AppLayout";
import FollowUps from "@/components/followups/FollowUps";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
export default async function FollowUpsPage() {
  const session = await auth();
  if (!session) redirect("/login");
  return <AppLayout><FollowUps /></AppLayout>;
}
