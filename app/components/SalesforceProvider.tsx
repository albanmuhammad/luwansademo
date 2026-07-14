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
            {/* Langsung muat CDN Utama Salesforce */}
            <Script
                src="https://cdn.c360a.salesforce.com/beacon/c360a/0d0c0943-d1e4-4472-ae82-4a1b82e85a65/scripts/c360a.min.js"
                strategy="afterInteractive"
                onLoad={() => {
                    // KODE INI AMAN: Hanya berjalan saat c360a.min.js sudah 100% ter-load
                    if (window.SalesforceInteractions) {
                        window.SalesforceInteractions.init({
                            cookieDomain: window.location.hostname,
                            consents: [
                                {
                                    provider: "luwansa-website",
                                    purpose: "Personalization",
                                    status: "Opt In"
                                }
                            ]
                        });
                    }
                }}
            />
            {children}
        </>
    );
}