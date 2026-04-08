import { gql } from "@apollo/client";

export const STORE_STORE = gql`
  query storeStore($id: Int!, $from: DateTime, $to: DateTime) {
    storeStore(id: $id) {
      currency
      id
      data(from: $from, to: $to) {
        affiliateCommission
        cancelled
        charges
        confirmed
        delivered
        expectedProfit
        hold
        items
        netSale
        notResponding
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
        orderLine {
          amount
          date
          delivered
          returned
          total
        }
        customerLine {
          affiliate
          customer
          date
          reseller
          total
        }
      }
      lastPayment
      threshold
      title
      totalPaid
    }
  }
`;
