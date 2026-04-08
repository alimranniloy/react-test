import gql from "graphql-tag";
// PAY_PAYMENT_PROVIDERS
export const PAY_PAYMENT_PROVIDERS = gql`
  query ($after: String, $first: Int) {
    payPaymentProviders(isActive: true, first: $first, after: $after) {
      total
      edges {
        node {
          id
          name
          transactionFee
          credentials {
            id
            index
            label
            sensitive
            value
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        endCursor
      }
    }
  }
`;
// PAY_PAYMENT_PROVIDER_DETAILS
export const PAY_PAYMENT_PROVIDER_DETAILS = gql`
  query ($id: Int!) {
    payPaymentProvider(id: $id) {
      id
      instructions
      kind
      name
      transactionFee
      credentials {
        id
        index
        label
        sensitive
        value
      }
    }
  }
`;

// PAY_TRANSACTION_DETAILS_PUBLIC
export const PAY_TRANSACTION_DETAILS_PUBLIC = gql`
  query ($transactionId: Int!) {
    payTransactionByTransactionIdPublic(transactionId: $transactionId) {
      amount
      callBack
      cancelUrl
      currency
      customerName
      displayValue
      failUrl
      id
      isCaptured
      isPaid
      merchantId
      message
      productInfo
      referenceId
      showRefundButton
      status
      successUrl
      transactionType
    }
  }
`;
// PAY_TRANSACTION_SUBSCRIPTION
export const PAY_TRANSACTION_SUBSCRIPTION = gql`
  subscription payTransaction($channel: String!) {
    payTransaction(channel: $channel) {
      amount
      callBack
      cancelUrl
      currency
      customerName
      displayValue
      failUrl
      id
      isCaptured
      isPaid
      merchantId
      message
      productInfo
      referenceId
      showRefundButton
      status
      successUrl
      transactionType
    }
  }
`;
