"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
    interface Window {
        SalesforceInteractions?: any;
    }
}

export default function SalesforceProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    useEffect(() => {
        const initializeSDK = () => {
            if (window.SalesforceInteractions) {
                const sdk = window.SalesforceInteractions;

                // Cek apakah sudah pernah diinit agar tidak double init
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
                });
            }
        };

        // Jalankan langsung jika script sudah instan tersedia
        initializeSDK();

        // Dengarkan event jika script baru selesai dimuat pasca-mount
        window.addEventListener("salesforce-sdk-ready", initializeSDK);
        return () => window.removeEventListener("salesforce-sdk-ready", initializeSDK);
    }, []);

    useEffect(() => {
        if (window.SalesforceInteractions) {
            window.SalesforceInteractions.reinit();
        }
    }, [pathname]);

    return <>{children}</>;
}