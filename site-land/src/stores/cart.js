import { defineStore } from "pinia";
import SecureLS from "secure-ls";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useNotificationsStore } from "./notifications";
const ls = new SecureLS({
  encryptionNamespace: "about-app",
});
export const useCartStore = defineStore(
  "cart_" + import.meta.env.VITE_VERSION,
  {
    state: () => ({
      cart: [],
      cartCustomer: {
        address: "",
        currency: "BDT",
        customLogisticsExtraCharge: "",
        deliveryTime: null,
        discount: 0,
        discountName: "",
        discountTitle: "",
        formattedAddress: "",
        gatewayText: "",
        id: null,
        latitude: 0.0,
        logisticsCharge: 0.0,
        logisticsExtraCharge: 0.0,
        logisticsId: 1,
        logisticsStoppageId: null,
        logisticsText: "",
        logisticsIsFree: false,
        longitude: 0.0,
        name: "",
        note: "",
        logisticsId: 1,
        phone: null,
        productPrice: 0.0,
        productTitle: "",
        productImage: null,
        referCode: "6",
        resellerAdvanceCollect: 0.0,
        userId: null,
      },
      selectedGateway: null,
    }),
    getters: {},
    actions: {
      addToCart(item) {
        // clear copun
        this.cartCustomer.discount = 0;
        this.cartCustomer.discountName = "";
        // exit
        item.index = item.index ? item.index : 0;
        let found = this.cart.find(
          (el) => el.id == item.id && el.index == item.index
        );
        if (found) {
          if (
            item.maxOrder > found.qnt &&
            (item.quantity > found.qnt || item.isContinueSelling)
          ) {
            if (found.minOrder > found.qnt) {
              found.qnt = found.minOrder;
            } else {
              found.qnt++;
            }
          }
        } else {
          item.qnt = item.minOrder ? item.minOrder : 1;
          if (item.variants.length > 0 && item.variant.length == 0) {
            const groupedArray = item.variants
              .sort((a, b) => (a.price > b.price ? 1 : -1))
              .reduce((groups, el) => {
                const variantType = el.variant.map((a) => a.key).join(" - ");
                if (!groups[variantType]) {
                  groups[variantType] = [];
                }
                groups[variantType].push(el);
                return groups;
              }, {});
            const variant = Object.values(groupedArray).map(
              (variantType) => variantType[0]
            );
            item.variant = variant;
            for (let i of item.variant) {
              item.price += i.price;
            }
          }
          // Check if the array contains an item with productType = 7
          const hasPackage = this.cart.some((item) => item.productType === 7);
          if (!hasPackage) {
            this.cart.push(item);
          } else {
            const notificationsStore = useNotificationsStore();
            notificationsStore.addNotification(
              { title: "Cart info", subTitle: "Remove package first." },
              "error"
            );
          }
        }
      },
      setToCart(item) {
        let found = this.cart.find(
          (el) => el.id == item.id && el.index == item.index
        );
        if (found) {
          found = item;
        }
      },
      removeFromCart(item) {
        // clear copun
        this.cartCustomer.discount = 0;
        this.cartCustomer.discountName = "";
        // exit
        let found = this.cart.find(
          (el) => el.id == item.id && el.index == item.index
        );
        if (found) {
          if (found.qnt > item.minOrder && found.qnt > 0) {
            found.qnt--;
          } else {
            let index = this.cart.indexOf(found);
            if (index > -1) {
              this.cart.splice(index, 1);
            }
          }
        } else {
          this.cart.push(item);
        }
      },
      removeCart(item) {
        // clear copun
        this.cartCustomer.discount = 0;
        this.cartCustomer.discountName = "";
        // exit
        let found = this.cart.find(
          (el) => el.id == item.id && el.index == item.index
        );
        if (found) {
          let index = this.cart.indexOf(found);
          if (index > -1) {
            this.cart.splice(index, 1);
          }
        }
      },
      resetCart() {
        this.cart = [];
      },
      setCartCustomer(customer) {
        this.cartCustomer.address =
          this.cartCustomer.address.length > 0
            ? this.cartCustomer.address
            : customer.address;
        this.cartCustomer.formattedAddress =
          this.cartCustomer.formattedAddress.length > 0
            ? this.cartCustomer.formattedAddress
            : customer.formattedAddress;
        this.cartCustomer.id = customer.id;
        this.cartCustomer.latitude = customer.latitude;
        this.cartCustomer.longitude = customer.longitude;
        this.cartCustomer.name =
          this.cartCustomer.name.length > 0
            ? this.cartCustomer.name
            : customer.title;
        this.cartCustomer.phone = this.cartCustomer.phone
          ? this.cartCustomer.phone
          : customer.phone;
        this.cartCustomer.referCode = customer.referCode;
        this.cartCustomer.userId = customer.userId;
      },
      setGateway(gateway) {
        this.selectedGateway = gateway;
      },
    },
    persist: {
      storage: {
        getItem: (key) => ls.get(key),
        setItem: (key, value) => ls.set(key, value),
        removeItem: (key) => ls.remove(key),
      },
    },
  }
);
