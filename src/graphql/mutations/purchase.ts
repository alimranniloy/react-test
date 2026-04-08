import { gql } from "@apollo/client";

export const SELF_STORE_PURCHASE_CREATE = gql`
  mutation SelfStorePurchaseCreate(
    $userId: Int!
    $siteId: Int!
    $supplierId: Int!
    $lines: [StorePurchaseLineInput!]!
    $discount: Float
    $vat: Float
    $logisticsCharge: Float
    $paid: Float
    $note: String
  ) {
    selfStorePurchaseCreate(
      userId: $userId
      siteId: $siteId
      supplierId: $supplierId
      lines: $lines
      discount: $discount
      vat: $vat
      logisticsCharge: $logisticsCharge
      paid: $paid
      note: $note
    ) {
      id
      purchaseId
      supplierId
      supplierName
      total
      status
    }
  }
`;
