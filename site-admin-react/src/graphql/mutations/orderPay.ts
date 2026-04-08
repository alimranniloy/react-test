import { gql } from "@apollo/client";

export const SELF_STORE_ORDER_PAY_UPDATE = gql`
  mutation selfStoreOrderPayUpdate(
    $userId: Int!
    $id: Int!
    $queryType: String!
    $orderId: Int
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
    selfStoreOrderPayUpdate(
      userId: $userId
      id: $id
      queryType: $queryType
      data: {
        orderId: $orderId
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
