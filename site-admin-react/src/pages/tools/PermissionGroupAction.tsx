import AppTable from "@/components/AppTable";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { SITE_PERMISSION, SITE_PERMISSIONS } from "@/graphql/queries/tools";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  SELF_SITE_PERMISSION_CREATE,
  SELF_SITE_PERMISSION_DELETE,
  SELF_SITE_PERMISSION_UPDATE
} from "@/graphql/mutations/permissions";
import { useAuthStore } from "@/store/useAuthStore";
import { useSiteStore } from "@/store/useSiteStore";

type PermissionItem = {
  code: string;
  id: number;
  isActive: boolean;
  title: string;
  parent: string;
};

type PermissionGroupActionProps = {
  id?: number | null;
  onClose?: () => void;
  onSaved?: () => void;
};

const basePermissions: PermissionItem[] = [
  { code: "createProduct", id: 1, isActive: false, title: "Product", parent: "Product" },
  { code: "updateProduct", id: 2, isActive: false, title: "Product", parent: "Product" },
  { code: "deleteProduct", id: 3, isActive: false, title: "Product", parent: "Product" },
  { code: "createCategory", id: 1, isActive: false, title: "Category", parent: "Product" },
  { code: "updateCategory", id: 2, isActive: false, title: "Category", parent: "Product" },
  { code: "deleteCategory", id: 3, isActive: false, title: "Category", parent: "Product" },
  { code: "createSubCategory", id: 1, isActive: false, title: "Sub category", parent: "Product" },
  { code: "updateSubCategory", id: 2, isActive: false, title: "Sub category", parent: "Product" },
  { code: "deletSubCategory", id: 3, isActive: false, title: "Sub category", parent: "Product" },
  { code: "createSubSubCategory", id: 1, isActive: false, title: "Sub Sub category", parent: "Product" },
  { code: "updateSubSubCategory", id: 2, isActive: false, title: "Sub Sub category", parent: "Product" },
  { code: "deleteSubSubCategory", id: 3, isActive: false, title: "Sub Sub category", parent: "Product" },
  { code: "createTag", id: 1, isActive: false, title: "Tag", parent: "Product" },
  { code: "updateTag", id: 2, isActive: false, title: "Tag", parent: "Product" },
  { code: "deleteTag", id: 3, isActive: false, title: "Tag", parent: "Product" },
  { code: "createBrand", id: 1, isActive: false, title: "Brand", parent: "Product" },
  { code: "updateBrand", id: 2, isActive: false, title: "Brand", parent: "Product" },
  { code: "deleteBrand", id: 3, isActive: false, title: "Brand", parent: "Product" },
  { code: "createAuthor", id: 1, isActive: false, title: "Author", parent: "Product" },
  { code: "updateAuthor", id: 2, isActive: false, title: "Author", parent: "Product" },
  { code: "deleteAuthor", id: 3, isActive: false, title: "Author", parent: "Product" },
  { code: "createProductPurchase", id: 1, isActive: false, title: "Purchase", parent: "Product" },
  { code: "updateProductPurchase", id: 2, isActive: false, title: "Purchase", parent: "Product" },
  { code: "deleteProductPurchase", id: 3, isActive: false, title: "Purchase", parent: "Product" },
  { code: "createProductPrice", id: 1, isActive: false, title: "Price", parent: "Product" },
  { code: "updateProductPrice", id: 2, isActive: false, title: "Price", parent: "Product" },
  { code: "deleteProductPrice", id: 3, isActive: false, title: "Price", parent: "Product" },
  { code: "createProductExcel", id: 1, isActive: false, title: "Excel", parent: "Product" },
  { code: "updateProductExcel", id: 2, isActive: false, title: "Excel", parent: "Product" },
  { code: "deleteProductExcel", id: 3, isActive: false, title: "Excel", parent: "Product" },
  { code: "createOrder", id: 1, isActive: false, title: "Order", parent: "Order" },
  { code: "updateOrder", id: 2, isActive: false, title: "Order", parent: "Order" },
  { code: "deleteOrder", id: 3, isActive: false, title: "Order", parent: "Order" },
  { code: "createCustomer", id: 1, isActive: false, title: "Customer", parent: "Customer" },
  { code: "updateCustomer", id: 2, isActive: false, title: "Customer", parent: "Customer" },
  { code: "deleteCustomer", id: 3, isActive: false, title: "Customer", parent: "Customer" },
  { code: "createPayment", id: 1, isActive: false, title: "Payment", parent: "Payment" },
  { code: "updatePayment", id: 2, isActive: false, title: "Payment", parent: "Payment" },
  { code: "deletePayment", id: 3, isActive: false, title: "Payment", parent: "Payment" },
  { code: "createReport", id: 1, isActive: false, title: "Report", parent: "Report" },
  { code: "updateReport", id: 2, isActive: false, title: "Report", parent: "Report" },
  { code: "deleteReport", id: 3, isActive: false, title: "Report", parent: "Report" },
  { code: "createUser", id: 1, isActive: false, title: "User", parent: "User" },
  { code: "updateUser", id: 2, isActive: false, title: "User", parent: "User" },
  { code: "deleteUser", id: 3, isActive: false, title: "User", parent: "User" },
  { code: "createReseller", id: 1, isActive: false, title: "Reseller", parent: "Reseller" },
  { code: "updateReseller", id: 2, isActive: false, title: "Reseller", parent: "Reseller" },
  { code: "deleteReseller", id: 3, isActive: false, title: "Reseller", parent: "Reseller" },
  { code: "createMarketing", id: 1, isActive: false, title: "Marketing", parent: "Marketing" },
  { code: "updateMarketing", id: 2, isActive: false, title: "Marketing", parent: "Marketing" },
  { code: "deleteMarketing", id: 3, isActive: false, title: "Marketing", parent: "Marketing" },
  { code: "createConnection", id: 1, isActive: false, title: "Connection", parent: "Connection" },
  { code: "updateConnection", id: 2, isActive: false, title: "Connection", parent: "Connection" },
  { code: "deleteConnection", id: 3, isActive: false, title: "Connection", parent: "Connection" },
  { code: "createGateway", id: 1, isActive: false, title: "Payment Gateway", parent: "Tool" },
  { code: "updateGateway", id: 2, isActive: false, title: "Payment Gateway", parent: "Tool" },
  { code: "deleteGateway", id: 3, isActive: false, title: "Payment Gateway", parent: "Tool" },
  { code: "createLogistics", id: 1, isActive: false, title: "Logistics", parent: "Tool" },
  { code: "updateLogistics", id: 2, isActive: false, title: "Logistics", parent: "Tool" },
  { code: "deleteLogistics", id: 3, isActive: false, title: "Logistics", parent: "Tool" },
  { code: "createPage", id: 1, isActive: false, title: "Page", parent: "Tool" },
  { code: "updatePage", id: 2, isActive: false, title: "Page", parent: "Tool" },
  { code: "deletePage", id: 3, isActive: false, title: "Page", parent: "Tool" },
  { code: "createPermissionGroup", id: 1, isActive: false, title: "Permission Group", parent: "Tool" },
  { code: "updatePermissionGroup", id: 2, isActive: false, title: "Permission Group", parent: "Tool" },
  { code: "deletePermissionGroup", id: 3, isActive: false, title: "Permission Group", parent: "Tool" },
  { code: "createFile", id: 1, isActive: false, title: "File", parent: "Tool" },
  { code: "updateFile", id: 2, isActive: false, title: "File", parent: "Tool" },
  { code: "deleteFile", id: 3, isActive: false, title: "File", parent: "Tool" },
  { code: "createIntegration", id: 1, isActive: false, title: "Integration", parent: "Tool" },
  { code: "updateIntegration", id: 2, isActive: false, title: "Integration", parent: "Tool" },
  { code: "deleteIntegration", id: 3, isActive: false, title: "Integration", parent: "Tool" }
];

