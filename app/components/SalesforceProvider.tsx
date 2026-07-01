"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Mencegah TypeScript error jika tipe global belum didefinisikan
declare global {
    interface Window {
        SalesforceInteractions?: any;
    }
}

export default function SalesforceProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    useEffect(() => {
        // Memastikan SDK sudah terload di objek window
        if (typeof window !== "undefined" && window.SalesforceInteractions) {
            const sdk = window.SalesforceInteractions;

            // 1. Jalankan Inisialisasi Utama (misalnya menggunakan No Consent / Pre-configured)
            sdk.init({
                cookieDomain: window.location.hostname, // Otomatis mengambil domain saat ini
                consents: [], // Sesuaikan logika consent Anda di sini
            }).then(() => {
                // 2. Jalankan Inisialisasi Sitemap setelah init selesai
                sdk.initSitemap({
                    global: {
                        // Konfigurasi global sitemap Anda
                    },
                    pageTypeDefault: {
                        // Default page type
                    },
                    pageTypes: [
                        // List page types Anda
                    ]
                });
            });
        }
    }, []); // Hanya berjalan sekali saat aplikasi pertama kali dimuat (mount)

    // 3. Efek untuk menangani perubahan URL (Virtual Page) di Next.js Single Page App
    useEffect(() => {
        if (typeof window !== "undefined" && window.SalesforceInteractions) {
            // Pemicu reinit setiap kali variabel `pathname` berubah
            window.SalesforceInteractions.reinit();
        }
    }, [pathname]);

    return <>{children}</>;
}