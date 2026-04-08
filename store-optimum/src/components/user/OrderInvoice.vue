<template>
  <main v-if="order">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1
          v-if="
            router.currentRoute.value.query &&
            router.currentRoute.value.query.status == 'success'
          "
          class="text-bold px-3 py-2 mb-4 bg-green-300 rounded-md text-gray-800"
        >
          Successfully payment received
        </h1>
        <h1 class="text-xl font-semibold text-gray-900 flex items-center">
          Invoice - ID: {{ order.orderId }}
        </h1>
        <p class="mt-2 text-sm text-gray-700">
          Last Update: <b>{{ order.customerNote }}</b>
        </p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <!-- <button
          @click="update()"
          type="button"
          class="inline-flex items-center justify-center rounded-l-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-offset-2 sm:w-auto"
        >
          Save
        </button>
        <button
          v-if="selectedTab == 'Invoice'"
          v-print="{
            id: 'Invoice',
            popTitle: 'Invoice',
            extraCss:
              'https://cdn.jsdelivr.net/npm/tailwindcss/dist/tailwind.min.css',
          }"
          type="button"
          class="inline-flex items-center justify-center rounded-r-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-offset-2 sm:w-auto"
        >
          Print
        </button> -->
      </div>
    </div>
    <div
      class="mx-auto mt-4 mb-4 grid max-w-2xl grid-cols-1 gap-6 sm:px-0 lg:max-w-6xl lg:grid-flow-col-dense lg:grid-cols-2"
    >
      <div class="space-y-6 lg:col-span-2 lg:col-start-1">
        <!-- Tabs -->
        <div class="lg:block">
          <div class="border-b border-gray-200">
            <nav class="overflow-x-auto -mb-px flex space-x-8">
              <div
                @click="toggleTab(tab.name)"
                v-for="tab in tabs"
                :key="tab.name"
                :class="[
                  selectedTab == tab.name
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-700',
                  'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm cursor-pointer active:cursor-wait',
                ]"
              >
                {{ tab.name }}
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
    <div
      v-show="selectedTab === 'Status'"
      id="Invoice"
      class="mx-auto mt-8 grid max-w-2xl grid-cols-1 gap-6 lg:max-w-6xl lg:grid-flow-col-dense lg:grid-cols-3"
    >
      <div class="space-y-0 lg:col-span-2 lg:col-start-1">
        <div class="flex justify-between items-center text-gray-600 py-2">
          Tracking ID: <span class="font-bold">{{ order.trackingId }}</span>
        </div>
        <a
          :href="order.logisticsUrl"
          target="_blank"
          class="flex justify-between items-center text-blue-400 text-xs"
          >Tracking URL: <span>{{ order.logisticsUrl }}</span></a
        >
        <nav aria-label="Progress" class="pt-4">
          <ol role="list" class="overflow-hidden">
            <li
              v-for="(event, stepIdx) in order.events"
              :key="event.id"
              :class="[
                stepIdx !== order.events.length - 1 ? 'pb-5' : '',
                'grid grid-cols-6 relative',
              ]"
            >
              <div class="w-20 text-sm text-gray-600">
                {{ dayjs(event.createdAt).format("h:mm A MMM D") }}
              </div>
              <div class="relative col-span-5">
                <div
                  class="absolute top-4 left-4 -ml-px mt-0.5 h-full w-0.5"
                  :class="
                    [7, 8, 9].includes(order.status)
                      ? 'bg-red-600'
                      : 'bg-green-600'
                  "
                  aria-hidden="true"
                />
                <button class="group relative flex items-start">
                  <span class="flex h-9 items-center">
                    <span
                      class="relative z-30 flex h-8 w-8 items-center justify-center rounded-full"
                      :class="
                        [7, 8, 9].includes(order.status)
                          ? 'bg-red-600 group-hover:bg-red-800'
                          : 'bg-green-600 group-hover:bg-green-800'
                      "
                    >
                      <CheckIcon
                        class="h-5 w-5 text-white"
                        aria-hidden="true"
                      />
                    </span>
                  </span>
                  <span class="ml-4 flex min-w-0 flex-col text-left">
                    <span class="text-sm font-medium">{{
                      getStatus(event.eventType)
                    }}</span>
                    <span class="text-sm text-gray-500">{{ event.note }}</span>
                  </span>
                </button>
              </div>
            </li>
          </ol>
        </nav>
        <div
          v-if="me && me.id == order.userId"
          class="pt-8 flex items-start space-x-4"
        >
          <div class="flex-shrink-0">
            <img
              class="inline-block h-10 w-10 rounded-full"
              v-lazy="me ? me.avatar : site.favicon"
              alt=""
            />
          </div>
          <div class="min-w-0 flex-1">
            <div class="relative">
              <div
                class="overflow-hidden rounded-lg border border-gray-300 shadow-sm focus-within: focus-within:ring-1 focus-within:ring-[--primary]"
              >
                <label for="comment" class="sr-only">Add your comment</label
                ><textarea
                  v-model="note"
                  rows="3"
                  name="comment"
                  id="comment"
                  class="block w-full resize-none border-0 py-3 focus:ring-0 sm:text-sm"
                  placeholder="Add your comment..."
                ></textarea>
                <div class="py-2" aria-hidden="true">
                  <div class="py-px">
                    <div class="h-9"></div>
                  </div>
                </div>
              </div>
              <div
                class="absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2"
              >
                <div class="flex-shrink-0">
                  <button
                    @click="createEvent(11)"
                    type="submit"
                    class="bg-[--primary] text-white py-3 px-6 text-sm font-medium rounded-md shadow-sm"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Page header -->
    <div
      v-show="selectedTab === 'Invoice'"
      id="Invoice"
      class="mx-auto mt-8 grid max-w-2xl grid-cols-1 gap-6 lg:max-w-6xl lg:grid-flow-col-dense lg:grid-cols-3"
    >
      <div ref="invoiceContent" class="space-y-0 lg:col-span-3 lg:col-start-1">
        <!-- Invoice -->
        <div class="max-w-[85rem] mx-auto">
          <!-- Grid -->
          <div
            class="mb-5 pb-5 flex justify-between items-center border-b border-gray-700"
          >
            <div>
              <h2 class="text-xl font-semibold text-gray-800">Invoice</h2>
              <dd class="font-medium text-gray-800">
                <span class="block font-semibold">{{ site.title }}</span>
                <address class="not-italic font-normal">
                  {{ site.domain }}
                </address>
                <address class="not-italic font-normal">
                  {{ site.address }}
                </address>
              </dd>
            </div>
            <!-- Col -->
          </div>
          <!-- End Grid -->

          <!-- Grid -->
          <div class="grid grid-cols-2 md:grid-cols-2 gap-3">
            <div>
              <div class="grid space-y-3">
                <dl class="grid sm:flex gap-x-3 text-sm">
                  <dt class="min-w-[150px] max-w-[200px] text-gray-500">
                    Billed to:
                  </dt>
                  <dd class="text-gray-800">
                    <div
                      class="inline-flex items-center gap-x-1.5 text-blue-600 decoration-2 hover:underline font-medium"
                    >
                      {{ order.customerPhone }}
                    </div>
                  </dd>
                </dl>

                <dl class="grid sm:flex gap-x-3 text-sm">
                  <dt class="min-w-[150px] max-w-[200px] text-gray-500">
                    Billing details:
                  </dt>
                  <dd class="font-medium text-gray-800">
                    <span class="block font-semibold">{{
                      order.customerName
                    }}</span>
                    <address class="not-italic font-normal">
                      {{ order.customerAddress }}
                    </address>
                  </dd>
                </dl>

                <dl
                  v-if="![17].includes(site.industry)"
                  class="grid sm:flex gap-x-3 text-sm"
                >
                  <dt class="min-w-[150px] max-w-[200px] text-gray-500">
                    Shipping details:
                  </dt>
                  <dd class="font-medium text-gray-800">
                    <span class="block font-semibold">{{
                      order.customerName
                    }}</span>
                    <address class="not-italic font-normal">
                      {{ order.customerAddress }}
                    </address>
                  </dd>
                </dl>
                <dl class="grid sm:flex gap-x-3 text-sm">
                  <dt class="min-w-[150px] max-w-[200px] text-gray-500">
                    Note:
                  </dt>
                  <dd class="text-gray-800">
                    <div
                      class="inline-flex items-center gap-x-1.5 text-blue-600 decoration-2 hover:underline font-medium"
                    >
                      {{ order.customerNote ? order.customerNote : "---" }}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
            <!-- Col -->

            <div>
              <div class="grid space-y-3">
                <dl class="grid sm:flex gap-x-3 text-sm">
                  <dt class="min-w-[150px] max-w-[200px] text-gray-500">
                    Invoice number:
                  </dt>
                  <dd class="font-medium text-gray-800">
                    {{ order.orderId }}
                  </dd>
                </dl>

                <dl class="grid sm:flex gap-x-3 text-sm">
                  <dt class="min-w-[150px] max-w-[200px] text-gray-500">
                    Status:
                  </dt>
                  <dd class="font-medium text-gray-800">
                    {{ getStatus(order.status) }}
                  </dd>
                </dl>

                <dl class="grid sm:flex gap-x-3 text-sm">
                  <dt class="min-w-[150px] max-w-[200px] text-gray-500">
                    Due date:
                  </dt>
                  <dd class="font-medium text-gray-800">
                    {{ dayjs(order.updatedAt).format("h:mm A D MMM YY") }}
                  </dd>
                </dl>

                <dl class="grid sm:flex gap-x-3 text-sm">
                  <dt class="min-w-[150px] max-w-[200px] text-gray-500">
                    Billing method:
                  </dt>
                  <dd class="font-medium text-gray-800">
                    {{ order.gatewayText }}
                  </dd>
                </dl>
              </div>
            </div>
            <!-- Col -->
          </div>
          <!-- End Grid -->

          <!-- Table -->
          <div class="mt-6 border border-gray-200 p-4 rounded-lg space-y-4">
            <div class="hidden sm:grid sm:grid-cols-5">
              <div
                class="sm:col-span-2 text-xs font-medium text-gray-500 uppercase"
              >
                Item
              </div>
              <div
                class="text-left text-xs font-medium text-gray-500 uppercase"
              >
                Image
              </div>
              <div
                class="text-left text-xs font-medium text-gray-500 uppercase"
              >
                Rate
              </div>
              <div
                class="text-right text-xs font-medium text-gray-500 uppercase"
              >
                Amount
              </div>
            </div>

            <div class="hidden sm:block border-b border-gray-700"></div>

            <div
              v-for="product in order.lines.filter((v) => v.isActive)"
              :key="product.id"
              class="grid grid-cols-3 sm:grid-cols-5 gap-2"
            >
              <div class="col-span-full sm:col-span-2">
                <h5
                  class="sm:hidden text-xs font-medium text-gray-500 uppercase"
                >
                  Item
                </h5>
                <p class="font-medium text-gray-800">
                  {{ product.productName }}
                </p>
                <p class="font-normal text-gray-500 text-xs">
                  {{ product.variant
                  }}{{ product.variant ? " - " + product.productSku : "" }}
                </p>
              </div>
              <div>
                <h5
                  class="sm:hidden text-xs font-medium text-gray-500 uppercase"
                >
                  Image
                </h5>
                <div class="h-10 w-10 flex-shrink-0">
                  <img
                    @click="images.push({ id: 1, image: product.image })"
                    @mouseover="images.push({ id: 1, image: product.image })"
                    class="h-10 w-10 rounded-md"
                    v-lazy="product.image"
                    :alt="product.productName"
                  />
                </div>
              </div>
              <div>
                <h5
                  class="sm:hidden text-xs font-medium text-gray-500 uppercase"
                >
                  Rate
                </h5>
                <p class="text-gray-800">
                  {{ formatMoney(product.price, site.currency) }} X
                  {{ product.quantity }}
                </p>
              </div>
              <div>
                <h5
                  class="sm:hidden text-right text-xs font-medium text-gray-500 uppercase"
                >
                  Amount
                </h5>
                <p class="text-right text-gray-800">
                  {{
                    formatMoney(product.price * product.quantity, site.currency)
                  }}
                </p>
              </div>
            </div>
          </div>
          <!-- End Table -->

          <!-- Flex -->
          <div class="mt-8 flex sm:justify-end">
            <div class="w-full max-w-xl sm:text-right space-y-2">
              <!-- Grid -->
              <div class="grid grid-cols-2 sm:grid-cols-1 gap-3 sm:gap-2">
                <dl
                  v-if="subTotal > 0"
                  class="grid sm:grid-cols-5 gap-x-3 text-sm"
                >
                  <dt class="col-span-3 text-gray-500">Subtotal:</dt>
                  <dd class="col-span-2 font-medium text-gray-800">
                    {{ formatMoney(subTotal, site.currency) }}
                  </dd>
                </dl>
                <dl
                  v-if="order.logisticsCharge > 0"
                  class="grid sm:grid-cols-5 gap-x-3 text-sm"
                >
                  <dt class="col-span-3 text-gray-500">Delivery charge:</dt>
                  <dd class="col-span-2 font-medium text-gray-800">
                    {{ formatMoney(order.logisticsCharge, site.currency) }}
                  </dd>
                </dl>
                <dl
                  v-if="order.logisticsExtraCharge > 0"
                  class="grid sm:grid-cols-5 gap-x-3 text-sm"
                >
                  <dt class="col-span-3 text-gray-500">Extra Delivery:</dt>
                  <dd class="col-span-2 font-medium text-gray-800">
                    {{ formatMoney(order.logisticsExtraCharge, site.currency) }}
                  </dd>
                </dl>
                <dl
                  v-if="order.discount > 0"
                  class="grid sm:grid-cols-5 gap-x-3 text-sm"
                >
                  <dt class="col-span-3 text-gray-500">Discounts:</dt>
                  <dd class="col-span-2 font-medium text-gray-800">
                    {{ formatMoney(order.discount, site.currency) }}
                  </dd>
                </dl>
                <dl
                  v-if="order.vat > 0"
                  class="grid sm:grid-cols-5 gap-x-3 text-sm"
                >
                  <dt class="col-span-3 text-gray-500">Tax:</dt>
                  <dd class="col-span-2 font-medium text-gray-800">
                    {{ formatMoney(order.vat, site.currency) }}
                  </dd>
                </dl>
                <dl
                  v-if="order.total > 0"
                  class="grid sm:grid-cols-5 gap-x-3 text-sm"
                >
                  <dt class="col-span-3 text-gray-500">Total:</dt>
                  <dd class="col-span-2 font-medium text-gray-800">
                    {{ formatMoney(order.total, site.currency) }}
                  </dd>
                </dl>
                <dl
                  v-if="order.paid > 0"
                  class="grid sm:grid-cols-5 gap-x-3 text-sm"
                >
                  <dt class="col-span-3 text-gray-500">Amount paid:</dt>
                  <dd class="col-span-2 font-medium text-gray-800">
                    {{ formatMoney(order.paid, site.currency) }}
                  </dd>
                </dl>
                <dl class="grid sm:grid-cols-5 gap-x-3 text-sm">
                  <dt class="col-span-3 text-gray-500">Due balance:</dt>
                  <dd class="col-span-2 font-medium text-gray-800">
                    {{ formatMoney(order.total - order.paid, site.currency) }}
                  </dd>
                </dl>
              </div>
              <!-- End Grid -->
            </div>
          </div>
          <!-- End Flex -->
        </div>
        <br />
        <!-- End Invoice -->
      </div>
    </div>
    <div
      v-show="selectedTab === 'Resell'"
      id="Invoice"
      class="mx-auto mt-8 grid max-w-2xl grid-cols-1 gap-6 lg:max-w-6xl lg:grid-flow-col-dense lg:grid-cols-3"
    >
      <div ref="invoiceContent" class="space-y-0 lg:col-span-3 lg:col-start-1">
        <!-- Invoice -->
        <div class="max-w-[85rem] mx-auto">
          <!-- Grid -->
          <div
            class="mb-5 pb-5 flex justify-between items-center border-b border-gray-700"
          >
            <div>
              <h2 class="text-xl font-semibold text-gray-800">Invoice</h2>
              <dd class="font-medium text-gray-800">
                <span class="block font-semibold">{{
                  order.customer.title
                }}</span>
                <address class="not-italic font-normal">
                  {{ order.customer.domain }}
                </address>
                <address class="not-italic font-normal">
                  {{ order.customer.phone }}
                </address>
                <address class="not-italic font-normal">
                  {{ order.customer.address }}
                </address>
              </dd>
            </div>
            <!-- Col -->
            <!-- Col -->
          </div>
          <!-- End Grid -->

          <!-- Grid -->
          <div class="grid grid-cols-2 md:grid-cols-2 gap-3">
            <div>
              <div class="grid space-y-3">
                <dl class="grid sm:flex gap-x-3 text-sm">
                  <dt class="min-w-[150px] max-w-[200px] text-gray-500">
                    Billed to:
                  </dt>
                  <dd class="text-gray-800">
                    <div
                      class="inline-flex items-center gap-x-1.5 text-blue-600 decoration-2 hover:underline font-medium"
                    >
                      {{ order.customerPhone }}
                    </div>
                  </dd>
                </dl>

                <dl class="grid sm:flex gap-x-3 text-sm">
                  <dt class="min-w-[150px] max-w-[200px] text-gray-500">
                    Billing details:
                  </dt>
                  <dd class="font-medium text-gray-800">
                    <span class="block font-semibold">{{
                      order.customerName
                    }}</span>
                    <address class="not-italic font-normal">
                      {{ order.customerAddress }}
                    </address>
                  </dd>
                </dl>

                <dl
                  v-if="![17].includes(site.industry)"
                  class="grid sm:flex gap-x-3 text-sm"
                >
                  <dt class="min-w-[150px] max-w-[200px] text-gray-500">
                    Shipping details:
                  </dt>
                  <dd class="font-medium text-gray-800">
                    <span class="block font-semibold">{{
                      order.customerName
                    }}</span>
                    <address class="not-italic font-normal">
                      {{ order.customerAddress }}
                    </address>
                  </dd>
                </dl>
                <dl class="grid sm:flex gap-x-3 text-sm">
                  <dt class="min-w-[150px] max-w-[200px] text-gray-500">
                    Note:
                  </dt>
                  <dd class="text-gray-800">
                    <div
                      class="inline-flex items-center gap-x-1.5 text-blue-600 decoration-2 hover:underline font-medium"
                    >
                      {{ order.customerNote ? order.customerNote : "---" }}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
            <!-- Col -->

            <div>
              <div class="grid space-y-3">
                <dl class="grid sm:flex gap-x-3 text-sm">
                  <dt class="min-w-[150px] max-w-[200px] text-gray-500">
                    Invoice number:
                  </dt>
                  <dd class="font-medium text-gray-800">
                    {{ order.orderId }}
                  </dd>
                </dl>

                <dl class="grid sm:flex gap-x-3 text-sm">
                  <dt class="min-w-[150px] max-w-[200px] text-gray-500">
                    Status:
                  </dt>
                  <dd class="font-medium text-gray-800">
                    {{ getStatus(order.status) }}
                  </dd>
                </dl>

                <dl class="grid sm:flex gap-x-3 text-sm">
                  <dt class="min-w-[150px] max-w-[200px] text-gray-500">
                    Due date:
                  </dt>
                  <dd class="font-medium text-gray-800">
                    {{ dayjs(order.updatedAt).format("h:mm A D MMM YY") }}
                  </dd>
                </dl>

                <dl class="grid sm:flex gap-x-3 text-sm">
                  <dt class="min-w-[150px] max-w-[200px] text-gray-500">
                    Billing method:
                  </dt>
                  <dd class="font-medium text-gray-800">
                    {{ order.gatewayText }}
                  </dd>
                </dl>
              </div>
            </div>
            <!-- Col -->
          </div>
          <!-- End Grid -->

          <!-- Table -->
          <div class="mt-6 border border-gray-200 p-4 rounded-lg space-y-4">
            <div class="hidden sm:grid sm:grid-cols-5">
              <div
                class="sm:col-span-2 text-xs font-medium text-gray-500 uppercase"
              >
                Item
              </div>
              <div
                class="text-left text-xs font-medium text-gray-500 uppercase"
              >
                Image
              </div>
              <div
                class="text-left text-xs font-medium text-gray-500 uppercase"
              >
                Rate
              </div>
              <div
                class="text-right text-xs font-medium text-gray-500 uppercase"
              >
                Amount
              </div>
            </div>

            <div class="hidden sm:block border-b border-gray-700"></div>

            <div
              v-for="product in order.lines.filter((v) => v.isActive)"
              :key="product.id"
              class="grid grid-cols-3 sm:grid-cols-5 gap-2"
            >
              <div class="col-span-full sm:col-span-2">
                <h5
                  class="sm:hidden text-xs font-medium text-gray-500 uppercase"
                >
                  Item
                </h5>
                <p class="font-medium text-gray-800">
                  {{ product.productName }}
                </p>
                <p class="font-normal text-gray-500 text-xs">
                  {{ product.variant
                  }}{{ product.variant ? " - " + product.productSku : "" }}
                </p>
              </div>
              <div>
                <h5
                  class="sm:hidden text-xs font-medium text-gray-500 uppercase"
                >
                  Image
                </h5>
                <div class="h-10 w-10 flex-shrink-0">
                  <img
                    @click="images.push({ id: 1, image: product.image })"
                    @mouseover="images.push({ id: 1, image: product.image })"
                    class="h-10 w-10 rounded-md"
                    v-lazy="product.image"
                    :alt="product.productName"
                  />
                </div>
              </div>
              <div>
                <h5
                  class="sm:hidden text-xs font-medium text-gray-500 uppercase"
                >
                  Rate
                </h5>
                <p class="text-gray-800">
                  {{ formatMoney(product.resellPrice, site.currency) }} X
                  {{ product.quantity }}
                </p>
              </div>
              <div>
                <h5
                  class="sm:hidden text-right text-xs font-medium text-gray-500 uppercase"
                >
                  Amount
                </h5>
                <p class="text-right text-gray-800">
                  {{
                    formatMoney(
                      product.resellPrice * product.quantity,
                      site.currency
                    )
                  }}
                </p>
              </div>
            </div>
          </div>
          <!-- End Table -->

          <!-- Flex -->
          <div class="mt-8 flex sm:justify-end">
            <div class="w-full max-w-xl sm:text-right space-y-2">
              <!-- Grid -->
              <div class="grid grid-cols-2 sm:grid-cols-1 gap-3 sm:gap-2">
                <dl
                  v-if="subTotal > 0"
                  class="grid sm:grid-cols-5 gap-x-3 text-sm"
                >
                  <dt class="col-span-3 text-gray-500">Subtotal:</dt>
                  <dd class="col-span-2 font-medium text-gray-800">
                    {{ formatMoney(subTotal, site.currency) }}
                  </dd>
                </dl>
                <dl
                  v-if="order.logisticsCharge > 0"
                  class="grid sm:grid-cols-5 gap-x-3 text-sm"
                >
                  <dt class="col-span-3 text-gray-500">Delivery charge:</dt>
                  <dd class="col-span-2 font-medium text-gray-800">
                    {{ formatMoney(order.logisticsCharge, site.currency) }}
                  </dd>
                </dl>
                <dl
                  v-if="order.logisticsExtraCharge > 0"
                  class="grid sm:grid-cols-5 gap-x-3 text-sm"
                >
                  <dt class="col-span-3 text-gray-500">Extra Delivery:</dt>
                  <dd class="col-span-2 font-medium text-gray-800">
                    {{ formatMoney(order.logisticsExtraCharge, site.currency) }}
                  </dd>
                </dl>
                <dl
                  v-if="order.discount > 0"
                  class="grid sm:grid-cols-5 gap-x-3 text-sm"
                >
                  <dt class="col-span-3 text-gray-500">Discounts:</dt>
                  <dd class="col-span-2 font-medium text-gray-800">
                    {{ formatMoney(order.discount, site.currency) }}
                  </dd>
                </dl>
                <dl
                  v-if="order.vat > 0"
                  class="grid sm:grid-cols-5 gap-x-3 text-sm"
                >
                  <dt class="col-span-3 text-gray-500">Tax:</dt>
                  <dd class="col-span-2 font-medium text-gray-800">
                    {{ formatMoney(order.vat, site.currency) }}
                  </dd>
                </dl>
                <dl
                  v-if="order.resellAmount > 0"
                  class="grid sm:grid-cols-5 gap-x-3 text-sm"
                >
                  <dt class="col-span-3 text-gray-500">Total:</dt>
                  <dd class="col-span-2 font-medium text-gray-800">
                    {{ formatMoney(order.resellAmount, site.currency) }}
                  </dd>
                </dl>
                <dl
                  v-if="order.paid > 0"
                  class="grid sm:grid-cols-5 gap-x-3 text-sm"
                >
                  <dt class="col-span-3 text-gray-500">Amount paid:</dt>
                  <dd class="col-span-2 font-medium text-gray-800">
                    {{ formatMoney(order.paid, site.currency) }}
                  </dd>
                </dl>
                <dl class="grid sm:grid-cols-5 gap-x-3 text-sm">
                  <dt class="col-span-3 text-gray-500">Due balance:</dt>
                  <dd class="col-span-2 font-medium text-gray-800">
                    {{
                      formatMoney(
                        order.resellAmount - order.paid,
                        site.currency
                      )
                    }}
                  </dd>
                </dl>
              </div>
              <!-- End Grid -->
            </div>
          </div>
          <!-- End Flex -->
        </div>
        <br />
        <!-- End Invoice -->
      </div>
    </div>
  </main>
  <ImageView
    v-if="images.length > 0"
    :images="images"
    @close="images = []"
  ></ImageView>
