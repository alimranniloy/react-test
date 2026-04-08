import gql from 'graphql-tag'
// STORE_CAMPAIGNS
export const STORE_CAMPAIGNS = gql `
  query ($siteId: [Int]!, $isPrivate: Boolean, $after: String, $first: Int){
    storeCampaigns(siteId: $siteId, isPrivate: $isPrivate, first: $first, after: $after){
      edges{
        node{
          createdAt
          hid
          id
          image
          isActive
          isPrivate
          priority
          siteId
          slug
          title
          translation
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
// STORE_CAMPAIGN_DETAILS
export const STORE_CAMPAIGN_DETAILS = gql `
query($id: Int!){
  storeCampaign(id: $id){
    createdAt
    description
    endAt
    hid
    id
    image
    isActive
    isPrivate
    priority
    siteId
    slug
    title
    translation
  }
}
`; // SELF_STORE_CAMPAIGN_CREATE
export const SELF_STORE_CAMPAIGN_CREATE = gql `
mutation selfStoreCampaignCreate(
  $userId: Int!
  $siteId: Int!
  $description: String!
  $endAt: DateTime!
  $image: Upload!
  $isActive: Boolean!
  $isPrivate: Boolean!
  $priority: Int!
  $title: String!
  $translation: String!
) {
  selfStoreCampaignCreate(
    userId: $userId
    siteId: $siteId
    data: {
      description: $description
      endAt: $endAt
      image: $image
      isActive: $isActive
      isPrivate: $isPrivate
      priority: $priority
      title: $title
      translation: $translation
    }
  ) {
    id
  }
}
`;
// SELF_STORE_CAMPAIGN_UPDATE
export const SELF_STORE_CAMPAIGN_UPDATE = gql `
mutation selfStoreCampaignUpdate(
  $userId: Int!
  $siteId: Int!
  $id: Int!
  $description: String
  $endAt: DateTime
  $image: Upload
  $isActive: Boolean
  $isPrivate: Boolean
  $priority: Int
  $title: String
  $translation: String
) {
  selfStoreCampaignUpdate(
    userId: $userId
    siteId: $siteId
    id: $id
    data: {
      description: $description
      endAt: $endAt
      image: $image
      isActive: $isActive
      isPrivate: $isPrivate
      priority: $priority
      title: $title
      translation: $translation
    }
  ) {
    id
  }
}
`;

// SELF_STORE_CAMPAIGN_DELETE
export const SELF_STORE_CAMPAIGN_DELETE = gql `
mutation selfStoreCampaignDelete($userId: Int!, $siteId: Int!, $id: Int!) {
  selfStoreCampaignDelete(userId: $userId, siteId: $siteId, id: $id) 
}
`;