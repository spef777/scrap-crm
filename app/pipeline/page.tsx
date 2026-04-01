import AppLayout from "@/components/layout/AppLayout";
import Pipeline from "@/components/pipeline/Pipeline";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
export default async function PipelinePage() {
  const session = await auth();
  if (!session) redirect("/login");
  return <AppLayout><Pipeline /></AppLayout>;
}
