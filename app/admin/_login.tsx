"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { adminLogin } from "./_actions";

export function AdminLogin({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const onSubmit = (formData: FormData) => {
    setError(null);
    start(async () => {
      const r = await adminLogin(formData);
      if (r.ok) router.refresh();
      else setError(r.error ?? "Bir hata oluştu.");
    });
  };

  return (
    <main id="main" className="flex min-h-screen items-center justify-center bg-bg px-6">
      <form
        action={onSubmit}
        className="w-full max-w-sm rounded-2xl border border-brand-ink/10 bg-paper p-8 shadow-ed-md"
      >
        <p className="text-[11px] uppercase tracking-[0.4em] text-brand-cognac">
          NUVE
        </p>
        <h1 className="mt-3 font-display text-2xl text-brand-ink">Yönetim Paneli</h1>
        <p className="mt-2 text-[13px] text-brand-mute">
          Yalnızca site sahibi. Devam etmek için şifreyi gir.
        </p>

        {!configured && (
          <p className="mt-4 rounded-lg bg-brand-cognac/10 px-3 py-2 text-[12px] text-brand-cognac">
            Sunucuda <code>ADMIN_PASSWORD</code> ayarlı değil — Coolify env&apos;e
            ekleyince giriş aktifleşir.
          </p>
        )}

        <input
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="Şifre"
          required
          className="mt-5 w-full rounded-lg border border-brand-ink/15 bg-bg px-4 py-3 text-[15px] text-brand-ink outline-none focus-visible:border-brand-cognac"
        />
        <button
          type="submit"
          disabled={pending}
          className="mt-4 w-full rounded-full bg-brand-ink py-3 text-[12px] uppercase tracking-[0.22em] text-bg transition hover:tracking-[0.28em] disabled:opacity-50"
        >
          {pending ? "Giriş yapılıyor…" : "Giriş yap"}
        </button>
        {error && (
          <p className="mt-3 text-center text-[12px] text-red-600">{error}</p>
        )}
      </form>
    </main>
  );
}
