import { gql } from "@apollo/client";

export const SELF_SITE_TRANSACTION_UPDATE = gql`
  mutation selfSiteTransactionUpdate(
    $userId: Int!
    $siteId: Int!
    $id: Int!
    $charge: Float
    $isPaid: Boolean
    $isSettle: Boolean
    $note: String
    $other: Float
    $paymentDate: DateTime
    $paymentId: String
    $paymentNo: String
    $paymentTitle: String
    $receiverId: Int
    $referId: Int
    $referPhone: Int
    $referTitle: String
    $senderId: Int
    $source: String
    $status: Int
    $subTotal: Float
    $total: Float
  ) {
    selfSiteTransactionUpdate(
      userId: $userId
      siteId: $siteId
      id: $id
      data: {
        charge: $charge
        isPaid: $isPaid
        isSettle: $isSettle
        note: $note
        other: $other
        paymentDate: $paymentDate
        paymentId: $paymentId
        paymentNo: $paymentNo
        paymentTitle: $paymentTitle
        receiverId: $receiverId
        referId: $referId
        referPhone: $referPhone
        referTitle: $referTitle
        senderId: $senderId
        source: $source
        status: $status
        subTotal: $subTotal
        total: $total
      }
    ) {
      id
    }
  }
`;
