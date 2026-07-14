"use client";

import Script from "next/script";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function SalesforceProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    useEffect(() => {
        // Reinit ketika route SPA berubah
        if (typeof window !== "undefined" && window.SalesforceInteractions) {
            window.SalesforceInteractions.reinit();
        }
    }, [pathname]);

    return (
        <>
            {/* 1. Daftarkan konfigurasi INIT ke antrean global sebelum script utama di-load */}
            <Script id="sf-interactions-queue" strategy="beforeInteractive">
                {`
          window.salesforce_interactions = window.salesforce_interactions || [];
          window.salesforce_interactions.push({
            cookieDomain: window.location.hostname,
            consents: [
              {
                provider: "luwansa-website",
                purpose: "Personalization",
                status: "OptIn"
              }
            ]
          });
        `}
            </Script>

            {/* 2. Muat CDN Utama Salesforce */}
            <Script
                src="https://cdn.c360a.salesforce.com/beacon/c360a/0d0c0943-d1e4-4472-ae82-4a1b82e85a65/scripts/c360a.min.js"
                strategy="afterInteractive"
            />
            {children}
        </>
    );
}