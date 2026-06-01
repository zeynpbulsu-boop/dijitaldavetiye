/**
 * Hafif sunucu-tarafı loglama soyutlaması — tek dikiş yeri (seam).
 *
 * Global kural: production kodda `console.log` YASAK; `console.error/warn`
 * bir logger servisine yönlendirilmeli. Bu modül o servisin yerini tutar:
 * şu an console.* sarmalar, ileride Sentry/Logflare buradan tek noktadan
 * bağlanır (aşağıdaki TODO). Çağrı tarafı `log.info/warn/error` kullanır.
 *
 * `scope` log satırını gruplar (ör. "dodo-webhook", "rsvp", "reviews").
 */

type Meta = unknown;

function line(scope: string, msg: string): string {
  return `[${scope}] ${msg}`;
}

// TODO(prod-observability): Sentry/Logflare entegrasyonu buraya — tek seam.
export const log = {
  info(scope: string, msg: string, meta?: Meta): void {
    console.info(line(scope, msg), meta ?? "");
  },
  warn(scope: string, msg: string, meta?: Meta): void {
    console.warn(line(scope, msg), meta ?? "");
  },
  error(scope: string, msg: string, meta?: Meta): void {
    console.error(line(scope, msg), meta ?? "");
  },
  /** Yalnızca geliştirme ortamında yazar; prod'da sessiz. */
  debug(scope: string, msg: string, meta?: Meta): void {
    if (process.env.NODE_ENV !== "production") {
      console.info(line(`${scope}:debug`, msg), meta ?? "");
    }
  },
};
