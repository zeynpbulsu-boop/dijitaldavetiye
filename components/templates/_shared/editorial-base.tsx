/**
 * Editorial Base — DEPRECATED RE-EXPORT SHIM
 *
 * The implementation lives in `_legacy-editorial-base.tsx`. This file
 * is a 1-line forwarder kept at the original path so the existing 8
 * editions (atelier-indigo, timeless, olive-grove, mansion-lights,
 * bodrum-blue, aurora, plus aliased blush-* / black-ink) continue to
 * resolve their `from "@/components/templates/_shared/editorial-base"`
 * imports unchanged during the FAZ 2D migration.
 *
 * New editions: do NOT import from here. Build a composition + slot
 * overrides and use <EditionRenderer /> instead.
 *
 * Removal: once every legacy edition is migrated to the slot
 * architecture, this file and `_legacy-editorial-base.tsx` will both
 * be deleted in a single sweep.
 *
 * @deprecated Use EditionRenderer + EditionComposition (FAZ 2B).
 */

export { EditorialBase } from "./_legacy-editorial-base";
