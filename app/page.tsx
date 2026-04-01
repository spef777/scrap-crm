import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import Dashboard from "@/components/dashboard/Dashboard";

export default async function HomePage() {
  const session = await auth();
  if (!session) redirect("/login");
  return (
    <AppLayout>
      <Dashboard />
    </AppLayout>
  );
}
