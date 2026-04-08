import { createJSONStorage } from "zustand/middleware";
import { secureStorage } from "@/store/secureStorage";

export const STORAGE_VERSION = 1;

export const createSecurePersist = <T>(
  name: string,
  partialize?: (state: T) => Partial<T>
) => ({
  name,
  storage: createJSONStorage(() => secureStorage),
  version: STORAGE_VERSION,
  partialize: (state: T) => (partialize ? partialize(state) : state)
});
