"use client";

import { useState } from "react";
import { WEDDING_SONGS, type WeddingSong } from "@/lib/themes-v2/wedding-songs";

/**
 * SongPicker — müşteri hazır şarkılardan tek tıkla seçer veya kendi linkini
 * yapıştırır. Seçim, name="music_url" input'una yazılır → mevcut müzik sistemi
 * (YouTube otomatik / klasik ambient) çalar.
 */
export function SongPicker({ defaultValue }: { defaultValue?: string | null }) {
  const [value, setValue] = useState(defaultValue ?? "");
  const popular = WEDDING_SONGS.filter((s) => s.kind === "popular");
  const classical = WEDDING_SONGS.filter((s) => s.kind === "classical");

  const chip = (song: WeddingSong) => {
    const active = value === song.url;
    return (
      <button
        key={song.url}
        type="button"
        onClick={() => setValue(song.url)}
        className="rounded-full border px-3.5 py-2 text-left text-[12px] transition hover:border-brand-cognac"
        style={{
          borderColor: active ? "transparent" : "rgba(43,30,22,0.18)",
          backgroundColor: active ? "#2B1E16" : "transparent",
          color: active ? "#F6F1EA" : "#2B1E16",
        }}
        aria-pressed={active}
      >
        <span className="font-display">{song.label}</span>
        <span style={{ opacity: 0.6 }}> · {song.artist}</span>
      </button>
    );
  };

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-[12px] uppercase tracking-[0.18em] text-brand-mute">
          Popüler şarkılar{" "}
          <span className="lowercase tracking-normal text-brand-mute/70">
            — mühre basınca arkada otomatik çalar
          </span>
        </p>
        <div className="flex flex-wrap gap-2">{popular.map(chip)}</div>
      </div>

      <div>
        <p className="mb-2 text-[12px] uppercase tracking-[0.18em] text-brand-mute">
          Klasik{" "}
          <span className="lowercase tracking-normal text-brand-mute/70">
            — kamu malı, telifsiz
          </span>
        </p>
        <div className="flex flex-wrap gap-2">{classical.map(chip)}</div>
      </div>

      <div>
        <label className="mb-2 block text-[12px] uppercase tracking-[0.18em] text-brand-mute">
          veya kendi şarkı linkin (YouTube önerilir)
        </label>
        <input
          name="music_url"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=…&t=63"
          className="w-full rounded-lg border border-brand-ink/15 bg-bg px-4 py-3 text-[14px] text-brand-ink outline-none focus-visible:border-brand-cognac"
        />
        <p className="mt-2 text-[11px] leading-relaxed text-brand-mute">
          Listeden seç ya da kendi linkini yapıştır. YouTube&apos;da{" "}
          <em>Paylaş → &quot;Şu andan başlat&quot;</em> ile şarkının güzel yerinden
          başlatabilirsin. Boş bırakırsan temanın kamu-malı klasik müziği çalar.
        </p>
      </div>
    </div>
  );
}
