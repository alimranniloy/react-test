import { useEffect } from "react";
import { useToastStore } from "@/siteAdmin/store/useToastStore";

export default function ToastStack() {
  const toasts = useToastStore((s) => s.toasts);
  const removeToast = useToastStore((s) => s.removeToast);

  useEffect(() => {
    if (!toasts.length) return;
    const timers = toasts.map((t) =>
      window.setTimeout(() => removeToast(t.id), 3500)
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [removeToast, toasts]);

  if (!toasts.length) return null;

  return (
    <div className="fixed right-4 top-4 z-50 space-y-2">
      {toasts.map((toast) => {
        const tone =
          toast.kind === "success"
            ? "border-emerald-200 bg-emerald-50 text-emerald-950"
            : toast.kind === "error"
            ? "border-rose-200 bg-rose-50 text-rose-950"
            : "border-slate-200 bg-white text-slate-950";
        return (
          <div
            key={toast.id}
            className={[
              "w-[360px] max-w-[calc(100vw-2rem)] rounded-lg border p-3 shadow-sm",
              tone
            ].join(" ")}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-semibold">{toast.title}</div>
                {toast.subTitle ? (
                  <div className="mt-1 text-xs opacity-80">{toast.subTitle}</div>
                ) : null}
              </div>
              <button
                type="button"
                className="text-xs opacity-70 hover:opacity-100"
                onClick={() => removeToast(toast.id)}
              >
                Close
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

