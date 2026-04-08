<template>
  <div
    :class="[
      'fixed w-full h-20 flex items-center z-50 shadow-md duration-300 bg-black/40 backdrop-blur-2xl backdrop-saturate-150 backdrop-brightness-95 px-4',
      scrolled ? 'border-none' : 'border-b border-[#1c1c1c]',
    ]"
  >
    <div
      class="w-full mx-auto flex max-w-[1600px] items-center justify-between px-4 3xl:px-0"
    >
      <div class="mx-auto w-full flex items-center justify-between">
        <div class="mx-auto w-full flex items-center justify-between">
          <div class="inline-flex items-center">
            <RouterLink to="/" class="font-bold text-2xl cursor-pointer">
              <img class="w-40" :src="optimumLogo" alt="Optimum Soft logo" />
            </RouterLink>
          </div>

          <div class="hidden lg:flex">
            <ul class="ml-12 inline-flex space-x-10">
              <li>
                <RouterLink
                  to="/"
                  class="text-md font-semibold text-white hover:text-amber-400 transition-colors duration-500"
                >
                  Home
                </RouterLink>
              </li>
              <li>
                <RouterLink
                  to="/pricing"
                  class="text-md font-semibold text-white hover:text-amber-400 transition-colors duration-500"
                >
                  Pricing
                </RouterLink>
              </li>
              <li>
                <RouterLink
                  to="/contact"
                  class="text-md font-semibold text-white hover:text-amber-400 transition-colors duration-500"
                >
                  Contact
                </RouterLink>
              </li>
            </ul>
          </div>
        </div>

        <!-- <a
          href="https://optimumsoft.dev/admin/login"
          class="start-button hidden lg:flex text-md font-semibold bg-white backdrop-blur-lg hover:bg-amber-400 hover:text-white h-12 px-8 rounded-full items-center transition-all cursor-pointer"
        >
          শুরু করুন
        </a> -->

        <div class="lg:hidden">
          <div class="inline-flex space-x-4">
            <RouterLink
              to="/"
              class="text-sm font-semibold text-white hover:text-amber-400 transition-colors duration-500"
              >Home</RouterLink
            >
            <RouterLink
              to="/pricing"
              class="text-sm font-semibold text-white hover:text-amber-400 transition-colors duration-500"
              >Pricing</RouterLink
            >
            <RouterLink
              to="/contact"
              class="text-sm font-semibold text-white hover:text-amber-400 transition-colors duration-500"
              >Contact</RouterLink
            >
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import optimumLogo from "@/assets/optimum.png";
import { useCartStore } from "@/stores/cart";
import { useCategoryStore } from "@/stores/category";
import { useCustomerStore } from "@/stores/customer";
import { useMeStore } from "@/stores/me";
import { usePageStore } from "@/stores/page";
import { useSearchStore } from "@/stores/search";
import { useSiteStore } from "@/stores/site";
import { useSubCategoryStore } from "@/stores/subCategory";
import { HomeIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";
import {
  computed,
  defineComponent,
  h,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
const { pages } = storeToRefs(usePageStore());
const { getPages } = usePageStore();
const { addToCart, removeFromCart, setToCart } = useCartStore();
const { customer } = storeToRefs(useCustomerStore());
const emit = defineEmits(["onCategory"]);
const router = useRouter();
const { site, locale, sideBar } = storeToRefs(useSiteStore());
const { setLocale } = useSiteStore();
const { me } = storeToRefs(useMeStore());
const { cart } = storeToRefs(useCartStore());
const { categories } = storeToRefs(useCategoryStore());
const { getCategories } = useCategoryStore();
const { subCategories } = storeToRefs(useSubCategoryStore());
const { getSubCategories } = useSubCategoryStore();

const scrollY = ref(0);

const handleScroll = () => {
  scrollY.value = window.scrollY;
};

const scrolled = computed(() => scrollY.value > 0);

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});

// const scrollY = ref(0);

// const handleScroll = () => {
//   scrollY.value = window.scrollY;
// };

// onMounted(() => {
//   window.addEventListener("scroll", handleScroll);
// });

// onBeforeUnmount(() => {
//   window.removeEventListener("scroll", handleScroll);
// });

