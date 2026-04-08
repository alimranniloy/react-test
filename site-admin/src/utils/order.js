import { useMutation } from "@vue/apollo-composable";
import {
  SELF_STORE_ORDER_CREATE_BY_GUEST,
  STORE_ORDER_PAYMENT_REQUEST,
} from "@/gql/order";
import { v4 as uuidv4 } from "uuid";

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


export const createPayment = async (
  siteId,
  gatewayId,
  domain, customer,
  products,
  total
) => {
  const referenceId = uuidv4();
 
  localStorage.setItem("referenceId", referenceId);
  const { mutate, loading, error } = useMutation(STORE_ORDER_PAYMENT_REQUEST, {
    variables: {
      siteId: siteId,
      gatewayId: gatewayId,
      amount: total,
      callBack: `https://${domain}/checkout/`,
      cancelUrl: `https://${domain}/checkout/`,
      currency: "BDT",
      customerAddress: customer.address,
      customerEmail: " ",
      customerName: customer.name,
      customerPhone: customer.phone.toString(),
      emiDuration: 0,
      emiInterest: 0,
      failUrl: `https://${domain}/checkout/`,
      isCardTransaction: true,
      isCodPayment: false,
      isEmi: true,
      merchantId: 1,
      message: "init",
      optionA: "option A",
      optionB: "option B",
      optionC: "option C",
      optionD: "option D",
      optionE: "option E",
      otherUrl: `https://${domain}/checkout/`,
      payeeSource: domain,
      paymentId: referenceId,
      productInfo: "Product Name",
      referenceId: referenceId,
      shipAddress: customer.address,
      showRefundButton: true,
      successUrl: `https://${domain}/checkout/`,
      transactionSource: domain,
      transactionType: 1,
    },
  });
  try {
    const response = await mutate();
    if (response.data.storeOrderPaymentRequest) {
      return {
        status: "success",
        message: response.data.storeOrderPaymentRequest.callBack,
      };
    }
  } catch (error) {
    return {
      status: "error",
      message: error.message,
    };
  }
};
