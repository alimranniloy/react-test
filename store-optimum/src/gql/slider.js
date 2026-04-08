import gql from 'graphql-tag'
// SITE_SLIDERS
export const SITE_SLIDERS = gql `
  query (
    $siteId: [Int]!
    $childId: Int
    $isPrivate: Boolean
    $first: Int
    $after: String
  ) {
    siteSliders(siteId: $siteId, isPrivate: $isPrivate, first: $first, after: $after) {
      edges{
        node{
          body
          cover(childId: $childId)
          id
          isActive(childId: $childId)
          isPrivate
          isPhone
          priority
          siteId
          title
          updatedAt
          url
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
// SITE_SLIDER_DETAILS
export const SITE_SLIDER_DETAILS = gql `
query($id: Int!){
  siteSlider(id: $id){
    body
    cover
    id
    isActive
    isPrivate
    isPhone
    priority
    siteId
    title
    updatedAt
    url
  }
}
`; // SELF_SITE_SLIDER_CREATE
export const SELF_SITE_SLIDER_CREATE = gql `
mutation selfSiteSliderCreate(
  $userId: Int!
  $siteId: Int!
  $body: String!
  $cover: Upload!
  $isActive: Boolean!
  $isPhone: Boolean!
  $isPrivate: Boolean!
  $priority: Int!
  $title: String!
  $url: String!
) {
  selfSiteSliderCreate(
    userId: $userId
    siteId: $siteId
    data: {
      body: $body
      cover: $cover
      isActive: $isActive
      isPhone: $isPhone
      isPrivate: $isPrivate
      priority: $priority
      title: $title
      url: $url
    }
  ) {
    id
  }
}
`;
// SELF_SITE_SLIDER_UPSATE
export const SELF_SITE_SLIDER_UPDATE = gql `
mutation selfSiteSliderUpdate(
  $userId: Int!
  $id: Int!
  $title: String
  $body: String
  $cover: Upload
  $url: String
  $isActive: Boolean
  $isPhone: Boolean
  $priority: Int
  $isPrivate: Boolean
) {
  selfSiteSliderUpdate(
    userId: $userId
    id: $id
    data: {
      title: $title
      body: $body
      cover: $cover
      url: $url
      isActive: $isActive
      isPhone: $isPhone
      isPrivate: $isPrivate
      priority: $priority
    }
  ) {
    id
  }
}
`;
// SELF_SITE_SLIDER_UPDATE_BY_CHILD
export const SELF_SITE_SLIDER_UPDATE_BY_CHILD = gql `
mutation selfSiteSliderUpdateByChild(
  $userId: Int!
  $siteId: Int!
  $id: Int!
  $title: String
  $body: String
  $cover: Upload
  $url: String
  $isActive: Boolean
  $isPhone: Boolean
  $priority: Int
  $isPrivate: Boolean
) {
  selfSiteSliderUpdateByChild(
    userId: $userId
    siteId: $siteId
    id: $id
    data: {
      title: $title
      body: $body
      cover: $cover
      url: $url
      isActive: $isActive
      isPhone: $isPhone
      isPrivate: $isPrivate
      priority: $priority
    }
  ) {
    id
  }
}
`;
// SELF_SITE_SLIDER_DELETE
export const SELF_SITE_SLIDER_DELETE = gql `
mutation selfSiteSliderDelete($userId: Int!, $siteId: Int!, $id: Int!) {
  selfSiteSliderDelete(userId: $userId, siteId: $siteId, id: $id) 
}
`;