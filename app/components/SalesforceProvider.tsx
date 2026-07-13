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

        // Cegah inisialisasi ganda (misal saat hot-reload di dev)
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
                sdk.initSitemap({
                    global: {},
                    pageTypeDefault: { name: "default" },
                    pageTypes: [
                        // Definisikan pageType per section supaya Salesforce bisa membedakan
                        // Home / Rooms / Meetings / Reservation di dashboard Personalization.
                        {
                            name: "home",
                            isMatch: () => window.location.pathname === "/",
                        },
                        {
                            name: "rooms_list",
                            isMatch: () => window.location.pathname === "/rooms",
                        },
                        {
                            name: "room_detail",
                            isMatch: () => window.location.pathname.startsWith("/rooms/"),
                        },
                        {
                            name: "meetings_list",
                            isMatch: () => window.location.pathname === "/meetings",
                        },
                        {
                            name: "meeting_detail",
                            isMatch: () => window.location.pathname.startsWith("/meetings/"),
                        },
                        {
                            name: "reservation",
                            isMatch: () => window.location.pathname.startsWith("/reservation/"),
                        },
                    ],
                });
                console.log("Salesforce SDK berhasil diinisialisasi");
                setSdkReady(true);
            });
    };

    // Next.js App Router adalah SPA setelah load pertama, jadi setiap ganti route
    // (klik tab Home/Kamar/Meeting, dst) harus memberi tahu SDK ada "page view" baru.
    useEffect(() => {
        if (isFirstLoad.current) {
            isFirstLoad.current = false;
            return; // page view pertama sudah ditangani oleh init() + initSitemap() di atas
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
