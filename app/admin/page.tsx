import type { Metadata } from "next";
import { adminDb } from "@/lib/db/supabase";
import type { Invitation } from "@/lib/db/types";
import { isAdminAuthed, adminPasswordConfigured } from "@/lib/admin/auth";
import { AdminLogin } from "./_login";
import { AdminPanel } from "./_panel";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "NUVE Yönetim",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  if (!isAdminAuthed()) {
    return <AdminLogin configured={adminPasswordConfigured()} />;
  }

  let invitations: Invitation[] = [];
  try {
    const db = adminDb();
    const { data } = await db
      .from("invitations")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(300);
    invitations = (data as Invitation[] | null) ?? [];
  } catch {
    invitations = [];
  }

  return <AdminPanel invitations={invitations} />;
}
