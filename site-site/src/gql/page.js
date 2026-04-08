import gql from "graphql-tag";
// SITE_PAGE_PREVIEW
export const SITE_PAGE_PREVIEW_BY_SLUG = gql`
  query ($siteId: Int!, $slug: String!) {
    sitePageBySlug(siteId: $siteId, slug: $slug) {
      description
      html
      id
      isActive
      slug
      title
      schema
    }
  }
`;