"use client";

import { ErrorScreen } from "@/components/ui/error-screen";

/** /admin/[token] segment hata sınırı (çiftin davetiye yönetimi). */
export default function Error(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorScreen {...props} scope="admin-token" title="Panel yüklenemedi" />;
}
