import { gql } from "@apollo/client";

export const STORE_CATEGORIES = gql`
  query ($siteId: [Int]!, $search: String, $isActive: Boolean, $first: Int, $after: String, $offset: Int) {
    storeCategories(
      siteId: $siteId
      search: $search
      isActive: $isActive
      first: $first
      after: $after
      offset: $offset
    ) {
      edges {
        node {
          id
          title
          isActive
          updatedAt
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      total
    }
  }
`;

export const STORE_CATEGORY = gql`
  query ($id: Int!) {
    storeCategory(id: $id) {
      id
      title
      description
      image
      isActive
      isHome
      isPrivate
      priority
      priorityHome
      translation
      external
      updatedAt
    }
  }
`;

export const STORE_SUB_CATEGORIES = gql`
  query ($siteId: [Int]!, $categoryId: Int, $first: Int, $after: String, $offset: Int) {
    storeSubCategories(siteId: $siteId, categoryId: $categoryId, first: $first, after: $after, offset: $offset) {
      edges {
        node {
          id
          title
          categoryId
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      total
    }
  }
`;

export const STORE_SUB_CATEGORY = gql`
  query ($id: Int!) {
    storeSubCategory(id: $id) {
      categoryId
      cover
      description
      hid
      id
      image
      isActive
      isHome
      isPrivate
      priority
      priorityHome
      siteId
      title
      translation
    }
  }
`;

export const STORE_SUB_SUB_CATEGORIES = gql`
  query ($siteId: [Int]!, $categoryId: Int, $subCategoryId: Int, $first: Int, $after: String, $offset: Int) {
    storeSubSubCategories(
      siteId: $siteId
      categoryId: $categoryId
      subCategoryId: $subCategoryId
      first: $first
      after: $after
      offset: $offset
    ) {
      edges {
        node {
          id
          title
          categoryId
          subCategoryId
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      total
    }
  }
`;

export const STORE_SUB_SUB_CATEGORY = gql`
  query ($id: Int!) {
    storeSubSubCategory(id: $id) {
      categoryId
      cover
      description
      id
      hid
      image
      isActive
      isHome
      isPrivate
      priority
      siteId
      subCategoryId
      title
      translation
    }
  }
`;

export const STORE_BRANDS = gql`
  query ($siteId: [Int]!, $search: String, $first: Int, $after: String, $offset: Int) {
    storeBrands(siteId: $siteId, search: $search, first: $first, after: $after, offset: $offset) {
      edges {
        node {
          id
          title
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      total
    }
  }
`;

export const STORE_AUTHORS = gql`
  query ($siteId: [Int]!, $search: String, $first: Int, $after: String, $offset: Int) {
    storeAuthors(siteId: $siteId, search: $search, first: $first, after: $after, offset: $offset) {
      edges {
        node {
          id
          title
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      total
    }
  }
`;

export const STORE_TAGS = gql`
  query ($siteId: [Int]!, $search: String, $first: Int, $after: String, $offset: Int) {
    storeTags(siteId: $siteId, search: $search, first: $first, after: $after, offset: $offset) {
      edges {
        node {
          id
          title
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      total
    }
  }
`;

export const STORE_SUPPLIERS = gql`
  query ($siteId: Int, $search: String, $first: Int, $after: String, $offset: Int) {
    storeSuppliers(siteId: $siteId, search: $search, first: $first, after: $after, offset: $offset) {
      edges {
        node {
          id
          title
          isActive
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      total
    }
  }
`;
