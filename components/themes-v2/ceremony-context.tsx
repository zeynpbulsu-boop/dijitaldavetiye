"use client";

import { createContext, useContext, type ReactNode } from "react";

/**
 * Açılış seremonisinin durumunu hero'lara taşır — imza etkileşimler
 * (örn. Fener'de ampullerin sırayla yanması) perdenin AÇILDIĞI anda
 * başlamalı, mount anında değil (yoksa perde arkasında olup biter).
 */
const CeremonyOpenedContext = createContext(false);

export function CeremonyProvider({ opened, children }: { opened: boolean; children: ReactNode }) {
  return <CeremonyOpenedContext.Provider value={opened}>{children}</CeremonyOpenedContext.Provider>;
}

export function useCeremonyOpened(): boolean {
  return useContext(CeremonyOpenedContext);
}
