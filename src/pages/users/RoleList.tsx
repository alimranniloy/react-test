import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { USERS } from "@/graphql/queries/user";
import { SELF_USER_UPDATE_BY_SOURCE } from "@/graphql/mutations/user";
import { useAuthStore } from "@/store/useAuthStore";
import DataTable, { type DataTableColumn } from "@/components/data-table/DataTable";
import { DEFAULT_PAGE_SIZE, nextPageVariables } from "@/lib/pagination";

const tabs = [
  { name: "All", value: null },
  { name: "Active", value: true },
  { name: "Inactive", value: false }
];

export default function RoleList() {
  const user = useAuthStore((state) => state.user);
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const [search, setSearch] = useState("");
  const [activeUser, setActiveUser] = useState<any | null>(null);
  const [draft, setDraft] = useState({ isActive: false, password: "" });
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const variables = useMemo(
    () => ({
      search: search.trim() || null,
      isActive: selectedTab.value,
      first: pageSize,
      after: null
    }),
    [search, selectedTab, pageSize]
  );

  const { data, loading, refetch, fetchMore } = useQuery(USERS, { variables });
  const [updateUser, { loading: saving }] = useMutation(SELF_USER_UPDATE_BY_SOURCE);
  const users = data?.users?.edges?.map((edge: any) => edge.node) ?? [];
  const pageInfo = data?.users?.pageInfo;
  const totalAvailable = data?.users?.total ?? users.length;
  const hasMore = (pageInfo?.hasNextPage ?? false) || users.length < totalAvailable;
  const columns: DataTableColumn<any>[] = [
    {
      id: "name",
      header: "Name",
      cell: (item) => (
        <div>
          <div className="font-medium text-gray-900">{item.name}</div>
          <div className="text-xs text-gray-500">{item.referCode}</div>
        </div>
      ),
      headClassName: "px-4 py-3.5 text-left text-sm font-semibold text-gray-900",
      cellClassName: "px-4 py-3 text-sm text-gray-700"
    },
    {
      id: "phone",
      header: "Phone",
      cell: (item) => item.phone || "—",
      headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
      cellClassName: "px-3 py-3 text-sm text-gray-500"
    },
    {
      id: "status",
      header: "Status",
      cell: (item) => (
        <span
          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-4 ${
            item.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {item.isActive ? "Active" : "Inactive"}
        </span>
      ),
      headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
      cellClassName: "px-3 py-3 text-sm"
    }
  ];

  const openUser = (item: any) => {
    setActiveUser(item);
    setDraft({ isActive: Boolean(item.isActive), password: "" });
  };

  const closeUser = () => setActiveUser(null);

  const saveUser = async () => {
    if (!user?.id || !activeUser) return;
    await updateUser({
      variables: {
        userId: user.id,
        id: activeUser.id,
        isActive: draft.isActive,
        password: draft.password || null
      }
    });
    await refetch();
    closeUser();
  };

  return (
    <div className="space-y-5">
      <div className="relative rounded-2xl border border-slate-200 bg-white p-5">
        <h1 className="text-xl font-semibold text-gray-900 flex items-center">
          Users
          <button
            type="button"
            onClick={() => refetch()}
            className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-indigo-600"
          >
            ↻
          </button>
        </h1>
        <p className="mt-2 text-sm text-gray-700">
          A list of all the users in your account including their name, title, email and role.
        </p>
        <div className="absolute -inset-2 -z-10 rounded-xl blur-lg opacity-20" style={{
          background:
            "linear-gradient(90deg, rgb(68, 255, 154) -0.55%, rgb(68, 176, 255) 22.86%, rgb(162 147 186) 48.36%, rgb(255, 102, 68) 73.33%, rgb(235, 255, 112) 99.34%)"
        }} />
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-4 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              type="button"
              onClick={() => setSelectedTab(tab)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab.name === tab.name
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-700 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search user"
          className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
        />
      </div>

      <DataTable
        rows={users}
        getRowId={(row) => row.id}
        columns={columns}
        loading={loading}
        emptyLabel="No record :-("
        onRowClick={openUser}
        rowClassName={() => "hover:bg-slate-50 cursor-pointer"}
        pagination={{
          mode: "cursor",
          count: users.length,
          total: totalAvailable,
          hasNext: hasMore,
          loading,
          onLoadMore: () =>
            fetchMore({
              variables: nextPageVariables({
                baseVariables: variables,
                pageInfo,
                currentCount: users.length,
                pageSize
              })
            }),
          pageSize,
          pageSizeOptions: [15, 30, 50, 100],
          onPageSizeChange: (value) => setPageSize(value)
        }}
      />
      {activeUser ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{activeUser.name}</h3>
                <p className="text-xs text-gray-500">{activeUser.phone || "—"}</p>
              </div>
              <button
                type="button"
                onClick={closeUser}
                className="rounded-md border border-gray-200 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
            <div className="grid gap-4 px-6 py-5">
              <label className="flex items-center gap-3 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={draft.isActive}
                  onChange={(event) => setDraft((prev) => ({ ...prev, isActive: event.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                />
                Active
              </label>
              <div>
                <label className="text-xs font-medium text-gray-500">Reset password</label>
                <input
                  value={draft.password}
                  onChange={(event) => setDraft((prev) => ({ ...prev, password: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="New password (optional)"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
              <button
                type="button"
                onClick={closeUser}
                className="rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveUser}
                disabled={saving}
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
