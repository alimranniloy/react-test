import SecureLS from "secure-ls";

const storageKey = "site-admin-react";

const ls = new SecureLS({
  encryptionNamespace: storageKey,
  isCompression: true
});

export const secureStorage = {
  getItem: (key: string) => {
    try {
      return ls.get(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: unknown) => {
    ls.set(key, value);
  },
  removeItem: (key: string) => {
    ls.remove(key);
  }
};
