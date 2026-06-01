"use client";

import { ErrorScreen } from "@/components/ui/error-screen";

/** /i/[slug] segment hata sınırı — davetiye render hatasında şık fallback. */
export default function Error(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorScreen
      {...props}
      scope="i"
      title="Davetiye açılamadı"
      message="Bu davetiyeyi gösterirken bir sorun oluştu. Sayfayı yenilemeyi dene; sürerse çift ile iletişime geç."
    />
  );
}
