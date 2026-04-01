import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import SupplierList from "@/components/suppliers/SupplierList";

export default async function SuppliersPage() {
  const session = await auth();
  if (!session) redirect("/login");
  return <AppLayout><SupplierList /></AppLayout>;
}