</template>

<script setup>
import {
  STORE_ORDER_DETAILS,
  SELF_SITE_ORDER_EVENT_CREATE_BY_CUSTOMER,
} from "@/gql/order";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { computed, ref, reactive, defineAsyncComponent } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useSiteStore } from "@/stores/site";
import { useMeStore } from "@/stores/me";
import { useCheckoutStore } from "@/stores/checkout";
import { useNotificationsStore } from "@/stores/notifications";
import { CheckIcon } from "@heroicons/vue/24/outline";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
const router = useRouter();
const { site } = storeToRefs(useSiteStore());
const { me } = storeToRefs(useMeStore());
const { orderId } = storeToRefs(useCheckoutStore());
const { addNotification } = useNotificationsStore();
const note = ref("");
const order = ref(null);
const { onResult, loading, error, refetch } = useQuery(STORE_ORDER_DETAILS, {
  siteId: site.value.id,
  id: orderId.value,
});
onResult((queryResult) => {
  order.value = queryResult.data.storeOrder;
});

const ImageView = defineAsyncComponent(() =>
  import("@/components/ImageView.vue")
);

const images = ref([]);
const getStatus = (status) => {
  let list = {
    0: "Processing",
    1: "Order placed",
    2: "Order confirmed",
    3: "Product packaging",
    4: "Ready for shipment",
    5: "On the way",
    6: "Under Review",
    7: "Rejected",
    8: "Return",
    9: "Canceled",
    10: "Delivered",
    11: "Query",
    12: "Payment",
    13: "Notification",
  };
  return list[status];
};
const selectedProduct = ref([]);

