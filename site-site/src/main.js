import { createApp, provide, h, markRaw, defineAsyncComponent, ref } from "vue";
import App from "./App.vue";
import router from "./router";
import { apolloClient } from "./vue-apollo";
import { provideApolloClient } from "@vue/apollo-composable";
import "./assets/main.css";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
// divmod
function divmod(num, base) {
  return [num / base, num % base];
}
// create a plugin that adds the `formatMoney` method to the global Vue instance
const Plugin = {
  install(app) {
    app.config.globalProperties.formatMoney = function (amount, currencyCode) {
      const noFraction = new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: currencyCode ? currencyCode : "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        currencyDisplay: "narrowSymbol",
      });

      const formatter = new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: currencyCode ? currencyCode : "USD",
        minimumFractionDigits: 2,
        currencyDisplay: "narrowSymbol",
      });
      if (amount % 1 == 0) {
        return noFraction.format(amount);
      } else {
        return formatter.format(amount);
      }
    };
    app.config.globalProperties.formatNumber = function (amount, currencyCode) {
      const formatter = new Intl.NumberFormat(currencyCode, {
        style: "decimal",
      });
      return formatter.format(amount);
    };
    app.config.globalProperties.encodeId = function (numeric_id, alphabet) {
      let v = [];
      if (alphabet == null) {
        alphabet =
          "LceIyBZ3zTE4dPAhlFDRn8aMiuKg5x21JWXCQ7otGOHYU0mfVvS6bsrqj9wkNp";
      }
      let base = alphabet.length;
      let n = numeric_id;
      while (true) {
        const [a, r] = divmod(n, base);
        n = a;
        let c = alphabet.charAt(r);
        if (c) {
          v.push(c);
        }
        if (Math.floor(n) == 0) {
          break;
        }
      }
      return v.reverse().join("");
    };
    app.config.globalProperties.decodeId = function (string_id, alphabet) {
      if (alphabet == null) {
        alphabet =
          "LceIyBZ3zTE4dPAhlFDRn8aMiuKg5x21JWXCQ7otGOHYU0mfVvS6bsrqj9wkNp";
      }
      let base = alphabet.length;
      let n = 0;
      for (const c of Array.from(string_id)) {
        let p = alphabet.indexOf(c);
        if (p !== -1) {
          n = n * base + p;
        } else {
          console.error("Character not found in alphabet:", c);
        }
      }
      return n;
    };
    app.config.globalProperties.formatCurrency = function (currencyCode) {
      var cureency_list = {
        USD: "$",
        SDG: "£",
        AFN: "Af",
        EUR: "€",
        ALL: "L",
        DZD: "DZD",
        AOA: "Kz",
        XCD: "$",
        ARS: "$",
        AMD: "Դ",
        AWG: "ƒ",
        AZN: "ман",
        BSD: "$",
        BHD: "BHD",
        BDT: "৳",
        BBD: "$",
        BYN: "Br",
        BZD: "$",
        BMD: "$",
        INR: "₹",
        BOB: "Bs.",
        BAM: "КМ",
        BWP: "P",
        NOK: "kr",
        BRL: "R$",
        BND: "$",
        BGN: "лв",
        BIF: "₣",
        CVE: "$",
        KHR: "៛",
        CAD: "$",
        KYD: "$",
        CLP: "$",
        CNY: "¥",
        COP: "$",
        KMF: "KMF",
        CDF: "₣",
        CRC: "₡",
        HRK: "Kn",
        CUP: "$",
        CZK: "Kč",
        DJF: "₣",
        DOP: "$",
        EGP: "£",
        DKK: "kr",
        SVC: "SVC",
        ERN: "Nfk",
        SZL: "L",
        ETB: "ETB",
        FKP: "£",
        FJD: "$",
        GMD: "D",
        GEL: "ლ",
        GHS: "₵",
        GIP: "£",
        GTQ: "Q",
        GYD: "$",
        HNL: "L",
        HKD: "$",
        HUF: "Ft",
        ISK: "Kr",
        IDR: "Rp",
        IRR: "IRR",
        IQD: "IQD",
        ILS: "₪",
        JMD: "$",
        JPY: "¥",
        JOD: "JOD",
        KZT: "〒",
        KES: "Sh",
        KWD: "KWD",
        KGS: "KGS",
        LAK: "₭",
        LBP: "LBP",
        LSL: "L",
        LRD: "$",
        LYD: "LYD",
        MOP: "P",
        MGA: "MGA",
        MWK: "MK",
        MYR: "RM",
        MVR: "MVR",
        MRU: "UM",
        MUR: "Rs",
        MXN: "$",
        MDL: "L",
        MNT: "₮",
        MAD: "MAD",
        MZN: "MTn",
        MMK: "K",
        NAD: "$",
        NPR: "₨",
        XPF: "₣",
        NIO: "C$",
        NGN: "₦",
        KPW: "₩",
        MKD: "ден",
        NOK: "kr",
        OMR: "OMR",
        PKR: "Rs",
        PGK: "K",
        PYG: "₲",
        PEN: "S/.",
        PHP: "₱",
        PLN: "zł",
        QAR: "QAR",
        RON: "L",
        RUB: "р.",
        RWF: "₣",
        SHP: "£",
        WST: "T",
        STN: "Db",
        SAR: "SAR",
        RSD: "din",
        SCR: "₨",
        SLL: "Le",
        SGD: "$",
        SBD: "$",
        SOS: "Sh",
        ZAR: "R",
        SSP: "SSP",
        LKR: "Rs",
        SRD: "$",
        NOK: "kr",
        SEK: "kr",
        CHF: "₣",
        SYP: "SYP",
        TWD: "$",
        TJS: "ЅМ",
        TZS: "Sh",
        THB: "฿",
        TOP: "$",
        TTD: "$",
        TND: "TND",
        TRY: "₤",
        TMT: "m",
        UGX: "Sh",
        UAH: "₴",
        AED: "AED",
        UYU: "$",
        UZS: "UZS",
        VUV: "Vt",
        VEF: "Bs F",
        VND: "₫",
        YER: "﷼",
        ZMW: "Zk",
        GBP: "£",
        AUD: "$",
        XOF: "XOF",
        ANG: "ANG",
        XAF: "₣",
        NZD: "$",
        NWL: "$",
      };
      if (cureency_list[currencyCode]) {
        return cureency_list[currencyCode] + " ";
      } else {
        return currencyCode + " ";
      }
    };
  },
};
const pinia = createPinia();
pinia.use(({ store }) => {
  store.router = markRaw(router);
});
pinia.use(piniaPluginPersistedstate);

const app = createApp({
  setup() {
    provideApolloClient(apolloClient);
  },

  render: () => h(App),
});
app.use(Plugin);
app.use(pinia);
app.use(router);
// app.use(VueLazyLoad, {
//   loading:
//     "https://bponi.sgp1.cdn.digitaloceanspaces.com/asset/image_placeholder.gif",
//   error:
//     "https://bponi.sgp1.cdn.digitaloceanspaces.com/asset/image_placeholder.gif",
// });
app.mount("#app");
