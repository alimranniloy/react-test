<template>
  <main class="mx-auto my-auto px-4 pb-[60px] pt-[70px] py-5">
    <div class="space-y-8">
      <div>
        <h3 class="text-lg font-medium leading-6 text-gray-900">
          Create Site {{ title ? " - " + title : "" }}
        </h3>
        <p class="mt-1 text-sm text-gray-500">
          This information will be displayed publicly so be careful what you
          share.
        </p>
      </div>
      <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div class="sm:col-span-6">
          <div
            class="relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
            <label for="title"
              class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">Title</label>
            <input v-model="title" type="text" name="title" id="title" autocomplete="off"
              class="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm disabled:bg-gray-20 disabled:text-gray-400 disabled:cursor-not-allowed"
              placeholder="Enter title" />
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ExclamationCircleIcon v-if="title.length < 3" class="h-5 w-5 text-red-500" aria-hidden="true" />
              <CheckCircleIcon v-else class="h-5 w-5 text-green-500" aria-hidden="true" />
            </div>
          </div>
        </div>
        <div class="sm:col-span-6">
          <div
            class="relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
            <label for="hostname"
              class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">Username</label>
            <input v-model="hostname" type="text" name="hostname" id="hostname" autocomplete="off"
              class="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm disabled:bg-gray-20 disabled:text-gray-400 disabled:cursor-not-allowed"
              placeholder="Enter username" />
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ExclamationCircleIcon v-if="!isAvailable" class="h-5 w-5 text-red-500" aria-hidden="true" />
              <CheckCircleIcon v-else class="h-5 w-5 text-green-500" aria-hidden="true" />
            </div>
          </div>
        </div>
        <div class="sm:col-span-3">
          <div
            class="relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
            <label for="hostname"
              class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">Address</label>
            <input v-model="address" type="text" name="address" id="address" autocomplete="off"
              class="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm disabled:bg-gray-20 disabled:text-gray-400 disabled:cursor-not-allowed"
              placeholder="Enter address" />
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ExclamationCircleIcon v-if="address.length < 3" class="h-5 w-5 text-red-500" aria-hidden="true" />
              <CheckCircleIcon v-else class="h-5 w-5 text-green-500" aria-hidden="true" />
            </div>
          </div>
        </div>
        <div class="sm:col-span-3">
          <div
            class="relative rounded-md border border-gray-300 px-3 py-3 focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
            <label for="street"
              class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">Street</label>
            <input v-model="street" type="text" name="street" id="street" autocomplete="off"
              class="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm disabled:bg-gray-20 disabled:text-gray-400 disabled:cursor-not-allowed"
              placeholder="Enter street" />
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ExclamationCircleIcon v-if="street.length < 3" class="h-5 w-5 text-red-500" aria-hidden="true" />
              <CheckCircleIcon v-else class="h-5 w-5 text-green-500" aria-hidden="true" />
            </div>
          </div>
        </div>
        <div class="sm:col-span-3">
          <Listbox as="div" class="relative" v-model="industry">
            <ListboxLabel
              class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900 z-10">
              Industry</ListboxLabel>
            <div class="relative">
              <ListboxButton
                class="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-3 pl-3 pr-10 text-left focus:outline-none sm:text-sm">
                <span class="flex items-center">
                  <span class="ml-3 block truncate">{{
                    industries.find((v) => v.value == industry)
                      ? industries.find((v) => v.value == industry).name
                      : industry
                  }}</span>
                </span>
                <span class="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                  <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </ListboxButton>
              <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100"
                leave-to-class="opacity-0">
                <ListboxOptions
                  class="absolute z-40 mt-1 max-h-56 w-full overflow-auto scrollbar-thin scrollbar-thumb-gray-100 scrollbar-track-gray-300 rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  <ListboxOption as="template" v-for="item in industries" :key="item" :value="item.value"
                    v-slot="{ active, selected }">
                    <li :class="[
                      active ? 'text-white bg-indigo-600' : 'text-gray-900',
                      'relative cursor-default select-none py-2 pl-3 pr-9',
                    ]">
                      <div class="flex items-center">
                        <span :class="[
                          selected ? 'font-semibold' : 'font-normal',
                          'ml-3 block truncate',
                        ]">{{ item.name }}</span>
                      </div>

                      <span v-if="selected" :class="[
                        active ? 'text-white' : 'text-indigo-600',
                        'absolute inset-y-0 right-0 flex items-center pr-4',
                      ]">
                        <CheckIcon class="h-5 w-5" aria-hidden="true" />
                      </span>
                    </li>
                  </ListboxOption>
                </ListboxOptions>
              </transition>
            </div>
          </Listbox>
        </div>
        <div class="sm:col-span-6">
          <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" class="px-6 py-3">
                    Type
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Host
                  </th>
                  <th scope="col" class="px-6 py-3">
                    Value
                  </th>
                  <th scope="col" class="px-6 py-3">
                    TTL
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    A Record
                  </th>
                  <td class="px-6 py-4">
                    @
                  </td>
                  <td class="px-6 py-4">
                    18.143.34.188
                  </td>
                  <td class="px-6 py-4">
                    Automatic
                  </td>
                </tr>
                <tr
                  class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    A Record
                  </th>
                  <td class="px-6 py-4">
                    www
                  </td>
                  <td class="px-6 py-4">
                    18.143.34.188
                  </td>
                  <td class="px-6 py-4">
                    Automatic
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="pt-5">
        <div class="flex justify-end">
          <button @click="logOut()" type="button"
            class="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-offset-2">
            Log out
          </button>
          <button @click="create()" type="submit"
            class="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-offset-2">
            Save
          </button>
        </div>
      </div>
    </div>
  </main>
