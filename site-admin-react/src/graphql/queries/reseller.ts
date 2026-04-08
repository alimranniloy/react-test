import { gql } from "@apollo/client";

export const STORE_SELL_TARGET_OPERATIONS = gql`
  query (
    $siteId: [Int]!
    $isActive: Boolean
    $search: String
    $first: Int
    $after: String
  ) {
    storeSellTargetOperations(
      siteId: $siteId
      isActive: $isActive
      search: $search
      first: $first
      after: $after
    ) {
      total
      edges {
        node {
          bonus
          endDate
          startDate
          isActive
          offerCriteria
          siteId
          targetType
          targetQty
          targetAmount
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

export const STORE_ORDER_RESELLER_LEDGER = gql`
  query (
    $siteId: Int!
    $customerId: Int
    $productIds: [Int]
    $first: Int
    $after: String
    $from: DateTime
    $to: DateTime
    $customerTitle: String
  ) {
    storeOrderResellerLedger(
      siteId: $siteId
      customerId: $customerId
      productIds: $productIds
      first: $first
      after: $after
      from: $from
      to: $to
      customerTitle: $customerTitle
    ) {
      total
      edges {
        node {
          customerId
          customerTitle
          date
          orderHid
          productCommission
          productQuantity
          resellerCommission
          sales
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

export const RESELLER = gql`
  query Reseller($siteId: String!, $resellerId: String!) {
    reseller(siteId: $siteId, resellerId: $resellerId) {
      id
      siteId
      userId
      code
      parentId
      level
      status
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

export const RESELLER_BY_CODE = gql`
  query ResellerByCode($data: ResellerByCodeInput!) {
    resellerByCode(data: $data) {
      id
      siteId
      userId
      code
      parentId
      level
      status
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

export const RESELLERS = gql`
  query Resellers($data: ResellerListFilterInput!) {
    resellers(data: $data) {
      id
      siteId
      userId
      code
      parentId
      level
      status
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

export const RESELLER_TREE = gql`
  query ResellerTree($data: ResellerTreeInput!) {
    resellerTree(data: $data) {
      siteId
      ancestorId
      descendantId
      depth
    }
  }
`;

export const RESELLER_WALLET = gql`
  query ResellerWallet($siteId: String!, $resellerId: String!) {
    wallet(siteId: $siteId, resellerId: $resellerId) {
      siteId
      resellerId
      pendingBalance
      withdrawableBalance
      paidBalance
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

export const RESELLER_WALLET_LEDGER = gql`
  query ResellerWalletLedger($data: WalletLedgerFilterInput!) {
    walletLedger(data: $data) {
      id
      siteId
      resellerId
      refType
      refId
      bucket
      direction
      amount
      meta
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

export const RESELLER_PAYOUT_REQUESTS = gql`
  query ResellerPayoutRequests($data: WalletPayoutRequestListInput!) {
    walletPayoutRequests(data: $data) {
      id
      siteId
      resellerId
      status
      amount
      note
      transactionRef
      requestedAt
      approvedAt
      settledAt
      rejectedAt
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

export const RESELLER_PAYOUT_AUDITS = gql`
  query ResellerPayoutAudits($data: WalletPayoutAuditListInput!) {
    walletPayoutAudits(data: $data) {
      id
      siteId
      payoutRequestId
      resellerId
      fromStatus
      toStatus
      note
      actorUserId
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

export const COMMISSION_PLAN = gql`
  query CommissionPlan($siteId: String!, $planId: String!) {
    commissionPlan(siteId: $siteId, planId: $planId) {
      id
      siteId
      userId
      name
      maxDepth
      basis
      platformSharePct
      isActive
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

export const COMMISSION_PLANS = gql`
  query CommissionPlans($siteId: String!, $isActive: Boolean) {
    commissionPlans(siteId: $siteId, isActive: $isActive) {
      id
      siteId
      userId
      name
      maxDepth
      basis
      platformSharePct
      isActive
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

export const COMMISSION_PLAN_LEVELS = gql`
  query CommissionPlanLevels($siteId: String!, $planId: String!) {
    commissionPlanLevels(siteId: $siteId, planId: $planId) {
      siteId
      planId
      level
      sharePct
      requiresTarget
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

export const RESELLER_TARGETS = gql`
  query ResellerTargets($data: TargetListInput!) {
    targets(data: $data) {
      id
      siteId
      userId
      name
      periodType
      startAt
      endAt
      metric
      threshold
      status
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

export const RESELLER_TARGET_PROGRESS = gql`
  query ResellerTargetProgress($data: TargetProgressListInput!) {
    targetProgress(data: $data) {
      siteId
      userId
      targetId
      resellerId
      qty
      revenue
      isCompleted
      completedAt
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

export const COMMISSION_EVENTS = gql`
  query CommissionEvents($data: CommissionEventListInput!) {
    commissionEvents(data: $data) {
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
      updatedAt
      deletedAt
    }
  }
`;

export const RECONCILIATION_SUMMARY = gql`
  query ReconciliationSummary($data: ReconciliationSummaryInput!) {
    reconciliationSummary(data: $data) {
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

export const RESELLER_REPORT_OVERVIEW = gql`
  query ResellerReportOverview($data: ResellerReportOverviewInput!) {
    resellerReportOverview(data: $data) {
      siteId
      totalResellers
      activeResellers
      suspendedResellers
      totalCommission
      totalOrders
      walletPendingTotal
      walletWithdrawableTotal
      walletPaidTotal
      payoutRequestedTotal
      payoutProcessingTotal
      payoutSettledTotal
    }
  }
`;

export const RESELLER_TOP_REPORT = gql`
  query ResellerTopReport($data: ResellerTopReportInput!) {
    resellerTopReport(data: $data) {
      resellerId
      code
      status
      totalCommission
      totalOrders
      pendingBalance
      withdrawableBalance
      paidBalance
    }
  }
`;

export const ORDER_RESELLER_ATTRIBUTION = gql`
  query OrderResellerAttribution($data: OrderResellerAttributionInput!) {
    orderResellerAttribution(data: $data) {
      siteId
      orderId
      resellerId
      attributionType
      resellerCode
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

export const ORDER_RESELLER_ATTRIBUTIONS = gql`
  query OrderResellerAttributions($data: OrderResellerAttributionListInput!) {
    orderResellerAttributions(data: $data) {
      siteId
      orderId
      resellerId
      attributionType
      resellerCode
      createdAt
      updatedAt
      deletedAt
    }
  }
`;
