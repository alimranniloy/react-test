import gql from 'graphql-tag'
// SITE_PAGES
export const SITE_PAGES = gql `
query($siteId: Int!, $search: String, $after: String, $first: Int) {
  sitePages(
    siteId: $siteId
    search: $search
    first: $first
    after: $after
  ) {
      total
      edges {
      node {
        id
        isActive
        slug
        title
        updatedAt
        siteId
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
// SITE_PAGE_PREVIEW
export const SITE_PAGE_PREVIEW = gql`
  query ($siteId: Int!, $id: Int!) {
    sitePage(siteId: $siteId, id: $id) {
      description
      html
      id
      isActive
      slug
      title
      schema
      siteId
    }
  }
`;
// SELF_SITE_PAGE_CREATE
export const SELF_SITE_PAGE_CREATE = gql `
mutation selfSitePageCreate(
  $userId: Int!
  $siteId: Int!
  $description: String!
  $html: JSON!
  $index: String!
  $isActive: Boolean!
  $isExcludedFromSitemap: Boolean!
  $isFooterHidden: Boolean!
  $isNavHidden: Boolean!
  $metaDescription: String!
  $metaKeywords: String!
  $metaTitle: String!
  $schema: JSON!
  $slug: String!
  $title: String!
) {
  selfSitePageCreate(
    userId: $userId
    siteId: $siteId
    data: {
      description: $description
      html: $html
      index: $index
      isActive: $isActive
      isExcludedFromSitemap: $isExcludedFromSitemap
      isFooterHidden: $isFooterHidden
      isNavHidden: $isNavHidden
      metaDescription: $metaDescription
      metaKeywords: $metaKeywords
      metaTitle: $metaTitle
      schema: $schema
      siteId: $siteId
      slug: $slug
      title: $title
    }
  ) {
    id
  }
}
`;
// SELF_SITE_PAGE_UPDATE
export const SELF_SITE_PAGE_UPDATE = gql`
  mutation selfSitePageUpdate(
    $userId: Int!
    $siteId: Int!
    $id: Int!
    $description: String
    $html: String
    $isActive: Boolean
    $slug: String
    $title: String
    $schema: JSON
  ) {
    selfSitePageUpdate(
      userId: $userId
      siteId: $siteId
      id: $id
      data: {
        description: $description
        html: $html
        isActive: $isActive
        slug: $slug
        title: $title
        schema: $schema
      }
    ) {
      id
    }
  }
`;
// SELF_SITE_PAGE_DELETE
export const SELF_SITE_PAGE_DELETE = gql `
mutation selfSitePageDelete($userId: Int!, $siteId: Int!, $id: Int!) {
  selfSitePageDelete(userId: $userId, siteId: $siteId, id: $id) 
}
`;