</template>
<script setup>
import {
  ExclamationCircleIcon,
  CheckCircleIcon,
  CheckIcon,
  ChevronUpDownIcon,
} from "@heroicons/vue/24/outline";
import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/vue";
import { SELF_SITE_CREATE, SITE_IS_EXISTS } from "@/gql/site";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { computed, ref, watch, defineAsyncComponent } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useSiteStore } from "@/stores/site";
import { useMeStore } from "@/stores/me";
import { useNotificationsStore } from "@/stores/notifications";
const router = useRouter();
const { site } = storeToRefs(useSiteStore());
const { setLoading } = useSiteStore();
const { me } = storeToRefs(useMeStore());
const { addNotification } = useNotificationsStore();
const { logOut } = useMeStore();
const { setSite } = useSiteStore();
// data
const address = ref("");
const country = ref(me.value.country);
const currency = ref(me.value.currency);
const desktopTheme = ref("app");
const domain = ref("");
const email = ref(me.value.email);
const hostname = ref("");
const industry = ref(10);
const latitude = ref(me.value.latitude);
const longitude = ref(me.value.longitude);
const note = ref(window.location.host);
const phone = ref(me.value.phone);
const referCode = ref("c");
const siteInfo = ref("site");
const siteType = ref("site");
const street = ref("");
const theme = ref("app");
const title = ref("");
const social = ref({
  facebook: "https://www.facebook.com",
  twitter: "https://www.twitter.com",
  instagram: "https://www.instagram.com",
  youtube: "https://www.youtube.com",
});
//

const isAvailable = ref(false);
const files = ref([]);
const alertMessage = ref({});
const showAlert = ref(false);

