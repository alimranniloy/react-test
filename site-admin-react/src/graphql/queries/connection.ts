import { gql } from "@apollo/client";

export const STORE_SHOPS = gql`
  query ($siteId: Int, $isActive: Boolean, $search: String, $after: String, $first: Int, $offset: Int) {
    storeShops(siteId: $siteId, isActive: $isActive, search: $search, first: $first, offset: $offset, after: $after) {
      total
      edges {
        node {
          address
          createdAt
          fee
          hid
          id
          isActive
          logo
          note
          ordersTotal
          phone
          products
          slug
          street
          title
          transaction
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

export const STORE_SUPPLIERS = gql`
  query ($siteId: Int, $isActive: Boolean, $search: String, $first: Int, $after: String, $offset: Int) {
    storeSuppliers(siteId: $siteId, isActive: $isActive, search: $search, first: $first, after: $after, offset: $offset) {
      total
      edges {
        node {
          address
          due
          id
          isActive
          isHome
          logo
          ordersTotal
          paid
          payable
          phone
          priority
          priorityHome
          queryType
          products
          sale
          title
          transaction
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

export const SITES = gql`
  query ($siteType: String, $createdById: Int, $parentId: Int, $after: String, $first: Int) {
    sites(siteType: $siteType, createdById: $createdById, parentId: $parentId, first: $first, after: $after) {
      total
      edges {
        node {
          favicon
          createdAt
          domain
          hostname
          id
          isActive
          percentage
          phone
          street
          title
          updatedAt
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

export const SITE_STAFFS = gql`
  query ($siteId: Int!, $staffType: Int, $search: String, $isActive: Boolean, $after: String, $first: Int) {
    siteStaffs(siteId: $siteId, staffType: $staffType, search: $search, isActive: $isActive, first: $first, after: $after) {
      total
      edges {
        node {
          id
          isActive
          phone
          staffType
          title
          updatedAt
          userId
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;
