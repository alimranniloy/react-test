import gql from "graphql-tag";
// SITE_TRANSACTIONS
export const SITE_TRANSACTIONS = gql`
  query (
    $siteId: Int
    $receiverId: Int
    $status: Int
    $after: String
    $first: Int
  ) {
    siteTransactions(
      siteId: $siteId
      receiverId: $receiverId
      status: $status
      first: $first
      after: $after
    ) {
      total
      edges {
        node {
          hid
          id
          isPaid
          isSettle
          note
          paymentDate
          paymentId
          paymentNo
          paymentTitle
          referId
          referPhone
          receiverId
          referTitle
          source
          subTotal
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
// SITE_TRANSACTION_DETAILS
export const SITE_TRANSACTION_DETAILS = gql`
  query ($id: Int!) {
    siteTransaction(id: $id) {
      hid
      id
      isPaid
      isSettle
      note
      paymentDate
      paymentId
      paymentNo
      paymentTitle
      referId
      referPhone
      receiverId
      referTitle
      source
      subTotal
      status
      total
      updatedAt
    }
  }
`;

// SELF_SITE_TRANSACTION_CREATE
export const SELF_SITE_TRANSACTION_CREATE = gql`
  mutation selfSiteTransactionCreate(
    $userId: Int!
    $siteId: Int!
    $charge: Float!
    $isPaid: Boolean!
    $isSettle: Boolean!
    $note: String!
    $other: Float!
    $paymentNo: String
    $paymentTitle: String
    $receiverId: Int!
    $referId: Int
    $referPhone: Int
    $referTitle: String
    $senderId: Int!
    $source: String!
    $status: Int!
    $subTotal: Float!
    $total: Float!
  ) {
    selfSiteTransactionCreate(
      userId: $userId
      siteId: $siteId
      data: {
        charge: $charge
        isPaid: $isPaid
        isSettle: $isSettle
        note: $note
        other: $other
        paymentNo: $paymentNo
        paymentTitle: $paymentTitle
        receiverId: $receiverId
        referId: $referId
        referPhone: $referPhone
        referTitle: $referTitle
        siteId: $siteId
        senderId: $senderId
        source: $source
        status: $status
        subTotal: $subTotal
        total: $total
      }
    ) {
      hid
      id
      isPaid
      isSettle
      note
      paymentDate
      paymentId
      paymentNo
      paymentTitle
      referId
      referPhone
      receiverId
      referTitle
      source
      subTotal
      status
      total
      updatedAt
    }
  }
`;
