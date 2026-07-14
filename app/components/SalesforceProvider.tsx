"use client";

import Script from "next/script";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
    interface Window {
        SalesforceInteractions?: any;
    }
}



export default function SalesforceProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // TEMPAT REINIT: Dipicu otomatis oleh Next.js setiap kali pindah halaman
    useEffect(() => {
        if (typeof window !== "undefined" && window.SalesforceInteractions) {
            // Memaksa SDK mengevaluasi ulang isMatch() pada sitemap karena route SPA berubah
            window.SalesforceInteractions.reinit();
        }
    }, [pathname]);

    return (
        <>
            {/* TEMPAT INIT: Dijalankan secara deklaratif begitu script beacon siap */}
            <Script
                src="https://cdn.c360a.salesforce.com/beacon/c360a/0d0c0943-d1e4-4472-ae82-4a1b82e85a65/scripts/c360a.min.js"
                strategy="afterInteractive"
                onLoad={() => {
                    if (window.SalesforceInteractions) {
                        window.SalesforceInteractions.init({
                            cookieDomain: window.location.hostname,
                            consents: [
                                {
                                    provider: "luwansa-website",
                                    purpose: "Personalization",
                                    status: "OptIn",
                                },
                            ],
                        });
                    }
                }}
            />
            {children}
        </>
    );
}