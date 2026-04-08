import { gql } from "@apollo/client";

export const SELF_STORE_TARGET_OPERATION_CREATE = gql`
  mutation selfStoreSellTargetOperationCreate(
    $userId: Int!
    $siteId: Int!
    $bonus: Int!
    $endDate: String
    $isActive: Boolean!
    $offerCriteria: String!
    $startDate: String
    $targetType: String!
    $targetQty: Int!
    $targetAmount: Int!
  ) {
    selfStoreSellTargetOperationCreate(
      userId: $userId
      siteId: $siteId
      data: {
        siteId: $siteId
        bonus: $bonus
        endDate: $endDate
        isActive: $isActive
        offerCriteria: $offerCriteria
        startDate: $startDate
        targetType: $targetType
        targetQty: $targetQty
        targetAmount: $targetAmount
      }
    ) {
      id
    }
  }
`;

export const RESELLER_REGISTER = gql`
  mutation ResellerRegister($data: ResellerRegisterInput!) {
    resellerRegister(data: $data) {
      id
      siteId
      userId
      code
      parentId
      level
      status
      createdAt
      updatedAt
    }
  }
`;

export const RESELLER_APPROVE = gql`
  mutation ResellerApprove($data: ResellerApprovalInput!) {
    resellerApprove(data: $data) {
      id
      siteId
      userId
      code
      parentId
      level
      status
      updatedAt
    }
  }
`;

export const RESELLER_UPDATE = gql`
  mutation ResellerUpdate($data: ResellerUpdateInput!) {
    resellerUpdate(data: $data) {
      id
      siteId
      userId
      code
      parentId
      level
      status
      updatedAt
    }
  }
`;

export const RESELLER_SUSPEND = gql`
  mutation ResellerSuspend($data: ResellerSuspendInput!) {
    resellerSuspend(data: $data) {
      id
      siteId
      userId
      code
      parentId
      level
      status
      updatedAt
    }
  }
`;

export const RESELLER_REPARENT = gql`
  mutation ResellerReparent($data: ResellerReparentInput!) {
    resellerReparent(data: $data) {
      id
      siteId
      userId
      code
      parentId
      level
      status
      updatedAt
    }
  }
`;

export const RESELLER_ATTRIBUTION_UPSERT = gql`
  mutation ResellerAttributionUpsert($data: ResellerAttributionUpsertInput!) {
    resellerAttributionUpsert(data: $data) {
      siteId
      orderId
      resellerId
      attributionType
      resellerCode
      createdAt
      updatedAt
    }
  }
`;

export const WALLET_PAYOUT_REQUEST_CREATE = gql`
  mutation WalletPayoutRequestCreate($data: WalletPayoutRequestCreateInput!) {
    walletPayoutRequestCreate(data: $data) {
      id
      siteId
      resellerId
      status
      amount
      note
      transactionRef
      requestedAt
      createdAt
    }
  }
`;

export const WALLET_PAYOUT_APPROVE = gql`
  mutation WalletPayoutApprove($data: WalletPayoutRequestActionInput!) {
    walletPayoutApprove(data: $data) {
      id
      status
      approvedAt
      updatedAt
    }
  }
`;

export const WALLET_PAYOUT_PROCESS = gql`
  mutation WalletPayoutProcess($data: WalletPayoutRequestProcessInput!) {
    walletPayoutProcess(data: $data) {
      id
      status
      updatedAt
    }
  }
`;

export const WALLET_PAYOUT_SETTLE = gql`
  mutation WalletPayoutSettle($data: WalletPayoutRequestSettleInput!) {
    walletPayoutSettle(data: $data) {
      id
      status
      transactionRef
      settledAt
      updatedAt
    }
  }
`;

export const WALLET_PAYOUT_REJECT = gql`
  mutation WalletPayoutReject($data: WalletPayoutRequestActionInput!) {
    walletPayoutReject(data: $data) {
      id
      status
      rejectedAt
      updatedAt
    }
  }
`;

export const WALLET_PAYOUT_FAIL = gql`
  mutation WalletPayoutFail($data: WalletPayoutRequestFailInput!) {
    walletPayoutFail(data: $data) {
      id
      status
      rejectedAt
      updatedAt
    }
  }
`;

export const WALLET_PAYOUT_CANCEL = gql`
  mutation WalletPayoutCancel($data: WalletPayoutRequestActionInput!) {
    walletPayoutCancel(data: $data) {
      id
      status
      rejectedAt
      updatedAt
    }
  }
`;

export const COMMISSION_PLAN_CREATE = gql`
  mutation CommissionPlanCreate($data: CommissionPlanCreateInput!) {
    commissionPlanCreate(data: $data) {
      id
      siteId
      name
      maxDepth
      basis
      platformSharePct
      isActive
      createdAt
    }
  }
`;

export const COMMISSION_PLAN_UPDATE = gql`
  mutation CommissionPlanUpdate($data: CommissionPlanUpdateInput!) {
    commissionPlanUpdate(data: $data) {
      id
      siteId
      name
      maxDepth
      basis
      platformSharePct
      isActive
      updatedAt
    }
  }
`;

export const COMMISSION_PLAN_ACTIVATE = gql`
  mutation CommissionPlanActivate($data: CommissionPlanActivateInput!) {
    commissionPlanActivate(data: $data) {
      id
      siteId
      isActive
      updatedAt
    }
  }
`;

export const COMMISSION_PLAN_LEVEL_UPSERT = gql`
  mutation CommissionPlanLevelUpsert($data: CommissionPlanLevelUpsertInput!) {
    commissionPlanLevelUpsert(data: $data) {
      siteId
      planId
      level
      sharePct
      requiresTarget
      updatedAt
    }
  }
`;

export const TARGET_CREATE = gql`
  mutation TargetCreate($data: TargetCreateInput!) {
    targetCreate(data: $data) {
      id
      siteId
      name
      periodType
      startAt
      endAt
      metric
      threshold
      status
      createdAt
    }
  }
`;

export const TARGET_UPDATE = gql`
  mutation TargetUpdate($data: TargetUpdateInput!) {
    targetUpdate(data: $data) {
      id
      siteId
      name
      periodType
      startAt
      endAt
      metric
      threshold
      status
      updatedAt
    }
  }
`;

export const TARGET_ARCHIVE = gql`
  mutation TargetArchive($data: TargetArchiveInput!) {
    targetArchive(data: $data)
  }
`;

export const COMMISSION_EVENT_RECORD = gql`
  mutation CommissionEventRecord($data: CommissionEventRecordInput!) {
    commissionEventRecord(data: $data) {
      id
      siteId
      resellerId
      orderId
      refType
      status
      basis
      level
      amount
      idempotencyKey
      meta
      createdAt
    }
  }
`;

export const COMMISSION_EVENT_REVERSE = gql`
  mutation CommissionEventReverse($data: CommissionEventReverseInput!) {
    commissionEventReverse(data: $data) {
      id
      status
      amount
      updatedAt
    }
  }
`;

export const WALLET_RECONCILE = gql`
  mutation WalletReconcile($data: WalletReconcileInput!) {
    walletReconcile(data: $data) {
      siteId
      resellerId
      walletPending
      walletWithdrawable
      walletPaid
      ledgerPending
      ledgerWithdrawable
      ledgerPaid
      pendingDiff
      withdrawableDiff
      paidDiff
    }
  }
`;
