import { gql } from "@apollo/client";

export const SELF_SITE_CREATE = gql`
  mutation selfSiteCreate(
    $userId: Int!
    $address: String!
    $country: Int!
    $currency: String!
    $desktopTheme: String!
    $domain: String!
    $email: String
    $footer: JSON
    $guide: JSON
    $hostname: String!
    $industry: Int!
    $latitude: Float!
    $longitude: Float!
    $memberTemplate: JSON
    $meta: JSON
    $navigation: JSON
    $note: String!
    $phone: Int
    $referCode: String!
    $schema: JSON
    $siteInfo: String!
    $siteType: String!
    $social: JSON
    $street: String
    $theme: String!
    $title: String!
  ) {
    selfSiteCreate(
      userId: $userId
      data: {
        address: $address
        country: $country
        currency: $currency
        desktopTheme: $desktopTheme
        domain: $domain
        email: $email
        footer: $footer
        guide: $guide
        hostname: $hostname
        industry: $industry
        latitude: $latitude
        longitude: $longitude
        memberTemplate: $memberTemplate
        meta: $meta
        navigation: $navigation
        note: $note
        phone: $phone
        referCode: $referCode
        schema: $schema
        siteInfo: $siteInfo
        siteType: $siteType
        social: $social
        street: $street
        theme: $theme
        title: $title
      }
    ) {
      id
      title
      domain
      hostname
      favicon
      street
      createdAt
      updatedAt
    }
  }
`;

