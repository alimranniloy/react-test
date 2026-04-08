<template>
  <h3
    v-if="
      logisticses.length > 0 &&
      [1, 2, 5, 6].includes(cart.length > 0 ? cart[0].productType : true)
    "
    class="text-base mb-3 mt-5 sm:mt-0"
  >
    {{ $t("checkout.deliveryOption") }}
  </h3>
  <RadioGroup
    v-if="
      logisticses.length > 0 &&
      [1, 2, 5, 6].includes(cart.length > 0 ? cart[0].productType : true)
    "
    v-model="selectedLogistics"
  >
    <RadioGroupLabel class="sr-only">
      {{ $t("checkout.deliveryOption") }}
    </RadioGroupLabel>
    <div class="space-y-5 rounded-md">
      <RadioGroupOption
        as="template"
        v-for="(logistics, logisticsIdx) in logisticses"
        :key="logistics.title"
        :value="logistics"
        v-slot="{ checked, active }"
      >
        <div
          :class="[
            checked ||
            (selectedLogistics && selectedLogistics.id == logistics.id)
              ? 'bg-[#23b47e1a] border-[#24b47e]'
              : 'border-gray-200',
            'relative rounded-md border p-3 flex items-center cursor-pointer focus:outline-none',
          ]"
        >
          <span
            :class="[
              checked ||
              (selectedLogistics && selectedLogistics.id == logistics.id)
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
              >{{ logistics.title }}</RadioGroupLabel
            >
            <!-- =========== hide delivery charge ============ -->
            <!-- <RadioGroupDescription as="p" :class="[checked ? '' : 'text-gray-500', 'block text-xs']">{{
              logistics.description }}
              <span>{{ $t("checkout.deliveryCost") }}
                {{
                site.isPublic ||
                ![1, 2, 5, 6].includes(
                cart.length > 0 ? cart[0].productType : true
                ) ||
                (customer && customer.isActive)
                ? formatMoney(
                selectedLogistics &&
                selectedLogistics.id == logistics.id
                ? cartCustomer.logisticsCharge
                : cartCustomer.logisticsCharge,
                "BDT"
                )
                : "***"
                }}</span>
            </RadioGroupDescription> -->
          </span>
        </div>
      </RadioGroupOption>
    </div>
  </RadioGroup>
  <Menu
    v-if="stoppages.filter((a) => a.stoppageType == 4).length > 0"
    as="div"
    v-slot="{ close }"
    class="relative mr-4 mt-5 w-full mb-5"
  >
    <div>
      <label
        for="productPrice"
        class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-sm font-medium text-gray-900 z-10"
        >Select Area</label
      >
      <MenuButton
        class="relative w-full cursor-default rounded-md border bg-white py-4 pl-3 pr-10 text-left focus:outline-none sm:text-sm"
      >
        {{
          areaId
            ? `${stoppages.find((a) => a.id == areaId).title}, ${
                stoppages.find((a) => a.id == subCityId).title
              }, ${stoppages.find((a) => a.id == cityId).title}`
            : "Select Area"
        }}
      </MenuButton>
    </div>

    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <MenuItems
        class="absolute right-0 mt-2 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none w-full z-40"
      >
        <div class="px-2 py-3 h-[400px] overflow-auto">
          <div class="relative rounded-md border px-3 py-3 mx-1 mb-1">
            <input
              v-model="search"
              type="text"
              name="search"
              id="search"
              class="w-full border-0 p-0 text-gray-900 placeholder-gray-500 bg-transparent sm:text-sm focus:ring-0"
              placeholder="Search area"
            />
            <div
              class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
            >
              <ExclamationCircleIcon
                v-if="search.length < 2"
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
            v-if="cityId || subCityId"
            class="bg-gray-300 rounded-sm mt-2 flex justify-start items-center"
          >
            <div
              v-if="cityId"
              @click="(cityId = null), (subCityId = null), (areaId = null)"
              class="flex justify-start items-center hover:bg-red-100"
            >
              <ChevronLeftIcon
                class="h-5 w-5 text-red-400"
                aria-hidden="true"
              />
              <div class="px-1 py-2">
                {{ stoppages.find((a) => a.id == cityId).title }}
              </div>
            </div>
            <div
              v-if="subCityId"
              @click="(subCityId = null), (areaId = null)"
              class="flex justify-start items-center w-full hover:bg-red-100"
            >
              <ChevronLeftIcon
                class="h-5 w-5 text-red-400"
                aria-hidden="true"
              />
              <div class="px-1 py-2">
                {{ stoppages.find((a) => a.id == subCityId).title }}
              </div>
            </div>
          </div>
          <div
            v-for="stoppage in searchResults
              .filter((a) =>
                search.length > 1
                  ? true
                  : cityId == null && subCityId == null && areaId == null
                  ? a.stoppageType == 2
                  : cityId != null && subCityId == null
                  ? a.cityId == cityId && a.stoppageType == 3
                  : cityId != null && subCityId != null
                  ? a.subCityId == subCityId && a.stoppageType == 4
                  : true,
              )
              .sort((a, b) =>
                search.length > 1 ? true : a.title.localeCompare(b.title),
              )"
            :key="stoppage.id"
            class="w-full"
          >
            <div
              class="flex justify-between items-center cursor-pointer hover:bg-red-100 rounded-md"
            >
              <div
                v-if="search.length == 0 && cityId == null"
                @click="cityId = stoppage.id"
                class="px-2 py-2 w-full"
              >
                {{ stoppage.title
                }}<span
                  class="bg-red-200 text-gray-700 p-1 ml-2 rounded-full text-[10px]"
                  >{{
                    stoppages.filter(
                      (a) => a.stoppageType == 3 && a.cityId == stoppage.id,
                    ).length
                  }}</span
                >
              </div>
              <div
                v-else-if="search.length == 0 && cityId && subCityId == null"
                @click="subCityId = stoppage.id"
                class="px-2 py-2 w-full"
              >
                {{ stoppage.title
                }}<span
                  class="bg-red-200 text-gray-700 p-1 ml-2 rounded-full text-[10px]"
                  >{{
                    stoppages.filter(
                      (a) => a.stoppageType == 4 && a.subCityId == stoppage.id,
                    ).length
                  }}</span
                >
              </div>
              <div
                v-else-if="
                  search.length == 0 && cityId && subCityId && areaId == null
                "
                @click="(areaId = stoppage.id), close()"
                class="px-2 py-2 w-full"
              >
                {{ stoppage.title }}
              </div>
              <div
                v-else-if="search.length > 0"
                @click="
                  stoppage.stoppageType == 4
                    ? ((areaId = stoppage.id),
                      (subCityId = stoppage.subCityId),
                      (cityId = stoppage.cityId),
                      close())
                    : stoppage.stoppageType == 3
                    ? ((search = ''),
                      (areaId = null),
                      (subCityId = stoppage.id),
                      (cityId = stoppage.cityId))
                    : stoppage.stoppageType == 2
                    ? ((search = ''),
                      (areaId = null),
                      (subCityId = null),
                      (cityId = stoppage.id))
                    : ((search = ''),
                      (areaId = null),
                      (subCityId = null),
                      (cityId = null))
                "
                class="px-2 py-2 w-full"
              >
                {{ stoppage.title
                }}<span>{{
                  stoppage.stoppageType == 2
                    ? " - (city)"
                    : stoppage.stoppageType == 3
                    ? "- (sub city)"
                    : ""
                }}</span>
              </div>
              <div
                v-else-if="search.length == 0 && cityId && subCityId && areaId"
                @click="(areaId = stoppage.id), close()"
                class="px-2 py-2 w-full"
              >
                {{ stoppage.title }}
              </div>
              <ChevronRightIcon
                v-if="cityId == null || subCityId == null"
                class="h-5 w-5 text-red-400"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </MenuItems>
    </transition>
  </Menu>
  <!-- <div
    v-show="
      [11].includes(site.industry) &&
      [1, 2, 5, 6].includes(cart.length > 0 ? cart[0].productType : true)
    "
    class="relative rounded-md border px-4 py-3 mt-6"
  >
    <label
      for="deliveryTime"
      class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-sm font-medium text-gray-900"
      >{{ $t("checkout.deliveryTime") }}</label
    >
    <RadioGroup v-model="deliveryTime" class="mt-3">
      <RadioGroupLabel class="sr-only">
        {{ $t("checkout.deliveryTime") }}
      </RadioGroupLabel>
      <div class="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-6">
        <RadioGroupOption
          as="template"
          v-for="(day, dayIdx) in days"
          :key="day"
          :value="day"
          v-slot="{ checked, active }"
        >
          <div
            :class="[
              dayIdx === 0 ? 'rounded-md' : '',
              dayIdx === days.length - 1 ? 'rounded-md' : '',
              checked || day.format('d') === deliveryTime.format('d')
                ? 'bg-[#23b47e1a] border-[#24b47e]'
                : 'border-gray-200 bg-gray-100',
              'relative border rounded-lg px-5 py-3 cursor-pointer focus:outline-none bg-brand text-brand-light',
            ]"
          >
            <span class="text-center">
              <RadioGroupLabel
                as="p"
                :class="[
                  checked ? '' : 'text-gray-900',
                  'text-base font-semibold text-brand-light',
                ]"
                >{{ day.format("ddd") }}</RadioGroupLabel
              >
              <RadioGroupDescription
                as="p"
                :class="[
                  checked || day === deliveryTime ? '' : 'text-gray-500',
                  'text-15px text-brand-light',
                ]"
                >{{ day.format("D MMM") }}
              </RadioGroupDescription>
            </span>
          </div>
        </RadioGroupOption>
      </div>
    </RadioGroup>
    <RadioGroup v-model="time" class="mt-4">
      <RadioGroupLabel class="sr-only">
        {{ $t("checkout.deliveryTime") }}
      </RadioGroupLabel>
      <div
        class="flex flex-wrap justify-between grid-cols-2 gap-4 lg:grid sm:grid-cols-3 lg:grid-cols-3"
      >
        <RadioGroupOption
          as="template"
          v-for="(item, timeIdx) in times"
          :key="item.name"
          :value="item.name"
          v-slot="{ checked, active }"
          class="cursor-pointer focus:outline-none"
        >
          <div
            :class="[
              timeIdx === 0 ? 'rounded-md' : '',
              timeIdx === times.length - 1 ? 'rounded-md' : '',
              checked || item.name === time
                ? 'border-[#24b47e]'
                : 'border-gray-200',
              'flex items-center',
            ]"
          >
            <span
              :class="[
                checked ? 'bg-[#24b47e] border-transparent' : 'bg-white border',
                active ? '' : '',
                'mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded-full border flex items-center justify-center',
              ]"
              aria-hidden="true"
            >
              <span class="rounded-full bg-white w-1.5 h-1.5" />
            </span>
            <RadioGroupLabel
              as="p"
              :class="[
                checked ? '' : 'text-gray-900',
                'text-sm text-black ml-3 ltr:ml-2 rtl:mr-2',
              ]"
              >{{ item.name }}</RadioGroupLabel
            >
          </div>
        </RadioGroupOption>
      </div>
    </RadioGroup>

    <div class="relative rounded-md border px-3 py-3 mt-6 mb-3">
      <label
        for="note"
        class="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-sm font-medium text-gray-900"
        >{{ $t("checkout.note") }}</label
      >
      <textarea
        v-model="cartCustomer.note"
        rows="4"
        name="note"
        id="note"
        class="w-full border-0 p-0 text-gray-900 placeholder-gray-500 bg-transparent sm:text-sm focus:ring-0"
      />
    </div>
    <div class="mb-2">
      <input
        id="default-type"
        type="checkbox"
        class="w-5 h-5 transition duration-500 ease-in-out border rounded-md cursor-pointer form-checkbox focus:ring-offset-0 hover:border-heading focus:outline-none focus:ring-0 focus-visible:outline-none focus:checked:bg-brand hover:checked:bg-brand checked:bg-brand"
        name="default"
      /><label
        for="default-type"
        class="ml-3 align-center text-sm font-medium text-gray-900"
        >Leave at my door if I am not around</label
      >
      <p
        class="text-brand-muted text-sm leading-7 lg:leading-[1.85em] ltr:ml-8 rtl:mr-8 pt-2.5"
      >
        By selecting this option you accept full responsibility for your order
        after it has been delivered unattended, including any loss due to theft
        or damage due to temperature sensitivity.
      </p>
    </div>
  </div> -->
