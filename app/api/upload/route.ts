/**
 * POST /api/upload?token=<admin_token>&kind=hero|gallery
 *
 * Multipart upload → Supabase Storage 'couple-media' bucket → public
 * URL döndürür. Editor `kind=hero` gönderirse invitations.hero_media_url
 * doğrudan set edilir; `kind=gallery` gönderirse photos JSONB array'ine
 * append edilir.
 *
 * Allowed MIME types: image/{jpeg,png,webp,avif}. Maks 10 MB
 * (bucket-level constraint + bu route'ta da kontrol ediyoruz).
 *
 * Erişim: admin_token URL gate. service-role storage put yapıyor
 * (anon kullanıcının upload yetkisi yok).
 */

import { NextResponse, type NextRequest } from "next/server";
import { adminDb } from "@/lib/db/supabase";
import type { Invitation, PhotoItem } from "@/lib/db/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BUCKET = "couple-media";
const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

async function resolveInvitation(token: string) {
  if (!token) return null;
  const supabase = adminDb();
  const { data } = await supabase
    .from("invitations")
    .select("id, slug, hero_media_url, photos")
    .eq("admin_token", token)
    .single<Pick<Invitation, "id" | "slug" | "hero_media_url" | "photos">>();
  return data;
}

function safeFileName(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function POST(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") ?? "";
  const kind = (req.nextUrl.searchParams.get("kind") ?? "gallery") as
    | "hero"
    | "gallery";
  if (kind !== "hero" && kind !== "gallery") {
    return NextResponse.json({ error: "Invalid kind." }, { status: 400 });
  }

  const inv = await resolveInvitation(token);
  if (!inv) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Expected multipart form." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing 'file' field." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Sadece JPEG, PNG, WebP veya AVIF kabul edilir." },
      { status: 415 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Dosya 10 MB üst sınırını geçti." },
      { status: 413 },
    );
  }

  const supabase = adminDb();
  const ext = file.type.split("/").pop() ?? "bin";
  const base = safeFileName(file.name.replace(/\.[^.]+$/, "")) || "media";
  const objectPath = `${inv.slug}/${kind}-${Date.now()}-${base}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const { error: uploadErr } = await supabase.storage
    .from(BUCKET)
    .upload(objectPath, arrayBuffer, {
      contentType: file.type,
      upsert: false,
      cacheControl: "31536000, immutable",
    });

  if (uploadErr) {
    console.error("[upload]", uploadErr);
    return NextResponse.json(
      { error: uploadErr.message },
      { status: 500 },
    );
  }

  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(objectPath);
  const publicUrl = pub.publicUrl;

  /* DB tarafı: kind'a göre ya invitation.hero_media_url ya da
     photos array'ine append. Galeride yeni item alt/caption boş. */
  if (kind === "hero") {
    const { error: updErr } = await supabase
      .from("invitations")
      .update({ hero_media_url: publicUrl })
      .eq("id", inv.id);
    if (updErr) {
      console.warn("[upload] hero_media_url update failed:", updErr);
    }
  } else {
    const existing: PhotoItem[] = Array.isArray(inv.photos) ? inv.photos : [];
    const next: PhotoItem[] = [
      ...existing,
      { url: publicUrl },
    ];
    const { error: updErr } = await supabase
      .from("invitations")
      .update({ photos: next })
      .eq("id", inv.id);
    if (updErr) {
      console.warn("[upload] photos append failed:", updErr);
    }
  }

  return NextResponse.json({ url: publicUrl, kind, path: objectPath }, { status: 201 });
}

/**
 * DELETE /api/upload?token=<admin_token>&kind=hero|gallery&url=<full-url>
 *
 * Editor'da "kaldır" butonu için. hero kind → invitations.hero_media_url
 * null'a alınır; gallery kind → photos array'inden filter edilir.
 * Storage objesini de siler.
 */
export async function DELETE(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") ?? "";
  const kind = req.nextUrl.searchParams.get("kind") ?? "";
  const url = req.nextUrl.searchParams.get("url") ?? "";
  if (!url) {
    return NextResponse.json({ error: "url required." }, { status: 400 });
  }
  if (kind !== "hero" && kind !== "gallery") {
    return NextResponse.json({ error: "Invalid kind." }, { status: 400 });
  }

  const inv = await resolveInvitation(token);
  if (!inv) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const supabase = adminDb();

  // URL → object path. Public URL formatı:
  //   https://<project>.supabase.co/storage/v1/object/public/couple-media/<path>
  const marker = `/object/public/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx >= 0) {
    const path = url.slice(idx + marker.length);
    if (path) {
      await supabase.storage.from(BUCKET).remove([path]);
    }
  }

  if (kind === "hero") {
    await supabase
      .from("invitations")
      .update({ hero_media_url: null })
      .eq("id", inv.id);
  } else {
    const existing: PhotoItem[] = Array.isArray(inv.photos) ? inv.photos : [];
    const next = existing.filter((p) => p.url !== url);
    await supabase
      .from("invitations")
      .update({ photos: next })
      .eq("id", inv.id);
  }

  return NextResponse.json({ ok: true });
}
