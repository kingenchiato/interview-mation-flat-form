"use client";

import { AppStoreProvider } from "@/lib/store";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppStoreProvider>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </AppStoreProvider>
  );
}
