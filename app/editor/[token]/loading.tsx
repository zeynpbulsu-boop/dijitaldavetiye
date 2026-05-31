import { PageLoading } from "@/components/ui/page-loading";

/** /editor/[token] düzenleyici davetiyeyi çekerken gösterilen iskelet. */
export default function Loading() {
  return <PageLoading label="Düzenleyici yükleniyor" />;
}
