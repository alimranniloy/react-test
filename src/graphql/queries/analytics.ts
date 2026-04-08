import { gql } from "@apollo/client";

export const ANALYTICS_SITE_PAGE = gql`
  query ($siteId: Int) {
    analyticsSitePage(siteId: $siteId) {
      total
      live
      pages {
        page
        total
      }
    }
  }
`;

export const ANALYTICS_SITE_PAGE_SUBSCRIPTION = gql`
  subscription analyticsSitePage($channel: String!) {
    analyticsSitePage(channel: $channel) {
      total
      live
      pages {
        page
        total
      }
    }
  }
`;