</template>
<script setup>
import Fuse from "fuse.js";
import { LOGISTICS_PARCEL_DELIVERY_CHARGE_CALCULATE } from "@/gql/logistics";
import { ref, computed, watch, onMounted, defineAsyncComponent } from "vue";
import { storeToRefs } from "pinia";
import { useCartStore } from "@/stores/cart";
import { useLogisticsStore } from "@/stores/logistics";
import { useMeStore } from "@/stores/me";
import { useCustomerStore } from "@/stores/customer";
import { useMutation } from "@vue/apollo-composable";
import { useSiteStore } from "@/stores/site";
import dayjs from "dayjs";
import {
  ExclamationCircleIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
} from "@heroicons/vue/24/outline";
import {
  RadioGroup,
  RadioGroupDescription,
  RadioGroupLabel,
  RadioGroupOption,
  Menu,
  MenuButton,
  MenuItems,
} from "@headlessui/vue";
const { cart, cartCustomer } = storeToRefs(useCartStore());
const { site } = storeToRefs(useSiteStore());
const { me } = storeToRefs(useMeStore());
const { customer } = storeToRefs(useCustomerStore());
const { logisticses, stoppages } = storeToRefs(useLogisticsStore());
const { getLogisticses, getStoppages } = useLogisticsStore();
const selectedLogistics = ref(null);
// stoppage
const search = ref("");
const cityId = ref(null);
const subCityId = ref(null);
const areaId = ref(null);
//  end stoppage
const weight = computed(() => {
  return cart.value.reduce((total, obj) => total + obj.weight * obj.qnt, 0);
});
const subTotal = computed(() => {
  return cart.value.reduce((total, obj) => total + obj.price * obj.qnt, 0);
});

