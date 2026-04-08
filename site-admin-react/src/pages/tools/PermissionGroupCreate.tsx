import { useNavigate } from "react-router-dom";
import PermissionGroupAction from "@/pages/tools/PermissionGroupAction";

export default function PermissionGroupCreate() {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <PermissionGroupAction onClose={() => navigate("/tool/permission-group/")} onSaved={() => navigate("/tool/permission-group/")} />
    </div>
  );
}
