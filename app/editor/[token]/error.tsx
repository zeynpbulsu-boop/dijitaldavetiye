"use client";

import { ErrorScreen } from "@/components/ui/error-screen";

/** /editor/[token] segment hata sınırı (çiftin düzenleyicisi). */
export default function Error(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorScreen
      {...props}
      scope="editor"
      title="Düzenleyici yüklenemedi"
      message="Düzenleyici açılırken bir sorun oluştu. Tekrar dene; değişikliklerin kaydedilmişse korunur."
    />
  );
}