const total = computed(() => {
  return (
    subTotal.value +
    (cartCustomer.value.logisticsIsFree
      ? 0.0
      : cartCustomer.value.logisticsCharge) +
    cartCustomer.value.logisticsExtraCharge -
    cartCustomer.value.discount
  );
});
const calculate = async () => {
  if (selectedLogistics.value) {
    const { mutate, loading, error } = useMutation(
      LOGISTICS_PARCEL_DELIVERY_CHARGE_CALCULATE,
      {
        variables: {
          companyId: selectedLogistics.value.companyId,
          merchantId: selectedLogistics.value.id,
          startLatitude: 0.0,
          startLongitude: 0.0,
          endLatitude: 0.0,
          endLongitude: 0.0,
          weight: weight.value,
          purchase: total.value,
          endStoppageId: areaId.value,
        },
      },
    );
    try {
      const response = await mutate();
      if (response.data.logisticsParcelDeliveryChargeCalculate) {
        cartCustomer.value.logisticsIsFree
          ? 0.0
          : (cartCustomer.value.logisticsCharge =
              response.data.logisticsParcelDeliveryChargeCalculate);
      }
    } catch (error) {}
  }
};
const deliveryTime = ref(dayjs().add(1, "day"));
const days = ref([
  dayjs(),
  dayjs().add(1, "day"),
  dayjs().add(2, "day"),
  dayjs().add(3, "day"),
  dayjs().add(4, "day"),
  dayjs().add(5, "day"),
]);
const time = ref("3 PM to 5 PM");
const times = [
  {
    name: "9 AM to 10 AM",
    time: dayjs(),
  },
  {
    name: "3 PM to 5 PM",
    time: dayjs(),
  },
  {
    name: "6 PM to 8 PM",
    time: dayjs(),
  },
];
watch(selectedLogistics, () => {
  if (
    [1, 2, 5, 6].includes(
      cart.value.length > 0 ? cart.value[0].productType : true,
    )
  ) {
    cartCustomer.value.logisticsId = selectedLogistics.value.companyId;
    cartCustomer.value.logisticsText = selectedLogistics.value.title;
    cartCustomer.value.logisticsIsFree
      ? 0.0
      : (cartCustomer.value.logisticsCharge = selectedLogistics.value.charge);
    calculate();
    if ([5, 7].includes(selectedLogistics.value.base)) {
      getStoppages(selectedLogistics.value.companyId);
    }
  }
});
watch(deliveryTime, () => {
  cartCustomer.value.deliveryTime = deliveryTime.value;
});
const options = {
  keys: ["title"], // Specify the property to search in
  includeScore: true,
  includeMatches: true,
  threshold: 0.4, // Adjust the threshold for fuzzy matching (0 to 1)
};
let fuse = new Fuse(stoppages.value, options);
const searchResults = ref(stoppages.value);
watch(search, (newValue) => {
  if (newValue) {
    const results = fuse.search(newValue);
    searchResults.value = results.map((result) => result.item);
  } else {
    searchResults.value = stoppages.value;
  }
});
watch(areaId, (newValue) => {
  if (newValue) {
    cartCustomer.value.logisticsStoppageId = stoppages.value.find(
      (a) => a.id == areaId.value,
    ).thirdPartyAreaId
      ? stoppages.value.find((a) => a.id == areaId.value).thirdPartyAreaId
      : newValue;
    cartCustomer.value.formattedAddress = `${
      stoppages.value.find((a) => a.id == areaId.value).title
    }, ${stoppages.value.find((a) => a.id == subCityId.value).title}, ${
      stoppages.value.find((a) => a.id == cityId.value).title
    }`;
    calculate();
  } else {
    cartCustomer.value.logisticsStoppageId = null;
  }
});
// watch for changes on onMounted
watch(stoppages, (newValue) => {
  searchResults.value = newValue;
  if (cartCustomer.value.logisticsStoppageId != null) {
    let stoppage = newValue.find(
      (a) => a.id == cartCustomer.value.logisticsStoppageId,
    );
    if (stoppage != null) {
      areaId.value = stoppage.id;
      subCityId.value = stoppage.subCityId;
      cityId.value = stoppage.cityId;
    }
  }
});
watch(logisticses, (newValue) => {
  if (
    selectedLogistics.value == null &&
    newValue.length > 0 &&
    [1, 2, 5, 6].includes(
      cart.value.length > 0 ? cart.value[0].productType : true,
    )
  ) {
    selectedLogistics.value = newValue[0];
    cartCustomer.value.logisticsId = selectedLogistics.value.companyId;
    cartCustomer.value.logisticsText = selectedLogistics.value.title;
    cartCustomer.value.logisticsIsFree
      ? 0.0
      : (cartCustomer.value.logisticsCharge = selectedLogistics.value.charge);
    calculate();
  }
  if (logisticses.value.length > 0) {
    if ([5, 7].includes(logisticses.value[0].base)) {
      getStoppages(logisticses.value[0].companyId);
    }
  }
});
// on mounted featch data
onMounted(async () => {
  if (logisticses.value.length == 0) {
    getLogisticses(site.value.createdById);
  }
  if (stoppages.value.length == 0 || logisticses.value.length > 1) {
    if ([5, 7].includes(logisticses.value[0]?.base)) {
      getStoppages(logisticses.value[0]?.companyId);
    }
  }
  if (
    selectedLogistics.value == null &&
    logisticses.value.length > 0 &&
    [1, 2, 5, 6].includes(
      cart.value.length > 0 ? cart.value[0].productType : true,
    )
  ) {
    selectedLogistics.value = logisticses.value[0];
    cartCustomer.value.logisticsId = selectedLogistics.value.companyId;
    cartCustomer.value.logisticsText = selectedLogistics.value.title;
    cartCustomer.value.logisticsIsFree
      ? 0.0
      : (cartCustomer.value.logisticsCharge = selectedLogistics.value.charge);
    calculate();
  }
  if (cartCustomer.value.logisticsStoppageId != null) {
    let stoppage = stoppages.value.find(
      (a) => a.id == cartCustomer.value.logisticsStoppageId,
    );
    if (stoppage != null) {
      areaId.value = stoppage.id;
      subCityId.value = stoppage.subCityId;
      cityId.value = stoppage.cityId;
    }
  }
});
</script>
