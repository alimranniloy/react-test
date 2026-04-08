import { useMutation } from "@vue/apollo-composable";
import { SELF_STORE_ORDER_CREATE_BY_GUEST } from "@/gql/order";
export const createOrder = async (siteId, customer, products) => {
  const { mutate, loading, error } = useMutation(
    SELF_STORE_ORDER_CREATE_BY_GUEST,
    {
      variables: {
        userId: 1,
        siteId: parseInt(siteId),
        address: customer.address,
        affiliateCommission: 0.0,
        cashbackBalance: 0.0,
        charge: 0.0,
        cost: 0.0,
        currency: "BDT",
        customerAddress: customer.address,
        customerId: 0,
        customerName: customer.name,
        customerNote: "",
        customerPhone: parseInt(customer.phone),
        deliveryTime: null,
        discount: 0.0,
        discountName: "",
        emiDuration: 0.0,
        emiInterest: 0.0,
        gatewayText: "",
        grossAmount: 0.0,
        image: null,
        isEmi: false,
        isRenew: false,
        latitude: 0.0,
        logisticsCharge: customer.logisticsCharge,
        logisticsExtraCharge: 0.0,
        logisticsId: 1,
        logisticsStoppageId: 1,
        logisticsText: "",
        longitude: 0.0,
        netAmount: 0.0,
        otp: Math.floor(Math.random() * (2000000000 + 1)),
        paid: 0.0,
        parentId: null,
        parentSiteId: null,
        productId: products[0].id,
        products: products,
        profit: 0.0,
        referCode: "6",
        resellAmount: 0.0,
        resellerAdvanceCollect: 0.0,
        resellerCommission: 0.0,
        rewardPoints: 0.0,
        shopId: null,
        source: "site.value.domain",
        staffId: null,
        subscription: null,
        subscriptionFee: null,
        total: 0.0,
        validTill: null,
        vat: 0.0,
        vatAmount: 0.0,
        weight: 0.0,
      },
    }
  );
  try {
    const response = await mutate();
    if (response.data.selfStoreOrderCreateByGuest) {
      return {
        status: "success",
        message: "Your order has been created!",
      };
    }
  } catch (error) {
    return {
      status: "error",
      message: error.message,
    };
  }
};
