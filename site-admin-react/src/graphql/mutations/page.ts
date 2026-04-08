import { gql } from "@apollo/client";

export const SELF_SITE_PAGE_CREATE = gql`
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

export const SELF_SITE_PAGE_DELETE = gql`
  mutation selfSitePageDelete($userId: Int!, $siteId: Int!, $id: Int!) {
    selfSitePageDelete(userId: $userId, siteId: $siteId, id: $id)
  }
`;
