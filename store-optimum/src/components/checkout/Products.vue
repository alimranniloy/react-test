<template>
  <div class="divide-y">
    <div v-for="product in cart.filter((v) => v.title.length > 0)"
      class="justify-between px-0 py-5 flex flex-col sm:flex-row bg-white relative">
      <div class="grid grid-cols-4 gap-3">
        <div class="col-span-1">
          <img class="object-cover aspect-square rounded-md" v-lazy="product.thumbnail" alt="" />
        </div>
        <div class="col-span-3">
          <a href="">
            <h2 class="text-base line-clamp-1">
              {{ product.title }}
            </h2>
          </a>
          <div class="mt-0">
            <span class="text-base mr-3">{{
              site.isPublic ||
                ![1, 2, 5, 6].includes(
                  cart.length > 0 ? cart[0].productType : true
                ) ||
                (customer && customer.isActive)
                ? formatMoney(product.price, product.currency)
                : "***"
            }}</span>
            <span v-if="product.comparePrice > product.price" class="text-[14px] mr-3 line-through text-gray-500">{{
              site.isPublic ||
                ![1, 2, 5, 6].includes(
                  cart.length > 0 ? cart[0].productType : true
                ) ||
                (customer && customer.isActive)
                ? formatMoney(product.comparePrice, product.currency)
                : "***"
            }}</span>
            <span v-if="product.comparePrice > product.price" class="text-[14px] text-[#EE741F]">({{
              discount(product.price,
                product.comparePrice).toFixed(1) }}%
              অফ)</span>
          </div>
          <p v-if="
            product.comparePrice - product.price > 0 &&
            !(product.resellPrice - product.price > 0)
          " class="text-[14px] text-[#17B31B] mt-0">
            আপনি সেইভ করেছেন
            {{
              site.isPublic ||
                ![1, 2, 5, 6].includes(
                  cart.length > 0 ? cart[0].productType : true
                ) ||
                (customer && customer.isActive)
                ? formatMoney(
                  product.comparePrice - product.price,
                  product.currency
                )
                : "***"
            }}
          </p>
          <p v-if="product.resellPrice - product.price > 0" class="text-[14px] text-[#17B31B] mt-1">
            রিসেল প্রাইজ
            {{
              site.isPublic ||
                ![1, 2, 5, 6].includes(
                  cart.length > 0 ? cart[0].productType : true
                ) ||
                (customer && customer.isActive)
                ? formatMoney(product.resellPrice, product.currency)
                : "***"
            }}
          </p>
          <div class="flex gap-x-2">
            <Menu v-for="(item, index) in variantUniqueTypes(product)" :key="index" as="div"
              class="relative -ml-px block my-2">
              <MenuButton
                class="border flex items-center rounded-md gap-2 transition-all px-2 py-2 cursor-pointer text-xs">{{
                  item
                }} -
                {{
                  product.variant.find((el) => el.variant.map((a) => a.key).join(' - ') == item)
                    ? product.variant.find((el) => el.variant.map((a) => a.key).join(' - ')).title
                    : ""
                }}
                <ChevronDownIcon class="h-3 w-3" />
              </MenuButton>
              <transition enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95">
                <MenuItems
                  class="absolute left-0 z-10 mt-2 -mr-1 w-56 origin-top-right rounded-md bg-white shadow-lg focus:outline-none">
                  <div class="py-3 px-3">
                    <MenuItem @click="selectVariant(product, variant)" v-for="variant in product.variants.filter(
                      (el) => el.variant.map((a) => a.key).join(' - ') == item
                    )" :key="variant.id" v-slot="{ active }">
                    <div :class="[
                      active
                        ? 'bg-gray-100 text-gray-900 rounded-md'
                        : 'text-gray-700',
                      'flex justify-between px-3 py-2 text-base',
                    ]">
                      <span>{{ variant.title }}</span>
                      <span>{{
                        site.isPublic ||
                          ![1, 2, 5, 6].includes(
                            cart.length > 0 ? cart[0].productType : true
                          ) ||
                          (customer && customer.isActive)
                          ? formatMoney(
                            variant.price + product.basePrice,
                            site.currency
                          )
                          : "***"
                      }}</span>
                    </div>
                    </MenuItem>
                  </div>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
        <button @click="removeCart(product)"
          class="absolute top-2 right-0 text-red-600 bg-red-100 hover:bg-red-200 h-8 w-8 flex items-center justify-center p-2 rounded-full transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div v-if="[1, 2, 5, 6].includes(product.productType)"
        class="flex items-center h-fit sm:self-end ml-24 sm:ml-0 mt-3 sm:mt-0">
        <button @click="removeFromCart(product)"
          class="bg-gray-200 rounded-lg h-8 w-8 flex items-center justify-center text-base font-bold text-gray-600">
          <span>-</span>
        </button>
        <input type="number"
          class="h-8 mx-3 text-[18px] text-center text-sm text-gray-500 border-gray-200 rounded-md w-20"
          v-model="product.qnt" />
        <button @click="addToCart(product)"
          class="bg-gray-200 rounded-lg h-8 w-8 flex items-center justify-center text-base font-bold text-gray-600">
          <span>+</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/24/outline";
import { storeToRefs } from "pinia";
import { useSiteStore } from "@/stores/site";
import { useCustomerStore } from "@/stores/customer";
import { useCartStore } from "@/stores/cart";
const { customer } = storeToRefs(useCustomerStore());
const { site } = storeToRefs(useSiteStore());
const { cart } = storeToRefs(useCartStore());
const { addToCart, setToCart, removeFromCart, removeCart } = useCartStore();
const variantUniqueTypes = (product) => {
  var variantTypes = [];
  if (product) {
    for (let variant of product.variants) {
      variantTypes.push(variant.variant.map((a) => a.key).join(" - "));
    }
  }
  return [...new Set(variantTypes)];
};
const selectVariant = (product, variant) => {
  let found = cart.value.find(
    (el) => el.id == product.id && el.index == product.index
  );
  if (found) {
    for (let i of found.variant.filter(
      (el) => el.variant.map((a) => a.key).join(' - ') == variant.variant.map((a) => a.key).join(' - ')
    )) {
      let index = found.variant.indexOf(i);
      if (index > -1) {
        found.variant.splice(index, 1);
      }
    }
    let foundVariant = found.variant.find((el) => el.id == variant.id);
    if (!foundVariant) {
      found.variant.push(variant);
    }
    found.price = found.basePrice;
    // calculate price
    for (let i of found.variant) {
      if (customer.value && customer.value.isReseller) {
        found.price = i.wholesalePrice + product.basePrice;
      } else {
        found.price = i.price + product.basePrice;
        found.comparePrice = i.comparePrice + product.baseComparePrice;
        found.resellPrice = i.wholesalePrice + product.baseWholesalePrice;
      }
    }
    setToCart(found);
  }
};
const discount = (sale, regular) => {
  return ((regular - sale) / regular) * 100;
};
</script>
