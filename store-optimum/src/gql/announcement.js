import gql from 'graphql-tag'
// HOME_ANNOUNCEMENTS
export const HOME_ANNOUNCEMENTS = gql `
query($appId: Int!, $search: String, $first: Int, $after: String){
  homeAnnouncements(appId: $appId, search: $search, first: $first, after: $after){
      total
      edges {
      node {
        id
        summary
        tag
        title
        updatedAt
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
// HOME_ANNOUNCEMENT_DETAILS
export const HOME_ANNOUNCEMENT_DETAILS = gql `
query($id: Int) {
  homeAnnouncement(id: $id) {
    appId
    html
    id
    image
    isActive
    isPinned
    summary
    tag
    title
    updatedAt
  }
}
`;