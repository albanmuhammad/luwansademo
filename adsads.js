/**
 * DRAF sitemap.js -- JS Luwansa Hotel & Convention Center
 *
 * PENTING: ini draf berbasis pola resmi dari dokumentasi Salesforce
 * (Sitemap / itemAction / onActionEvent / PageConfig), TAPI sebelum di-upload,
 * verifikasi ulang syntax persis (nama fungsi utility, bentuk objek LineItem/Order,
 * dsb) terhadap contoh resmi di:
 *   - https://developer.salesforce.com/docs/marketing/einstein-personalization/guide/example-sitemap.html
 *   - https://developer.salesforce.com/docs/data/salesforce-interactions-sdk/guide/c360a-api-sample-ecommerce-sitemap.html
 * Uji juga pakai Sitemap Editor + Event Validation (Network tab) sebelum go-live,
 * karena signature persis bisa berbeda tergantung versi SDK di org Anda.
 *
 * Kontrak data-sf-* yang dipakai file ini didokumentasikan lengkap di
 * SALESFORCE-TRACKING.md.
 */

/**
 * PENTING: init() HANYA ada di sini -- satu-satunya tempat di seluruh sistem yang
 * memanggil SalesforceInteractions.init(). React app (SalesforceProvider.tsx) TIDAK
 * memanggil init() sama sekali, cuma memuat beacon script + reinit() saat route
 * berubah. Kalau ada init() lain selain yang di bawah ini, HAPUS -- double init()
 * adalah penyebab paling umum kenapa tracking tidak jalan / consent tidak ke-set.
 */
SalesforceInteractions.init({
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
}).then(function () {
  const sitemapConfig = {
    global: {
      onActionEvent: function (actionEvent, context) {
        const target = context && context.target;
        if (!target) return;

        const addToCartEl = target.closest("[data-sf-add-to-cart]");
        if (addToCartEl) {
          SalesforceInteractions.sendEvent({
            interaction: {
              name: SalesforceInteractions.CartInteractionName.AddToCart,
              cart: {
                lineItems: [buildLineItem(addToCartEl)],
              },
            },
          });
        }
      },
    },

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
        action: function () {
          const el = document.querySelector("[data-sf-catalog-id]");
          if (!el) return;
          SalesforceInteractions.sendEvent({
            interaction: {
              name: SalesforceInteractions.CatalogObjectInteractionName
                .ViewCatalogObject,
              catalogObject: buildCatalogObject(el),
            },
          });
        },
      },
      {
        name: "meeting_detail",
        isMatch: function () {
          return window.location.pathname.indexOf("/meetings/") === 0;
        },
        action: function () {
          const el = document.querySelector("[data-sf-catalog-id]");
          if (!el) return;
          SalesforceInteractions.sendEvent({
            interaction: {
              name: SalesforceInteractions.CatalogObjectInteractionName
                .ViewCatalogObject,
              catalogObject: buildCatalogObject(el),
            },
          });
        },
      },
      {
        name: "reservation",
        isMatch: function () {
          return window.location.pathname.indexOf("/reservation/") === 0;
        },
        onActionEvent: function (actionEvent, context) {
          const target = context && context.target;
          if (!target) return;

          const purchaseBtn = target.closest("[data-sf-purchase-cta]");
          if (!purchaseBtn) return;

          const formEl = purchaseBtn.closest("form");
          if (!formEl) return;

          const getField = function (name) {
            const input = formEl.querySelector(
              '[data-sf-field="' + name + '"]',
            );
            return input ? input.value : undefined;
          };

          SalesforceInteractions.sendEvent({
            user: {
              attributes: {
                email: getField("email"),
                firstName: getField("firstName"),
                lastName: getField("lastName"),
                phone: getField("phone"),
                gender: getField("gender"),
                country: getField("country"),
              },
            },
            interaction: {
              name: SalesforceInteractions.OrderInteractionName.PurchaseOrder,
              order: {
                id: "ORD-" + Date.now(),
                lineItems: [buildLineItem(formEl)],
                attributes: {
                  checkIn: getField("checkIn"),
                  checkOut: getField("checkOut"),
                  category: formEl.getAttribute("data-sf-category"),
                },
              },
            },
          });
        },
      },
    ],
  };

  SalesforceInteractions.initSitemap(sitemapConfig);

  // Deteksi navigasi SPA (Next.js App Router) tanpa bantuan React sama sekali
  let lastPath = window.location.pathname;

  function handleRouteChange() {
    if (window.location.pathname === lastPath) return;
    lastPath = window.location.pathname;
    SalesforceInteractions.reinit();
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
});

/** Bangun objek catalogObject dari atribut data-sf-* pada sebuah elemen. */
function buildCatalogObject(el) {
  return {
    id: el.getAttribute("data-sf-catalog-id"),
    type: el.getAttribute("data-sf-catalog-type"),
    attributes: {
      name: el.getAttribute("data-sf-name"),
      price: Number(el.getAttribute("data-sf-price")),
    },
    relatedCatalogObjects: {
      Category: [el.getAttribute("data-sf-category")],
    },
  };
}

/** Bangun objek lineItem (dipakai di AddToCart & Order) dari elemen yang sama. */
function buildLineItem(el) {
  return {
    catalogObjectType: el.getAttribute("data-sf-catalog-type"),
    catalogObjectId: el.getAttribute("data-sf-catalog-id"),
    quantity: 1,
    price: Number(el.getAttribute("data-sf-price")),
  };
}
