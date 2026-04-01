import AppLayout from "@/components/layout/AppLayout";
import ImportPage from "@/components/import/ImportPage";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
export default async function ImportSuppliers() {
  const session = await auth();
  if (!session) redirect("/login");
  return <AppLayout><ImportPage /></AppLayout>;
}
