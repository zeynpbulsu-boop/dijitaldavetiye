import { PageLoading } from "@/components/ui/page-loading";

/** /admin/[token] tek davetiye yönetimi yüklenirken gösterilen iskelet. */
export default function Loading() {
  return <PageLoading label="Davetiye yükleniyor" />;
}
