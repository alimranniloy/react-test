import gql from 'graphql-tag'
// SITE_STAFFS
export const SITE_STAFFS = gql `
query($siteId: Int!, $staffType: Int, $search: String, $after: String, $first: Int) {
  siteStaffs(siteId: $siteId, staffType: $staffType, search: $search, first: $first, after: $after){
    edges{
      node{
        id
        isActive
        phone
        staffType
        title
        updatedAt
        userId
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
// SITE_STAFF_DETAILS
export const SITE_STAFF_DETAILS = gql `
  query siteStaff($siteId: Int!, $id: Int!){
    siteStaff(siteId: $siteId, id: $id) {
      description
      id
      isActive
      permission
      phone
      staffType
      title
      userId
      user {
        id
        referCode
      }
  }
}
`;

// SELF_SITE_BY_STAFF
export const SELF_SITE_BY_STAFF = gql`
  query($userId: Int!, $siteId: Int!){
    selfSiteStaff(userId: $userId, siteId: $siteId) {
      id
      isActive
      permission
      phone
      staffType
      title
      userId
  }
}
`;

// SITE_SITE_STAFF_CREATE
export const SITE_SITE_STAFF_CREATE = gql`
mutation selfSiteStaffCreate(
  $siteId: Int!
  $userId: Int!
  $description: String!
  $isActive: Boolean!
  $permission: JSON!
  $phone: Int!
  $staffType: Int!
  $title: String!
) {
  selfSiteStaffCreate(
    userId: $userId
    data: {
      description: $description
      isActive: $isActive
      permission: $permission
      phone: $phone
      siteId: $siteId
      staffType: $staffType
      title: $title
      userId: $userId
    }
  ) {
    id
    isActive
    permission
    phone
    staffType
    title
    userId
  }
}

`;
// SELF_SITE_STAFF_CREATE_BY_ADMIN
export const SELF_SITE_STAFF_CREATE_BY_ADMIN = gql `
mutation selfSiteStaffCreateByAdmin(
  $userId: Int!
  $siteId: Int!
  $description: String!
  $isActive: Boolean!
  $permission: JSON!
  $phone: Int!
  $staffType: Int!
  $title: String!
) {
  selfSiteStaffCreateByAdmin(
    userId: $userId
    siteId: $siteId
    data: {
      description: $description
      isActive: $isActive
      permission: $permission
      phone: $phone
      siteId: $siteId
      staffType: $staffType
      title: $title
      userId: $userId
    }
  ) {
    id
    isActive
    phone
    staffType
    title
    updatedAt
  }
}
`;
// SELF_SITE_STAFF_UPDATE
export const SELF_SITE_STAFF_UPDATE = gql `
mutation selfSiteStaffUpdate(
  $userId: Int!
  $siteId: Int!
  $id: Int!
  $description: String
  $isActive: Boolean
  $permission: JSON
  $phone: Int
  $staffType: Int
  $title: String
) {
  selfSiteStaffUpdate(
    userId: $userId
    id: $id
    data: {
      description: $description
      isActive: $isActive
      permission: $permission
      phone: $phone
      siteId: $siteId
      staffType: $staffType
      title: $title
    }
  ) {
    id
    isActive
    phone
    staffType
    title
    updatedAt
  }
}
`;
// SELF_SITE_STAFF_DELETE
export const SELF_SITE_STAFF_DELETE = gql `
mutation selfSiteStaffDelete($userId: Int!, $id: Int!) {
  selfSiteStaffDelete(userId: $userId, id: $id)
}
`;