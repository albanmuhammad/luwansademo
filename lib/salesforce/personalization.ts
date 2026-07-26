"use client";

declare global {
  interface Window {
    SalesforceInteractions?: any;
  }
}

/**
 * Fetch satu atau lebih Personalization Point lewat SDK (SalesforceInteractions.Personalization.fetch).
 * SDK otomatis memakai individualId/anonymousId yang sama dengan yang dipakai untuk
 * tracking (sendEvent) -- tidak perlu di-set manual seperti waktu testing di Postman.
 *
 * Ada retry karena komponen ini bisa mount SEBELUM sitemap.js selesai load & init()
 * (script beacon dimuat dengan strategy="afterInteractive", jadi ada jeda waktu).
 */
export function fetchPersonalization<T = any>(
  pointNames: string[],
  maxAttempts = 25,
  intervalMs = 200,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const tryFetch = (attemptsLeft: number) => {
      const sdk = window.SalesforceInteractions;
      if (sdk?.Personalization?.fetch) {
        sdk.Personalization.fetch(pointNames).then(resolve).catch(reject);
        return;
      }
      if (attemptsLeft <= 0) {
        reject(
          new Error(
            "SalesforceInteractions.Personalization belum siap (timeout)",
          ),
        );
        return;
      }
      setTimeout(() => tryFetch(attemptsLeft - 1), intervalMs);
    };
    tryFetch(maxAttempts);
  });
}