const groupBy = (items: PermissionItem[], key: keyof PermissionItem) => {
  return items.reduce<Record<string, PermissionItem[]>>((acc, item) => {
    const groupKey = String(item[key]);
    if (!acc[groupKey]) acc[groupKey] = [];
    acc[groupKey].push(item);
    return acc;
  }, {});
};

export default function PermissionGroupAction({ id, onClose, onSaved }: PermissionGroupActionProps) {
  const site = useSiteStore((state) => state.site);
  const user = useAuthStore((state) => state.user);
  const siteId = site?.id ?? null;
  const [title, setTitle] = useState("");
  const [permissions, setPermissions] = useState<PermissionItem[]>(basePermissions);
  const [errors, setErrors] = useState<{ title?: string }>({});

  const { data } = useQuery(SITE_PERMISSION, {
    variables: { siteId: siteId ?? 0, id: id ?? 0 },
    skip: !siteId || !id
  });

  const [createPermission, { loading: creating }] = useMutation(SELF_SITE_PERMISSION_CREATE, {
    refetchQueries: siteId ? [{ query: SITE_PERMISSIONS, variables: { siteId } }] : []
  });
  const [updatePermission, { loading: updating }] = useMutation(SELF_SITE_PERMISSION_UPDATE);
  const [deletePermission, { loading: deleting }] = useMutation(SELF_SITE_PERMISSION_DELETE, {
    refetchQueries: siteId ? [{ query: SITE_PERMISSIONS, variables: { siteId } }] : []
  });

  useEffect(() => {
    if (!data?.sitePermission) return;
    const permissionGroup = data.sitePermission;
    setTitle(permissionGroup.title ?? "");
    if (Array.isArray(permissionGroup.permission)) {
      setPermissions((prev) =>
        prev.map((item) => {
          const found = permissionGroup.permission.find((p: any) => p.code === item.code);
          return found ? { ...item, isActive: found.isActive } : item;
        })
      );
    }
  }, [data]);

  const validate = () => {
    if (!title || title.trim().length < 3) {
      setErrors({ title: "Title must be at least 3 characters long" });
      return false;
    }
    setErrors({});
    return true;
  };

  const togglePermission = (code: string) => {
    setPermissions((prev) => prev.map((item) => (item.code === code ? { ...item, isActive: !item.isActive } : item)));
  };

  const handleCreate = async () => {
    if (!user?.id || !siteId) return;
    if (!validate()) return;
    await createPermission({
      variables: {
        userId: user.id,
        siteId,
        isActive: true,
        permission: permissions,
        title
      }
    });
    onSaved?.();
  };

  const handleUpdate = async () => {
    if (!user?.id || !siteId || !id) return;
    if (!validate()) return;
    await updatePermission({
      variables: {
        userId: user.id,
        siteId,
        permissionId: id,
        permission: permissions,
        title
      }
    });
    onSaved?.();
  };

  const handleDelete = async () => {
    if (!user?.id || !id) return;
    if (!window.confirm("Are you sure you want to delete your permission group?")) return;
    await deletePermission({ variables: { userId: user.id, permissionId: id } });
    onSaved?.();
  };

  const groupedByParent = groupBy(
    permissions.slice().sort((a, b) => a.parent.localeCompare(b.parent)),
    "parent"
  );

  return (
    <div className="max-w-screen-xl mx-auto px-0">
      <div className="py-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-700">
            {id ? `Permission group - ${title || ""}` : "Create your permission group"}
          </h2>
          {id && onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Close
            </button>
          ) : null}
        </div>

        <div className="relative rounded-md border border-gray-300 px-3 py-3">
          <label className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">
            Permission Group title
          </label>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            type="text"
            className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
            placeholder="Enter the permission group title"
          />
        </div>
        {errors.title ? <p className="mt-1 text-sm text-red-600">{errors.title}</p> : null}
      </div>

      {Object.entries(groupedByParent).map(([parentName, parentItems]) => {
        const groupedByTitle = groupBy(
          parentItems.slice().sort((a, b) => a.title.localeCompare(b.title)),
          "title"
        );
        return (
          <div key={parentName} className="mb-4 flex flex-col">
            <div className="table-source-wrap">
              <AppTable className="data-table min-w-full divide-y divide-gray-300">
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 w-100">
                      {parentName}
                    </TableHead>
                    <TableHead scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 w-20">
                      Create
                    </TableHead>
                    <TableHead scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 w-20">
                      Update
                    </TableHead>
                    <TableHead scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 w-20">
                      Delete
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-200 bg-white">
                  {Object.entries(groupedByTitle).map(([titleName, groupItems]) => (
                    <TableRow key={titleName} className="cursor-pointer active:cursor-wait">
                      <TableCell className="whitespace-nowrap px-2 py-1 text-sm text-gray-500">
                        <span className="inline-flex px-2 text-md font-semibold leading-4">{titleName}</span>
                      </TableCell>
                      {groupItems
                        .slice()
                        .sort((a, b) => a.id - b.id)
                        .map((item) => (
                          <TableCell key={item.code} className="whitespace-nowrap px-2 py-1 text-sm text-gray-500 text-right">
                            <button
                              type="button"
                              onClick={() => togglePermission(item.code)}
                              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                                item.isActive ? "bg-purple-600" : "bg-gray-200"
                              }`}
                            >
                              <span
                                aria-hidden="true"
                                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                  item.isActive ? "translate-x-5" : "translate-x-0"
                                }`}
                              />
                            </button>
                          </TableCell>
                        ))}
                    </TableRow>
                  ))}
                </TableBody>
              </AppTable>
            </div>
          </div>
        );
      })}

      <div className="flex justify-end gap-4 pt-5 pb-8">
        <button
          type="button"
          onClick={() => onClose?.()}
          className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          Cancel
        </button>
        {id ? (
          <div className="space-x-4">
            <button
              type="button"
              onClick={handleUpdate}
              disabled={updating}
              className="rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
            >
              Update
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleCreate}
            disabled={creating}
            className="rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
          >
            Create
          </button>
        )}
      </div>
    </div>
  );
}
