import gql from 'graphql-tag'
// STORE_STORE
export const STORE_STORE = gql `
query storeStore($id: Int!, $from: DateTime, $to: DateTime) {
  storeStore(id: $id) {
    currency
    id
    data(from: $from, to: $to){
      affiliateCommission
      cancelled
      charges
      confirmed
      delivered
      expectedProfit
      items
      netSale
      onTheWay
      orders
      packaging
      paidAffiliateCommission
      paidResellerCommission
      payableAffiliateCommission
      payableResellerCommission
      pending
      placed
      profit
      rejected
      resellerCommission
      returned
      sale
      shipment
      station
      totalAffiliateCommission
      transaction
    }
    lastPayment
    threshold
    title
    totalPaid
  }
}
`;