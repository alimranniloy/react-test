import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { STORE_GATEWAY } from "@/graphql/queries/tools";
import { PAY_PAYMENT_PROVIDERS } from "@/graphql/queries/pay";
import {
  SELF_STORE_GATEWAY_CREATE,
  SELF_STORE_GATEWAY_UPDATE,
  SELF_STORE_GATEWAY_DELETE
} from "@/graphql/mutations/tools";
import { SELF_SITE_UPDATE } from "@/graphql/queries/site";
import { useAuthStore } from "@/store/useAuthStore";
import { useSiteStore } from "@/store/useSiteStore";

const gatewayTypes = [
  { id: 1, title: "Cash on Delivery" },
  { id: 4, title: "Automatic" }
];

const paymentTypes = [
  { id: 1, title: "Full Payment", code: "full" },
  { id: 2, title: "Partial", code: "partial" },
  { id: 3, title: "Only delivery charge", code: "delivery" }
];

type CredentialItem = {
  id?: number;
  label: string;
  sensitive?: boolean;
  value: string;
};

type GatewayActionProps = {
  id?: number | null;
  onClose: () => void;
  onSaved: () => void;
};

export default function GatewayAction({ id, onClose, onSaved }: GatewayActionProps) {
  const site = useSiteStore((state) => state.site);
  const user = useAuthStore((state) => state.user);
  const siteId = site?.id ?? null;

  const [title, setTitle] = useState("");
  const [fee, setFee] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [priority, setPriority] = useState(0);
  const [gatewayType, setGatewayType] = useState(1);
  const [paymentProviderId, setPaymentProviderId] = useState<number | null>(null);
  const [credentials, setCredentials] = useState<CredentialItem[]>([]);
  const [paymentType, setPaymentType] = useState(paymentTypes[0]);
  const [note, setNote] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isDiscount, setIsDiscount] = useState(false);
  const [isFreeLogistics, setIsFreeLogistics] = useState(false);
  const [isManual, setIsManual] = useState(false);
  const [isSandbox, setIsSandbox] = useState(false);
  const [heighlight, setHeighlight] = useState("");
  const [gatewayCredential, setGatewayCredential] = useState<Record<string, string>>({});

  const { data: providersData } = useQuery(PAY_PAYMENT_PROVIDERS, {
    variables: { first: 15 }
  });
  const paymentProviders = providersData?.payPaymentProviders?.edges?.map((edge: any) => edge.node) ?? [];
  const paymentProvider = paymentProviders.find((provider: any) => provider.id === paymentProviderId) ?? null;

  const { data: gatewayData } = useQuery(STORE_GATEWAY, {
    variables: { siteId: siteId ?? 0, id: id ?? 0 },
    skip: !siteId || !id
  });

  const [createGateway, { loading: creating }] = useMutation(SELF_STORE_GATEWAY_CREATE);
  const [updateGateway, { loading: updating }] = useMutation(SELF_STORE_GATEWAY_UPDATE);
  const [deleteGateway, { loading: deleting }] = useMutation(SELF_STORE_GATEWAY_DELETE);
  const [updateSite] = useMutation(SELF_SITE_UPDATE);

  useEffect(() => {
    if (!gatewayData?.storeGateway) return;
    const gateway = gatewayData.storeGateway;
    setTitle(gateway.title ?? "");
    setFee(gateway.fee ?? 0);
    setDiscount(gateway.discount ?? 0);
    setPriority(gateway.priority ?? 0);
    setGatewayType(gateway.gatewayType ?? 1);
    setHeighlight(gateway.heighlight ?? "");
    setPaymentProviderId(gateway.paymentProviderId ?? null);
    setNote(gateway.note ?? "");
    setIsActive(Boolean(gateway.isActive));
    setIsDiscount(Boolean(gateway.isDiscount));
    setIsFreeLogistics(Boolean(gateway.isFreeLogistics));
    setIsManual(Boolean(gateway.isManual));
    setIsSandbox(Boolean(gateway.isSandbox));
    setGatewayCredential(gateway.credential ?? {});
    const matchedPayment = paymentTypes.find((type) => type.code === gateway.note);
    if (matchedPayment) {
      setPaymentType(matchedPayment);
    }
  }, [gatewayData]);

  useEffect(() => {
    if (!paymentProvider) return;
    const cloned = (paymentProvider.credentials ?? []).map((item: any) => ({
      ...item,
      value: gatewayCredential[item.label] || ""
    }));
    setCredentials(cloned);
  }, [paymentProvider, gatewayCredential]);

  useEffect(() => {
    if (gatewayType === 1) {
      setPaymentProviderId(null);
      setCredentials([]);
      setGatewayCredential({});
    }
  }, [gatewayType]);

  useEffect(() => {
    if (paymentType?.code) {
      setNote(paymentType.code);
    }
  }, [paymentType]);

  const credential = useMemo(() => {
    const parsed: Record<string, string> = {};
    credentials.forEach((item) => {
      parsed[item.label] = item.value ?? "";
    });
    return parsed;
  }, [credentials]);

  const handleCredentialChange = (label: string, value: string) => {
    setCredentials((prev) => prev.map((item) => (item.label === label ? { ...item, value } : item)));
  };

  const handleSubmit = async () => {
    if (!user?.id || !siteId) return;
    if (title.trim().length < 3) return;

    const payload = {
      userId: user.id,
      siteId,
      credential,
      discount,
      fee,
      gatewayType,
      heighlight,
      isActive,
      isDiscount,
      isFreeLogistics,
      isManual: gatewayType === 4 ? false : true,
      isSandbox,
      logo: paymentProvider ? `asset/${paymentProvider.name.toLowerCase()}.png` : "asset/gateway.png",
      note,
      priority,
      title,
      paymentProviderId: gatewayType === 4 ? paymentProviderId : null
    };

    if (id) {
      await updateGateway({ variables: { id, ...payload } });
    } else {
      const response = await createGateway({ variables: payload });
      if (response.data?.selfStoreGatewayCreate && site?.completedStep && !site.completedStep.includes(4)) {
        await updateSite({
          variables: {
            userId: user.id,
            siteId,
            completedStep: [...site.completedStep, 4]
          }
        });
      }
    }

    onSaved();
  };

  const handleDelete = async () => {
    if (!user?.id || !siteId || !id) return;
    if (!window.confirm("Delete this gateway?")) return;
    await deleteGateway({ variables: { userId: user.id, siteId, id } });
    onSaved();
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Gateway{title ? ` - ${title}` : ""}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Close
          </button>
        </div>
        <p className="mt-1 text-sm text-gray-500">Seamless Integration for Effortless Transactions.</p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-2">
          <div className="relative rounded-md border border-gray-300 px-3 py-3">
            <label className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">Title</label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
              placeholder="Cash on Delivery"
            />
          </div>
        </div>
        <div className="sm:col-span-2">
          <div className="relative rounded-md border border-gray-300 px-3 py-3">
            <label className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">Transaction Fee</label>
            <input
              type="number"
              value={fee}
              onChange={(event) => setFee(Number(event.target.value))}
              className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
            />
          </div>
        </div>
        <div className="sm:col-span-2">
          <div className="relative rounded-md border border-gray-300 px-3 py-3">
            <label className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">Discount Amount</label>
            <input
              type="number"
              value={discount}
              onChange={(event) => setDiscount(Number(event.target.value))}
              className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
            />
          </div>
        </div>
        <div className="sm:col-span-1">
          <div className="relative rounded-md border border-gray-300 px-3 py-3">
            <label className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">Priority</label>
            <input
              type="number"
              value={priority}
              onChange={(event) => setPriority(Number(event.target.value))}
              className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
            />
          </div>
        </div>
        <div className="sm:col-span-1">
          <div className="relative rounded-md border border-gray-300 px-3 py-3">
            <label className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">Type</label>
            <select
              value={gatewayType}
              onChange={(event) => setGatewayType(Number(event.target.value))}
              className="block w-full border-0 p-0 text-gray-900 focus:ring-0 sm:text-sm"
            >
              {gatewayTypes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {gatewayType === 4 ? (
          <div className="sm:col-span-3">
            <div className="relative rounded-md border border-gray-300 px-3 py-3">
              <label className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">Provider</label>
              <select
                value={paymentProviderId ?? ""}
                onChange={(event) => setPaymentProviderId(event.target.value ? Number(event.target.value) : null)}
                className="block w-full border-0 p-0 text-gray-900 focus:ring-0 sm:text-sm"
              >
                <option value="">Select Provider</option>
                {paymentProviders.map((provider: any) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : null}

        {paymentProvider && gatewayType === 4 ? (
          <div className="sm:col-span-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">{paymentProvider.name} instruction</h3>
            <p className="mt-1 text-sm text-gray-500">{paymentProvider.instructions}</p>
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              {credentials.map((item) => (
                <div key={item.label} className="sm:col-span-3">
                  <div className="relative rounded-md border border-gray-300 px-3 py-3">
                    <label className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">{item.label}</label>
                    <input
                      type={item.sensitive ? "password" : "text"}
                      value={item.value}
                      onChange={(event) => handleCredentialChange(item.label, event.target.value)}
                      className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
                    />
                  </div>
                </div>
              ))}
              <div className="sm:col-span-3">
                <div className="relative rounded-md border border-gray-300 px-3 py-3">
                  <label className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">Payment Type</label>
                  <select
                    value={paymentType.id}
                    onChange={(event) => {
                      const next = paymentTypes.find((type) => type.id === Number(event.target.value));
                      if (next) setPaymentType(next);
                    }}
                    className="block w-full border-0 p-0 text-gray-900 focus:ring-0 sm:text-sm"
                  >
                    {paymentTypes.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {gatewayType !== 4 ? (
          <div className="sm:col-span-6">
            <div className="relative rounded-md border border-gray-300 px-3 py-3">
              <label className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">Instruction</label>
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={3}
                className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
                placeholder="Enter payment instruction"
              />
              <p className="mt-2 text-sm text-gray-500">Write a few sentences.</p>
            </div>
          </div>
        ) : null}
      </div>

      <div className="pt-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Status</h3>
        <p className="mt-1 text-sm text-gray-500">The details used to determine your category behaviour around the web.</p>
      </div>
      <div className="mt-2">
        <div className="mt-4 space-y-4">
          <div className="relative flex items-start">
            <div className="flex h-5 items-center">
              <input
                id="isActive"
                type="checkbox"
                checked={isActive}
                onChange={(event) => setIsActive(event.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="isActive" className="font-medium text-gray-700">Active</label>
              <p className="text-gray-500">User can switch between active/inactive.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4">
        <div>
          {id ? (
            <button
              type="button"
              onClick={handleDelete}
              className="rounded-md border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
              disabled={deleting}
            >
              Delete
            </button>
          ) : null}
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-60"
          disabled={creating || updating}
        >
          {id ? "Update" : "Create"}
        </button>
      </div>
    </div>
  );
}
