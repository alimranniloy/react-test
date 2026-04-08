import { gql } from "@apollo/client";

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

export const PAY_PAYMENT_PROVIDER = gql`
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
