"use client";

import { createContext, useContext, type ReactNode } from "react";
import {
  invitationStrings,
  type InvitationStrings,
} from "@/lib/themes-v2/i18n";

/**
 * Davetiye arayüz-metni context'i — ThemeShell doğru dili sağlar, tüm
 * section primitive'leri prop-drilling olmadan `useInvitationT()` ile çeker.
 * Provider yoksa TR'ye düşer (güvenli varsayılan).
 */
const InvitationI18nContext = createContext<InvitationStrings>(
  invitationStrings("tr"),
);

export function InvitationI18nProvider({
  value,
  children,
}: {
  value: InvitationStrings;
  children: ReactNode;
}) {
  return (
    <InvitationI18nContext.Provider value={value}>
      {children}
    </InvitationI18nContext.Provider>
  );
}

export function useInvitationT(): InvitationStrings {
  return useContext(InvitationI18nContext);
}
