import { useNotificationsStore, type NotificationItem } from "@/stores/notifications";

const typeStyles: Record<NotificationItem["type"], string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  error: "border-rose-200 bg-rose-50 text-rose-900",
  info: "border-blue-200 bg-blue-50 text-blue-900",
  warning: "border-amber-200 bg-amber-50 text-amber-900"
};

export default function NotificationStack() {
  const notifications = useNotificationsStore((state) => state.notifications);
  const removeNotification = useNotificationsStore((state) => state.removeNotification);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed right-6 top-6 z-[100] space-y-4">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`w-[360px] rounded-lg border px-6 py-4 shadow-lg ${typeStyles[notification.type]}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-base font-semibold">{notification.title}</div>
              {notification.subTitle ? (
                <div className="mt-1 text-sm text-slate-600">{notification.subTitle}</div>
              ) : null}
            </div>
            <button
              type="button"
              className="text-sm text-slate-500 hover:text-slate-800"
              onClick={() => removeNotification(notification.id)}
            >
              Close
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