const createEvent = async (eventType) => {
  const { mutate, loading, error } = useMutation(
    SELF_SITE_ORDER_EVENT_CREATE_BY_CUSTOMER,
    {
      variables: {
        userId: me.value.id,
        siteId: site.value.id,
        orderId: orderId.value,
        eventType: eventType,
        note: note.value + " - " + me.value.name,
      },
    }
  );
  try {
    const response = await mutate();
    if (response.data.selfStoreOrderEventCreateByCustomer) {
      addNotification(
        { title: "Brand info", subTitle: "Successfully updated new data." },
        "success"
      );
      note.value = "";
      refetch();
    }
  } catch (error) {
    addNotification({ title: "Brand info", subTitle: error.message }, "error");
  }
};
const selectedTab = ref("Status");
const tabs = [
  { name: "Status", industry: [] },
  { name: "Invoice", industry: [] },
  { name: "Resell", industry: ["resell"] },
];
const toggleTab = (name) => {
  selectedTab.value = name;
};

const subTotal = computed(() => {
  let total = 0;
  if (order.value) {
    for (let product of order.value.lines.filter((el) => el.isActive)) {
      if (selectedTab.value == "Resell") {
        var totalPrice = product.quantity * product.resellPrice;
      } else {
        var totalPrice = product.quantity * product.price;
      }
      total += totalPrice;
    }
  }
  return total;
});
</script>
