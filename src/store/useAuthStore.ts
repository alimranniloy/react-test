import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apolloClient, onLogin, onLogout } from "@/graphql/apolloClient";
import { ME, USER_CHECK } from "@/graphql/queries/me";
import { LOGIN, LOGIN_BY_OTP } from "@/graphql/mutations/me";
import { createSecurePersist } from "@/store/persist";

export type User = {
  id: number;
  name: string;
  email?: string | null;
  phone?: number | null;
  country?: number | null;
  currency?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  isStaff?: boolean | null;
  isSuperuser?: boolean | null;
  isActive?: boolean | null;
};

type AuthState = {
  token: string | null;
  user: User | null;
  auth: boolean;
  loading: boolean;
  message: string | null;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  setAuth: (auth: boolean) => void;
  setMessage: (message: string | null) => void;
  checkUser: (data: string, parentId?: number | null) => Promise<User | null>;
  loginWithPassword: (userId: number, password: string, parentId?: number | null) => Promise<boolean>;
  loginWithOtp: (userId: number, otp: number) => Promise<boolean>;
  fetchMe: () => Promise<User | null>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      auth: false,
      loading: false,
      message: null,
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
      setAuth: (auth) => set({ auth }),
      setMessage: (message) => set({ message }),
      checkUser: async (data, parentId) => {
        set({ loading: true, message: null });
        try {
          const result = await apolloClient.query({
            query: USER_CHECK,
            variables: { data, parentId: parentId ?? null },
            fetchPolicy: "network-only"
          });
          const user = result.data?.userCheck ?? null;
          set({ loading: false });
          return user;
        } catch (error) {
          set({ loading: false, message: (error as Error).message });
          return null;
        }
      },
      loginWithPassword: async (userId, password, parentId) => {
        set({ loading: true, message: null });
        try {
          const result = await apolloClient.mutate({
            mutation: LOGIN,
            variables: { id: userId, password, parentId: parentId ?? null }
          });
          const token = result.data?.login?.token ?? null;
          if (!token) {
            set({ loading: false, message: result.data?.login?.message ?? "Invalid credentials" });
            return false;
          }
          await onLogin(token);
          set({ token, auth: true });
          await apolloClient.resetStore();
          const meResult = await apolloClient.query({
            query: ME,
            fetchPolicy: "network-only"
          });
          set({ user: meResult.data?.me ?? null, loading: false });
          return true;
        } catch (error) {
          set({ loading: false, message: (error as Error).message });
          return false;
        }
      },
      loginWithOtp: async (userId, otp) => {
        set({ loading: true, message: null });
        try {
          const result = await apolloClient.mutate({
            mutation: LOGIN_BY_OTP,
            variables: { id: userId, otp }
          });
          const token = result.data?.loginByOtp ?? null;
          if (!token) {
            set({ loading: false, message: "Invalid OTP" });
            return false;
          }
          await onLogin(token);
          set({ token, auth: true });
          await apolloClient.resetStore();
          const meResult = await apolloClient.query({
            query: ME,
            fetchPolicy: "network-only"
          });
          set({ user: meResult.data?.me ?? null, loading: false });
          return true;
        } catch (error) {
          set({ loading: false, message: (error as Error).message });
          return false;
        }
      },
      fetchMe: async () => {
        set({ loading: true });
        try {
          const result = await apolloClient.query({
            query: ME,
            fetchPolicy: "network-only"
          });
          const me = result.data?.me ?? null;
          set({ user: me, loading: false, auth: !!me });
          return me;
        } catch (error) {
          set({ loading: false, message: (error as Error).message });
          return null;
        }
      },
      logout: async () => {
        await onLogout();
        set({ token: null, user: null, auth: false, message: null });
      }
    }),
    createSecurePersist<AuthState>("site-admin-react-auth", (state) => ({
      token: state.token,
      user: state.user,
      auth: state.auth
    }))
  )
);
