"use client";

import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { useEffect, useState } from "react";
import { Magnetic } from "@/components/effects/magnetic";
import { useLocale, useT } from "@/lib/i18n/provider";
import { LOCALES, LOCALE_LABEL, type Locale } from "@/lib/i18n/types";

/**
 * Editorial masthead with scroll-aware blur + mobile drawer + real
 * 3-language switcher (TR / EN / SR Latinica) backed by LocaleProvider.
 */
export function Nav() {
  const t = useT();
  const { locale, setLocale } = useLocale();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 16);
  });

  useEffect(() => {
    if (drawerOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  const navItems = [
    { label: t.nav.menu.themes, href: "/tasarimlar" },
    { label: t.nav.menu.how, href: "/#how-it-works" },
    { label: t.nav.menu.pricing, href: "/#pricing" },
    { label: t.nav.menu.faq, href: "/#faq" },
    { label: t.nav.menu.contact, href: "/#footer" },
  ];

  return (
    <>
      <motion.header
        className="sticky top-0 z-50 transition-all duration-300"
        animate={{
          backgroundColor: scrolled
            ? "rgba(242, 238, 230, 0.78)"
            : "rgba(242, 238, 230, 0)",
          backdropFilter: scrolled ? "blur(14px) saturate(1.1)" : "blur(0px)",
          borderBottomColor: scrolled
            ? "rgba(43, 30, 22, 0.08)"
            : "rgba(43, 30, 22, 0)",
        }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ borderBottomWidth: 1, borderBottomStyle: "solid" }}
      >
        <div className="container-wide flex h-[72px] items-center justify-between gap-4 md:gap-6">
          <Link
            href="/"
            aria-label={t.nav.home_aria}
            className="font-display text-[26px] italic leading-none text-brand-ink tracking-tight"
          >
            nuve
          </Link>

          <nav className="hidden md:block" aria-label={t.nav.aria_label}>
            <ul className="flex items-center gap-7 lg:gap-9">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group relative inline-flex items-center text-[13px] font-medium tracking-[0.04em] text-brand-ink/85 transition-colors duration-200 hover:text-brand-ink"
                  >
                    {item.label}
                    <span
                      aria-hidden
                      className="absolute -bottom-1.5 left-0 h-px w-0 bg-brand-cognac transition-all duration-300 group-hover:w-full"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3 md:gap-5">
            <div className="hidden md:block">
              <LangSwitcher value={locale} onChange={setLocale} ariaLabel={t.nav.lang_aria} />
            </div>

            <Magnetic strength={0.28} radius={110}>
            <Link
              href="/order/blush-reverie"
              data-cursor="cta"
              aria-label={t.nav.cta_aria}
              className="btn-couture group"
            >
              <span>{t.nav.cta_short}</span>
              <svg
                width="14" height="10" viewBox="0 0 14 10" fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="hidden transition-transform duration-300 group-hover:translate-x-1 sm:inline"
                aria-hidden
              >
                <path d="M1 5H13M13 5L9 1M13 5L9 9" stroke="currentColor"
                  strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            </Magnetic>

            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label={t.nav.open_menu}
              aria-expanded={drawerOpen}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-ink/22 text-brand-ink transition-colors hover:border-brand-cognac hover:text-brand-cognac md:hidden"
            >
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden>
                <path d="M1 1H13M1 5H13M1 9H8" stroke="currentColor"
                  strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[55] md:hidden"
          >
            <button
              type="button"
              aria-label={t.nav.close_menu}
              onClick={() => setDrawerOpen(false)}
              className="absolute inset-0 bg-brand-ink/35 backdrop-blur-[2px]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-0 flex h-full w-[88%] max-w-[420px] flex-col bg-brand-cream shadow-[-24px_0_60px_-16px_rgba(43,30,22,0.4)]"
            >
              <div className="flex items-center justify-between border-b border-brand-ink/12 px-6 py-5">
                <span className="font-display text-[22px] italic text-brand-ink">nuve</span>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  aria-label={t.nav.close_menu}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-ink/22 text-brand-ink transition-colors hover:border-brand-cognac hover:text-brand-cognac"
                >
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                    <path d="M1 1L13 13M13 1L1 13" stroke="currentColor"
                      strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-6 py-8">
                <ul className="space-y-5">
                  {navItems.map((item, i) => (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.1 + i * 0.06,
                        duration: 0.4,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setDrawerOpen(false)}
                        className="group flex items-baseline justify-between border-b border-brand-ink/10 pb-4 transition-colors duration-200"
                      >
                        <span
                          className="font-display text-brand-ink"
                          style={{
                            fontSize: "32px",
                            lineHeight: 1.1,
                            letterSpacing: "-0.018em",
                          }}
                        >
                          {item.label}
                        </span>
                        <span aria-hidden className="text-brand-cognac transition-transform duration-300 group-hover:translate-x-1">
                          →
                        </span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              <div className="border-t border-brand-ink/12 px-6 py-6">
                <div className="mb-5">
                  <LangSwitcher value={locale} onChange={setLocale} ariaLabel={t.nav.lang_aria} />
                </div>
                <a
                  href="mailto:info@nuve.app"
                  className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.2em] text-brand-cognac"
                >
                  <span>info@nuve.app</span>
                  <span aria-hidden>→</span>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/**
 * 3-way TR / EN / SR toggle. Active = ink + semibold, inactive = muted.
 */
function LangSwitcher({
  value,
  onChange,
  ariaLabel,
}: {
  value: Locale;
  onChange: (v: Locale) => void;
  ariaLabel: string;
}) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="inline-flex items-center gap-1 text-[11px] tracking-[0.18em]"
    >
      {LOCALES.map((code, i) => {
        const active = value === code;
        return (
          <span key={code} className="inline-flex items-center">
            <button
              type="button"
              onClick={() => onChange(code)}
              aria-pressed={active}
              className={`px-1.5 py-0.5 transition-colors duration-200 ${
                active
                  ? "font-semibold text-brand-ink"
                  : "font-normal text-brand-ink/45 hover:text-brand-ink/75"
              }`}
            >
              {LOCALE_LABEL[code]}
            </button>
            {i < LOCALES.length - 1 && (
              <span aria-hidden className="text-brand-ink/25">/</span>
            )}
          </span>
        );
      })}
    </div>
  );
}
