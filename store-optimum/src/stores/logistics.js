import { defineStore } from "pinia";
import SecureLS from "secure-ls";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useNotificationsStore } from "./notifications";
import { LOGISTICS_MERCHANTS, LOGISTICS_STOPPAGES } from "@/gql/logistics";
const ls = new SecureLS({
  encryptionNamespace: "store-optimum",
});
export const useLogisticsStore = defineStore(
  "logistics_" + import.meta.env.VITE_VERSION,
  {
    state: () => ({
      logisticses: [],
      stoppages: [],
    }),
    getters: {},
    actions: {
      async getLogisticses(userId) {
        const { onResult, loading, error } = useQuery(LOGISTICS_MERCHANTS, {
          userId: userId,
          isActive: true,
          first: 2048,
        });
        onResult((queryResult) => {
          var items = [];
          queryResult.data.logisticsMerchants.edges.forEach(function (item) {
            var i = {
              base: item.node.chargeBase,
              charge: item.node.chargeMerchantDefined,
              id: item.node.id,
              address: item.node.logisticsAddress,
              title: item.node.title,
              note: item.node.note,
              companyId: item.node.company.id,
            };
            if (!items.find((el) => el.id === i.id)) {
              items.push(i);
            }
          });
          this.logisticses = items;
        });
      },
      async getStoppages(companyId) {
        const { onResult, loading, error } = useQuery(LOGISTICS_STOPPAGES, {
          companyId: companyId,
          isActive: true,
          first: 8192,
        });
        onResult((queryResult) => {
          var items = [];
          queryResult.data.logisticsStoppages.edges.forEach(function (item) {
            var i = {
              address: item.node.address,
              areaId: item.node.areaId,
              charge: item.node.charge,
              cityId: item.node.cityId,
              countryId: item.node.countryId,
              id: item.node.id,
              isActive: item.node.isActive,
              latitude: item.node.latitude,
              longitude: item.node.longitude,
              postCode: item.node.postCode,
              stoppageType: item.node.stoppageType,
              subCityId: item.node.subCityId,
              thirdPartyAreaId: item.node.thirdPartyAreaId,
              title: item.node.title,
            };
            if (!items.find((el) => el.id === i.id)) {
              items.push(i);
            }
          });
          this.stoppages = items;
        });
      },
    },
    persist: {
      storage: {
        getItem: (key) => ls.get(key),
        setItem: (key, value) => ls.set(key, value),
        removeItem: (key) => ls.remove(key),
      },
    },
  },
);
