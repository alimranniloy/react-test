import gql from "graphql-tag";
// SITE
export const SITE = gql`
  query ($domain: String!) {
    site(domain: $domain) {
      domain
      email
      favicon
      hostname
      id
      phone
      phoneLogo
      schema
      siteInfo
      siteType
      theme
      title
    }
  }
`;