import { defineStore } from "pinia";
import SecureLS from "secure-ls";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useNotificationsStore } from "./notifications";
import { FILE_FILES, FILE_FILE_PREVIEW } from "@/gql/file";
const ls = new SecureLS({
  encryptionNamespace: "site-admin",
});
export const useFileStore = defineStore(
  "file_" + import.meta.env.VITE_VERSION,
  {
    state: () => ({
      fileId: null,
      file: null,
      files: [],
    }),
    getters: {},
    actions: {
      async setFileId(fileId) {
        this.fileId = fileId;
      },
      async getFile(id) {
        const { onResult, loading, error } = useQuery(FILE_FILE_PREVIEW, {
          id: id,
        });
        onResult((queryResult) => {
          this.file = queryResult.data.siteFile;
        });
      },
      async getFiles(siteId) {
        const { onResult, loading, error } = useQuery(FILE_FILES, {
          siteId: siteId,
          first: 2048,
        });
        onResult((queryResult) => {
          this.files = queryResult.data.siteFiles;
        });
      },
    },
    persist: {
      storage: {
        getItem: (key) => ls.get(key),
        setItem: (key, value) => ls.set(key, value),
        removeItem: (key) => ls.remove(key),
      },
    },
  }
);
