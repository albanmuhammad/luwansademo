/**
 * SITEMAP.JS -- JS Luwansa Hotel & Convention Center
 * Uji menggunakan Salesforce Sitemap Editor + Event Validation
 */

const sitemapConfig = {
  global: {
    onActionEvent: function (actionEvent, context) {
      const target = context && context.target;
      if (!target) return actionEvent;

      const addToCartEl = target.closest("[data-sf-add-to-cart]");
      if (addToCartEl) {
        actionEvent.interaction = {
          name: SalesforceInteractions.CartInteractionName.AddToCart,
          cart: {
            lineItems: [buildLineItem(addToCartEl)],
          },
        };
      }
      return actionEvent;
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
      interaction: {
        name: SalesforceInteractions.CatalogObjectInteractionName
          .ViewCatalogObject,
        catalogObject: function () {
          const el = document.querySelector("[data-sf-catalog-id]");
          return el ? buildCatalogObject(el) : undefined;
        },
      },
    },
    {
      name: "meeting_detail",
      isMatch: function () {
        return window.location.pathname.indexOf("/meetings/") === 0;
      },
      interaction: {
        name: SalesforceInteractions.CatalogObjectInteractionName
          .ViewCatalogObject,
        catalogObject: function () {
          const el = document.querySelector("[data-sf-catalog-id]");
          return el ? buildCatalogObject(el) : undefined;
        },
      },
    },
    {
      name: "reservation",
      isMatch: function () {
        return window.location.pathname.indexOf("/reservation/") === 0;
      },
      listeners: [
        SalesforceInteractions.listener("submit", "form", function (event) {
          // JANGAN hapus baris ini. Ini memberi jeda agar asinkronus sendEvent
          // tidak terputus oleh manipulasi DOM komponen React di baliknya.
          const formEl = event.target.closest("form");
          if (!formEl) return;

          const getField = function (name) {
            const input = formEl.querySelector(
              '[data-sf-field="' + name + '"]',
            );
            return input ? input.value : undefined;
          };

          const checkInVal = getField("checkIn");
          const checkOutVal = getField("checkOut");
          let totalNights = 1;

          if (checkInVal && checkOutVal) {
            const date1 = new Date(checkInVal);
            const date2 = new Date(checkOutVal);
            const diffTime = date2.getTime() - date1.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays > 0) {
              totalNights = diffDays;
            }
          }

          const baseRoomPrice =
            Number(formEl.getAttribute("data-sf-price")) || 0;
          const grandTotalPrice = baseRoomPrice * totalNights;

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
              name: SalesforceInteractions.OrderInteractionName.Purchase,
              order: {
                id: "ORD-" + Date.now(),
                price: grandTotalPrice,
                lineItems: [buildLineItem(formEl, totalNights)],
                attributes: {
                  checkIn: checkInVal,
                  checkOut: checkOutVal,
                  category: formEl.getAttribute("data-sf-category"),
                },
              },
            },
          });
        }),
      ],
    },
  ],
};

SalesforceInteractions.initSitemap(sitemapConfig);

/** Helper Functions */
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

/**
 * Bangun objek lineItem dengan kuantitas malam dinamis
 * @param {HTMLElement} el Elemen form
 * @param {number} nights Jumlah malam hasil kalkulasi
 */
function buildLineItem(el, nights) {
  // Gunakan kuantitas malam yang dihitung, jika tidak dilempar (seperti di AddToCart global) default ke 1
  const quantityValue = nights && nights > 0 ? nights : 1;

  return {
    catalogObjectType: el.getAttribute("data-sf-catalog-type"),
    catalogObjectId: el.getAttribute("data-sf-catalog-id"),
    quantity: quantityValue,
    price: Number(el.getAttribute("data-sf-price")) || 0, // Ini tetap diisi harga per satu malam / per unit
  };
}
