"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { adminDb } from "@/lib/db/supabase";
import { type TierSlug } from "@/lib/db/types";
import { computeLiveUntil } from "@/lib/db/lifecycle";
import {
  ADMIN_COOKIE,
  verifyPassword,
  sessionToken,
  isAdminAuthed,
} from "@/lib/admin/auth";

export interface ActionResult {
  ok: boolean;
  error?: string;
}

/** Şifreyle giriş → httpOnly oturum cookie'si. */
export async function adminLogin(formData: FormData): Promise<ActionResult> {
  const pw = String(formData.get("password") ?? "");
  if (!verifyPassword(pw)) return { ok: false, error: "Hatalı şifre." };
  const token = sessionToken();
  if (!token)
    return { ok: false, error: "Sunucuda ADMIN_PASSWORD ayarlı değil." };
  cookies().set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 gün
  });
  revalidatePath("/admin");
  return { ok: true };
}

export async function adminLogout(): Promise<void> {
  cookies().delete(ADMIN_COOKIE);
  revalidatePath("/admin");
}

/** TEK TIK YAYINLA — status=live + live_until = bugün + tier süresi (365g).
 *  Coolify deploy DEĞİL; sadece DB güncellemesi → anında canlı. */
export async function publishInvitation(id: string): Promise<ActionResult> {
  if (!isAdminAuthed()) return { ok: false, error: "Yetkisiz." };
  if (!id) return { ok: false, error: "id yok." };
  const db = adminDb();
  const { data: row } = await db
    .from("invitations")
    .select("tier")
    .eq("id", id)
    .single<{ tier: TierSlug }>();
  const liveUntil = computeLiveUntil(row?.tier, Date.now());
  const { error } = await db
    .from("invitations")
    .update({
      status: "live",
      live_until: liveUntil,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin");
  return { ok: true };
}

/** Yayından çek (arşivle) — /i/[slug] artık 404 verir. */
export async function archiveInvitation(id: string): Promise<ActionResult> {
  if (!isAdminAuthed()) return { ok: false, error: "Yetkisiz." };
  if (!id) return { ok: false, error: "id yok." };
  const db = adminDb();
  const { error } = await db
    .from("invitations")
    .update({ status: "archived", updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin");
  return { ok: true };
}
