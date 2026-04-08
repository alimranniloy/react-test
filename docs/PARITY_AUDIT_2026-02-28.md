# Store Admin Parity Audit (February 28, 2026)

## Scope
- Source: `frontend/store/store-admin` (Vue)
- Target: `frontend/store/store-admin-react` (React)
- Focus: route parity, table selection UX parity, and field/action parity in high-impact modules.

## Route Parity Summary
- Vue unique normalized routes audited: `182`
- React normalized routes audited: `216`
- Missing Vue routes in React: `0` functional gaps (catch-all pattern differs only by syntax)

Notes:
- Vue catch-all `/:catchAll(.*)` is functionally covered by React `*`.
- Legacy social/community aliases from Vue root paths now map to React `/feed/*` routes:
  - `/post/:id`
  - `/group/:slug/:hid`
  - `/group/:slug/:hid/members`
  - `/:username`
  - `/:username/following`
  - `/:username/followers`
- Legacy product and reseller aliases now covered:
  - `/product/create/`, `/product/create2/`, `/product/update`
  - `/reseller/commission/create`, `/reseller/commission/plan`, `/reseller/request`

## Table UX Parity
- Global table rendering moved to reusable shadcn-style primitives:
  - `src/components/ui/table.tsx`
  - `src/components/AppTable.tsx`
- All page tables migrated to `AppTable`.
- Row-selection checkboxes now use Radix/shadcn checkbox primitive via:
  - `src/components/ui/checkbox.tsx`
  - `src/components/SelectAllCheckbox.tsx`
- Selection strip unified to dropdown-based toolbar:
  - `src/components/TableBulkBar.tsx`
  - Applied on all routes that use row selection.

## Generic DataTable API
- Added typed generic table API:
  - `src/components/data-table/DataTable.tsx`
- Supports:
  - typed columns (`DataTableColumn<T>`)
  - optional row selection + bulk actions
  - cursor and offset pagination adapters
  - optional row click and row-level classing
- First live adoption:
  - `src/pages/users/RoleList.tsx`

## Field/Action Parity Findings (Manual)
### Marketing
- `CampaignAction.vue` / `Campaign.tsx`
  - Parity: core fields present (`title`, `translation`, `queryType`, priorities, visibility flags, `endAt`, `description`, `image`, `cover`).
  - Gap: Vue includes richer tabbed edit workflow and preview link behavior (`/campaign/preview/...`).
- `CollectionAction.vue` / `Collection.tsx`
  - Parity: core fields and image/cover upload present.
  - Gap: Vue has richer tabbed status/metadata workflow and preview behavior.
- `SliderAction.vue` / `Slider.tsx`
  - Parity: core fields (`title`, `url`, `priority`, `body`, flags, media).
  - Gap: Vue handles richer media-state UX (video/PDF specific flows) with explicit preview/remove states.

### Orders
- `OrderList.vue` / `OrderList.tsx`
  - Parity improved: bulk selection now uses unified dropdown toolbar with retained action set (print, logistics, status transitions).
  - Gap: Vue and React still differ in microcopy and some visual grouping layout.

### Products
- Product create/update aliases now parity-covered.
- Core category/tag/brand/author CRUD route behavior is parity-covered.
- Gap: very large `ProductAction` still has type and stability issues requiring dedicated hardening pass.

## Remaining Parity Work (Actionable)
1. Marketing action pages:
   - Recreate Vue tab structures and preview links 1:1 in React forms.
2. Media workflows:
   - Add explicit video/PDF preview and remove flows to React slider/campaign/collection actions.
3. Product action hardening:
   - Stabilize `ProductAction.tsx` types and media handling to unlock full parity confidence.
4. Continue `DataTable<T>` rollout:
   - Migrate more list routes off bespoke table markup to reduce drift.

## Verification Notes
- Build currently has pre-existing TypeScript errors unrelated to this parity routing/table migration and must be resolved in a separate stabilization pass.
