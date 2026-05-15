"use client";

/**
 * Default Gallery Slot — FAZ 2B
 *
 * Three layout variants — editions pick one via `layout` prop, or
 * override the slot entirely if they want something completely
 * different (e.g. Aurora's modernist grid with overlay caps).
 *
 *   - "mason"      → Pinterest-style staggered columns (warmest,
 *                    feels like a wedding scrapbook)
 *   - "slider"     → Horizontal snap rail (premium photo-by-photo)
 *   - "grid"       → Equal-aspect editorial grid (museum catalog)
 */

import Image from "next/image";
import type { SlotProps } from "../slots";

export type GalleryLayout = "mason" | "slider" | "grid";

export function createGallerySlot(layout: GalleryLayout = "grid") {
  function GallerySlot({ data, editionSlug }: SlotProps) {
    const photos = data.galleryPhotos ?? [];
    if (photos.length === 0) return null;

    return (
      <section
        data-slot="gallery"
        data-slot-layout={layout}
        data-edition-slug={editionSlug}
        className="border-t py-20 lg:py-28"
        style={{
          background: "var(--edition-bg)",
          borderColor: "var(--edition-hairline)",
          color: "var(--edition-ink)",
        }}
      >
        <div className="container-tight mx-auto px-5">
          <div className="mb-10 text-center">
            <div
              className="text-[11px] font-semibold uppercase tracking-[0.28em]"
              style={{ color: "var(--edition-accent)" }}
            >
              — Anılar
            </div>
            <h2
              className="mt-4"
              style={{
                fontFamily: "var(--edition-display)",
                fontSize: "clamp(28px, 3.5vw, 48px)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
              }}
            >
              Yan yana, hatıra hatıra
            </h2>
          </div>

          {layout === "mason" && <MasonLayout photos={photos} />}
          {layout === "slider" && <SliderLayout photos={photos} />}
          {layout === "grid" && <GridLayout photos={photos} />}
        </div>
      </section>
    );
  }

  GallerySlot.displayName = `GallerySlot(${layout})`;
  return GallerySlot;
}

/* ── Layout variants ───────────────────────────────────────────── */

function MasonLayout({ photos }: { photos: string[] }) {
  // CSS columns gives true masonry without measuring heights.
  return (
    <div className="columns-2 gap-3 md:columns-3 lg:columns-4 [&>*]:mb-3 [&>*]:break-inside-avoid">
      {photos.map((src, i) => (
        <PhotoCard
          key={`${src}-${i}`}
          src={src}
          alt={`Anı ${i + 1}`}
          aspect={
            i % 3 === 0 ? "aspect-[3/4]" :
            i % 3 === 1 ? "aspect-[4/5]" :
                          "aspect-[1/1]"
          }
        />
      ))}
    </div>
  );
}

function SliderLayout({ photos }: { photos: string[] }) {
  return (
    <div
      className="no-scrollbar -mx-5 flex w-[calc(100%+2.5rem)] snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4"
    >
      {photos.map((src, i) => (
        <div
          key={`${src}-${i}`}
          className="aspect-[3/4] w-[280px] flex-shrink-0 snap-center sm:w-[320px] lg:w-[360px]"
        >
          <PhotoCard src={src} alt={`Anı ${i + 1}`} aspect="aspect-[3/4]" />
        </div>
      ))}
    </div>
  );
}

function GridLayout({ photos }: { photos: string[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
      {photos.map((src, i) => (
        <PhotoCard
          key={`${src}-${i}`}
          src={src}
          alt={`Anı ${i + 1}`}
          aspect="aspect-[4/5]"
        />
      ))}
    </div>
  );
}

function PhotoCard({
  src,
  alt,
  aspect,
}: {
  src: string;
  alt: string;
  aspect: string;
}) {
  return (
    <div
      className={`relative w-full overflow-hidden ${aspect}`}
      style={{
        border: `1px solid var(--edition-hairline)`,
        borderRadius: 4,
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 50vw, 320px"
        className="object-cover"
      />
    </div>
  );
}
