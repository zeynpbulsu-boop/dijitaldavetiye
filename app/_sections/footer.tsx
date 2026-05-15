"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n/provider";

export function Footer() {
  const t = useT();
  return (
    <footer id="footer" className="bg-brand-ink text-brand-cream">
      <div className="container-wide pt-24 pb-10 lg:pt-32">
        <div className="border-b border-brand-cream/15 pb-10">
          <h2
            className="font-display text-brand-cream"
            style={{ fontSize: "clamp(96px, 18vw, 240px)", lineHeight: 0.82, letterSpacing: "-0.04em" }}
          >
            nuve<span className="italic text-brand-cognac">.</span>
          </h2>
        </div>

        <div className="grid grid-cols-12 gap-8 py-14 lg:gap-10">
          <div className="col-span-12 lg:col-span-4">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-brand-cream/40">
              — {t.footer.atelier_label}
            </p>
            <p
              className="mt-5 font-display text-brand-cream/90"
              style={{ fontSize: "clamp(20px, 1.7vw, 24px)", lineHeight: 1.4, letterSpacing: "-0.012em" }}
            >
              {t.footer.atelier_body}
            </p>

            <div className="mt-7 flex items-center gap-3">
              <SocialLink
                href="https://instagram.com/nuve.app"
                label="Instagram"
                icon={
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                    <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.4" />
                    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.4" />
                    <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
                  </svg>
                }
              />
              <SocialLink
                href="https://tiktok.com/@nuve.app"
                label="TikTok"
                icon={
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                    <path d="M14 4v9.5a3.5 3.5 0 1 1-3.5-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    <path d="M14 4c0 2.5 2 4.5 4.5 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                }
              />
              <SocialLink
                href="https://pinterest.com/nuveapp"
                label="Pinterest"
                icon={
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" />
                    <path d="M11 8c-1.5 1-2 4-1 7.5M11.5 12.5c.5 1 2 1.5 3 .5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                }
              />
            </div>
          </div>

          <FooterColumn title={t.footer.col_product} links={t.footer.product_links} />
          <FooterColumn title={t.footer.col_legal} links={t.footer.legal_links} />

          <div className="col-span-12 lg:col-span-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-brand-cream/40">
              {t.footer.col_contact}
            </p>
            <p className="mt-5 font-display text-brand-cream/90" style={{ fontSize: "17px", lineHeight: 1.55 }}>
              {t.footer.contact_body}
            </p>
            <Link
              href="mailto:info@nuve.app"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand-cream px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.2em] text-brand-ink transition hover:bg-brand-cognac hover:text-brand-cream"
            >
              info@nuve.app
              <svg
                width="13" height="10" viewBox="0 0 14 10" fill="none" aria-hidden
                className="transition-transform group-hover:translate-x-0.5"
              >
                <path d="M1 5H13M13 5L9 1M13 5L9 9" stroke="currentColor"
                  strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-baseline justify-between gap-4 border-t border-brand-cream/15 pt-7 text-brand-cream/50">
          <span className="text-[11px] uppercase tracking-[0.22em]">{t.footer.rights}</span>
          <span className="text-[11px] uppercase tracking-[0.22em]">{t.footer.locale_row}</span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="col-span-6 lg:col-span-2">
      <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-brand-cream/40">
        {title}
      </p>
      <ul className="mt-5 space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              className="font-display text-brand-cream/85 transition-colors duration-200 hover:text-brand-cream"
              style={{ fontSize: "16px", lineHeight: 1.4 }}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-cream/22 text-brand-cream/70 transition-all duration-300 hover:border-brand-cognac hover:bg-brand-cognac/10 hover:text-brand-cream"
    >
      {icon}
    </Link>
  );
}
