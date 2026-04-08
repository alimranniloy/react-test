import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useSubscription } from "@apollo/client";
import dayjs from "dayjs";
import { CHAT_MESSAGES } from "@/graphql/queries/chat";
import { CHAT_MESSAGE_CREATE, CHAT_TYPING_CREATE } from "@/graphql/mutations/chat";
import { CHAT_MESSAGE_SUBSCRIPTION, CHAT_TYPING_SUBSCRIPTION } from "@/graphql/subscriptions/chat";
import { useAuthStore } from "@/store/useAuthStore";
import { useToastStore } from "@/siteAdmin/store/useToastStore";

type ThreadUser = { id: number; name?: string | null; avatar?: string | null };

export type Thread = {
  id: number;
  lastMessage?: string | null;
  updatedAt?: string | null;
  isSeenByReceiver?: boolean | null;
  isSeenBySender?: boolean | null;
  receiver: ThreadUser;
  sender: ThreadUser;
};

export default function ChatBody({ thread }: { thread: Thread }) {
  const user = useAuthStore((s) => s.user);
  const addToast = useToastStore((s) => s.addToast);
  const channel =
    typeof window === "undefined"
      ? String(thread.id)
      : window.btoa(String(thread.id));
  const typingChannel =
    typeof window === "undefined"
      ? `${thread.id}_typing`
      : window.btoa(`${thread.id}_typing`);

  const [first] = useState(50);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeout = useRef<number | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  const { data, loading, error, refetch } = useQuery(CHAT_MESSAGES, {
    variables: { threadId: thread.id, first, after: null },
    fetchPolicy: "network-only"
  });

  const edges: any[] = data?.chatMessages?.edges ?? [];

  const [createMessage, createState] = useMutation(CHAT_MESSAGE_CREATE, {
    onError: (err) =>
      addToast({ kind: "error", title: "Chat", subTitle: err.message })
  });

  const [typingCreate] = useMutation(CHAT_TYPING_CREATE, {
    onError: () => {}
  });

  // New messages via subscription.
  useSubscription(CHAT_MESSAGE_SUBSCRIPTION, {
    variables: { channel },
    skip: !channel,
    onData: () => {
      refetch().catch(() => {});
    }
  });

  // Typing indicator (best effort).
  useSubscription(CHAT_TYPING_SUBSCRIPTION, {
    variables: { channel: typingChannel },
    skip: !typingChannel,
    onData: ({ data: sub }) => {
      const uid = sub.data?.chatTyping?.userId;
      if (!uid || uid === user?.id) return;
      setIsTyping(true);
      if (typingTimeout.current) window.clearTimeout(typingTimeout.current);
      typingTimeout.current = window.setTimeout(() => setIsTyping(false), 1500);
    }
  });

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [edges.length, thread.id]);

  const otherUser = useMemo(() => {
    if (!user?.id) return null;
    return thread.receiver.id === user.id ? thread.sender : thread.receiver;
  }, [thread.receiver, thread.sender, user?.id]);

  const onType = async () => {
    if (!user?.id) return;
    if (!typingChannel) return;
    try {
      await typingCreate({ variables: { channel: typingChannel, userId: user.id } });
    } catch {}
  };

  const handleSend = async () => {
    if (!user?.id) return;
    if (!message.trim()) return;
    await createMessage({
      variables: {
        userId: user.id,
        channel,
        message: message.trim(),
        threadId: thread.id,
        image: null
      }
    });
    setMessage("");
    await refetch().catch(() => {});
  };

  return (
    <div className="flex-1 rounded-md border bg-white overflow-hidden">
      <div className="flex h-14 items-center justify-between px-4 border-b bg-slate-50">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-900 truncate">
            {otherUser?.name || "Thread"}
          </div>
          <div className="text-xs text-slate-500">#{thread.id}</div>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-md border bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Refresh
        </button>
      </div>

      <div className="h-[calc(100vh-290px)] overflow-y-auto p-4 space-y-3 bg-white">
        {loading ? (
          <div className="text-sm text-slate-500">Loading...</div>
        ) : null}
        {error ? (
          <div className="text-sm text-rose-600">{String(error.message)}</div>
        ) : null}

        {edges.map((e: any) => {
          const m = e.node;
          const mine = m.user?.id === user?.id;
          return (
            <div
              key={m.id}
              className={[
                "flex gap-2",
                mine ? "justify-end" : "justify-start"
              ].join(" ")}
            >
              <div className="max-w-[70%]">
                <div
                  className={[
                    "rounded-2xl px-3 py-2 text-sm",
                    mine
                      ? "bg-indigo-600 text-white rounded-tr-sm"
                      : "bg-slate-100 text-slate-900 rounded-tl-sm"
                  ].join(" ")}
                >
                  {String(m.message ?? "")}
                </div>
                <div
                  className={[
                    "mt-1 text-[11px] text-slate-400",
                    mine ? "text-right" : "text-left"
                  ].join(" ")}
                >
                  {m.createdAt ? dayjs(m.createdAt).format("h:mm A") : ""}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      <div className="border-t px-4 py-3 bg-slate-50">
        {isTyping ? (
          <div className="mb-2 text-xs text-slate-500">Typing...</div>
        ) : null}
        <div className="flex items-center gap-2">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            onInput={onType}
            placeholder="Write a message..."
            className="flex-1 rounded-full border px-4 py-2 text-sm"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={createState.loading}
            className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