if (categories.value.length == 0) {
  getCategories(
    [
      site.value.id,
      ...site.value.parent
        .filter((item) => item.isActive)
        .map((item) => item.id),
    ],
    site.value.parent.filter((item) => item.isActive).length > 0
      ? site.value.id
      : null
  );
}
if (subCategories.value.length == 0) {
  getSubCategories(
    [
      site.value.id,
      ...site.value.parent
        .filter((item) => item.isActive)
        .map((item) => item.id),
    ],
    site.value.parent.filter((item) => item.isActive).length > 0
      ? site.value.id
      : null
  );
}
// search
const searchResultsHide = ref(true);
const { search, searchs } = storeToRefs(useSearchStore());
const { setSearch, getSearchs } = useSearchStore();
if (searchs.value.length == 0) {
  getSearchs(
    [
      site.value.id,
      ...site.value.parent
        .filter((item) => item.isActive)
        .map((item) => item.id),
    ],
    site.value.parent.filter((item) => item.isActive).length > 0
      ? site.value.id
      : null
  );
}
const plainSearch = ref(search.value);
const searchResults = ref([]);
watch(plainSearch, (newValue) => {
  if (newValue && newValue.length > 2) {
    var url = new URL("https://search.bponi.com/indexes/store_product/search");
    const filter = [
      site.value.id,
      ...site.value.parent
        .filter((item) => item.isActive)
        .map((item) => item.id),
    ].map((el) => "site_id=" + el.toString());
    var params = {
      q: newValue,
      limit: 20,
      filter: filter.join(" OR "),
    };
    Object.keys(params).forEach((key) => {
      var value = params[key];
      url.searchParams.append(key, value);
    });
    const headers = {
      Authorization: "Bearer yA9mppsDdJbhHiNt101",
    };
    fetch(url, {
      headers,
    })
      .then((response) => response.json())
      .then((data) => (searchResults.value = data.hits));
  } else {
    searchResults.value = [];
  }
});
const toggleSearch = () => {
  if (plainSearch.value) {
    router.push(`/products/?search=${plainSearch.value}`);
    plainSearch.value = "";
    searchResults.value = [];
  } else {
    setSearch(null);
    searchResults.value = [];
  }
};
if (pages.value.length == 0) {
  getPages(site.value.id);
}
// const chunkSize = 5;
// const resultArray = ref([]);
// for (let i = 0; i < pages.value.length; i += chunkSize) {
//   resultArray.value.push(pages.value.slice(i, i + chunkSize));
// }
const footerPages = ref([
  {
    name: "About",
    href: "/page/about/",
    isExternal: false,
    industry: ["singlevendor", "multivendor", "reseller", "hyperlocation"],
  },
  {
    name: "Contact",
    href: "/page/contact/",
    isExternal: false,
    industry: ["singlevendor", "multivendor", "reseller", "hyperlocation"],
  },
  {
    name: "Privacy Policy",
    href: "/page/privacy-policy/",
    isExternal: false,
    industry: ["singlevendor", "multivendor", "reseller", "hyperlocation"],
  },
  {
    name: "Terms & Conditions",
    href: "/page/terms-conditions/",
    isExternal: false,
    industry: ["singlevendor", "multivendor", "reseller", "hyperlocation"],
  },
  {
    name: "Return & Refund Policy",
    href: "/page/return-refund-policy/",
    isExternal: false,
    industry: ["singlevendor", "multivendor", "reseller", "hyperlocation"],
  },
]);
const social = [
  {
    name: "Facebook",
    href:
      site.value.social && site.value.social.facebook
        ? site.value.social.facebook
        : "https://www.facebook.com/",
    icon: defineComponent({
      render: () =>
        h("svg", { fill: "currentColor", viewBox: "0 0 24 24" }, [
          h("path", {
            "fill-rule": "evenodd",
            d: "M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z",
            "clip-rule": "evenodd",
          }),
        ]),
    }),
  },
  {
    name: "Instagram",
    href:
      site.value.social && site.value.social.instagram
        ? site.value.social.instagram
        : "https://www.instagram.com/",
    icon: defineComponent({
      render: () =>
        h("svg", { fill: "currentColor", viewBox: "0 0 24 24" }, [
          h("path", {
            "fill-rule": "evenodd",
            d: "M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z",
            "clip-rule": "evenodd",
          }),
        ]),
    }),
  },
  {
    name: "Twitter",
    href:
      site.value.social && site.value.social.twitter
        ? site.value.social.twitter
        : "https://www.twitter.com/",
    icon: defineComponent({
      render: () =>
        h("svg", { fill: "currentColor", viewBox: "0 0 24 24" }, [
          h("path", {
            d: "M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84",
          }),
        ]),
    }),
  },
  {
    name: "YouTube",
    href:
      site.value.social && site.value.social.youtube
        ? site.value.social.youtube
        : "https://www.youtube.com/",
    icon: defineComponent({
      render: () =>
        h("svg", { fill: "currentColor", viewBox: "0 0 24 24" }, [
          h("path", {
            "fill-rule": "evenodd",
            d: "M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z",
            "clip-rule": "evenodd",
          }),
        ]),
    }),
  },
];
const path = computed(() => router.currentRoute.value.name);
const showSeach = ref(false);
const menu = computed(() => [
  {
    id: 1,
    icon: HomeIcon,
    name: "Home",
    translattion: t("nav.home"),
    href: "/",
  },
  {
    id: 2,
    name: "Categories",
    translattion: t("nav.categories"),
    href: "/categories/",
  },
  {
    id: 3,
    name: "New Products",
    translattion: t("nav.newProduct"),
    href: "/product/new",
  },
  {
    id: 4,
    name: "Flash Sale",
    translattion: t("nav.flashSale"),
    href: "/product/flash/",
  },
  {
    id: 5,
    name: "Brands",
    translattion: t("nav.brand"),
    href: "/brands/",
  },
  {
    id: 6,
    name: "Campaigns",
    translattion: t("nav.campaign"),
    href: "/campaigns/",
  },
  {
    id: 7,
    name: "Collections",
    translattion: t("nav.collection"),
    href: "/collections/",
  },
]);

const slugify = (str) => {
  str = (str + "").toString();
  return encodeURIComponent(str)
    .replace("!", "%21")
    .replace("'", "%27")
    .replace("(", "%28")
    .replace(")", "%29")
    .replace("*", "%2A")
    .replace("%20", "+");
};
const { locale: i18nLocale, t } = useI18n();
const languages = ref([
  { id: 1, code: "en", name: "🇺🇸 EN / English" },
  { id: 2, code: "bn", name: "🇧🇩 BN / Bengali" },
]);
// Default selected language based on the value of site locale
const selectedLang = ref(
  languages.value.find((item) => item.code === locale.value)
);
watch(selectedLang, (newLang) => {
  if (newLang) {
    i18nLocale.value = newLang.code;
    setLocale(newLang.code);
  }
});
onMounted(() => {
  i18nLocale.value = locale.value;
});
</script>
