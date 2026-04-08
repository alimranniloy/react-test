import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { KHATA_ACCOUNT_DATA, KHATA_ACCOUNTS } from "@/graphql/queries/account";
import { SELF_KHATA_ACCOUNT_CREATE } from "@/graphql/mutations/account";
import { useAuthStore } from "@/store/useAuthStore";
import { DEFAULT_PAGE_SIZE, nextPageVariables } from "@/lib/pagination";
import DataTable, { type DataTableColumn } from "@/components/data-table/DataTable";

dayjs.extend(relativeTime);

const pageSizeOptions = [15, 30, 50, 100];

const formatMoney = (value: number | null | undefined, currency = "BDT") => {
  if (value == null || Number.isNaN(value)) return "—";
  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency,
      maximumFractionDigits: 0
    }).format(value);
  } catch {
    return `${currency} ${value}`;
  }
};

export default function PaymentAccount() {
  const user = useAuthStore((state) => state.user);
  const userId = user?.id ?? null;
  const currency = (user as { currency?: string } | null)?.currency ?? "BDT";

  const [accountType, setAccountType] = useState<"allAccount" | "income" | "expence" | "payer" | "payable">(
    "allAccount"
  );
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const { data: accountData } = useQuery(KHATA_ACCOUNT_DATA, {
    variables: { id: userId ?? 0 },
    skip: !userId
  });

  const variables = useMemo(
    () => ({
      createdById: userId ?? 0,
      accountType: null,
      isDeleted: false,
      min: null,
      max: null,
      queryType: "latest",
      first: pageSize,
      after: null
    }),
    [userId, pageSize]
  );

  const { data, loading, fetchMore } = useQuery(KHATA_ACCOUNTS, {
    variables,
    skip: !userId
  });
  const [createAccount, { loading: saving }] = useMutation(SELF_KHATA_ACCOUNT_CREATE);

  const accounts = data?.khataAccounts?.edges?.map((edge: any) => edge.node) ?? [];
  const pageInfo = data?.khataAccounts?.pageInfo;
  const totalAvailable = data?.khataAccounts?.total ?? accounts.length;
  const hasMore = (pageInfo?.hasNextPage ?? false) || accounts.length < totalAvailable;
  const totals = accountData?.khataAccountData?.data ?? {
    totalIncome: 0,
    totalExpence: 0,
    totalReceiveable: 0,
    totalPayable: 0,
    income: 0,
    expence: 0,
    receiveable: 0,
    payable: 0
  };

  const cashInHand = Math.abs(totals.income || 0) + Math.abs(totals.payable || 0) - (Math.abs(totals.expence || 0) + Math.abs(totals.receiveable || 0));
  const columns = useMemo<DataTableColumn<any>[]>(
    () => [
      {
        id: "name",
        header: "Name",
        headClassName: "px-4 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-4 py-3 text-sm text-gray-700",
        cell: (account) => (
          <>
            <div className="font-medium text-gray-900">{account.title}</div>
            <div className="text-xs text-gray-500">#{account.hid}</div>
          </>
        )
      },
      {
        id: "phone",
        header: "Phone",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-3 py-3 text-sm text-gray-500",
        cell: (account) => account.phone || "—"
      },
      {
        id: "amount",
        header: "Amount",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-3 py-3 text-sm text-gray-500",
        cell: (account) => formatMoney(account.amount)
      },
      {
        id: "total",
        header: "Total",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-3 py-3 text-sm text-gray-500",
        cell: (account) => formatMoney(account.total)
      },
      {
        id: "updatedAt",
        header: "Updated",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "px-3 py-3 text-sm text-gray-500",
        cell: (account) => (account.updatedAt ? dayjs(account.updatedAt).fromNow() : "—")
      }
    ],
    []
  );

  const [form, setForm] = useState({
    title: "",
    phone: "",
    address: "",
    budget: "",
    total: "",
    tags: "",
    accountType: 1
  });

  const submitCreate = async () => {
    if (!userId) return;
    await createAccount({
      variables: {
        userId,
        accountType: Number(form.accountType),
        address: form.address || "",
        budget: Number(form.budget || 0),
        currency,
        phone: form.phone ? Number(form.phone) : null,
        tags: form.tags || null,
        title: form.title || "",
        total: Number(form.total || 0)
      }
    });
    setForm({
      title: "",
      phone: "",
      address: "",
      budget: "",
      total: "",
      tags: "",
      accountType: 1
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900 flex items-center">
              Orders
              <span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-500">↻</span>
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all the orders in your account including their name, title, email and role.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="relative">
              <div className="flex bg-orange-50 px-4 pt-4 pb-2 rounded-t-md">
                <button
                  type="button"
                  onClick={() => setAccountType(accountType === "income" ? "allAccount" : "income")}
                  className={`w-full flex flex-col items-center leading-3 ${accountType === "income" ? "text-md" : "text-sm"}`}
                >
                  Income
                  <span className="text-[16px] py-2 font-normal text-green-600">
                    {formatMoney(Math.abs(totals.totalIncome || 0))}
                  </span>
                </button>
                <div className="bg-gray-300 h-100px w-[2px] rounded-full" />
                <button
                  type="button"
                  onClick={() => setAccountType(accountType === "expence" ? "allAccount" : "expence")}
                  className={`w-full flex flex-col items-center leading-3 ${accountType === "expence" ? "text-md" : "text-sm"}`}
                >
                  Expense
                  <span className="text-[16px] py-2 font-normal text-red-600">
                    {formatMoney(Math.abs(totals.totalExpence || 0))}
                  </span>
                </button>
                <div className="bg-gray-300 h-100px w-[2px] rounded-full" />
                <div className="w-full flex flex-col items-center text-sm leading-3">
                  Cash In Hand
                  <span className="text-[16px] py-2 font-normal text-blue-600">
                    {formatMoney(cashInHand)}
                  </span>
                </div>
              </div>
              <div className="flex bg-orange-50 pb-2 mb-3 pt-2 rounded-b-md">
                <button
                  type="button"
                  onClick={() => setAccountType(accountType === "payer" ? "allAccount" : "payer")}
                  className={`w-full items-center text-center leading-3 ${accountType === "payer" ? "text-md" : "text-sm"}`}
                >
                  পাবো
                  <div className="flex flex-col items-center">
                    <span className="text-[16px] py-2 font-normal text-green-600">
                      {formatMoney(Math.abs(totals.totalReceiveable || 0))}
                    </span>
                  </div>
                </button>
                <div className="bg-gray-300 h-100px w-[2px] rounded-full" />
                <button
                  type="button"
                  onClick={() => setAccountType(accountType === "payable" ? "allAccount" : "payable")}
                  className={`w-full items-center text-center leading-3 ${accountType === "payable" ? "text-md" : "text-sm"}`}
                >
                  দিবো
                  <div className="flex flex-col items-center">
                    <span className="text-[16px] py-2 font-normal text-red-600">
                      {formatMoney(Math.abs(totals.totalPayable || 0))}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
          <div className="lg:col-span-3 grid gap-4 rounded-md border border-slate-200 bg-white p-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-gray-500">Account name</label>
                <input
                  value={form.title}
                  onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Phone</label>
                <input
                  value={form.phone}
                  onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Address</label>
                <input
                  value={form.address}
                  onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Tags</label>
                <input
                  value={form.tags}
                  onChange={(event) => setForm((prev) => ({ ...prev, tags: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Budget</label>
                <input
                  value={form.budget}
                  onChange={(event) => setForm((prev) => ({ ...prev, budget: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Total</label>
                <input
                  value={form.total}
                  onChange={(event) => setForm((prev) => ({ ...prev, total: event.target.value }))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Account type</label>
                <select
                  value={form.accountType}
                  onChange={(event) => setForm((prev) => ({ ...prev, accountType: Number(event.target.value) }))}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value={1}>Income</option>
                  <option value={2}>Expense</option>
                  <option value={3}>Payer</option>
                  <option value={4}>Payable</option>
                </select>
              </div>
              <div className="flex items-end justify-end gap-2">
                <button
                  type="button"
                  onClick={submitCreate}
                  disabled={saving}
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60"
                >
                  Create account
                </button>
              </div>
            </div>
            <div className="rounded-lg border border-dashed border-slate-200 p-4 text-sm text-slate-500">
              Import contacts (CSV) and ledger actions coming next.
            </div>
          </div>
        </div>
      </div>

      <DataTable
        rows={accounts}
        getRowId={(row) => row.id}
        columns={columns}
        loading={loading}
        emptyLabel="No record :-("
        pagination={{
          mode: "cursor",
          count: accounts.length,
          total: totalAvailable,
          hasNext: hasMore,
          loading,
          onLoadMore: () =>
            fetchMore({
              variables: nextPageVariables({
                baseVariables: variables,
                pageInfo,
                currentCount: accounts.length,
                pageSize
              })
            }),
          pageSize,
          pageSizeOptions,
          onPageSizeChange: (value) => setPageSize(value),
          from: accounts.length ? 1 : 0,
          to: accounts.length
        }}
      />
    </div>
  );
}
