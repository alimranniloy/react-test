<template>
  <!-- market list-->
  <div class="sm:flex sm:items-center">
    <div class="sm:flex-auto">
      <h1 class="text-xl font-semibold text-gray-900">Orders</h1>
      <p class="mt-2 text-sm text-gray-700">
        A list of all the orders in your account including their name, title,
        email and role.
      </p>
    </div>
    <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
      <button
        type="button"
        class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-offset-2 sm:w-auto disabled:opacity-25"
      >
        Add order
      </button>
    </div>
  </div>
  <div class="mt-8 flex flex-col">
    <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
        <div
          class="relative overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg"
        >
          <table class="min-w-full divide-y divide-gray-300">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                >
                  Order
                </th>
                <th
                  scope="col"
                  class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Total
                </th>
                <th
                  scope="col"
                  class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Accounts
                </th>
                <th
                  scope="col"
                  class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Total
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr>
                <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                  <div class="text-gray-900">Placed</div>
                </td>
                <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                  <div class="text-gray-900">{{ customer.ordersPlaced }}</div>
                </td>
                <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                  <div class="text-gray-900">Pending cash back</div>
                </td>
                <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                  <div class="text-gray-900">
                    {{ customer.pendingCashbackBalance }}
                  </div>
                </td>
              </tr>
              <tr>
                <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                  <div class="text-gray-900">Pending</div>
                </td>
                <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                  <div class="text-gray-900">{{ customer.ordersPending }}</div>
                </td>
                <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                  <div class="text-gray-900">Total cash back</div>
                </td>
                <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                  <div class="text-gray-900">
                    {{ customer.totalCashbackBalance }}
                  </div>
                </td>
              </tr>
              <tr>
                <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                  <div class="text-gray-900">Confirmed</div>
                </td>
                <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                  <div class="text-gray-900">
                    {{ customer.ordersConfirmed }}
                  </div>
                </td>
                <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                  <div class="text-gray-900">Pending gift card balance</div>
                </td>
                <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                  <div class="text-gray-900">
                    {{ customer.pendingGiftCardBalance }}
                  </div>
                </td>
              </tr>
              <tr>
                <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                  <div class="text-gray-900">Product packaging</div>
                </td>
                <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                  <div class="text-gray-900">
                    {{ customer.ordersPackaging }}
                  </div>
                </td>
                <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                  <div class="text-gray-900">Total gift card balance</div>
                </td>
                <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                  <div class="text-gray-900">
                    {{ customer.totalGiftCardBalance }}
                  </div>
                </td>
              </tr>
              <tr>
                <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                  <div class="text-gray-900">Ready for shipment</div>
                </td>
                <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                  <div class="text-gray-900">{{ customer.ordersShipment }}</div>
                </td>
                <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                  <div class="text-gray-900">Pending profit</div>
                </td>
                <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                  <div class="text-gray-900">{{ customer.pendingProfit }}</div>
                </td>
              </tr>
              <tr>
                <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                  <div class="text-gray-900">On the way</div>
                </td>
                <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                  <div class="text-gray-900">{{ customer.ordersOnTheWay }}</div>
                </td>
                <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                  <div class="text-gray-900">Total profit</div>
                </td>
                <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                  <div class="text-gray-900">{{ customer.totalProfit }}</div>
                </td>
              </tr>
              <tr>
                <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                  <div class="text-gray-900">Under Review</div>
                </td>
                <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                  <div class="text-gray-900">{{ customer.ordersStation }}</div>
                </td>
                <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                  <div class="text-gray-900">Pending purchase</div>
                </td>
                <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                  <div class="text-gray-900">
                    {{ customer.pendingPurchase }}
                  </div>
                </td>
              </tr>
              <tr>
                <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                  <div class="text-gray-900">Rejected</div>
                </td>
                <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                  <div class="text-gray-900">{{ customer.ordersRejected }}</div>
                </td>
                <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                  <div class="text-gray-900">Total purchase</div>
                </td>
                <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                  <div class="text-gray-900">{{ customer.totalPurchase }}</div>
                </td>
              </tr>
              <tr>
                <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                  <div class="text-gray-900">Return</div>
                </td>
                <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                  <div class="text-gray-900">{{ customer.ordersReturned }}</div>
                </td>
                <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                  <div class="text-gray-900">Pending reward points</div>
                </td>
                <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                  <div class="text-gray-900">
                    {{ customer.pendingRewardPoints }}
                  </div>
                </td>
              </tr>
              <tr>
                <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                  <div class="text-gray-900">Canceled</div>
                </td>
                <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                  <div class="text-gray-900">
                    {{ customer.ordersCancelled }}
                  </div>
                </td>
                <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                  <div class="text-gray-900">Total reward points</div>
                </td>
                <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                  <div class="text-gray-900">
                    {{ customer.totalRewardPoints }}
                  </div>
                </td>
              </tr>
              <tr>
                <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                  <div class="text-gray-900">Delivered</div>
                </td>
                <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                  <div class="text-gray-900">
                    {{ customer.ordersDelivered }}
                  </div>
                </td>
                <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                  <div class="text-gray-900">Total return charge</div>
                </td>
                <td class="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                  <div class="text-gray-900">
                    {{ customer.totalReturnCharge }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  <!-- /End market list -->
</template>

<script setup>
const props = defineProps({
  customer: {
    type: Object,
    required: true,
  },
});
</script>
