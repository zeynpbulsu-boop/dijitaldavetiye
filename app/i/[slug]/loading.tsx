import { PageLoading } from "@/components/ui/page-loading";

/** /i/[slug] Supabase'den davetiyeyi çekerken gösterilen anlık iskelet. */
export default function Loading() {
  return <PageLoading label="Davetiye açılıyor" />;
}
