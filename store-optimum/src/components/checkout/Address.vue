<template>
  <div>
    <PhoneNumber
      :key="cartCustomer.phone"
      class="mt-6 md:mt-0"
      :height="'p-3'"
      :title="$t('checkout.enterPhone')"
      :phone="cartCustomer.phone"
      @onPhone="onPhone"
    />
    <div class="relative rounded-md border p-3 mb-6">
      <label
        for="name"
        class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-sm font-medium text-gray-900"
        >{{ $t("checkout.enterName") }}</label
      >
      <input
        v-model.lazy.trim="cartCustomer.name"
        type="text"
        name="name"
        id="name"
        placeholder="Enter name"
        class="w-full border-0 p-0 text-gray-900 placeholder-gray-500 bg-transparent sm:text-sm focus:ring-0"
      />
      <div
        class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
      >
        <ExclamationCircleIcon
          v-if="cartCustomer.name.length < 3"
          class="h-5 w-5 text-red-500"
          aria-hidden="true"
        />
        <CheckCircleIcon
          v-else
          class="h-5 w-5 text-green-500"
          aria-hidden="true"
        />
      </div>
    </div>
    <div class="relative rounded-md border px-3 py-3 mb-6">
      <label
        for="address"
        class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-sm font-medium text-gray-900"
        >{{ $t("checkout.enterAddress") }}</label
      >
      <textarea
        v-model.lazy.trim="cartCustomer.address"
        rows="4"
        name="comment"
        id="address"
        placeholder="Enter address"
        class="w-full border-0 p-0 text-gray-900 placeholder-gray-500 bg-transparent sm:text-sm focus:ring-0"
      />
      <div
        class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
      >
        <ExclamationCircleIcon
          v-if="cartCustomer.address.length < 3"
          class="h-5 w-5 text-red-500"
          aria-hidden="true"
        />
        <CheckCircleIcon
          v-else
          class="h-5 w-5 text-green-500"
          aria-hidden="true"
        />
      </div>
    </div>
    <div
      v-if="resellTotal > subTotal"
      class="relative rounded-md border p-5 mb-6"
    >
      <h3 class="text-base mb-2">
        {{ $t("checkout.isCustomLogisticsExtraCharge") }}
      </h3>
      <RadioGroup v-model="isCustomLogisticsExtraCharge">
        <RadioGroupLabel class="sr-only">
          {{ $t("checkout.isCustomLogisticsExtraCharge") }}
        </RadioGroupLabel>
        <div class="rounded-md flex gap-4 items-center justify-between">
          <RadioGroupOption
            class="w-full"
            as="template"
            :value="false"
            v-slot="{ checked, active }"
          >
            <div
              :class="[
                checked || !isCustomLogisticsExtraCharge
                  ? 'bg-[#23b47e1a] border-[#24b47e]'
                  : 'border-gray-200',
                'relative rounded-md border p-3 flex items-center cursor-pointer focus:outline-none',
              ]"
            >
              <span
                :class="[
                  checked || !isCustomLogisticsExtraCharge
                    ? 'bg-[#24b47e] border-transparent'
                    : 'bg-white border',
                  active ? '' : '',
                  'mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded-full border flex items-center justify-center',
                ]"
                aria-hidden="true"
              >
                <span class="rounded-full bg-white w-1.5 h-1.5" />
              </span>
              <span class="ml-3 flex flex-col">
                <RadioGroupLabel
                  as="span"
                  :class="[
                    checked ? '' : 'text-gray-900',
                    'block text-sm font-medium',
                  ]"
                  >{{ $t("checkout.no") }}</RadioGroupLabel
                >
                <RadioGroupDescription
                  as="p"
                  :class="[checked ? '' : 'text-gray-500', 'block text-xs']"
                  >{{ $t("checkout.noDetails") }}
                </RadioGroupDescription>
              </span>
            </div>
          </RadioGroupOption>
          <RadioGroupOption
            class="w-full"
            as="template"
            :value="true"
            v-slot="{ checked, active }"
          >
            <div
              :class="[
                checked || isCustomLogisticsExtraCharge
                  ? 'bg-[#23b47e1a] border-[#24b47e]'
                  : 'border-gray-200',
                'relative rounded-md border p-3 flex items-center cursor-pointer focus:outline-none',
              ]"
            >
              <span
                :class="[
                  checked || isCustomLogisticsExtraCharge
                    ? 'bg-[#24b47e] border-transparent'
                    : 'bg-white border',
                  active ? '' : '',
                  'mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded-full border flex items-center justify-center',
                ]"
                aria-hidden="true"
              >
                <span class="rounded-full bg-white w-1.5 h-1.5" />
              </span>
              <span class="ml-3 flex flex-col">
                <RadioGroupLabel
                  as="span"
                  :class="[
                    checked ? '' : 'text-gray-900',
                    'block text-sm font-medium',
                  ]"
                  >{{ $t("checkout.yes") }}</RadioGroupLabel
                >
                <RadioGroupDescription
                  as="p"
                  :class="[checked ? '' : 'text-gray-500', 'block text-xs']"
                  >{{ $t("checkout.yesDetails") }}
                </RadioGroupDescription>
              </span>
            </div>
          </RadioGroupOption>
        </div>
      </RadioGroup>

      <div
        v-show="isCustomLogisticsExtraCharge"
        class="relative rounded-md border px-3 py-3 mt-6"
      >
        <label
          for="customLogisticsExtraCharge"
          class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-sm font-medium text-gray-900"
          >{{ $t("checkout.customLogisticsExtraCharge") }}</label
        >
        <input
          type="text"
          name="customLogisticsExtraCharge"
          id="customLogisticsExtraCharge"
          class="w-full border-0 p-0 text-gray-900 placeholder-gray-500 bg-transparent sm:text-sm focus:ring-0"
          v-model="customLogisticsExtraCharge"
        />
        <div
          class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
        >
          <ExclamationCircleIcon
            v-if="cartCustomer.customLogisticsExtraCharge == null"
            class="h-5 w-5 text-red-500"
            aria-hidden="true"
          />
          <CheckCircleIcon
            v-else
            class="h-5 w-5 text-green-500"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
    <div
      v-if="resellTotal > subTotal"
      class="relative rounded-md border p-5 mb-6"
    >
      <h3 class="text-base mb-2">
        {{ $t("checkout.isResellerAdvanceCollect") }}
      </h3>
      <RadioGroup v-model="isResellerAdvanceCollect">
        <RadioGroupLabel class="sr-only">
          {{ $t("checkout.isResellerAdvanceCollect") }}
        </RadioGroupLabel>
        <div class="rounded-md flex gap-4 items-center justify-between">
          <RadioGroupOption
            class="w-full"
            as="template"
            :value="false"
            v-slot="{ checked, active }"
          >
            <div
              :class="[
                checked || !isResellerAdvanceCollect
                  ? 'bg-[#23b47e1a] border-[#24b47e]'
                  : 'border-gray-200',
                'relative rounded-md border p-3 flex items-center cursor-pointer focus:outline-none',
              ]"
            >
              <span
                :class="[
                  checked || !isResellerAdvanceCollect
                    ? 'bg-[#24b47e] border-transparent'
                    : 'bg-white border',
                  active ? '' : '',
                  'mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded-full border flex items-center justify-center',
                ]"
                aria-hidden="true"
              >
                <span class="rounded-full bg-white w-1.5 h-1.5" />
              </span>
              <span class="ml-3 flex flex-col">
                <RadioGroupLabel
                  as="span"
                  :class="[
                    checked ? '' : 'text-gray-900',
                    'block text-sm font-medium',
                  ]"
                  >{{ $t("checkout.no") }}</RadioGroupLabel
                >
                <RadioGroupDescription
                  as="p"
                  :class="[checked ? '' : 'text-gray-500', 'block text-xs']"
                  >{{ $t("checkout.due") }}
                </RadioGroupDescription>
              </span>
            </div>
          </RadioGroupOption>
          <RadioGroupOption
            class="w-full"
            as="template"
            :value="true"
            v-slot="{ checked, active }"
          >
            <div
              :class="[
                checked || isResellerAdvanceCollect
                  ? 'bg-[#23b47e1a] border-[#24b47e]'
                  : 'border-gray-200',
                'relative rounded-md border p-3 flex items-center cursor-pointer focus:outline-none',
              ]"
            >
              <span
                :class="[
                  checked || isResellerAdvanceCollect
                    ? 'bg-[#24b47e] border-transparent'
                    : 'bg-white border',
                  active ? '' : '',
                  'mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded-full border flex items-center justify-center',
                ]"
                aria-hidden="true"
              >
                <span class="rounded-full bg-white w-1.5 h-1.5" />
              </span>
              <span class="ml-3 flex flex-col">
                <RadioGroupLabel
                  as="span"
                  :class="[
                    checked ? '' : 'text-gray-900',
                    'block text-sm font-medium',
                  ]"
                  >{{ $t("checkout.yes") }}</RadioGroupLabel
                >
                <RadioGroupDescription
                  as="p"
                  :class="[checked ? '' : 'text-gray-500', 'block text-xs']"
                  >{{ $t("checkout.received") }}
                </RadioGroupDescription>
              </span>
            </div>
          </RadioGroupOption>
        </div>
      </RadioGroup>

      <div
        v-show="isResellerAdvanceCollect"
        class="relative rounded-md border px-3 py-3 mt-6"
      >
        <label
          for="resellerAdvanceCollect"
          class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-sm font-medium text-gray-900"
          >{{ $t("checkout.resellerAdvanceCollect") }}</label
        >
        <input
          type="number"
          name="resellerAdvanceCollect"
          id="resellerAdvanceCollect"
          class="w-full border-0 p-0 text-gray-900 placeholder-gray-500 bg-transparent sm:text-sm focus:ring-0"
          v-model.lazy.number="resellerAdvanceCollect"
        />
        <div
          class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
        >
          <ExclamationCircleIcon
            v-if="cartCustomer.resellerAdvanceCollect == 0"
            class="h-5 w-5 text-red-500"
            aria-hidden="true"
          />
          <CheckCircleIcon
            v-else
            class="h-5 w-5 text-green-500"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
    <Shipping />
  </div>
