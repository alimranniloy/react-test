import { create } from "zustand";

export type NotificationType = "success" | "error" | "info" | "warning";

export type NotificationItem = {
  id: string;
  title: string;
  subTitle?: string;
  type: NotificationType;
  createdAt: number;
};

type NotificationPayload = {
  title: string;
  subTitle?: string;
};

type NotificationState = {
  notifications: NotificationItem[];
  addNotification: (payload: NotificationPayload, type?: NotificationType) => void;
  removeNotification: (id: string) => void;
};

export const useNotificationsStore = create<NotificationState>((set, get) => ({
  notifications: [],
  addNotification: (payload, type = "info") => {
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const item: NotificationItem = {
      id,
      title: payload.title,
      subTitle: payload.subTitle,
      type,
      createdAt: Date.now()
    };
    set((state) => ({ notifications: [...state.notifications, item] }));
    setTimeout(() => {
      get().removeNotification(id);
    }, 4000);
  },
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((item) => item.id !== id)
    }))
}));
