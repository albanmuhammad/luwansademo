"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

declare global {
    interface Window {
        SalesforceInteractions?: any;
    }
}

export default function SalesforceProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [sdkReady, setSdkReady] = useState(false);
    const isFirstLoad = useRef(true);

    const initializeSDK = () => {
        if (typeof window === "undefined" || !window.SalesforceInteractions) return;
        const sdk = window.SalesforceInteractions;

        if (sdk.isInitialized?.()) {
            setSdkReady(true);
            return;
        }

        sdk
            .init({
                cookieDomain: window.location.hostname,
                consents: [],
            })
            .then(() => {
                console.log("Salesforce SDK berhasil diinisialisasi");
                setSdkReady(true);
            });
    };

    useEffect(() => {
        if (isFirstLoad.current) {
            isFirstLoad.current = false;
            return;
        }
        if (sdkReady && window.SalesforceInteractions) {
            window.SalesforceInteractions.reinit();
        }
    }, [pathname, sdkReady]);

    return (
        <>
            <Script
                src="https://cdn.c360a.salesforce.com/beacon/c360a/0d0c0943-d1e4-4472-ae82-4a1b82e85a65/scripts/c360a.min.js"
                strategy="afterInteractive"
                onLoad={initializeSDK}
            />
            {children}
        </>
    );
}