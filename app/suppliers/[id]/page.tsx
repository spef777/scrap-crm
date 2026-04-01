import AppLayout from "@/components/layout/AppLayout";
import SupplierProfile from "@/components/suppliers/SupplierProfile";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SupplierPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session) redirect("/login");
  return <AppLayout><SupplierProfile supplierId={id} /></AppLayout>;
}
