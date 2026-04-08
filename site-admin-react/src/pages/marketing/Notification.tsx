import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ActionDrawer from "@/components/ActionDrawer";
import { useAuthStore } from "@/store/useAuthStore";
import { useSiteStore } from "@/store/useSiteStore";
import { SITE_NOTIFICATIONS } from "@/graphql/queries/marketing";
import { DEFAULT_PAGE_SIZE, nextPageVariables } from "@/lib/pagination";
import useRowSelection from "@/hooks/useRowSelection";
import DataTable, { type DataTableColumn } from "@/components/data-table/DataTable";
import {
  SELF_HOME_NOTIFICATION_CREATE,
  SELF_SITE_NOTIFICATION_CREATE,
  SELF_SITE_NOTIFICATION_DELETE,
  SELF_SITE_NOTIFICATION_UPDATE
} from "@/graphql/mutations/marketing";

dayjs.extend(relativeTime);

export default function Notification() {
  const user = useAuthStore((state) => state.user);
  const site = useSiteStore((state) => state.site);
  const userId = user?.id ?? null;
  const siteId = site?.id ?? null;

  const [first, setFirst] = useState(DEFAULT_PAGE_SIZE);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    title: "",
    body: "",
    isPublic: true,
    isTemporary: true
  });

  const { data, loading, fetchMore, refetch } = useQuery(SITE_NOTIFICATIONS, {
    variables: {
      siteId: siteId ?? 0,
      first
    },
    skip: !siteId
  });

  const [createNotification, { loading: creating }] = useMutation(SELF_SITE_NOTIFICATION_CREATE);
  const [updateNotification, { loading: updating }] = useMutation(SELF_SITE_NOTIFICATION_UPDATE);
  const [deleteNotification, { loading: deleting }] = useMutation(SELF_SITE_NOTIFICATION_DELETE);
  const [sendHomeNotification, { loading: sending }] = useMutation(SELF_HOME_NOTIFICATION_CREATE);

  const notifications = data?.siteNotifications?.edges?.map((edge: any) => edge.node) ?? [];
  const total = data?.siteNotifications?.total ?? notifications.length;
  const pageInfo = data?.siteNotifications?.pageInfo;
  const hasMore = Boolean(pageInfo?.hasNextPage) || notifications.length < total;

  const { selectedIds, allSelected, indeterminate, toggleAll, toggleOne, clearSelection } = useRowSelection({
    rows: notifications,
    getId: (item: any) => item.id
  });

  const editing = useMemo(
    () => notifications.find((item: any) => item.id === editingId) ?? null,
    [editingId, notifications]
  );

  const resetForm = () => {
    setEditingId(null);
    setForm({
      title: "",
      body: "",
      isPublic: true,
      isTemporary: true
    });
  };

  const openCreate = () => {
    resetForm();
    setDrawerOpen(true);
  };

  const openEdit = (item: any) => {
    setEditingId(item.id);
    setForm({
      title: item.title ?? "",
      body: item.body ?? "",
      isPublic: Boolean(item.isPublic),
      isTemporary: false
    });
    setDrawerOpen(true);
  };

  const resend = async (item: any) => {
    if (!userId || !site?.hostname) return;
    await sendHomeNotification({
      variables: {
        userId,
        title: item.title ?? "",
        body: item.body ?? "",
        topic: site.hostname
      }
    });
  };

  const submit = async () => {
    if (!userId || !siteId || !site?.hostname) return;
    if (form.title.trim().length < 3 || form.body.trim().length < 3) return;

    await sendHomeNotification({
      variables: {
        userId,
        title: form.title.trim(),
        body: form.body.trim(),
        topic: site.hostname
      }
    });

    if (editingId) {
      await updateNotification({
        variables: {
          userId,
          siteId,
          id: editingId,
          title: form.title.trim(),
          body: form.body.trim(),
          data: "",
          isPublic: form.isPublic,
          isUnread: false,
          level: 1
        }
      });
      await refetch();
      setDrawerOpen(false);
      resetForm();
      return;
    }

    if (!form.isTemporary) {
      await createNotification({
        variables: {
          userId,
          siteId,
          title: form.title.trim(),
          body: form.body.trim(),
          data: "",
          isPublic: form.isPublic,
          isUnread: false,
          level: 1
        }
      });
      await refetch();
    }

    setDrawerOpen(false);
    resetForm();
  };

  const remove = async () => {
    if (!editingId || !userId || !siteId) return;
    if (!window.confirm("Delete this notification?")) return;
    await deleteNotification({
      variables: {
        userId,
        siteId,
        id: editingId
      }
    });
    await refetch();
    setDrawerOpen(false);
    resetForm();
  };

  const loadMore = async () => {
    if (!hasMore || !siteId) return;
    await fetchMore({
      variables: nextPageVariables({
        baseVariables: { siteId },
        pageInfo,
        currentCount: notifications.length,
        pageSize: first
      }),
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!fetchMoreResult?.siteNotifications?.edges?.length) return previousResult;
        return {
          siteNotifications: {
            ...fetchMoreResult.siteNotifications,
            edges: [...(previousResult.siteNotifications?.edges ?? []), ...fetchMoreResult.siteNotifications.edges]
          }
        };
      }
    });
  };

  const columns = useMemo<DataTableColumn<any>[]>(
    () => [
      {
        id: "message",
        header: "Message",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "max-w-[360px] truncate px-3 py-2 text-sm",
        cell: (item) => (
          <>
            <div className="font-medium text-gray-900">{item.title}</div>
            <div className="text-xs text-gray-500">{item.body}</div>
          </>
        )
      },
      {
        id: "public",
        header: "Public",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "whitespace-nowrap px-3 py-2 text-sm text-gray-500",
        cell: (item) => (
          <span
            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
              item.isPublic ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {item.isPublic ? "Public" : "Private"}
          </span>
        )
      },
      {
        id: "updated",
        header: "Updated",
        headClassName: "px-3 py-3.5 text-left text-sm font-semibold text-gray-900",
        cellClassName: "whitespace-nowrap px-3 py-2 text-sm text-gray-500",
        cell: (item) => (
          <>
            <div className="text-gray-900">{item.updatedAt ? dayjs(item.updatedAt).fromNow() : "-"}</div>
            <div className="text-xs text-gray-500">{item.updatedAt ? dayjs(item.updatedAt).format("h:mm A MMM D") : "-"}</div>
          </>
        )
      },
      {
        id: "action",
        header: "Action",
        headClassName: "w-40 px-4 py-3.5 text-right text-sm font-semibold text-gray-900",
        cellClassName: "whitespace-nowrap px-4 py-2 text-right text-sm text-gray-500",
        cell: (item) => (
          <div className="inline-flex">
            <button
              type="button"
              onClick={() => resend(item)}
              className="rounded-l-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Resend
            </button>
            <button
              type="button"
              onClick={() => openEdit(item)}
              className="rounded-r-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Edit
            </button>
          </div>
        )
      }
    ],
    []
  );

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 flex items-center">
              Notification
              <button
                type="button"
                onClick={() => refetch()}
                className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-indigo-600"
                aria-label="Refresh notifications"
                title="Refresh"
              >
                RF
              </button>
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all notifications in this store. You can resend, update, or delete them.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500"
          >
            Add New
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-1">
        <DataTable
          rows={notifications}
          getRowId={(item) => item.id}
          columns={columns}
          loading={loading}
          emptyLabel="No record :-("
          selection={{
            selectedIds,
            allSelected,
            indeterminate,
            onToggleAll: toggleAll,
            onToggleOne: (id, checked) => toggleOne(Number(id), checked),
            onClear: clearSelection,
            actions: [
              {
                label: "Delete Selected",
                tone: "danger",
                onClick: async (rows) => {
                  if (!userId || !siteId || rows.length === 0) return;
                  if (!window.confirm("Delete selected notifications?")) return;
                  await Promise.all(
                    rows.map((item) =>
                      deleteNotification({
                        variables: {
                          userId,
                          siteId,
                          id: item.id
                        }
                      })
                    )
                  );
                  await refetch();
                  clearSelection();
                }
              }
            ]
          }}
          pagination={{
            mode: "cursor",
            count: notifications.length,
            total,
            hasNext: hasMore,
            onLoadMore: loadMore,
            loading,
            pageSize: first,
            pageSizeOptions: [15, 30, 100, 200, 500, 1000],
            onPageSizeChange: setFirst,
            nextLabel: "Next",
            from: notifications.length ? 1 : 0,
            to: notifications.length
          }}
        />
      </div>

      <ActionDrawer
        open={drawerOpen}
        title={editing ? "Update Notification" : "Create Notification"}
        subtitle="Send push notification now and optionally store in database."
        onClose={() => {
          setDrawerOpen(false);
          resetForm();
        }}
        footer={
          <div className="flex items-center justify-between">
            <div>
              {editing ? (
                <button
                  type="button"
                  onClick={remove}
                  disabled={deleting}
                  className="rounded-md border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              ) : null}
            </div>
            <button
              type="button"
              onClick={submit}
              disabled={creating || updating || sending}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-500 disabled:opacity-60"
            >
              {editing ? "Update" : "Confirm"}
            </button>
          </div>
        }
      >
        <label className="text-sm font-medium text-gray-700">
          Title
          <input
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            placeholder="Enter title"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </label>

        <label className="text-sm font-medium text-gray-700">
          Message
          <textarea
            value={form.body}
            onChange={(event) => setForm((prev) => ({ ...prev, body: event.target.value }))}
            placeholder="Enter body"
            rows={4}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </label>

        {!editing ? (
          <label className="flex items-center justify-between rounded-md border border-gray-200 p-3 text-sm text-gray-700">
            <div>
              <div className="font-medium text-gray-900">Temporary</div>
              <div className="text-xs text-gray-500">This notification will not save to database.</div>
            </div>
            <input
              type="checkbox"
              checked={form.isTemporary}
              onChange={(event) => setForm((prev) => ({ ...prev, isTemporary: event.target.checked }))}
              className="h-4 w-4 rounded border-gray-300"
            />
          </label>
        ) : null}

        <label className="flex items-center justify-between rounded-md border border-gray-200 p-3 text-sm text-gray-700">
          <div>
            <div className="font-medium text-gray-900">Public</div>
            <div className="text-xs text-gray-500">Anyone can view this notification.</div>
          </div>
          <input
            type="checkbox"
            checked={form.isPublic}
            onChange={(event) => setForm((prev) => ({ ...prev, isPublic: event.target.checked }))}
            className="h-4 w-4 rounded border-gray-300"
          />
        </label>
      </ActionDrawer>
    </div>
  );
}
