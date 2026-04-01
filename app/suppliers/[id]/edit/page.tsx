import AppLayout from "@/components/layout/AppLayout";
import SupplierForm from "@/components/suppliers/SupplierForm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function EditSupplierPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) redirect("/login");
  return <AppLayout><SupplierForm supplierId={params.id} /></AppLayout>;
}
