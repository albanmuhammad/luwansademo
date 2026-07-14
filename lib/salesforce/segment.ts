"use client";

import type { RoomCategory } from "./track";

/**
 * CATATAN PENTING (baca ini sebelum pakai):
 *
 * Personalisasi banner "sebenarnya" seharusnya dikontrol dari sisi Salesforce
 * Personalization (Content Zone / Decision yang di-setup admin di org Anda),
 * berdasarkan Category yang kita kirim lewat trackViewItem/trackPurchase di track.ts.
 * Itu jalur yang dipakai untuk personalisasi lintas-device / lintas-sesi yang "beneran".
 *
 * Fungsi di file ini HANYA fallback lokal (disimpan di localStorage browser) supaya
 * banner di homepage bisa langsung berubah pada sesi yang sama begitu user selesai
 * memesan -- berguna untuk demo/testing sebelum campaign di Salesforce selesai
 * dikonfigurasi. Setelah campaign Salesforce siap, ganti PersonalizedBanner.tsx agar
 * membaca hasil zone/campaign dari SDK, dan fungsi ini bisa dibuang.
 *
 * localStorage adalah "external system" (di luar React), jadi cara membacanya
 * di komponen React sebaiknya lewat useSyncExternalStore (lihat subscribeLocalSegment
 * di bawah), bukan useEffect + useState -- itu yang dipakai PersonalizedBanner.tsx.
 */

const STORAGE_KEY = "luwansa_segment";

type Listener = () => void;
const listeners = new Set<Listener>();

export function setLocalSegment(segment: RoomCategory) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, segment);
  } catch {
    // localStorage bisa gagal (mode private/incognito) -> abaikan, tidak fatal
  }
  // beri tahu semua subscriber di tab yang sama (event "storage" browser hanya
  // fire di tab LAIN, bukan tab yang melakukan perubahan)
  listeners.forEach((listener) => listener());
}

export function getLocalSegment(): RoomCategory | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === "b2c" || value === "b2b" ? value : null;
  } catch {
    return null;
  }
}

/** Dipakai oleh useSyncExternalStore untuk subscribe ke perubahan segment. */
export function subscribeLocalSegment(callback: Listener) {
  listeners.add(callback);
  window.addEventListener("storage", callback); // sinkron antar-tab
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}
