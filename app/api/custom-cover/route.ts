/**
 * POST /api/custom-cover
 *
 * NUVE Premium feature: müşteri kendi venue + atmosfer prompt'u girer,
 * fal.ai Recraft v3 ile per-couple custom cover illustration üretir.
 *
 * TDI paritesi: TheDigitalInvite Premium tier (€575) manuel insan
 * illüstratör. NUVE'de fal.ai ile $0.04/cover otomatize → daha hızlı,
 * daha ucuz, daha çok varyant.
 *
 * Body:
 *   {
 *     prompt: string;      // "köy evi, zeytin ağacı, iki kedi, golden hour"
 *     edition?: string;    // "aethel" | "nocturne" | ... (style lock hint)
 *     aspectRatio?: "9:16" | "16:9";  // default 9:16
 *   }
 *
 * Response:
 *   { ok: true, url: string }
 *   { ok: false, error: string }
 *
 * Auth: ödeme ÖNCESİ sipariş akışından çağrıldığı için admin_token yok →
 * public. Finansal-DoS'a karşı IP başına rate limit ile korunur. fal.ai
 * anahtarı YALNIZCA env'den okunur (kaynak kodda secret YOK); yoksa uç
 * fail-closed 503 döner.
 */

import { NextResponse } from "next/server";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FAL_KEY = process.env.FAL_KEY;
const FAL_ENDPOINT = "https://fal.run/fal-ai/recraft-v3";

/** IP başına 10 dakikada 6 üretim — ücretli fal.ai çağrısını sınırlar. */
const RL_LIMIT = 6;
const RL_WINDOW_MS = 10 * 60 * 1000;

/* Per-edition style lock — kullanıcı prompt'unun üstüne eklenir ki
   custom cover edition'ın atmosferiyle uyumlu çıksın. */
const STYLE_BY_EDITION: Record<string, string> = {
  aethel:
    "Editorial wedding photograph, Tuscan golden hour ambient, sage and cream palette, " +
    "Hasselblad medium format, painterly natural light. ",
  nocturne:
    "Editorial wedding photograph, Ottoman palace midnight ambient, deep navy and gold palette, " +
    "Leica M11 anamorphic lens flare. ",
  candela:
    "Editorial wedding photograph, intimate candlelit Bosphorus mansion ambient, " +
    "burgundy velvet and warm gold palette, Hasselblad medium format. ",
  mistral:
    "Editorial wedding photograph, Aegean coastal sunset ambient, cream and turquoise palette, " +
    "Sony A7R V salt-air haze. ",
  olea:
    "Editorial wedding photograph, ancient olive grove early morning ambient, sage and cream palette, " +
    "Canon EOS R5 golden hour. ",
  aurora:
    "Editorial architectural wedding photograph, contemporary minimal interior ambient, " +
    "warm beige rose-gold and twilight purple palette, Phase One XT medium format. ",
};

interface RequestBody {
  prompt?: string;
  edition?: string;
  aspectRatio?: "9:16" | "16:9";
}

export async function POST(req: Request) {
  // Anahtar yoksa fail-closed — feature kapalı, sızıntı yok.
  if (!FAL_KEY) {
    return NextResponse.json(
      { ok: false, error: "Özel kapak üretimi şu an kullanılamıyor." },
      { status: 503 },
    );
  }

  // Finansal-DoS koruması: IP başına rate limit (Date.now handler'da → güvenli).
  const rl = rateLimit(`custom-cover:${clientIp(req)}`, RL_LIMIT, RL_WINDOW_MS, Date.now());
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Çok fazla deneme. Biraz sonra tekrar dene." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
    );
  }

  let body: RequestBody;
  try {
    body = (await req.json()) as RequestBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const userPrompt = (body.prompt ?? "").trim();
  if (userPrompt.length < 4) {
    return NextResponse.json(
      { ok: false, error: "Prompt en az 4 karakter olmalı." },
      { status: 400 }
    );
  }
  if (userPrompt.length > 800) {
    return NextResponse.json(
      { ok: false, error: "Prompt en fazla 800 karakter olabilir." },
      { status: 400 }
    );
  }

  const editionStyle = body.edition && STYLE_BY_EDITION[body.edition]
    ? STYLE_BY_EDITION[body.edition]
    : "Editorial wedding photograph, Hasselblad medium format, Vogue Weddings cover. ";

  const fullPrompt =
    editionStyle +
    "Custom couple-specific scene: " +
    userPrompt +
    " 9:16 vertical portrait composition. Hyperrealistic, no painterly, no watercolor, " +
    "no illustration, no cartoon, no anime.";

  const isPortrait = (body.aspectRatio ?? "9:16") === "9:16";

  try {
    const falResponse = await fetch(FAL_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Key ${FAL_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: fullPrompt,
        image_size: isPortrait ? "portrait_16_9" : "landscape_16_9",
        style: "realistic_image/natural_light",
      }),
    });

    if (!falResponse.ok) {
      const errText = await falResponse.text();
      console.error("[custom-cover] fal.ai error:", falResponse.status, errText);
      return NextResponse.json(
        { ok: false, error: `Asset üretici hata verdi (${falResponse.status}).` },
        { status: 502 }
      );
    }

    const data = (await falResponse.json()) as {
      images?: Array<{ url?: string }>;
      image?: { url?: string };
    };
    const url =
      data.images?.[0]?.url ?? data.image?.url;

    if (!url) {
      console.error("[custom-cover] no url in response:", data);
      return NextResponse.json(
        { ok: false, error: "Asset URL alınamadı." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true, url });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown";
    console.error("[custom-cover] exception:", msg);
    return NextResponse.json(
      { ok: false, error: `Asset üretimi başarısız: ${msg}` },
      { status: 500 }
    );
  }
}
