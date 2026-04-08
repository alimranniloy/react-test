import gql from "graphql-tag"; 
// ----------------------------------------------------------------------------------------------
//                                        STORE ORDERS
// ----------------------------------------------------------------------------------------------
// STORE_ORDER_PAYMENTS
export const STORE_ORDER_PAYMENTS = gql`
  query (
    $siteId: Int!
    $customerId: Int
    $isPaid: Boolean
    $isSettle: Boolean
    $after: String
  ) {
    storeOrderPayments(
      siteId: $siteId
      customerId: $customerId
      isPaid: $isPaid
      isSettle: $isSettle
      after: $after
    ) {
      total
      edges {
        node {
          createdAt
          customerId
          customerPhone
          customerTitle
          hid
          id
          invoiceId
          isPaid
          isSettle
          note
          orderIds
          paymentDate
          paymentId
          paymentNo
          paymentTitle
          status
          total
          updatedAt
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
// STORE_ORDER_PAYMENT_DETAILS
export const STORE_ORDER_PAYMENT_DETAILS = gql`
  query ($siteId: Int!, $id: Int!) {
    storeOrderPayment(siteId: $siteId, id: $id) {
      createdAt
      customerId
      customerPhone
      customerTitle
      hid
      id
      invoiceId
      isPaid
      isSettle
      note
      orderIds
      orders {
        customerPhone
        customerTitle
        id
        logisticsCharge
        resellerCommission
        total
      }
      paymentDate
      paymentId
      paymentNo
      paymentTitle
      status
      total
      updatedAt
    }
  }
`;

// SELF_STORE_ORDER_PAYMENT_CREATE
export const SELF_STORE_ORDER_PAYMENT_CREATE = gql`
  mutation selfStoreOrderPaymentCreate(
    $userId: Int!
    $siteId: Int!
    $queryType: String!
  ) {
    selfStoreOrderPaymentCreate(
      userId: $userId
      siteId: $siteId
      queryType: $queryType
    )
  }
`;
// SELF_STORE_ORDER_PAYMENT_UPDATE
export const SELF_STORE_ORDER_PAYMENT_UPDATE = gql`
  mutation selfStoreOrderPaymentUpdate(
    $userId: Int!
    $id: Int!
    $queryType: String!
    $invoiceId: Int
    $isPaid: Boolean
    $isSettle: Boolean
    $note: String
    $orderIds: [Int]
    $paymentDate: DateTime
    $paymentId: String
    $paymentNo: String
    $paymentTitle: String
    $status: Int
    $total: Float
  ) {
    selfStoreOrderPaymentUpdate(
      userId: $userId
      id: $id
      queryType: $queryType
      data: {
        invoiceId: $invoiceId
        isPaid: $isPaid
        isSettle: $isSettle
        note: $note
        orderIds: $orderIds
        paymentDate: $paymentDate
        paymentId: $paymentId
        paymentNo: $paymentNo
        paymentTitle: $paymentTitle
        status: $status
        total: $total
      }
    ) {
      id
    }
  }
`; // SELF_STORE_ORDER_PAYMENT_CREATE_INVOICE
export const SELF_STORE_ORDER_PAYMENT_CREATE_INVOICE = gql`
  mutation selfStoreOrderPaymentCreateInvoice(
    $userId: Int!
    $siteId: Int!
    $id: Int!
  ) {
    selfStoreOrderPaymentCreateInvoice(
      userId: $userId
      siteId: $siteId
      id: $id
    ) {
      id
      hid
    }
  }
`;
