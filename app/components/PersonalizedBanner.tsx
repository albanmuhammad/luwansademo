"use client";

import { useSyncExternalStore } from "react";
import Image from "next/image";
import { getLocalSegment, subscribeLocalSegment } from "../../lib/salesforce/segment";
import type { RoomCategory } from "../../lib/salesforce/track";

const BANNERS: Record<RoomCategory | "default", { image: string; title: string; subtitle: string; cta: string; href: string }> = {
  default: {
    image:
      "https://www.jsluwansa.com/wp-content/uploads/sites/76/2026/07/Website-Landing-Page-2026-NEW.jpg",
    title: "Selamat Datang di JS Luwansa Hotel & Convention Center",
    subtitle: "Kenyamanan menginap dan fasilitas MICE terbaik di kawasan Kuningan, Jakarta.",
    cta: "Lihat Kamar",
    href: "/rooms",
  },
  b2c: {
    image:
      "https://www.jsluwansa.com/wp-content/uploads/sites/76/2024/11/JS-Luwansa-Ambassador-Room-3-2200x1200.jpg",
    title: "Nikmati Staycation Nyaman Bersama Keluarga",
    subtitle: "Dapatkan penawaran spesial untuk kamar pilihan Anda.",
    cta: "Pesan Kamar Sekarang",
    href: "/rooms",
  },
  b2b: {
    image:
      "https://www.jsluwansa.com/wp-content/uploads/sites/76/2024/11/JSL-Meeting-Room-3-2200x1200.jpg",
    title: "Selenggarakan Meeting & Konvensi Anda di JS Luwansa",
    subtitle: "Ruang meeting fleksibel dengan fasilitas MICE lengkap.",
    cta: "Lihat Ruang Meeting",
    href: "/meetings",
  },
};

function getSnapshot(): RoomCategory | "default" {
  return getLocalSegment() ?? "default";
}

function getServerSnapshot(): RoomCategory | "default" {
  return "default";
}

export default function PersonalizedBanner() {
  const segment = useSyncExternalStore(subscribeLocalSegment, getSnapshot, getServerSnapshot);
  const banner = BANNERS[segment];

  return (
    <div className="relative w-full h-[360px] sm:h-[440px] overflow-hidden">
      <Image src={banner.image} alt={banner.title} fill priority className="object-cover" />
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 h-full flex flex-col items-start justify-center gap-4 px-6 sm:px-16 max-w-2xl">
        <h1 className="text-white text-3xl sm:text-4xl font-semibold leading-tight">{banner.title}</h1>
        <p className="text-white/90 text-base sm:text-lg">{banner.subtitle}</p>
        <a href={banner.href} className="rounded-full bg-white text-black px-6 py-3 text-sm font-medium hover:opacity-90">
          {banner.cta}
        </a>
      </div>
    </div>
  );
}