</template>
<script setup>
import { USER_BY_PHONE, USER_UPDATE_PUBLIC } from "@/gql/user";
import { STORE_CUSTOMER_CREATE_USER_ID } from "@/gql/customer";
import {
  RadioGroup,
  RadioGroupDescription,
  RadioGroupLabel,
  RadioGroupOption,
} from "@headlessui/vue";
import Shipping from "@/components/checkout/Shipping.vue";
import PhoneNumber from "@/components/checkout/PhoneNumber.vue";
import { ref, computed, watch, onMounted } from "vue";
import { useCartStore } from "@/stores/cart";
import { useSiteStore } from "@/stores/site";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { storeToRefs } from "pinia";
import {
  ExclamationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/vue/24/outline";
const { site } = storeToRefs(useSiteStore());
const { cart, cartCustomer } = storeToRefs(useCartStore());
const customLogisticsExtraCharge = ref(null);
const isCustomLogisticsExtraCharge = ref(
  customLogisticsExtraCharge.value ? true : false
);
const resellerAdvanceCollect = ref(0);
const isResellerAdvanceCollect = ref(false);
const timer = ref(null);
const resellTotal = computed(() => {
  return cart.value.reduce(
    (total, obj) => total + obj.resellPrice * obj.qnt,
    0
  );
});
watch(isCustomLogisticsExtraCharge, (newVaue) => {
  if (!newVaue) {
    customLogisticsExtraCharge.value = null;
  }
});
const subTotal = computed(() => {
  return cart.value.reduce((total, obj) => total + obj.price * obj.qnt, 0);
});
const subResell = computed(() => {
  return cart.value.reduce(
    (total, obj) => total + obj.resellPrice * obj.qnt,
    0
  );
});

const totalLogisticsExtraCharge = computed(() => {
  if (typeof cartCustomer.value.customLogisticsExtraCharge == "number") {
    return cartCustomer.value.customLogisticsExtraCharge -
      cartCustomer.value.logisticsIsFree
      ? 0.0
      : cartCustomer.value.logisticsCharge;
  } else {
    return 0.0;
  }
});

const onPhone = (phone) => {
  cartCustomer.value.phone = phone;
  const { onResult, onError } = useQuery(USER_BY_PHONE, {
    phone: phone,
  });
  onResult((queryResult) => {
    let user = queryResult.data.userByPhone;
    cartCustomer.value.userId = user.id;
    cartCustomer.value.name =
      user.publicTitle && user.publicTitle.length > 0
        ? user.publicTitle
        : cartCustomer.value.name;
    cartCustomer.value.address =
      user.publicAddress && user.publicAddress.length > 0
        ? user.publicAddress
        : cartCustomer.value.address;
    cartCustomer.value.phone = phone;
    cartCustomer.value.userId = user.id;
    cartCustomer.value.latitude =
      user.publicLatitude > 0
        ? user.publicLatitude
        : cartCustomer.value.latitude;
    cartCustomer.value.longitude =
      user.publicLongitude > 0
        ? user.publicLongitude
        : cartCustomer.value.longitude;
    cartCustomer.value.formattedAddress =
      user.publicFormattedAddress && user.publicFormattedAddress.length > 0
        ? user.publicFormattedAddress
        : cartCustomer.value.formattedAddress;
  });
  onError((error) => {
    cartCustomer.value.userId = null;
  });
};
const updateUserPublic = async () => {
  const { mutate, loading, error } = useMutation(USER_UPDATE_PUBLIC, {
    variables: {
      id: cartCustomer.value.userId,
      publicAddress: cartCustomer.value.address,
      publicFormattedAddress: cartCustomer.value.formattedAddress,
      publicLatitude: cartCustomer.value.latitude,
      publicLongitude: cartCustomer.value.longitude,
      publicTitle: cartCustomer.value.name,
    },
  });
  try {
    const response = await mutate();
    if (response.data.userUpdatePublic) {
      // addNotification(
      //   { title: "Order info", subTitle: "Successfully updated new data." },
      //   "success"
      // );
    }
  } catch (error) {
    // addNotification(
    //   { title: "Order info", subTitle: error.message },
    //   "error"
    // );
  }
};
const createUser = async () => {
  const { mutate } = useMutation(STORE_CUSTOMER_CREATE_USER_ID, {
    variables: {
      siteId: site.value.id,
      title: cartCustomer.value.name,
      phone: cartCustomer.value.phone,
    },
  });
  try {
    const response = await mutate();
    if (response.data.storeCustomerCreateUserId) {
      cartCustomer.value.userId =
        response.data.storeCustomerCreateUserId.userId;
      // addNotification(
      //   { title: "Order info", subTitle: "Successfully updated new data." },
      //   "success"
      // );
    }
  } catch (error) {
    // addNotification(
    //   { title: "Order info", subTitle: error.message },
    //   "error"
    // );
  }
};
watch(cartCustomer.value, () => {
  if (cartCustomer.value.userId) {
    clearTimeout(timer.value);
    timer.value = setTimeout(() => {
      updateUserPublic();
    }, 3000);
  } else if (
    cartCustomer.value.userId == null &&
    cartCustomer.value.phone &&
    cartCustomer.value.name.length > 3
  ) {
    createUser();
  }
});
watch(customLogisticsExtraCharge, () => {
  if (
    customLogisticsExtraCharge.value &&
    customLogisticsExtraCharge.value.length > 0
  ) {
    cartCustomer.value.customLogisticsExtraCharge = parseFloat(
      customLogisticsExtraCharge.value
    )
      ? parseFloat(customLogisticsExtraCharge.value)
      : 0.0;
  } else {
    cartCustomer.value.customLogisticsExtraCharge = null;
  }
});
watch(resellerAdvanceCollect, () => {
  if (
    resellerAdvanceCollect.value &&
    resellerAdvanceCollect.value > 0 &&
    resellerAdvanceCollect.value <=
      subResell.value -
        subTotal.value +
        totalLogisticsExtraCharge.value -
        cartCustomer.value.discount
  ) {
    cartCustomer.value.resellerAdvanceCollect = parseFloat(
      resellerAdvanceCollect.value
    )
      ? parseFloat(resellerAdvanceCollect.value)
      : 0.0;
  } else {
    cartCustomer.value.resellerAdvanceCollect = 0;
    resellerAdvanceCollect.value = 0;
    addNotification(
      {
        title: "Order info",
        subTitle: "Can not collect advance payment more than your profit.",
      },
      "error"
    );
  }
});
onMounted(() => {
  if (cartCustomer.value.customLogisticsExtraCharge != null) {
    isCustomLogisticsExtraCharge.value = true;
    customLogisticsExtraCharge.value =
      cartCustomer.value.customLogisticsExtraCharge.toString();
  }
});
</script>
