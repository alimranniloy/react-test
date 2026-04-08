import { gql } from "@apollo/client";

export const STORE_PURCHASES = gql`
  query StorePurchases(
    $siteId: Int!
    $supplierId: Int
    $status: Int
    $staffId: Int
    $search: String
    $from: DateTime
    $to: DateTime
  ) {
    storePurchases(
      siteId: $siteId
      supplierId: $supplierId
      status: $status
      staffId: $staffId
      search: $search
      from: $from
      to: $to
    ) {
      id
      purchaseId
      supplierId
      supplierName
      supplierPhone
      supplierEmail
      supplierAddress
      supplierNote
      staffId
      status
      statusCompleted
      total
      netAmount
      grossAmount
      paid
      cost
      discount
      logisticsCharge
      currency
      source
      purchaseType
      createdAt
      updatedAt
      image
    }
  }
`;

export const STORE_SUPPLIER_PENDING_PRODUCTS = gql`
  query StoreSupplierPendingProducts($siteId: Int!, $supplierId: Int!, $statuses: [Int!]) {
    storeSupplierPurchaseCandidates(siteId: $siteId, supplierId: $supplierId, statuses: $statuses) {
      productId
      productName
      productSku
      quantity
      stock
      cost
      price
      orderIds
      variant
      variantId
      supplierId
    }
  }
`;
