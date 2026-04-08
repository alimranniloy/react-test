import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { useToastStore } from "@/siteAdmin/store/useToastStore";

export default function Inactive() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const addToast = useToastStore((s) => s.addToast);

  const handleLogout = async () => {
    await logout();
    navigate("/login/", { replace: true });
  };

  const handleRefresh = () => {
    addToast({
      kind: "success",
      title: "Permission info",
      subTitle: "Refreshed."
    });
    window.location.reload();
  };

  return (
    <main className="mx-auto my-auto px-4 pb-16 pt-0 py-5">
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium leading-6 text-slate-900">
            Need proper permissions
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            You don't have permission to access this page.
          </p>
        </div>
        <div className="pt-5">
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md border border-slate-300 bg-white py-2 px-4 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            >
              Log out
            </button>
            <button
              type="button"
              onClick={handleRefresh}
              className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

