import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import {
  getTemplate,
  getTemplateMeta,
  listTemplates,
} from "@/lib/templates/registry";
import { turkishSample } from "@/lib/templates/sample-data";
import { themeForSlug } from "@/lib/templates/themes";
import { PhoneFrame } from "./_phone-frame";

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return listTemplates().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const meta = getTemplateMeta(params.slug);
  if (!meta) return { title: "Şablon bulunamadı" };

  // Deprecated slugs are kept routable (so existing /i/<slug> URLs
  // don't break) but they must not show up in search engines — the
  // canonical edition is what we want indexed instead.
  const isDeprecated = meta.deprecated === true;

  return {
    title: meta.name,
    description: meta.description,
    openGraph: {
      title: `${meta.name} · NUVE`,
      description: meta.description,
      images: [meta.thumb],
    },
    ...(isDeprecated && {
      robots: {
        index: false,
        follow: false,
        googleBot: { index: false, follow: false },
      },
    }),
  };
}

export default function TemplateDetailPage({ params }: PageProps) {
  const meta = getTemplateMeta(params.slug);
  if (!meta) notFound();

  const template = getTemplate(params.slug);
  const isComingSoon = !template;
  const theme = themeForSlug(meta.slug);

  return (
    <main
      className="min-h-screen"
      style={{ background: theme.bg, color: theme.ink }}
    >
      {/* Back link — uses theme tones, transparent so the bg shows through */}
      <div
        className="border-b backdrop-blur-[2px]"
        style={{
          borderColor: theme.storyBorder,
          background: theme.isDark
            ? "rgba(0,0,0,0.18)"
            : "rgba(255,255,255,0.25)",
        }}
      >
        <div className="container-tight flex h-[60px] items-center">
          <Link
            href="/#themes"
            className="inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.2em] transition-opacity hover:opacity-70"
            style={{ color: theme.inkSoft }}
          >
            <ArrowLeft className="h-4 w-4" /> Tüm Şablonlar
          </Link>
        </div>
      </div>

      <div className="container-tight grid items-start gap-12 py-12 lg:grid-cols-[1fr_1fr] lg:gap-20 lg:py-20">
        {/* LEFT — interactive preview phone */}
        <div className="flex justify-center">
          {isComingSoon ? (
            <ComingSoonCard meta={meta} />
          ) : (
            <PhoneFrame>
              <template.Component data={turkishSample} isPreview />
            </PhoneFrame>
          )}
        </div>

        {/* RIGHT — template info, theme-tinted */}
        <aside>
          <div
            className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em]"
            style={{ color: theme.accent }}
          >
            — {meta.tagline}
          </div>
          <h1
            className="font-display"
            style={{
              color: theme.ink,
              fontSize: "clamp(32px, 4vw, 56px)",
              lineHeight: 1.02,
              letterSpacing: "-0.025em",
            }}
          >
            {meta.name}
          </h1>

          <p
            className="mt-5 max-w-prose"
            style={{ color: theme.inkSoft, fontSize: "17px", lineHeight: 1.65 }}
          >
            {meta.description}
          </p>

          {/* Price row */}
          <div
            className="mt-7 flex items-baseline gap-4 border-b pb-7"
            style={{ borderColor: theme.storyBorder }}
          >
            <div
              className="font-display leading-none"
              style={{
                color: theme.accent,
                fontSize: "44px",
                letterSpacing: "-0.025em",
              }}
            >
              €39,99
            </div>
            <div
              className="text-[11px] font-semibold uppercase tracking-[0.22em]"
              style={{ color: theme.inkSoft }}
            >
              Tek seferlik · 1 yıl yayın · KDV dahil
            </div>
          </div>

          {/* Palette */}
          <div className="mt-7">
            <div
              className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em]"
              style={{ color: theme.inkSoft }}
            >
              Renk Paleti
            </div>
            <div className="flex gap-2">
              {meta.palette.map((c) => (
                <span
                  key={c}
                  title={c}
                  className="h-9 w-9 rounded-full border-2"
                  style={{
                    background: c,
                    borderColor: theme.isDark ? "#00000022" : "#ffffffaa",
                    boxShadow: `0 0 0 1px ${theme.storyBorder}`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Features */}
          <ul className="mt-7 space-y-0">
            {[
              `${meta.pages} sayfalık tam web sitesi`,
              meta.hasEnvelope
                ? "Açılan zarf animasyonu + wax seal monogram"
                : "Sade tek-sayfa düzen",
              "Geri sayım sayacı + RSVP form",
              "Mobil + desktop optimize",
              `Dil seçenekleri: ${meta.languages.join(" · ")}`,
              "Sınırsız düzenleme · ömür boyu güncelleme",
            ].map((f, i, arr) => (
              <li
                key={f}
                className="flex items-center gap-3 py-3 text-[14px]"
                style={{
                  color: theme.inkSoft,
                  borderBottom:
                    i < arr.length - 1
                      ? `1px solid ${theme.storyBorder}`
                      : undefined,
                }}
              >
                <span
                  className="font-semibold"
                  style={{ color: theme.spark }}
                >
                  ✓
                </span>
                {f}
              </li>
            ))}
          </ul>

          <Link
            href={`/order/${meta.slug}`}
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full px-7 py-4 text-[14px] font-medium transition-all hover:translate-y-[-1px]"
            style={{
              background: theme.accent,
              color: theme.monogramText,
              boxShadow: `0 12px 30px -10px ${theme.accent}88`,
            }}
          >
            Bu Şablonla Devam Et →
          </Link>
          <p
            className="mt-3 text-center text-[12px] tracking-[0.1em]"
            style={{ color: theme.inkSoft }}
          >
            Form 5 dakika · Teslim 48 saat içinde
          </p>
        </aside>
      </div>
    </main>
  );
}

function ComingSoonCard({
  meta,
}: {
  meta: ReturnType<typeof getTemplateMeta> extends infer T ? NonNullable<T> : never;
}) {
  return (
    <div
      className="aspect-[9/19] w-full max-w-[300px] overflow-hidden rounded-[36px] border-[8px] border-[#1a1410] bg-cover bg-center shadow-[0_40px_80px_rgba(60,40,30,0.25)]"
      style={{ backgroundImage: `url('${meta.thumb}')` }}
    >
      <div className="flex h-full w-full flex-col items-center justify-end bg-gradient-to-t from-black/85 via-black/30 to-transparent p-6 text-center text-paper">
        <div className="font-serif text-[28px] italic">{meta.name}</div>
        <div className="mt-2 text-[10px] font-medium uppercase tracking-[0.3em] text-paper/70">
          Çok yakında interaktif önizleme
        </div>
      </div>
    </div>
  );
}