const create = async () => {
  setLoading(true);
  const { mutate, loading, error } = useMutation(SELF_SITE_CREATE, {
    variables: {
      userId: me.value.id,
      address: address.value,
      country: country.value,
      currency: currency.value,
      desktopTheme: desktopTheme.value,
      // domain: domain.value + ".site.bponi.com",
      domain: domain.value + (site.value.whiteLabelUrl ? site.value.whiteLabelUrl : '.site.bponi.com'),
      email: email.value,
      guide: guide.value,
      hostname: hostname.value
        .toLowerCase()
        .trim()
        .replace(/[^a-zA-Z0-9]/g, ""),
      industry: industry.value,
      latitude: latitude.value,
      longitude: longitude.value,
      meta: meta.value,
      navigation: navigation.value,
      note: note.value,
      phone: phone.value,
      referCode: referCode.value,
      siteInfo: siteInfo.value,
      siteType: siteType.value,
      social: social.social,
      street: street.street,
      theme: theme.value,
      title: title.value,
    },
  });
  try {
    const response = await mutate();
    if (response.data.selfSiteCreate) {
      addNotification(
        { title: "Store info", subTitle: "Successfully updated new data." },
        "success"
      );
      setSite(response.data.selfSiteCreate);
      router.push(`/`);
    }
    setLoading(false);
  } catch (error) {
    addNotification({ title: "Store info", subTitle: error.message }, "error");
  }
};
const update = async () => {
  setLoading(true);
  const { mutate, loading, error } = useMutation(SELF_STORE_SHOP_UPDATE, {
    variables: {
      userId: me.value.id,
      siteId: site.value.id,
      id: shopId.value,
      address: address.value,
      brands: brands.value,
      categories: categories.value,
      country: country.value,
      cover: cover.value,
      address: address.value,
      features: features.value,
      latitude: latitude.value,
      logo: logo.value,
      longitude: longitude.value,
      phone: phone.value,
      shopType: shopType.value,
      hostname: hostname.value,
      street: street.value,
      subCategories: subCategories.value,
      thumbnail: thumbnail.value,
      slug: title.value
        .toLowerCase()
        .trim()
        .replace(/[^a-zA-Z0-9]/g, ""),
      title: title.value,
      translation: title.value,
    },
  });
  try {
    const response = await mutate();
    if (response.data.selfStoreUpdate) {
      addNotification(
        { title: "Store info", subTitle: "Successfully updated new data." },
        "success"
      );
    }
    setLoading(false);
  } catch (error) {
    addNotification({ title: "Store info", subTitle: error.message }, "error");
  }
};

const industries = ref([
  { value: 10, name: "Beauty" },
  { value: 2, name: "Fashion" },
  { value: 3, name: "Electronics" },
  { value: 4, name: "Furniture" },
  { value: 5, name: "Handcrafts" },
  { value: 6, name: "Jewelry" },
  { value: 7, name: "Painting" },
  { value: 8, name: "Photography" },
  { value: 9, name: "Restaurants" },
  { value: 1, name: "Groceries" },
  { value: 17, name: "Medicine" },
  { value: 11, name: "Food &amp; drink" },
  { value: 12, name: "Sports" },
  { value: 13, name: "Toys" },
  { value: 14, name: "Services" },
  { value: 15, name: "Virtual services" },
  { value: 16, name: "Course" },
  { value: 17, name: "Resturant" },
  { value: 99, name: "Other" },
]);

watch(hostname, () => {
  if (hostname.value.length > 3) {
    const { onResult, loading, onError } = useQuery(SITE_IS_EXISTS, {
      hostname: hostname.value
        .toLowerCase()
        .trim()
        .replace(/[^a-zA-Z0-9]/g, ""),
    });
    onResult((queryResult) => {
      if (!queryResult.data.siteSiteIsExists.exists) {
        addNotification(
          { title: "Store info", subTitle: "Valid username" },
          "success"
        );
        isAvailable.value = true;
        domain.value = hostname.value
          .toLowerCase()
          .trim()
          .replace(/[^a-zA-Z0-9]/g, "");
      } else {
        addNotification(
          { title: "Store info", subTitle: "Already a used thie username" },
          "error"
        );
        isAvailable.value = false;
      }
    });
    onError((error) => {
      if (error.message == "Item not found.") {
        addNotification(
          { title: "Store info", subTitle: "Already a used thie username." },
          "error"
        );
        isAvailable.value = false;
      }
    });
  }
});

const meta = computed(() => {
  return {
    color: [
      {
        name: "primary",
        value:
          "#" + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0"),
      },
      { name: "secondary", value: "#ffffff" },
      { name: "success", value: "#28a745" },
      { name: "info", value: "#17a2b8" },
      { name: "warning", value: "#ffc107" },
      { name: "danger", value: "#ff1f1f" },
    ],
  };
});

