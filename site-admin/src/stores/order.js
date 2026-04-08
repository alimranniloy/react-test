import { defineStore } from "pinia";
import SecureLS from "secure-ls";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useNotificationsStore } from './notifications'
import {
  STORE_ORDERS, STORE_ORDER_PREVIEW
} from "@/gql/order";
const ls = new SecureLS({
  encryptionNamespace: 'site-admin'
});
export const useOrderStore = defineStore("order_" + import.meta.env.VITE_VERSION, {
  state: () => ({
    orderId: null,
    order: null,
    ordersStatus: [],
    liveOrders: [],
    isLive: true,
    orderIds: [],
  }),
  getters: {},
  actions: {
    async setOrderId(orderId) {
      this.orderId = orderId;
    },
    async getOrder(id) {
      const { onResult, loading, error } = useQuery(STORE_ORDER_PREVIEW, {
        id: id,
      })
      onResult(queryResult => {
        this.order = queryResult.data.storeOrder;
      });
    },
    async setOrdersStatus(status) {
      let found = this.ordersStatus.find(order => order.id === status.id);
      if (!found) {
        this.ordersStatus.push(status);
      } else {
        found.status = status.status
      }
    },
    async addLiveOrders(order) {
      let found = this.liveOrders.find(v => v.id === order.id);
      if (!found) {
        this.liveOrders.unshift(order);
      } else {
        found.status = order.status
      }
    },
    async removeLiveOrders(id) {
      let found = this.liveOrders.find((order) => order.id == id);
      if (found) {
        let index = this.liveOrders.indexOf(found);
        if (index > -1) {
          this.liveOrders.splice(index, 1);
        }
      }
    },
    async setLiveOrders(orders) {
      this.liveOrders = orders;
    },
    async setIsLive(status) {
      this.isLive = status;
    },
    async setOrderIds(ids) {
      this.orderIds = ids;
    },
  },
  persist: {
    storage: {
      getItem: key => ls.get(key),
      setItem: (key, value) => ls.set(key, value),
      removeItem: key => ls.remove(key)
    },
  },
});
