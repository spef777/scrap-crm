import AppLayout from "@/components/layout/AppLayout";
import SupplierProfile from "@/components/suppliers/SupplierProfile";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SupplierPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) redirect("/login");
  return <AppLayout><SupplierProfile supplierId={params.id} /></AppLayout>;
}
