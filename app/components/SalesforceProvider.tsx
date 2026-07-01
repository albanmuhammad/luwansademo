"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script"; // Impor Script di sini

declare global {
    interface Window {
        SalesforceInteractions?: any;
    }
}

export default function SalesforceProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [sdkReady, setSdkReady] = useState(false);

    const initializeSDK = () => {
        if (typeof window !== "undefined" && window.SalesforceInteractions) {
            const sdk = window.SalesforceInteractions;

            // Cegah inisialisasi ganda
            if (sdk.isInitialized?.()) return;

            sdk.init({
                cookieDomain: window.location.hostname,
                consents: [],
            }).then(() => {
                sdk.initSitemap({
                    global: {},
                    pageTypeDefault: { name: "default" },
                    pageTypes: []
                });
                console.log("Salesforce SDK Berhasil Diinisialisasi");
                setSdkReady(true);
            });
        }
    };

    // Jalankan reinit saat rute berubah, tapi pastikan SDK sudah ready dulu
    useEffect(() => {
        if (sdkReady && window.SalesforceInteractions) {
            window.SalesforceInteractions.reinit();
        }
    }, [pathname, sdkReady]);

    return (
        <>
            {/* Script aman ditaruh di sini karena ini Client Component */}
            <Script
                src="https://cdn.c360a.salesforce.com/beacon/c360a/0d0c0943-d1e4-4472-ae82-4a1b82e85a65/scripts/c360a.min.js"
                strategy="afterInteractive"
                onLoad={initializeSDK} // Fungsi onLoad aman dieksekusi di sini
            />
            {children}
        </>
    );
}