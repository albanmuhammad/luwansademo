/**
 * SITEMAP.JS -- JS Luwansa Hotel & Convention Center
 *
 * CATATAN PENTING (baca dulu): versi sebelumnya pakai property `listeners:` dan
 * `interaction:` di dalam pageTypes -- itu TIDAK terverifikasi dan ternyata tidak
 * ke-attach sama sekali (tidak ada request keluar walau diklik). Versi ini sengaja
 * TIDAK bergantung pada skema deklaratif Salesforce yang belum terverifikasi --
 * semua event dikirim lewat event listener JavaScript biasa (document-level,
 * capture phase) + SalesforceInteractions.sendEvent() langsung, yang sudah
 * dikonfirmasi valid dari dokumentasi resmi.
 *
 * pageTypes di bawah TETAP dipertahankan untuk klasifikasi halaman (berguna untuk
 * fitur Personalization lain seperti Content Zone), tapi TIDAK lagi jadi tempat
 * bergantungnya pengiriman event.
 */

console.log("[Luwansa] 1. Script sitemap.js mulai dieksekusi");

const sfInitPromise = SalesforceInteractions.init({
  cookieDomain: window.location.hostname,
  consents: [
    {
      provider: "luwansa-website",
      purpose:
        SalesforceInteractions.ConsentPurpose?.Personalization ??
        "Personalization",
      status: SalesforceInteractions.ConsentStatus?.OptIn ?? "OptIn",
    },
  ],
});

console.log(
  "[Luwansa] 2. init() sudah dipanggil, sfInitPromise:",
  sfInitPromise,
);

// ============================================================
// PENTING: listener di bawah ini didaftarkan SEGERA, TIDAK menunggu init()
// selesai/resolve. Kalau init() gagal/reject diam-diam, listener tetap ke-attach
// -- kita tidak mau seluruh tracking mati cuma gara-gara satu promise gagal.
// ============================================================

// --- 1. View Item ---
function trackViewIfDetailPage() {
  const path = window.location.pathname;
  if (path.indexOf("/rooms/") !== 0 && path.indexOf("/meetings/") !== 0) return;
  const el = document.querySelector("[data-sf-catalog-id]");
  if (!el) return;
  SalesforceInteractions.sendEvent({
    interaction: {
      name: SalesforceInteractions.CatalogObjectInteractionName
        .ViewCatalogObject,
      catalogObject: buildCatalogObject(el),
    },
  });
}

// --- 2. Add to Cart ---
document.addEventListener(
  "click",
  function (event) {
    const el = event.target.closest("[data-sf-add-to-cart]");
    if (!el) return;
    SalesforceInteractions.sendEvent({
      interaction: {
        name: SalesforceInteractions.CartInteractionName.AddToCart,
        cart: { lineItems: [buildLineItem(el, 1)] },
      },
    });
  },
  true,
);

// --- 3. Purchase + Identity ---
document.addEventListener(
  "submit",
  function (event) {
    console.log(
      "[Luwansa] 3. Event 'submit' TERTANGKAP. target:",
      event.target,
    );

    const formEl = event.target.closest("[data-sf-catalog-id]");
    console.log("[Luwansa] 4. Hasil closest('[data-sf-catalog-id]'):", formEl);

    if (!formEl || formEl.tagName !== "FORM") {
      console.log(
        "[Luwansa] 4b. STOP -- formEl tidak ditemukan atau bukan <form>",
      );
      return;
    }

    const getField = function (name) {
      const input = formEl.querySelector('[data-sf-field="' + name + '"]');
      return input ? input.value : undefined;
    };

    const checkInVal = getField("checkIn");
    const checkOutVal = getField("checkOut");
    let totalNights = 1;
    if (checkInVal && checkOutVal) {
      const diffDays = Math.ceil(
        (new Date(checkOutVal).getTime() - new Date(checkInVal).getTime()) /
          86400000,
      );
      if (diffDays > 0) totalNights = diffDays;
    }

    const basePrice = Number(formEl.getAttribute("data-sf-price")) || 0;

    console.log("[Luwansa] 5. Mengirim sendEvent Purchase...", {
      catalogId: formEl.getAttribute("data-sf-catalog-id"),
      price: basePrice,
      nights: totalNights,
    });

    console.log(
      "[Luwansa] 5. Mengirim rangkaian sendEvent (Identity, Contact Point, & Purchase)...",
    );

    const emailValue = getField("email");
    const phoneValue = getField("phone");

    // 1. Kirim Event Identity Utama + Purchase (Sesuai kode awalmu)
    SalesforceInteractions.sendEvent({
      user: {
        attributes: {
          eventType: "identity",
          isAnonymous: 0,
          email: emailValue,
          firstName: getField("firstName"),
          lastName: getField("lastName"),
          phone: phoneValue,
          gender: getField("gender"),
          country: getField("country"),
        },
      },
      interaction: {
        name: SalesforceInteractions.OrderInteractionName.Purchase,
        order: {
          id: "ORD-" + Date.now(),
          totalValue: basePrice * totalNights,
          lineItems: [buildLineItem(formEl, totalNights)],
          attributes: {
            checkIn: checkInVal,
            checkOut: checkOutVal,
            category: formEl.getAttribute("data-sf-category"),
          },
        },
      },
    });

    // 2. Kirim Event untuk contactPointEmail jika email ada
    if (emailValue) {
      SalesforceInteractions.sendEvent({
        user: {
          attributes: {
            eventType: "contactPointEmail", // Mengarahkan ke stream contactPointEmail
            email: emailValue, // Field wajib sesuai skema
            category: "Profile", // Kategori dari skema JSON kamu
          },
        },
      });
    }

    // 3. Kirim Event untuk contactPointPhone jika nomor hp ada
    if (phoneValue) {
      SalesforceInteractions.sendEvent({
        user: {
          attributes: {
            eventType: "contactPointPhone", // Mengarahkan ke stream contactPointPhone
            phoneNumber: phoneValue, // Field wajib sesuai skema kamu
            category: "Profile", // Kategori dari skema JSON kamu[cite: 1]
          },
        },
      });
    }
  },
  true,
);

