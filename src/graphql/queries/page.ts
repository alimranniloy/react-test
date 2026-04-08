import { gql } from "@apollo/client";

export const SITE_PAGE = gql`
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
