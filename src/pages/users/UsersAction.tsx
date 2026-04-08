import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { USERS } from "@/graphql/queries/user";
import { SELF_USER_UPDATE_BY_SOURCE } from "@/graphql/mutations/user";
import { useAuthStore } from "@/store/useAuthStore";

export default function UsersAction() {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const [password, setPassword] = useState("");

  const params = new URLSearchParams(location.search);
  const id = Number(params.get("id") ?? 0);

  const variables = useMemo(
    () => ({
      search: id > 0 ? String(id) : null,
      after: null
    }),
    [id]
  );

  const { data, loading, refetch } = useQuery(USERS, {
    variables,
    skip: id <= 0
  });

  const targetUser = (data?.users?.edges?.map((edge: any) => edge.node) ?? []).find((item: any) => item.id === id) ?? null;

  const [isActive, setIsActive] = useState<boolean | null>(null);
  const [updateUser, { loading: saving }] = useMutation(SELF_USER_UPDATE_BY_SOURCE);

  const effectiveIsActive = isActive ?? Boolean(targetUser?.isActive);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!user?.id || id <= 0) return;
    await updateUser({
      variables: {
        userId: user.id,
        id,
        isActive: effectiveIsActive,
        password: password.trim() ? password : null
      }
    });
    setPassword("");
    await refetch();
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h1 className="text-xl font-semibold text-gray-900">User Action</h1>
        <p className="mt-2 text-sm text-gray-700">Update account status and optionally reset the password.</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-xs text-slate-500">
            User ID
            <input
              value={id > 0 ? String(id) : ""}
              readOnly
              className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none"
            />
          </label>
          <label className="flex flex-col gap-2 text-xs text-slate-500">
            Name
            <input
              value={targetUser?.name ?? (loading ? "Loading..." : "Unknown user")}
              readOnly
              className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none"
            />
          </label>
          <label className="flex flex-col gap-2 text-xs text-slate-500 md:col-span-2">
            New Password (optional)
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Leave empty to keep current password"
              className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none"
            />
          </label>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
          <input
            id="user-active"
            type="checkbox"
            checked={effectiveIsActive}
            onChange={(event) => setIsActive(event.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600"
          />
          <label htmlFor="user-active" className="text-sm text-slate-700">
            Active account
          </label>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={saving || id <= 0}
            className="rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
          >
            Save
          </button>
          <Link to="/users/" className="rounded-full bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-600">
            Back
          </Link>
        </div>
      </form>
    </div>
  );
}