// --- 4. Deteksi navigasi SPA ---
let lastPath = window.location.pathname;
function handleRouteChange() {
  if (window.location.pathname === lastPath) return;
  lastPath = window.location.pathname;
  SalesforceInteractions.reinit();
  trackViewIfDetailPage();
}
const originalPushState = history.pushState;
history.pushState = function () {
  originalPushState.apply(this, arguments);
  handleRouteChange();
};
const originalReplaceState = history.replaceState;
history.replaceState = function () {
  originalReplaceState.apply(this, arguments);
  handleRouteChange();
};
window.addEventListener("popstate", handleRouteChange);

console.log(
  "[Luwansa] 6. Semua listener (click/submit/popstate) sudah terpasang",
);

trackViewIfDetailPage(); // page load pertama

// ============================================================
// initSitemap() dipisah, dibungkus try/catch + .catch() supaya kalau GAGAL,
// errornya MUNCUL JELAS di Console -- tidak lagi diam-diam hilang.
// ============================================================
sfInitPromise
  .then(function () {
    // Aktifkan debug logging SDK -- ini akan mencetak log detail dari SDK sendiri
    // (event yang terkirim, payload lengkap, error internal) ke Console, bukan cuma
    // log manual yang saya tulis. Method resmi: setLoggingLevel(), BUKAN property
    // assignment seperti `log.level = "debug"`.
    SalesforceInteractions.setLoggingLevel("debug");
    console.log("[Luwansa] 2b. Debug logging SDK diaktifkan");

    try {
      const sitemapConfig = {
        global: {},
        pageTypes: [
          {
            name: "home",
            isMatch: function () {
              return window.location.pathname === "/";
            },
          },
          {
            name: "rooms_list",
            isMatch: function () {
              return window.location.pathname === "/rooms";
            },
          },
          {
            name: "meetings_list",
            isMatch: function () {
              return window.location.pathname === "/meetings";
            },
          },
          {
            name: "room_detail",
            isMatch: function () {
              return window.location.pathname.indexOf("/rooms/") === 0;
            },
          },
          {
            name: "meeting_detail",
            isMatch: function () {
              return window.location.pathname.indexOf("/meetings/") === 0;
            },
          },
          {
            name: "reservation",
            isMatch: function () {
              return window.location.pathname.indexOf("/reservation/") === 0;
            },
          },
        ],
      };
      SalesforceInteractions.initSitemap(sitemapConfig);
    } catch (e) {
      console.error("[Luwansa] initSitemap() gagal:", e);
    }
  })
  .catch(function (e) {
    console.error("[Luwansa] SalesforceInteractions.init() gagal/reject:", e);
  });

/** Bangun objek catalogObject dari atribut data-sf-* pada sebuah elemen. */
function buildCatalogObject(el) {
  return {
    id: el.getAttribute("data-sf-catalog-id"),
    type: el.getAttribute("data-sf-catalog-type"),
    attributes: {
      name: el.getAttribute("data-sf-name"),
      price: Number(el.getAttribute("data-sf-price")),
      category: el.getAttribute("data-sf-category"),
    },
    relatedCatalogObjects: {
      Category: [el.getAttribute("data-sf-category")],
    },
  };
}

/** Bangun objek lineItem (dipakai di AddToCart & Order). */
function buildLineItem(el, quantity) {
  return {
    catalogObjectType: el.getAttribute("data-sf-catalog-type"),
    catalogObjectId: el.getAttribute("data-sf-catalog-id"),
    quantity: quantity && quantity > 0 ? quantity : 1,
    price: Number(el.getAttribute("data-sf-price")) || 0,
  };
}
