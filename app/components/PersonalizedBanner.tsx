"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchPersonalization } from "../../lib/salesforce/personalization";

interface BannerAttributes {
  BackgroundImageUrl: string;
  Header: string;
  Subheader: string;
  CallToActionText: string;
  CallToActionUrl: string;
}

const DEFAULT_BANNER: BannerAttributes = {
  BackgroundImageUrl:
    "https://www.jsluwansa.com/wp-content/uploads/sites/76/2026/07/Website-Landing-Page-2026-NEW.jpg",
  Header: "Selamat Datang di JS Luwansa Hotel & Convention Center",
  Subheader: "Kenyamanan menginap dan fasilitas MICE terbaik di kawasan Kuningan, Jakarta.",
  CallToActionText: "Lihat Kamar",
  CallToActionUrl: "/rooms",
};

// Lama fade out/in dalam ms -- harus SAMA dengan angka di className duration-* di bawah
const FADE_MS = 400;

export default function PersonalizedBanner() {
  const [banner, setBanner] = useState<BannerAttributes>(DEFAULT_BANNER);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    fetchPersonalization<{
      personalizations: Array<{
        personalizationPointName: string;
        attributes: Partial<BannerAttributes>;
      }>;
    }>(["Homepage_Banner"])
      .then((res) => {
        const point = res?.personalizations?.find(
          (p) => p.personalizationPointName === "Homepage_Banner",
        );
        if (point?.attributes && Object.keys(point.attributes).length > 0) {
          // Crossfade: fade-out konten lama dulu, baru ganti isinya, lalu fade-in.
          setVisible(false);
          setTimeout(() => {
            setBanner((prev) => ({ ...prev, ...point.attributes }));
            setVisible(true);
          }, FADE_MS);
        }
      })
      .catch((err) => {
        console.warn(
          "[Luwansa] Gagal fetch personalisasi Homepage_Banner, pakai fallback default:",
          err,
        );
      });
  }, []);

  return (
    <div className="relative w-full h-[360px] sm:h-[440px] overflow-hidden">
      <div
        className={`absolute inset-0 transition-opacity duration-[400ms] ease-in-out ${visible ? "opacity-100" : "opacity-0"
          }`}
      >
        <Image
          src={banner.BackgroundImageUrl}
          alt={banner.Header}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 h-full flex flex-col items-start justify-center gap-4 px-6 sm:px-16 max-w-2xl">
          <h1 className="text-white text-3xl sm:text-4xl font-semibold leading-tight">
            {banner.Header}
          </h1>
          <p className="text-white/90 text-base sm:text-lg">{banner.Subheader}</p>
          <a href={banner.CallToActionUrl} className="rounded-full bg-white text-black px-6 py-3 text-sm font-medium hover:opacity-90">
            {banner.CallToActionText}
          </a>
        </div>
      </div>
    </div>
  );
}