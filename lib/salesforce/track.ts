"use client";

/**
 * Wrapper tipis di atas Salesforce Interactions Web SDK (namespace `SalesforceInteractions`).
 * Semua pemanggilan sendEvent() dipusatkan di sini supaya nama Interaction & bentuk payload
 * konsisten di seluruh aplikasi, dan gampang di-audit terhadap Event Stream di Salesforce.
 *
 * Referensi:
 * - Interaction Definitions: https://developer.salesforce.com/docs/marketing/personalization/guide/interaction-definitions.html
 * - Event Structure:         https://developer.salesforce.com/docs/data/salesforce-interactions-sdk/guide/c360a-api-event-structure.html
 * - User Identity Mapping:   https://developer.salesforce.com/docs/marketing/personalization/guide/user-identity-mapping.html
 *
 * PENTING: nama enum seperti `OrderInteractionName.PurchaseOrder` bisa sedikit berbeda
 * tergantung versi SDK / konfigurasi org Anda. Sebelum go-live, cek nilai persis yang
 * tersedia lewat `console.log(window.SalesforceInteractions)` di browser, atau tanya
 * admin Salesforce Personalization di org Anda, lalu sesuaikan konstanta di bawah.
 */

declare global {
  interface Window {
    SalesforceInteractions?: any;
  }
}

export type RoomCategory = "b2c" | "b2b"; // b2c = Kamar, b2b = Ruang Meeting

export interface CatalogItem {
  id: string; // slug room, dipakai sebagai catalogObject.id
  name: string;
  type: "Kamar" | "RuangMeeting"; // catalogObject.type -> harus match dgn Catalog Object type di Salesforce
  category: RoomCategory;
  price?: number;
  currency?: string;
}

export interface ReservationPayload {
  orderId: string;
  item: CatalogItem;
  guest: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: string;
    country: string;
    checkIn: string;
    checkOut: string;
  };
}

function getSDK() {
  if (typeof window === "undefined") return null;
  return window.SalesforceInteractions ?? null;
}

/** Dipanggil ketika user melihat / membuka detail sebuah room (kamar atau meeting). */
export function trackViewItem(item: CatalogItem) {
  const sdk = getSDK();
  if (!sdk) return;

  sdk.sendEvent({
    interaction: {
      name: sdk.CatalogObjectInteractionName?.ViewCatalogObject ?? "viewCatalogObject",
      catalogObject: {
        id: item.id,
        type: item.type,
        attributes: {
          name: item.name,
          price: item.price,
          currency: item.currency ?? "IDR",
        },
        // dipakai Salesforce untuk membangun affinity/segment per kategori (b2c vs b2b)
        relatedCatalogObjects: {
          Category: [item.category],
        },
      },
    },
  });
}

/** Dipanggil ketika user klik "Pesan Sekarang" (mulai isi form reservasi = niat beli). */
export function trackAddToCart(item: CatalogItem) {
  const sdk = getSDK();
  if (!sdk) return;

  sdk.sendEvent({
    interaction: {
      name: sdk.CartInteractionName?.AddToCart ?? "addToCart",
      cart: {
        lineItems: [
          {
            catalogObjectType: item.type,
            catalogObjectId: item.id,
            quantity: 1,
            price: item.price,
          },
        ],
      },
    },
  });
}

/**
 * Dipanggil ketika user klik "Beli Sekarang" di form reservasi.
 * Menggabungkan dua hal dalam satu event:
 *  1. Identity  -> mengirim `user.attributes` (email, nama, dst) sehingga Salesforce
 *                  langsung mencocokkan/mem-merge profil anonim menjadi known user.
 *  2. Purchase  -> mengirim Order Interaction sehingga item ini tercatat sebagai transaksi,
 *                  dan Category (b2c/b2b) ikut terekam sebagai bagian dari purchase history.
 */
export function trackPurchase({ orderId, item, guest }: ReservationPayload) {
  const sdk = getSDK();
  if (!sdk) return;

  sdk.sendEvent({
    user: {
      attributes: {
        email: guest.email,
        firstName: guest.firstName,
        lastName: guest.lastName,
        phone: guest.phone,
        gender: guest.gender,
        country: guest.country,
      },
    },
    interaction: {
      name: sdk.OrderInteractionName?.PurchaseOrder ?? "purchase",
      order: {
        id: orderId,
        lineItems: [
          {
            catalogObjectType: item.type,
            catalogObjectId: item.id,
            quantity: 1,
            price: item.price,
          },
        ],
        attributes: {
          checkIn: guest.checkIn,
          checkOut: guest.checkOut,
          category: item.category, // b2c | b2b -> ini yang jadi dasar segmentasi banner
        },
      },
    },
  });
}

/** Helper generik untuk custom event lain (klik tab, klik CTA, dll) kalau dibutuhkan nanti. */
export function trackCustomEvent(name: string, attributes?: Record<string, unknown>) {
  const sdk = getSDK();
  if (!sdk) return;
  sdk.sendEvent({
    interaction: { name },
    ...(attributes ? { attributes } : {}),
  });
}
