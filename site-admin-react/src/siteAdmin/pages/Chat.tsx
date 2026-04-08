import { useState } from "react";
import { useQuery } from "@apollo/client";
import { CHAT_THREADS } from "@/graphql/queries/chat";
import { useAuthStore } from "@/store/useAuthStore";
import ChatBody from "@/siteAdmin/pages/chat/ChatBody";
import type { Thread } from "@/siteAdmin/pages/chat/ChatBody";

export default function Chat() {
  const user = useAuthStore((s) => s.user);

  const [first] = useState(25);
  const [search, setSearch] = useState("");
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);

  const { data, loading, error, refetch, fetchMore } = useQuery(CHAT_THREADS, {
    variables: { userId: user?.id ?? 0, first, after: null, search: null },
    fetchPolicy: "network-only",
    skip: !user?.id
  });

  const edges: any[] = data?.chatThreads?.edges ?? [];
  const pageInfo = data?.chatThreads?.pageInfo;

  const loadMore = async () => {
    const endCursor = pageInfo?.endCursor;
    if (!endCursor || !user?.id) return;
    await fetchMore({
      variables: { userId: user.id, first, after: endCursor, search: search || null },
      updateQuery: (prev, { fetchMoreResult }) => {
        const prevEdges = prev?.chatThreads?.edges ?? [];
        const nextEdges = fetchMoreResult?.chatThreads?.edges ?? [];
        const nextPageInfo =
          fetchMoreResult?.chatThreads?.pageInfo ?? prev?.chatThreads?.pageInfo;
        return {
          ...prev,
          chatThreads: {
            ...prev.chatThreads,
            edges: [...prevEdges, ...nextEdges],
            pageInfo: nextPageInfo
          }
        };
      }
    });
  };

  return (
    <div className="flex min-h-[calc(100vh-140px)] gap-4">
      <div className="w-full lg:w-[360px] rounded-md border bg-white overflow-hidden">
        <div className="border-b bg-slate-50 p-4">
          <div className="text-base font-semibold text-slate-900">My Team</div>
          <div className="mt-2 flex gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                refetch({
                  userId: user?.id ?? 0,
                  first,
                  after: null,
                  search: search || null
                }).catch(() => {});
              }}
              className="flex-1 rounded-md border px-3 py-2 text-sm"
              placeholder="Search..."
            />
            <button
              type="button"
              onClick={() =>
                refetch({
                  userId: user?.id ?? 0,
                  first,
                  after: null,
                  search: search || null
                }).catch(() => {})
              }
              className="rounded-md border bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Go
            </button>
          </div>
        </div>

        <div className="divide-y">
          {loading ? (
            <div className="p-4 text-sm text-slate-500">Loading...</div>
          ) : null}
          {error ? (
            <div className="p-4 text-sm text-rose-600">{String(error.message)}</div>
          ) : null}
          {edges.map((e: any) => {
            const t: Thread = e.node;
            const other =
              user?.id && t.receiver?.id === user.id ? t.sender : t.receiver;
            const selected = selectedThread?.id === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedThread(t)}
                className={[
                  "w-full text-left p-4 hover:bg-slate-50",
                  selected ? "bg-slate-50" : ""
                ].join(" ")}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full overflow-hidden border bg-slate-100">
                    {other?.avatar ? (
                      <img
                        src={String(other.avatar)}
                        className="h-full w-full object-cover"
                        alt=""
                        onError={(img) => {
                          (img.currentTarget as HTMLImageElement).style.display =
                            "none";
                        }}
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-slate-900 truncate">
                      {String(other?.name ?? "User")}
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                      {String(t.lastMessage ?? "")}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
          {!loading && edges.length === 0 ? (
            <div className="p-4 text-sm text-slate-500">No threads.</div>
          ) : null}
        </div>

        <div className="border-t bg-white p-3 flex justify-end">
          <button
            type="button"
            onClick={loadMore}
            disabled={!pageInfo?.endCursor}
            className="rounded-md border bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            Next
          </button>
        </div>
      </div>

      <div className="hidden lg:block flex-1">
        {selectedThread ? (
          <ChatBody thread={selectedThread} />
        ) : (
          <div className="rounded-md border bg-white p-6 text-sm text-slate-500">
            Select a thread to start chatting.
          </div>
        )}
      </div>
    </div>
  );
}
