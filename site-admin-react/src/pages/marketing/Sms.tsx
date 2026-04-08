import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { SELF_SMS_ACCOUNT, SELF_SMS_MESSAGES } from "@/graphql/queries/sms";
import { SELF_SMS_ACCOUNT_CREATE, SELF_SMS_ACCOUNT_UPDATE, SMS_MESSAGE_CREATE } from "@/graphql/mutations/sms";
import { useAuthStore } from "@/store/useAuthStore";
import { useSiteStore } from "@/store/useSiteStore";
import { STORE_CUSTOMERS } from "@/graphql/queries/customer";
import { DEFAULT_PAGE_SIZE, nextPageVariables } from "@/lib/pagination";
import DataTable, { type DataTableColumn } from "@/components/data-table/DataTable";

const countSmsSegments = (message: string) => Math.max(1, Math.ceil(message.length / 160));

export default function Sms() {
  const user = useAuthStore((state) => state.user);
  const site = useSiteStore((state) => state.site);
  const userId = user?.id ?? null;

  const { data: accountData, refetch: refetchAccount } = useQuery(SELF_SMS_ACCOUNT, {
    variables: { userId: userId ?? 0 },
    skip: !userId
  });

  const account = accountData?.selfSmsAccount ?? null;

  const { data: messageData, loading: messageLoading, fetchMore } = useQuery(SELF_SMS_MESSAGES, {
    variables: {
      userId: userId ?? 0,
      first: DEFAULT_PAGE_SIZE
    },
    skip: !userId
  });

  const messages = messageData?.selfSmsMessages?.edges?.map((edge: any) => edge.node) ?? [];
  const pageInfo = messageData?.selfSmsMessages?.pageInfo;
  const totalAvailable = messageData?.selfSmsMessages?.total ?? messages.length;
  const hasMore = (pageInfo?.hasNextPage ?? false) || messages.length < totalAvailable;

  const [createAccount, { loading: creatingAccount }] = useMutation(SELF_SMS_ACCOUNT_CREATE);
  const [updateAccount, { loading: updatingAccount }] = useMutation(SELF_SMS_ACCOUNT_UPDATE);
  const [sendMessage, { loading: sendingMessage }] = useMutation(SMS_MESSAGE_CREATE);

  const [accountForm, setAccountForm] = useState({
    accountType: 0,
    name: "",
    phone: "",
    address: "",
    currency: site?.currency ?? "BDT",
    country: 1,
    isThirdParty: false,
    thirdPartyName: "",
    charge: ""
  });

  const [messageForm, setMessageForm] = useState({
    phone: "",
    message: "",
    channel: "sms"
  });

  const [receiverOpen, setReceiverOpen] = useState(false);
  const [receiverSearch, setReceiverSearch] = useState("");
  const [selectedReceivers, setSelectedReceivers] = useState<Array<{ id: number; phone: number; name: string }>>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const customerVariables = useMemo(
    () => ({
      siteId: site?.id ?? 0,
      search: receiverSearch.trim() || null,
      first: DEFAULT_PAGE_SIZE
    }),
    [receiverSearch, site?.id]
  );

  const { data: customerData, loading: customerLoading } = useQuery(STORE_CUSTOMERS, {
    variables: customerVariables,
    skip: !site?.id
  });

  const customers = customerData?.storeCustomers?.edges?.map((edge: any) => edge.node) ?? [];
  const messageColumns = useMemo<DataTableColumn<any>[]>(
    () => [
      {
        id: "phone",
        header: "Phone",
        headClassName: "px-4 py-2",
        cellClassName: "px-4 py-2 text-gray-700",
        cell: (msg) => msg.phone
      },
      {
        id: "message",
        header: "Message",
        headClassName: "px-4 py-2",
        cellClassName: "px-4 py-2 text-gray-600",
        cell: (msg) => msg.message
      },
      {
        id: "status",
        header: "Status",
        headClassName: "px-4 py-2",
        cellClassName: "px-4 py-2",
        cell: (msg) => <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{msg.status}</span>
      },
      {
        id: "updatedAt",
        header: "Updated",
        headClassName: "px-4 py-2",
        cellClassName: "px-4 py-2 text-gray-500",
        cell: (msg) => msg.updatedAt
      }
    ],
    []
  );
  const customerColumns = useMemo<DataTableColumn<any>[]>(
    () => [
      {
        id: "select",
        header: "Select",
        headClassName: "px-4 py-2",
        cellClassName: "px-4 py-2",
        cell: (customer) => (
          <input
            type="checkbox"
            checked={selectedIds.includes(customer.id)}
            onChange={(event) => {
              const phoneValue = Number(customer.phone);
              if (Number.isNaN(phoneValue)) return;
              if (event.target.checked) {
                setSelectedIds((prev) => [...prev, customer.id]);
                setSelectedReceivers((prev) => [...prev, { id: customer.id, phone: phoneValue, name: customer.title }]);
              } else {
                setSelectedIds((prev) => prev.filter((id) => id !== customer.id));
                setSelectedReceivers((prev) => prev.filter((item) => item.id !== customer.id));
              }
            }}
          />
        )
      },
      {
        id: "name",
        header: "Name",
        headClassName: "px-4 py-2",
        cellClassName: "px-4 py-2 text-gray-700",
        cell: (customer) => customer.title
      },
      {
        id: "phone",
        header: "Phone",
        headClassName: "px-4 py-2",
        cellClassName: "px-4 py-2 text-gray-500",
        cell: (customer) => customer.phone
      }
    ],
    [selectedIds]
  );

  const accountPayload = useMemo(() => {
    if (!account) return null;
    return {
      accountType: account.accountType ?? 0,
      name: account.name ?? "",
      phone: account.phone ? String(account.phone) : "",
      address: account.address ?? "",
      currency: account.currency ?? site?.currency ?? "BDT",
      country: 1,
      isThirdParty: Boolean(account.isThirdParty),
      thirdPartyName: account.thirdPartyName ?? "",
      charge: account.charge ? String(account.charge) : ""
    };
  }, [account, site?.currency]);

  useEffect(() => {
    if (accountPayload) {
      setAccountForm(accountPayload);
    }
  }, [accountPayload]);

  const submitAccount = async () => {
    if (!userId) return;
    if (account) {
      await updateAccount({
        variables: {
          userId,
          accountId: account.id,
          accountType: accountForm.accountType,
          address: accountForm.address || undefined,
          currency: accountForm.currency,
          name: accountForm.name,
          phone: accountForm.phone ? Number(accountForm.phone) : undefined,
          isThirdParty: accountForm.isThirdParty,
          thirdPartyName: accountForm.thirdPartyName || undefined,
          chagre: accountForm.charge ? Number(accountForm.charge) : undefined
        }
      });
    } else {
      await createAccount({
        variables: {
          userId,
          accountType: accountForm.accountType,
          address: accountForm.address || undefined,
          avatar: "",
          country: accountForm.country,
          currency: accountForm.currency,
          name: accountForm.name,
          phone: accountForm.phone ? Number(accountForm.phone) : undefined
        }
      });
    }
    await refetchAccount();
  };

  const submitMessage = async () => {
    if (!userId || !account?.id) return;
    if (!messageForm.message.trim()) return;

    const count = countSmsSegments(messageForm.message);
    const chargePer = Number(account?.charge ?? 0);

    const phones = [
      ...selectedReceivers.map((receiver) => receiver.phone),
      ...(messageForm.phone.trim() ? [Number(messageForm.phone)] : [])
    ].filter((value, index, arr) => arr.indexOf(value) === index);

    for (const phone of phones) {
      await sendMessage({
        variables: {
          userId,
          accountId: account.id,
          channel: messageForm.channel,
          charge: chargePer * count,
          count,
          currency: account.currency ?? site?.currency ?? "BDT",
          message: messageForm.message,
          phone,
          senderId: userId
        }
      });
    }

    setMessageForm((prev) => ({ ...prev, message: "" }));
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h1 className="text-xl font-semibold text-gray-900">SMS</h1>
        <p className="mt-2 text-sm text-gray-700">Send marketing SMS campaigns.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">SMS Account</h2>
          {account && accountPayload ? (
            <button
              type="button"
              onClick={() => setAccountForm(accountPayload)}
              className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
            >
              Load Current
            </button>
          ) : null}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-gray-700">
            Account Type
            <select
              value={accountForm.accountType}
              onChange={(event) => setAccountForm((prev) => ({ ...prev, accountType: Number(event.target.value) }))}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value={0}>Standard</option>
              <option value={1}>Premium</option>
              <option value={2}>Third Party</option>
            </select>
          </label>
          <label className="text-sm font-medium text-gray-700">
            Name
            <input
              value={accountForm.name}
              onChange={(event) => setAccountForm((prev) => ({ ...prev, name: event.target.value }))}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm font-medium text-gray-700">
            Phone
            <input
              value={accountForm.phone}
              onChange={(event) => setAccountForm((prev) => ({ ...prev, phone: event.target.value }))}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm font-medium text-gray-700">
            Address
            <input
              value={accountForm.address}
              onChange={(event) => setAccountForm((prev) => ({ ...prev, address: event.target.value }))}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm font-medium text-gray-700">
            Currency
            <input
              value={accountForm.currency}
              onChange={(event) => setAccountForm((prev) => ({ ...prev, currency: event.target.value }))}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm font-medium text-gray-700">
            Charge per SMS
            <input
              value={accountForm.charge}
              onChange={(event) => setAccountForm((prev) => ({ ...prev, charge: event.target.value }))}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={accountForm.isThirdParty}
              onChange={(event) => setAccountForm((prev) => ({ ...prev, isThirdParty: event.target.checked }))}
            />
            Third Party
          </label>
          <label className="text-sm font-medium text-gray-700">
            Third Party Name
            <input
              value={accountForm.thirdPartyName}
              onChange={(event) => setAccountForm((prev) => ({ ...prev, thirdPartyName: event.target.value }))}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </label>
        </div>
        <div className="mt-4">
          <button
            type="button"
            onClick={submitAccount}
            disabled={creatingAccount || updatingAccount}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-60"
          >
            {account ? "Update Account" : "Create Account"}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-gray-900">Send SMS</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-gray-700">
            Phone
            <input
              value={messageForm.phone}
              onChange={(event) => setMessageForm((prev) => ({ ...prev, phone: event.target.value }))}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm font-medium text-gray-700">
            Channel
            <input
              value={messageForm.channel}
              onChange={(event) => setMessageForm((prev) => ({ ...prev, channel: event.target.value }))}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </label>
        </div>
        <label className="mt-4 block text-sm font-medium text-gray-700">
          Message
          <textarea
            value={messageForm.message}
            onChange={(event) => setMessageForm((prev) => ({ ...prev, message: event.target.value }))}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            rows={4}
          />
        </label>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
          <span>Segments: {countSmsSegments(messageForm.message)}</span>
          <span>Estimated charge: {Number(account?.charge ?? 0) * countSmsSegments(messageForm.message)}</span>
          <button
            type="button"
            onClick={() => setReceiverOpen(true)}
            className="rounded-md border border-gray-200 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50"
          >
            Select receivers ({selectedReceivers.length})
          </button>
        </div>
        <div className="mt-4">
          <button
            type="button"
            onClick={submitMessage}
            disabled={sendingMessage || !account}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-60"
          >
            Send SMS
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">SMS History</h2>
          <span className="text-xs text-gray-500">Latest activity</span>
        </div>
        <div className="mt-4 overflow-hidden rounded-lg border border-gray-200">
          <DataTable
            rows={messages}
            getRowId={(msg) => msg.id}
            columns={messageColumns}
            loading={messageLoading}
            emptyLabel="No SMS history."
            pagination={{
              mode: "cursor",
              count: messages.length,
              total: totalAvailable,
              from: messages.length ? 1 : 0,
              to: messages.length,
              hasNext: hasMore,
              onLoadMore: () => {
                fetchMore({
                  variables: nextPageVariables({
                    baseVariables: { userId: userId ?? 0 },
                    pageInfo,
                    currentCount: messages.length,
                    pageSize: DEFAULT_PAGE_SIZE
                  })
                });
              },
              loading: messageLoading
            }}
          />
        </div>
      </div>

      {receiverOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-4xl rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">Select Receivers</h3>
              <button
                type="button"
                onClick={() => setReceiverOpen(false)}
                className="rounded-md border border-gray-200 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
            <div className="px-6 py-4">
              <div className="flex items-center gap-2">
                <input
                  value={receiverSearch}
                  onChange={(event) => setReceiverSearch(event.target.value)}
                  placeholder="Search customer"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div className="mt-4 max-h-72 overflow-y-auto rounded-lg border border-gray-200">
                <DataTable
                  rows={customers}
                  getRowId={(customer) => customer.id}
                  columns={customerColumns}
                  loading={customerLoading}
                  emptyLabel="No customers."
                />
              </div>
            </div>
            <div className="border-t border-gray-200 px-6 py-4">
              <div className="flex flex-wrap gap-2">
                {selectedReceivers.map((receiver) => (
                  <span key={receiver.id} className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                    {receiver.name} ({receiver.phone})
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedReceivers((prev) => prev.filter((item) => item.id !== receiver.id));
                        setSelectedIds((prev) => prev.filter((id) => id !== receiver.id));
                      }}
                      className="text-slate-500 hover:text-slate-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
