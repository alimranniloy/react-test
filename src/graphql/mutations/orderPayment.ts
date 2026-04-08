import { gql } from "@apollo/client";

export const SELF_STORE_ORDER_PAYMENT_UPDATE = gql`
  mutation selfStoreOrderPaymentUpdate(
    $userId: Int!
    $siteId: Int!
    $id: Int!
    $isPaid: Boolean
    $isSettle: Boolean
    $note: String
    $paymentDate: DateTime
    $paymentId: String
    $paymentNo: String
    $paymentTitle: String
    $status: Int
    $total: Float
  ) {
    selfStoreOrderPaymentUpdate(
      userId: $userId
      siteId: $siteId
      id: $id
      data: {
        isPaid: $isPaid
        isSettle: $isSettle
        note: $note
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
`;
