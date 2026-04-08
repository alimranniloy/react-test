import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

export default function Logout() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    (async () => {
      await logout();
      navigate("/login/", { replace: true });
    })();
  }, [logout, navigate]);

  return (
    <div className="rounded-lg border bg-white p-6">
      <h2 className="text-lg font-semibold">Logging out...</h2>
      <p className="text-sm text-slate-500 mt-2">Please wait.</p>
    </div>
  );
}

