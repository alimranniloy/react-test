<template>
  <div
    class="hidden min-w-[280px] max-w-[300px] bg-white sticky top-[120px] rounded-xl h-[calc(100vh-99px)] lg:h-[calc(100vh-136px)] p-4 xl:flex flex-col"
  >
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-bold text-xl">Cart</h3>
      </div>
      <div class="flex-1">
        <div
          v-if="cart.length > 0"
          class="flex flex-col justify-between h-full"
        >
          <div
            class="h-[calc(100vh-260px)] overflow-y-auto scrollbar-thin"
          >
            <!-- single cart item -->
            <div
              v-for="product in cart.filter((v) => v.title.length > 0)"
              class="grid grid-cols-[60px_1fr] gap-3 border-b py-4"
            >
              <div>
                <img class="w-full mt-2 rounded-sm" v-lazy="product.thumbnail" alt="" />
              </div>
              <div>
                <div class="flex items-center gap-1">
                  <div class="text-sm">
                    <p>{{ product.title }}</p>
                    <div class="font-semibold text-red-500">
                      <span>{{
                        site.isPublic || (customer && customer.isActive)
                          ? formatMoney(product.price, product.currency)
                          : "***"
                      }}</span>
                    </div>
                  </div> 
                  <div>
                    <TrashIcon
                      @click="removeCart(product)"
                      class="h-6 w-6 text-red-500 cursor-pointer"
                    />
                  </div>
                </div>
                <!-- increment and decrement -->
                <div class="flex items-center pt-3">
                  <div
                    @click="removeFromCart(product)"
                    class="bg-gray-200 rounded-lg h-8 cursor-pointer w-8 flex items-center justify-center text-base font-bold text-gray-400"
                  >
                    <span>-</span>
                  </div>
                  <div class="font-bold mx-3">{{ product.qnt }}</div>
                  <div
                    @click="addToCart(product)"
                    class="bg-gray-200 rounded-lg h-8 w-8 flex items-center justify-center text-base font-bold text-gray-400 cursor-pointer"
                  >
                    <span>+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="">
            <!-- <div class="flex justify-between border-b py-4">
                <div class="flex">
                  <div
                    class="w-14 h-14 flex items-center justify-center bg-gray-200 rounded-xl mr-3"
                  >
                    <span class=""
                      ><HeartIcon
                        class="h-5 w-5 text-red-400"
                        aria-hidden="true"
                    /></span>
                  </div>
                  <div class="w-48 text-sm">
                    <p>Add additional $1000 products to save</p>
                    <div class="font-semibold">
                      <span>79$</span>
                      .
                      <span class="text-gray-400">delivery charge</span>
                    </div>
                  </div>
                </div>
              </div> -->
            <router-link
              :to="`/checkout`"
              class="bg-[--primary] text-white py-2 px-4 rounded-xl flex items-center justify-between"
            >
              <div>Checkout</div>
              <div class="text-xl font-semibold">
                {{
                  site.isPublic || (customer && customer.isActive)
                    ? formatMoney(
                        cart.reduce(
                          (total, obj) => total + obj.price * obj.qnt,
                          0
                        ),
                        "BDT"
                      )
                    : "***"
                }}
              </div>
            </router-link>
          </div>
        </div>
        <div v-else class="flex flex-col justify-between h-full">
          <div class="flex items-center justify-center h-[calc(100vh-260px)]">
            <div class="flex flex-col items-center">
              <img
                class="w-24"
                src="https://bponi.sgp1.cdn.digitaloceanspaces.com/images/emptyCart.png"
                alt=""
              />
              <h3 class="font-bold text-center text-xl mt-4">
                Your basket is empty
              </h3>
              <p class="text-center mt-3">
                The items you order will appear here.
              </p>
            </div>
          </div>
          <div>
            <div
              class="bg-gray-100 text-gray-400 py-2 px-4 rounded-xl flex items-center justify-between"
            >
              <div>Checkout</div>
              <div class="text-xl font-semibold">00</div>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { useCartStore } from "@/stores/cart";
import { useCustomerStore } from "@/stores/customer";
import { useSiteStore } from "@/stores/site";
import { TrashIcon } from "@heroicons/vue/24/outline";
const { cart } = storeToRefs(useCartStore());
const { addToCart, removeFromCart, removeCart } = useCartStore();
const { customer } = storeToRefs(useCustomerStore());
const { site } = storeToRefs(useSiteStore());
</script>
