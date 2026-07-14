"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

declare global {
    interface Window {
        SalesforceInteractions?: any;
    }
}

export default function SalesforceProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isFirstLoad = useRef(true);

    useEffect(() => {
        if (isFirstLoad.current) {
            isFirstLoad.current = false;
            return; // page view pertama sudah ditangani otomatis oleh sitemap saat load
        }
        window.SalesforceInteractions?.reinit?.();
    }, [pathname]);

    return (
        <>
            <Script
                src="https://cdn.c360a.salesforce.com/beacon/c360a/0d0c0943-d1e4-4472-ae82-4a1b82e85a65/scripts/c360a.min.js"
                strategy="afterInteractive"
            />
            {children}
        </>
    );
}