const guide = ref([
  {
    code: "product_product",
    id: 1,
    isActive: true,
    isPurchased: true,
    title: "Product",
  },
  {
    code: "product_category",
    id: 2,
    isActive: true,
    isPurchased: true,
    title: "Product Category",
  },
  {
    code: "product_sub_category",
    id: 3,
    isActive: true,
    isPurchased: true,
    title: "Product Sub Category",
  },
  {
    code: "product_sub_sub_category",
    id: 4,
    isActive: true,
    isPurchased: true,
    title: "Product Sub Sub Category",
  },
  {
    code: "product_excel",
    id: 5,
    isActive: true,
    isPurchased: true,
    title: "Product Excel",
  },
  {
    code: "product_brand",
    id: 6,
    isActive: true,
    isPurchased: true,
    title: "Product Brand",
  },
  {
    code: "order_order",
    id: 7,
    isActive: true,
    isPurchased: true,
    title: "Orders",
  },
  {
    code: "order_pos",
    id: 8,
    isActive: true,
    isPurchased: false,
    title: "Order POS",
  },
  {
    code: "order_excel",
    id: 9,
    isActive: true,
    isPurchased: true,
    title: "Order Excel",
  },
  {
    code: "payment_customer",
    id: 10,
    isActive: true,
    isPurchased: true,
    title: "Payment Customer",
  },
  {
    code: "payment_reseller",
    id: 11,
    isActive: true,
    isPurchased: true,
    title: "Payment Reseller",
  },
  {
    code: "payment_transaction",
    id: 35,
    isActive: true,
    isPurchased: true,
    title: "Payment Transaction",
  },
  {
    code: "user_reseller",
    id: 12,
    isActive: true,
    isPurchased: true,
    title: "User reseller",
  },
  {
    code: "user_affiliate",
    id: 13,
    isActive: true,
    isPurchased: true,
    title: "User Affiliate",
  },
  {
    code: "user_wholesaler",
    id: 14,
    isActive: true,
    isPurchased: false,
    title: "User wholesaler",
  },
  {
    code: "user_excel",
    id: 15,
    isActive: true,
    isPurchased: true,
    title: "user_excel",
  },
  {
    code: "user_users",
    id: 16,
    isActive: true,
    isPurchased: true,
    title: "user_users",
  },
  {
    code: "marketing_campaign",
    id: 17,
    isActive: true,
    isPurchased: true,
    title: "marketing_campaign",
  },
  {
    code: "marketing_collection",
    id: 18,
    isActive: true,
    isPurchased: true,
    title: "marketing_collection",
  },
  {
    code: "marketing_voucher",
    id: 19,
    isActive: true,
    isPurchased: true,
    title: "marketing_voucher",
  },
  {
    code: "marketing_slider",
    id: 20,
    isActive: true,
    isPurchased: true,
    title: "marketing_slider",
  },
  {
    code: "connection_merchant",
    id: 21,
    isActive: true,
    isPurchased: false,
    title: "connection_merchant",
  },
  {
    code: "connection_supplier",
    id: 22,
    isActive: true,
    isPurchased: true,
    title: "connection_supplier",
  },
  {
    code: "connection_partner",
    id: 23,
    isActive: true,
    isPurchased: false,
    title: "connection_partner",
  },
  {
    code: "connection_affiliate",
    id: 24,
    isActive: true,
    isPurchased: true,
    title: "Connection Affiliate",
  },
  {
    code: "connection_staff",
    id: 25,
    isActive: true,
    isPurchased: true,
    title: "connection_staff",
  },
  {
    code: "tool_gateway",
    id: 26,
    isActive: true,
    isPurchased: true,
    title: "tool_gateway",
  },
  {
    code: "tool_logistics",
    id: 27,
    isActive: true,
    isPurchased: true,
    title: "tool_logistics",
  },
  {
    code: "tool_stoppage",
    id: 28,
    isActive: true,
    isPurchased: false,
    title: "tool_stoppage",
  },
  {
    code: "tool_page",
    id: 29,
    isActive: true,
    isPurchased: true,
    title: "tool_page",
  },
  {
    code: "tool_file",
    id: 30,
    isActive: true,
    isPurchased: true,
    title: "tool_file",
  },
  {
    code: "tool_invoice",
    id: 31,
    isActive: true,
    isPurchased: false,
    title: "tool_invoice",
  },
  {
    code: "tool_feed",
    id: 32,
    isActive: true,
    isPurchased: false,
    title: "tool_feed",
  },
  {
    code: "tool_navigation",
    id: 33,
    isActive: true,
    isPurchased: false,
    title: "tool_navigation",
  },
]);
const navigation = computed(() => {
  return {};
});
</script>
