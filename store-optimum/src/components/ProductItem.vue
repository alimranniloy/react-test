<template>
  <div
    class="bg-slate-100 cursor-pointer rounded-xl md:rounded-xl overflow-hidden flex flex-col justify-between relative w-full"
    v-if="
      [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 99].includes(
        site.industry
      )
    "
  >
    <router-link
      :to="`/product/${product.slug ? product.slug : 'product'}/${
        product.hid
      }/`"
      class="overflow-hidden"
    >
      <div class="p-2.5 relative">
        <div class="flex justify-center">
          <img
            v-lazy="product.thumbnail"
            alt="Product Image"
            class="object-cover aspect-square max-h-[215px] rounded-md bg-white"
          />
        </div>
        <span
          v-if="product.comparePrice > price"
          class="bg-[#fc5230] text-white text-xs font-semibold py-[1px] px-1 rounded absolute bottom-2 left-2 transform -rotate-3"
          >{{ discount(price, product.comparePrice).toFixed(1) }}%</span
        >
      </div>
      <div class="px-3">
        <div class="py-1">
          <span class="text-[#fc5230] text-base font-semibold">{{
            site.isPublic ||
            (customer && customer.isActive) ||
            source == "package"
              ? formatMoney(price, product.currency)
              : "***"
          }}</span>
          <span
            v-if="product.comparePrice > price"
            class="ml-2 text-gray-500 text-xs sm:text-xs font-normal relative after:block after:absolute after:h-[1px] after:bg-[#fc5230] after:w-full after:right-0 after:top-[7px] after:-rotate-3"
            >{{
              site.isPublic ||
              (customer && customer.isActive) ||
              source == "package"
                ? formatMoney(product.comparePrice, product.currency)
                : "***"
            }}</span
          >
        </div>
        <h2
          class="text-sm font-regular line-clamp-1 md:line-clamp-2 leading-5 text-gray-600"
        >
          {{ locale == "en" ? product.title : product.translation }}
        </h2>
        <div
          v-if="product.rating > 2"
          class="mt-1 flex items-center mb-2 text-xs"
        >
          <StarIcon
            class="w-4 h-4 me-1"
            :class="product.rating >= 1 ? 'fill-yellow-400' : 'fill-gray-300'"
          />
          <StarIcon
            class="w-4 h-4 me-1"
            :class="product.rating >= 2 ? 'fill-yellow-400' : 'fill-gray-300'"
          />
          <StarIcon
            class="w-4 h-4 me-1"
            :class="product.rating >= 3 ? 'fill-yellow-400' : 'fill-gray-300'"
          />
          <StarIcon
            class="w-4 h-4 me-1"
            :class="product.rating >= 4 ? 'fill-yellow-400' : 'fill-gray-300'"
          />
          <StarIcon
            class="w-4 h-4 me-1"
            :class="product.rating >= 5 ? 'fill-yellow-400' : 'fill-gray-300'"
          />
          <p class="ms-1 text-xs font-medium text-gray-500 dark:text-gray-400">
            ({{ product.ratingTotal }})
          </p>
        </div>
      </div>
    </router-link>
    <div>
      <div
        v-if="product.quantity > 0 || product.isContinueSelling"
        class="mx-3 mb-3 mt-2 flex items-center bg-white shadow-sm text-gray-700 rounded-md"
      >
        <button
          @click="toggleAddToCart(product)"
          class="flex items-center justify-start w-20 font-bold py-2 px-3 transition-all text-xl"
          :class="cartProduct ? 'rounded-r-xl' : 'rounded-xl'"
        >
          <PlusIcon class="h-5 w-5 inline text-gray-700" aria-hidden="true" />
        </button>
        <div
          v-if="cartProduct"
          class="font-bold text-center justify-center h-full text-sm w-full flex items-center px-3 text-gray-700"
        >
          {{ cartProduct ? cartProduct.qnt : 0 }}
        </div>
        <button
          v-if="cartProduct"
          @click="removeFromCart(cartProduct)"
          class="flex items-center justify-start w-20 font-bold py-2 px-3 transition-all text-xl"
          :class="cartProduct ? 'rounded-l-xl' : ''"
        >
          <MinusIcon class="h-5 w-5 inline text-gray-700" aria-hidden="true" />
        </button>
        <button
          v-if="!cartProduct"
          @click="toggleBuyNow(product)"
          class="flex items-center justify-end w-full font-normal py-2 px-3 transition-all text-xs truncate"
          :class="cartProduct ? 'rounded-r-xl' : 'rounded-xl'"
        >
          {{ $t("content.buyNow") }}&nbsp;
          <ArrowLongRightIcon
            class="h-5 w-5 inline text-gray-700"
            aria-hidden="true"
          />
        </button>
      </div>
      <div
        v-else
        class="mx-3 mb-3 mt-2 flex items-center shadow-sm bg-white text-gray-700 rounded-md"
      >
        <button
          class="flex items-center justify-center w-full font-normal py-2 px-3 transition-all text-xs truncate rounded-xl"
        >
          Stock Out&nbsp;
          <ArrowLongRightIcon
            class="h-5 w-5 inline text-gray-700"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  </div>

  <!-- productItem for another industry -->
  <div
    class="cursor-pointer bg-white p-1 md:p-2 rounded-md overflow-hidden flex flex-col justify-between relative"
    :class="className"
    v-else-if="[1].includes(site.industry)"
  >
    <router-link
      :to="`/product/${product.slug ? product.slug : 'product'}/${
        product.hid
      }/`"
      class="overflow-hidden"
    >
      <div class="relative">
        <img
          v-lazy="product.thumbnail"
          alt="Product Image"
          class="object-cover w-full h-28 md:h-40 rounded-xl"
        />
        <span
          v-if="product.comparePrice > price"
          class="bg-[#fc5230] text-white text-xs font-semibold py-[1px] px-1 rounded absolute bottom-2 left-2 transform -rotate-3"
          >{{ discount(price, product.comparePrice).toFixed(1) }}%</span
        >
      </div>
      <div class="">
        <div>
          <span class="text-[#fc5230] text-sm font-semibold">{{
            site.isPublic || (customer && customer.isActive)
              ? formatMoney(price, product.currency)
              : "***"
          }}</span>
          <span
            v-if="product.comparePrice > price"
            class="ml-2 text-gray-500 text-xs sm:text-xs font-normal relative after:block after:absolute after:h-[1px] after:bg-[#fc5230] after:w-full after:right-0 after:top-[7px] after:-rotate-3"
            >{{
              site.isPublic || (customer && customer.isActive)
                ? formatMoney(product.comparePrice, product.currency)
                : "***"
            }}</span
          >
        </div>
        <h2
          class="h-10 text-sm font-regular line-clamp-2 leading-5 text-[#21201f]"
        >
          {{ locale == "en" ? product.title : product.translation }}
        </h2>
        <div class="flex items-center justify-between mt-2">
          <span class="text-gray-500 text-xs"
            >{{ product.unit }}&nbsp;{{ getUnitType(product.unitType) }}</span
          >
          <BoltIcon class="h-3 w-3 text-gray-500" />
        </div>
      </div>
    </router-link>

    <!-- add to cart buttons -->
    <div
      v-if="product.quantity > 0 || product.isContinueSelling"
      class="flex items-center gap-4 shadow-sm bg-white text-gray-700 rounded-full border absolute bottom-[90px] -right-0 p-1"
    >
      <button
        @click="toggleAddToCart(product)"
        class="flex items-center justify-start font-bold transition-all text-xl cursor-default"
      >
        <PlusIcon class="h-5 w-5 inline text-[--primary]" aria-hidden="true" />
      </button>
      <div
        v-if="cartProduct"
        class="font-bold text-center text-gray-700 cursor-default"
      >
        {{ cartProduct ? cartProduct.qnt : 0 }}
      </div>
      <button
        v-if="cartProduct"
        @click="removeFromCart(cartProduct)"
        class="flex items-center justify-start font-bold transition-all text-xl cursor-default"
        :class="cartProduct ? 'rounded-l-xl' : ''"
      >
        <MinusIcon class="h-5 w-5 inline text-[--primary]" aria-hidden="true" />
      </button>
    </div>

    <!-- stock out button -->
    <div
      v-else
      class="mx-3 mb-3 mt-2 flex items-center shadow-sm bg-white text-gray-700 rounded-md"
    >
      <button
        class="flex items-center justify-center w-full font-normal py-2 px-3 transition-all text-xs truncate rounded-xl"
      >
        Stock Out&nbsp;
        <ArrowLongRightIcon
          class="h-5 w-5 inline text-gray-700"
          aria-hidden="true"
        />
      </button>
    </div>
  </div>

  <div
    v-else
    class="sm:border-0 justify-between px-3 py-3 sm:p-3 rounded-xl sm:rounded-lg bg-white"
  >
    <div class="flex justify-between">
      <div class="flex w-5/6">
        <div class="w-1/4 mr-3 h-[100px]">
          <router-link :to="`/product/${product.slug}/${product.hid}/`">
            <img
              class="object-cover h-20 rounded-xl"
              v-lazy="product.thumbnail"
              alt=""
            />
          </router-link>
        </div>
        <div class="w-3/4">
          <p class="whitespace-nowrap text-[12px] text-gray-400 truncate">
            {{ getBrand(product.brands) }}
          </p>
          <router-link :to="`/product/${product.slug}/${product.hid}/`">
            <h2 class="text-[13px] line-clamp-2">
              {{ product.title }}
            </h2>
          </router-link>
          <div class="mt-0 flex">
            <span class="text-[14px] font-bold mr-3">{{
              site.isPublic ||
              (customer && customer.isActive) ||
              source == "package"
                ? formatMoney(price, product.currency)
                : "***"
            }}</span>
            <span
              v-if="product.comparePrice > price"
              class="text-[14px] mr-3 line-through text-gray-500"
              >{{
                site.isPublic ||
                (customer && customer.isActive) ||
                source == "package"
                  ? formatMoney(product.comparePrice, product.currency)
                  : "***"
              }}</span
            >
            <span
              v-if="product.comparePrice > price"
              class="text-[14px] text-[#EE741F]"
              >({{ discount(price, product.comparePrice).toFixed(1) }}%)</span
            >
          </div>
        </div>
      </div>
      <div class="w-1/6 items-center justify-end grid">
        <button
          :disabled="!cartProduct"
          @click="removeFromCart(cartProduct)"
          class="bg-gray-200 rounded-lg h-8 w-8 flex items-center justify-center text-base font-bold hover:bg-gray-200"
        >
          <MinusIcon class="h-5 w-5 inline" aria-hidden="true" />
        </button>
        <div
          class="text-[14px] font-bold justify-center flex items-center h-8 w-8 text-gray-600"
        >
          {{ cartProduct ? cartProduct.qnt : 0 }}
        </div>
        <button
          @click="toggleAddToCart(product)"
          class="bg-gray-200 rounded-lg h-8 w-8 flex items-center justify-center text-base font-bold hover:bg-gray-200"
        >
          <PlusIcon class="h-5 w-5 inline" aria-hidden="true" />
        </button>
      </div>
    </div>
  </div>

  <!-- modal -->
  <div
    id="product-modal"
    class="z-[9999] w-full h-screen transition-all fixed top-0 left-0 items-center pb-16 sm:items-center justify-center bg-[#4848488a] hidden"
    :style="!isFull ? '' : 'display: flex'"
  >
    <div class="w-[600px] mx-5 sm:mx-0 bg-white p-5 rounded-xl">
      <div class="">
        <div class="flex justify-between">
          <router-link
            :to="`/product/${product.slug}/${product.hid}/`"
            class="text-2xl font-bold"
            >{{ product.title }}</router-link
          >
          <button
            @click="toggleFull()"
            type="button"
            class="text-gray-400 flex items-center justify-center bg-transparent h-10 w-10 hover:bg-gray-200 hover:text-gray-900 rounded-lg"
          >
            <XCircleIcon class="h-5 w-5 text-gray-800" aria-hidden="true" />
            <span class="sr-only">Close menu</span>
          </button>
        </div>
        <!-- price in modal -->
        <div class="py-2">
          <span class="text-[#fc5230] text-xl sm:text-2xl font-semibold">{{
            site.isPublic ||
            (customer && customer.isActive) ||
            source == "package"
              ? formatMoney(price, product.currency)
              : "***"
          }}</span>
          <span
            v-if="product.comparePrice > price"
            class="ml-2 text-gray-500 text-md sm:text-xl font-normal relative after:block after:absolute after:h-[1px] after:bg-[#fc5230] after:w-full after:right-0 after:top-[10px] after:-rotate-3"
            >{{
              site.isPublic ||
              (customer && customer.isActive) ||
              source == "package"
                ? formatMoney(product.comparePrice, product.currency)
                : "***"
            }}</span
          >
        </div>
        <p class="mt-4">{{ product.description }}</p>

        <!-- variant in modal -->
        <RadioGroup
          :key="group.title"
          v-for="group in variantGroups"
          @update:modelValue="(value) => selectVariantGroup(value)"
          class="mt-2"
        >
          <RadioGroupLabel
            class="text-sm font-semibold text-gray-600 uppercase"
          >
            {{ group.title }}
          </RadioGroupLabel>
          <div class="grid mt-2 grid-flow-col auto-cols-max">
            <RadioGroupOption
              as="template"
              v-for="item in group.items"
              :key="product.id + '_' + item"
              :id="product.id + '_' + item"
              :value="{ key: group.title, value: item }"
            >
              <div
                :class="[
                  variantGroup.find((a) => a.value == item)
                    ? 'bg-[#23b47e1a] border-[#24b47e] z-10'
                    : 'border-gray-200',
                  'rounded-md relative border p-2 px-3 flex items-center cursor-pointer focus:outline-none mr-3',
                ]"
              >
                <span class="flex flex-col">
                  <RadioGroupLabel
                    as="span"
                    :class="[
                      false ? '' : 'text-gray-900',
                      'block text-sm font-medium',
                    ]"
                    >{{ item }}</RadioGroupLabel
                  >
                </span>
              </div>
            </RadioGroupOption>
          </div>
        </RadioGroup>

        <!-- Resell price in modal -->
        <div
          v-if="
            site.siteInfo == 'reseller' || (customer && customer.isReseller)
          "
          class="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-6 mt-5"
        >
          <div class="sm:col-span-3">
            <div class="relative">
              <label
                for="resellPrice"
                class="absolute -top-2 z-10 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
                >Resell Price (Min resell
                {{
                  site.isPublic ||
                  (customer && customer.isActive) ||
                  source == "package"
                    ? formatMoney(product.minResellPrice, product.currency)
                    : "***"
                }})
              </label>
              <div class="relative rounded-md shadow-sm">
                <div
                  class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                >
                  <span class="text-gray-500 sm:text-sm">{{
                    formatCurrency(site.currency)
                  }}</span>
                </div>
                <input
                  v-model.number="resellPrice"
                  type="number"
                  name="resellPrice"
                  id="resellPrice"
                  class="block w-full rounded-md border-gray-300 py-3 pl-7 pr-12 focus: focus:ring-[--primary] sm:text-sm"
                  placeholder="0.00"
                  aria-describedby="cost-currency"
                />
                <div
                  class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  <span class="text-gray-500 sm:text-sm" id="cost-currency">{{
                    site.currency
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="
            site.siteInfo == 'reseller' || (customer && customer.isReseller)
          "
          class="flex gap-10 mt-4"
        >
          <div>
            <p
              class="text-lg font-semibold"
              :class="
                resellPrice - price > 0 ? 'text-green-500' : 'text-red-500'
              "
            >
              {{
                site.isPublic ||
                (customer && customer.isActive) ||
                source == "package"
                  ? formatMoney(
                      resellPrice - price > 0 ? resellPrice - price : 0,
                      product.currency
                    )
                  : "***"
              }}
            </p>
            <p class="text-gray-400 text-base">Profit</p>
          </div>
          <div>
            <p
              class="text-lg font-semibold"
              :class="
                resellPrice - price > 0 ? 'text-green-500' : 'text-red-500'
              "
            >
              {{
                resellPrice - price > 0
                  ? ((100 * (resellPrice - price)) / price).toFixed(0)
                  : 0
              }}%
            </p>
            <p class="text-gray-400 text-base">Margin</p>
          </div>
          <div>
            <p class="text-lg font-semibold text-red-500">
              {{
                site.isPublic ||
                (customer && customer.isActive) ||
                source == "package"
                  ? formatMoney(product.maxResellPrice, product.currency)
                  : "***"
              }}
            </p>
            <p class="text-gray-400 text-base">Max Resell</p>
          </div>
        </div>
      </div>

      <!-- add to cart buttons in modal for reseller website -->
      <div class="pt-5 bg-white w-full flex justify-between items-center">
        <div
          v-if="
            site.siteInfo == 'reseller' || (customer && customer.isReseller)
          "
          class="flex w-full gap-2"
        >
          <button
            class="bg-bg rounded-md"
            @click="toggleFavorite(product, isFavorite(product))"
          >
            <HeartIcon
              class="h-8 w-8"
              :class="isFavorite(product) ? 'text-red-500' : 'text-gray-300'"
              aria-hidden="true"
            />
          </button>
          <button
            class="bg-[--primary] text-white p-3 w-full rounded-md"
            @click="toggleAddToCart(product)"
          >
            Add to cart
          </button>
          <button
            class="border p-3 w-40 cursor-default rounded-md flex justify-between items-center"
          >
            <button
              :disabled="!cartProduct"
              @click="removeFromCart(cartProduct)"
            >
              <MinusIcon class="h-5 w-5 text-gray-500" aria-hidden="true" />
            </button>
            <span class="text-gray-500">{{
              cartProduct ? cartProduct.qnt : 0
            }}</span>
            <button @click="toggleAddToCart(product)">
              <PlusIcon class="h-5 w-5 text-gray-500" aria-hidden="true" />
            </button>
          </button>
        </div>
        <!-- add to cart in modal -->
        <div v-else class="flex w-full gap-2">
          <button
            class="bg-[--primary] text-gray-700 p-3 w-full rounded-md"
            @click="toggleAddToCart(product)"
          >
            Add to cart
          </button>
          <button
            class="border p-3 w-32 rounded-md flex justify-between items-center"
          >
            <button @click="removeFromCart(cartProduct)">
              <MinusIcon class="h-5 w-5 text-gray-500" aria-hidden="true" />
            </button>
            <span class="text-gray-500">{{
              cartProduct ? cartProduct.qnt : 0
            }}</span>
            <button @click="toggleAddToCart(product)">
              <PlusIcon class="h-5 w-5 text-gray-500" aria-hidden="true" />
            </button>
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- Products end -->
</template>

<script setup>
import { cloneDeep } from "lodash";
import { RadioGroup, RadioGroupLabel, RadioGroupOption } from "@headlessui/vue";
import {
  HeartIcon,
  PlusIcon,
  MinusIcon,
  XCircleIcon,
  StarIcon,
  BoltIcon,
} from "@heroicons/vue/24/outline";
import { ArrowLongRightIcon } from "@heroicons/vue/24/outline";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  STORE_CUSTOMER_REMOVE_FAVORITE,
  STORE_CUSTOMER_ADD_FAVORITE,
} from "@/gql/customer";
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useCustomerStore } from "@/stores/customer";
import { useMeStore } from "@/stores/me";
import { useCartStore } from "@/stores/cart";
import { useBrandStore } from "@/stores/brand";
import { useNotificationsStore } from "@/stores/notifications";
import { useMutation, useQuery } from "@vue/apollo-composable";
import { useRouter } from "vue-router";
import { useSiteStore } from "@/stores/site";
dayjs.extend(relativeTime);
const router = useRouter();
const { addNotification } = useNotificationsStore();
const { me } = storeToRefs(useMeStore());
const { site, locale } = storeToRefs(useSiteStore());
const { brands } = storeToRefs(useBrandStore());
const { cart } = storeToRefs(useCartStore());
const { customer } = storeToRefs(useCustomerStore());
const { addToCart, removeFromCart } = useCartStore();
const { getBrands } = useBrandStore();
if (brands.value.length == 0) {
  getBrands(
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
const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  isPop: {
    type: Boolean,
    required: false,
    default: true,
  },
  source: {
    type: String,
    required: false,
    default: "product",
  },
  className: {
    type: String,
    required: false,
    default: "",
  },
});
const cartProduct = computed(() => {
  if (props.product) {
    let index = props.product.index ? props.product.index : 0;
    let item = cart.value.find(
      (el) => el.id == props.product.id && el.index == index
    );
    return item ? item : null;
  } else {
    return null;
  }
});

const images = ref([]);
const imageIndex = ref(0);
const selectedImage = computed(() => {
  return images.value[imageIndex.value];
});
const isFull = ref(false);

const toggleFull = () => {
  isFull.value = !isFull.value;
};
const toggleAddToCart = (product) => {
  let index = selectedVariant.value ? selectedVariant.value.id : 0;
  console.log(index);
  if (
    props.isPop == false &&
    (site.value.siteInfo == "reseller" ||
      site.value.siteInfo == "multivendor_reseller" ||
      (customer.value && customer.value.isActive && customer.value.isReseller))
  ) {
    router.push(`/product/${product.title}/${product.hid}/`);
  } else if (cart.value.filter((v) => v.productType == 4).length > 0) {
    router.push(`/checkout/`);
  } else if (
    product.productType != 7 &&
    !isFull.value &&
    (site.value.siteInfo == "reseller" ||
      site.value.siteInfo == "multivendor_reseller" ||
      (customer.value && customer.value.isActive && customer.value.isReseller))
  ) {
    isFull.value = !isFull.value;
  } else {
    // resell price check
    if (
      site.value.siteInfo == "reseller" ||
      site.value.siteInfo == "multivendor_reseller" ||
      (customer.value && customer.value.isActive && customer.value.isReseller)
    ) {
      if (
        !(
          resellPrice.value >= product.minResellPrice &&
          resellPrice.value <= product.maxResellPrice
        )
      ) {
        addNotification({
          title: "Product info",
          subTitle: "Review resell price",
        });
        return false;
      }
    }
    var item = {
      affiliateCommission: product.affiliateCommission,
      cashback: product.cashback,
      comparePrice: product.comparePrice,
      cost: product.cost,
      currency: product.currency,
      deliveryCharge: product.deliveryCharge,
      emiDuration: product.emiDuration ? product.emiDuration : 0,
      emiInterest: product.emiInterest ? product.emiInterest : 0,
      emiPrice: product.emiPrice,
      hid: product.hid,
      id: product.id,
      index: index,
      isContinueSelling: product.isContinueSelling,
      isEmi: false,
      maxOrder: product.maxOrder,
      maxResellPrice: product.maxResellPrice,
      minOrder: minOrder.value,
      price: price.value,
      basePrice: product.price,
      basecomparePrice: product.comparePrice,
      cost: product.cost,
      baseWholesalePrice: product.wholesalePrice,
      productType: product.productType,
      quantity: product.quantity,
      resellPrice: resellPrice.value ? resellPrice.value : price.value,
      rewardPoints: product.rewardPoints,
      sku: product.sku,
      slug: product.slug,
      thumbnail: selectedImage.value ? selectedImage.value : product.thumbnail,
      title: product.title,
      translation: product.translation,
      unit: product.unit,
      unitType: product.unitType,
      variant: cloneDeep(selectedVariant.value ? [selectedVariant.value] : []),
      variants: cloneDeep(product.variants ? product.variants : []),
      vat: product.vat,
      weight: product.weight,
    };
    addToCart(cloneDeep(item));

    toAnalyticsAddCart(product);
    isFull.value = false;
  }
};
const toggleBuyNow = (product) => {
  let index = selectedVariant.value ? selectedVariant.value.id : 0;
  if (
    props.isPop == false &&
    (site.value.siteInfo == "reseller" ||
      site.value.siteInfo == "multivendor_reseller" ||
      (customer.value && customer.value.isActive && customer.value.isReseller))
  ) {
    router.push(`/product/${product.title}/${product.hid}/`);
  } else if (cart.value.filter((v) => v.productType == 4).length > 0) {
    router.push(`/checkout/`);
  } else if (
    props.product.productType != 7 &&
    !isFull.value &&
    (site.value.siteInfo == "reseller" ||
      site.value.siteInfo == "multivendor_reseller" ||
      (customer.value && customer.value.isActive && customer.value.isReseller))
  ) {
    isFull.value = !isFull.value;
  } else {
    // resell price check
    if (
      site.value.siteInfo == "reseller" ||
      site.value.siteInfo == "multivendor_reseller" ||
      (customer.value && customer.value.isActive && customer.value.isReseller)
    ) {
      if (
        !(
          resellPrice.value >= product.minResellPrice &&
          resellPrice.value <= product.maxResellPrice
        )
      ) {
        addNotification({
          title: "Product info",
          subTitle: "Review resell price",
        });
        return false;
      }
    }
    var item = {
      affiliateCommission: product.affiliateCommission,
      cashback: product.cashback,
      comparePrice: product.comparePrice,
      cost: product.cost,
      currency: product.currency,
      deliveryCharge: product.deliveryCharge,
      emiDuration: product.emiDuration ? product.emiDuration : 0,
      emiInterest: product.emiInterest ? product.emiInterest : 0,
      emiPrice: product.emiPrice,
      hid: product.hid,
      id: product.id,
      index: index,
      isContinueSelling: product.isContinueSelling,
      isEmi: false,
      maxOrder: product.maxOrder,
      maxResellPrice: product.maxResellPrice,
      minOrder: minOrder.value,
      price: price.value,
      productType: product.productType,
      quantity: product.quantity,
      resellPrice: resellPrice.value ? resellPrice.value : price.value,
      rewardPoints: product.rewardPoints,
      sku: product.sku,
      slug: product.slug,
      thumbnail: selectedImage.value ? selectedImage.value : product.thumbnail,
      title: product.title,
      translation: product.translation,
      unit: product.unit,
      unitType: product.unitType,
      variant: cloneDeep(selectedVariant.value ? [selectedVariant.value] : []),
      variants: cloneDeep(product.variants ? product.variants : []),
      vat: product.vat,
      weight: product.weight,
    };
    addToCart(cloneDeep(item));

    toAnalyticsAddCart(product);
    isFull.value = false;
    router.push(`/checkout/`);
  }
};
const getBrand = (ids) => {
  if (ids.length > 0) {
    return brands.value.find((v) => v.id == ids[0])
      ? brands.value.find((v) => v.id == ids[0]).title
      : "";
  }
};

// variant setting
const selectedVariant = ref(
  cartProduct.value ? cartProduct.value.variant[0] : null
);
const variantGroups = computed(() => {
  const groups = {};
  props.product.variants.forEach((item) => {
    item.variant.forEach((variant) => {
      const key = variant.key;
      const value = variant.value;

      if (!groups[key]) {
        groups[key] = { title: key, items: [] };
      }

      if (!groups[key].items.includes(value)) {
        groups[key].items.push(value);
      }
    });
  });
  return groups;
});
const variantGroup = ref([]);
const selectVariantGroup = (variant) => {
  let found = variantGroup.value.find((a) => a.key == variant.key);
  if (found) {
    found.value = variant.value;
  } else {
    variantGroup.value.push(variant);
  }
  selectedVariant.value = props.product.variants.find(
    (a) => JSON.stringify(a.variant) === JSON.stringify(variantGroup.value)
  );
  imageIndex.value = selectedVariant.value
    ? selectedVariant.value.imageIndex
    : 0;
};
const price = computed(() => {
  if (props.product.productType == 7) {
    return props.product.price;
  } else if (customer.value && customer.value.isWholesale) {
    if (props.product.wholesale.length > 0) {
      const sortedArray = props.product.wholesale.sort(
        (a, b) => a.price - b.price
      );
      return sortedArray[0].price > 0
        ? sortedArray[0].price
        : props.product.price;
    } else {
      return props.product.wholesalePrice > 0
        ? props.product.wholesalePrice
        : props.product.price;
    }
  } else if (customer.value && customer.value.isReseller) {
    return props.product.wholesalePrice > 0
      ? props.product.wholesalePrice
      : props.product.price;
  } else if (props.product.isFlash) {
    return props.product.flashPrice > 0
      ? props.product.flashPrice
      : props.product.price;
  } else {
    return props.product.price;
  }
});
const minOrder = computed(() => {
  if (customer.value && customer.value.isWholesale) {
    if (props.product.wholesale.length > 0) {
      const sortedArray = props.product.wholesale.sort(
        (a, b) => a.price - b.price
      );
      return sortedArray[0].minOrder;
    } else {
      return props.product.minOrder;
    }
  } else {
    return props.product.minOrder;
  }
});
const resellPrice = ref(0.0);
const discount = (sale, regular) => {
  return ((regular - sale) / regular) * 100;
};

const toggleFavorite = async (product, isFavorite) => {
  if (customer.value && customer.value.id) {
    if (isFavorite) {
      const { mutate, loading, error } = useMutation(
        STORE_CUSTOMER_REMOVE_FAVORITE,
        {
          variables: {
            userId: me.value.id,
            customerId: customer.value.id,
            productId: product.id,
          },
        }
      );
      try {
        const response = await mutate();
        if (response.data.selfStoreCustomerRemoveFavorite) {
          customer.value.favorite = customer.value.favorite.filter(
            (number) => number !== product.id
          );
        }
      } catch (error) {}
    } else {
      const { mutate, loading, error } = useMutation(
        STORE_CUSTOMER_ADD_FAVORITE,
        {
          variables: {
            userId: me.value.id,
            customerId: customer.value.id,
            productId: product.id,
          },
        }
      );
      try {
        const response = await mutate();
        if (response.data.selfStoreCustomerAddFavorite) {
          customer.value.favorite.push(product.id);
        }
      } catch (error) {}
    }
  } else {
    router.push(`/login/?redirect=${router.currentRoute.value.path}`);
  }
};

const isFavorite = (item) => {
  if (customer.value) {
    let found = customer.value.favorite.find((el) => el == item.id);
    if (found) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

const toAnalyticsAddCart = (product) => {
  // facebook pixel track AddToCart
  if (window.fbq) {
    window.fbq("track", "AddToCart", {
      content_ids: [product.hid],
      content_name: product.title,
      content_type: "product",
      currency: product.currency,
      value: price.value,
      num_items: 1,
      source: `https://${site.value.domain}`,
      contents: [
        {
          id: product.hid,
          quantity: product.quantity,
          item_price: price.value,
        },
      ],
    });
  }
  // end facebook pixel track AddToCart
  // google analytics track add_to_cart
  if (window.gtag) {
    gtag("event", "add_to_cart", {
      currency: product.currency,
      value: price.value,
      items: [
        {
          item_id: product.hid,
          item_name: product.title,
          price: price.value,
          quantity: 1,
        },
      ],
    });
  }
  // end google analytics track add_to_cart
  // google analytics track view_item
  if (window.dataLayer) {
    dataLayer.push({ ecommerce: null });
    dataLayer.push({
      event: "add_to_cart",
      ecommerce: {
        currency: product.currency,
        value: price.value,
        items: [
          {
            item_id: product.hid,
            item_name: product.title,
            price: price.value,
            quantity: 1,
          },
        ],
      },
    });
  }
  // end google analytics track view_item
};

const getUnitType = (type) => {
  const list = {
    1: "Acre",
    2: "Bag",
    3: "Barrel",
    4: "Bottle",
    5: "Box",
    6: "Bundel",
    7: "Carton",
    8: "Container",
    9: "Cup",
    10: "Dozen",
    11: "Dram",
    12: "dp",
    13: "Each",
    14: "gl",
    15: "gm",
    16: "htr",
    17: "Jar",
    18: "kg",
    19: "km",
    20: "ltr",
    21: "m",
    22: "mg",
    23: "ml",
    24: "Pack",
    25: "Package",
    26: "Packet",
    27: "Pair",
    28: "Piece",
    29: "Pound",
    30: "Qt.",
    31: "scm",
    32: "sf",
    33: "sqi",
    34: "skm",
    35: "smeter",
    36: "sqm",
    37: "sy",
    38: "ts",
    39: "t",
    40: "Color",
  };
  return list[type];
};
</script>
