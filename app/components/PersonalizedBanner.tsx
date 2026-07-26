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
    "https://www.jsluwansa.com/wp-content/uploads/sites/76/2024/11/JS-Luwansa-Grand-Deluxe-Corner-2200x1200.jpg",
  Header: "Feel the Comfort",
  Subheader: "Relax and Enjoy",
  CallToActionText: "Booking Now",
  CallToActionUrl: "/rooms",
};

export default function PersonalizedBanner() {
  const [banner, setBanner] = useState<BannerAttributes>(DEFAULT_BANNER);

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
        if (point?.attributes) {
          setBanner((prev) => ({ ...prev, ...point.attributes }));
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
  );
}