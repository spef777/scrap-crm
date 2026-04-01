import AppLayout from "@/components/layout/AppLayout";
import Deals from "@/components/deals/Deals";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
export default async function DealsPage() {
  const session = await auth();
  if (!session) redirect("/login");
  return <AppLayout><Deals /></AppLayout>;
}
