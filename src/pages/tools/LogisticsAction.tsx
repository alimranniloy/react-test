import AppTable from "@/components/AppTable";
import { useEffect, useMemo, useState } from "react";
import { useApolloClient, useMutation, useQuery } from "@apollo/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { LOGISTICS_COMPANIES, LOGISTICS_MERCHANT, SELF_LOGISTICS_MERCHANT } from "@/graphql/queries/tools";
import { SELF_LOGISTICS_MERCHANT_DELETE, SELF_LOGISTICS_MERCHANT_UPDATE } from "@/graphql/mutations/logistics";
import { SELF_SITE_UPDATE } from "@/graphql/queries/site";
import { useAuthStore } from "@/store/useAuthStore";
import { useSiteStore } from "@/store/useSiteStore";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

dayjs.extend(relativeTime);

const chargeBases = [
  { id: 1, title: "Fixed" },
  { id: 2, title: "Location" },
  { id: 3, title: "Weight" },
  { id: 5, title: "Stoppage" },
  { id: 6, title: "Conditions" },
  { id: 7, title: "Area" }
];

type CredentialItem = {
  id?: number;
  label: string;
  sensitive?: boolean;
  value: string;
  index?: number;
};

type ConditionItem = {
  id: number;
  minPurchase: number;
  maxPurchase: number;
  minWeight: number;
  maxWeight: number;
  charge: number;
};

type LogisticsActionProps = {
  id?: number | null;
  companyId?: number | null;
  onClose: (refresh?: boolean) => void;
  onSaved: () => void;
};

export default function LogisticsAction({ id, companyId, onClose, onSaved }: LogisticsActionProps) {
  const client = useApolloClient();
  const site = useSiteStore((state) => state.site);
  const user = useAuthStore((state) => state.user);

  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(companyId ?? null);
  const [logisticsId, setLogisticsId] = useState<number | null>(id ?? null);

  const [title, setTitle] = useState("");
  const [chargeBase, setChargeBase] = useState(1);
  const [chargeMinimum, setChargeMinimum] = useState(0);
  const [chargeMaximum, setChargeMaximum] = useState(0);
  const [chargeMerchantDefined, setChargeMerchantDefined] = useState(0);
  const [chargePerKm, setChargePerKm] = useState(0);
  const [chargePerKg, setChargePerKg] = useState(0);
  const [chargeSameCountry, setChargeSameCountry] = useState(0);
  const [chargeSameCity, setChargeSameCity] = useState(0);
  const [chargeSameSubCity, setChargeSameSubCity] = useState(0);
  const [chargeSameArea, setChargeSameArea] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [credentials, setCredentials] = useState<CredentialItem[]>([]);
  const [chargeConditions, setChargeConditions] = useState<ConditionItem[]>([]);
  const [newCondition, setNewCondition] = useState<ConditionItem>({
    id: 0,
    minPurchase: 0,
    maxPurchase: 0,
    minWeight: 0,
    maxWeight: 0,
    charge: 0
  });

  const [createOrUpdateMerchant, { loading: saving }] = useMutation(SELF_LOGISTICS_MERCHANT_UPDATE);
  const [deleteMerchant, { loading: deleting }] = useMutation(SELF_LOGISTICS_MERCHANT_DELETE);
  const [updateSite] = useMutation(SELF_SITE_UPDATE);

  const { data: companiesData, fetchMore: fetchMoreCompanies } = useQuery(LOGISTICS_COMPANIES, {
    variables: { isActive: true, isThirdParty: null, queryType: "top", after: null },
    skip: Boolean(id)
  });

  const companies = companiesData?.logisticsCompanies?.edges?.map((edge: any) => edge.node) ?? [];

  const { data: merchantData } = useQuery(LOGISTICS_MERCHANT, {
    variables: { companyId: selectedCompanyId ?? 0, id: logisticsId ?? 0 },
    skip: !selectedCompanyId || !logisticsId
  });

  const merchant = merchantData?.logisticsMerchant ?? null;

  const activeCompany = useMemo(() => {
    if (selectedCompanyId) {
      return companies.find((item: any) => item.id === selectedCompanyId) ?? merchant?.company ?? null;
    }
    return merchant?.company ?? null;
  }, [selectedCompanyId, companies, merchant]);

  useEffect(() => {
    if (!activeCompany?.credentials) {
      setCredentials([]);
      return;
    }
    const base = (activeCompany.credentials ?? []).map((item: any) => ({
      ...item,
      value: merchant?.credential?.[item.label] ?? ""
    }));
    setCredentials(base);
  }, [activeCompany, merchant]);

  useEffect(() => {
    if (!merchant) return;
    setTitle(merchant.title ?? "");
    setChargeBase(merchant.chargeBase ?? 1);
    setChargeMinimum(merchant.chargeMinimum ?? 0);
    setChargeMaximum(merchant.chargeMaximum ?? 0);
    setChargeMerchantDefined(merchant.chargeMerchantDefined ?? 0);
    setChargePerKm(merchant.chargePerKm ?? 0);
    setChargePerKg(merchant.chargePerKg ?? 0);
    setChargeSameCountry(merchant.chargeSameCountry ?? 0);
    setChargeSameCity(merchant.chargeSameCity ?? 0);
    setChargeSameSubCity(merchant.chargeSameSubCity ?? 0);
    setChargeSameArea(merchant.chargeSameArea ?? 0);
    setIsActive(Boolean(merchant.isActive));
    setChargeConditions(merchant.chargeConditions ?? []);
  }, [merchant]);

  useEffect(() => {
    if (!selectedCompanyId || id) return;
    const run = async () => {
      if (!user?.id) return;
      const response = await client.query({
        query: SELF_LOGISTICS_MERCHANT,
        variables: { userId: user.id, companyId: selectedCompanyId },
        fetchPolicy: "network-only"
      });
      const found = response.data?.selfLogisticsMerchant;
      if (found?.id) {
        setLogisticsId(found.id);
      }
    };
    run();
  }, [client, selectedCompanyId, user, id]);

  const credentialPayload = useMemo(() => {
    const payload: Record<string, string> = {};
    credentials.forEach((item) => {
      payload[item.label] = item.value ?? "";
    });
    return payload;
  }, [credentials]);

  const handleCredentialChange = (label: string, value: string) => {
    setCredentials((prev) => prev.map((item) => (item.label === label ? { ...item, value } : item)));
  };

  const handleAddCondition = () => {
    if (!newCondition.minPurchase && !newCondition.maxPurchase && !newCondition.charge) return;
    const nextId = newCondition.id || chargeConditions.length + 1;
    const next = { ...newCondition, id: nextId };
    setChargeConditions((prev) => {
      const index = prev.findIndex((item) => item.id === next.id);
      if (index >= 0) {
        const cloned = [...prev];
        cloned[index] = next;
        return cloned;
      }
      return [...prev, next];
    });
    setNewCondition({ id: 0, minPurchase: 0, maxPurchase: 0, minWeight: 0, maxWeight: 0, charge: 0 });
  };

  const handleRemoveCondition = (condition: ConditionItem) => {
    setChargeConditions((prev) => prev.filter((item) => item.id !== condition.id));
  };

  const handleSave = async () => {
    if (!user?.id) return;
    if (!logisticsId) return;
    const payload = {
      userId: user.id,
      id: logisticsId ?? 0,
      chargeBase,
      chargeConditions,
      chargeMaximum,
      chargeMerchantDefined,
      chargeMinimum,
      chargePerKg,
      chargePerKm,
      chargeSameArea,
      chargeSameCity,
      chargeSameCountry,
      chargeSameSubCity,
      credential: credentialPayload,
      isActive,
      logisticsTitle: activeCompany?.title ?? "",
      title
    };

    await createOrUpdateMerchant({ variables: payload });

    if (!id && site?.completedStep && !site.completedStep.includes(5)) {
      await updateSite({
        variables: {
          userId: user.id,
          siteId: site.id,
          completedStep: [...site.completedStep, 5]
        }
      });
    }

    onSaved();
  };

  const handleDelete = async () => {
    if (!user?.id || !logisticsId) return;
    if (!window.confirm("Delete this logistics merchant?")) return;
    await deleteMerchant({ variables: { userId: user.id, id: logisticsId } });
    onSaved();
  };

  const companyList = (
    <div className="table-source-wrap">
      <AppTable className="data-table min-w-full divide-y divide-gray-300">
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead scope="col" className="relative w-6 px-4 sm:w-6 sm:px-4">
              SL
            </TableHead>
            <TableHead scope="col" className="min-w-[6rem] w-full py-3.5 px-3 text-left text-sm font-semibold text-gray-900">
              Title
            </TableHead>
            <TableHead scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Status
            </TableHead>
            <TableHead scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Update
            </TableHead>
            <TableHead scope="col" className="px-4 py-3.5 text-right text-sm font-semibold text-gray-900 sm:pr-6">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-gray-200 bg-white">
          {companies.map((company: any, index: number) => (
            <TableRow key={company.id} className="cursor-pointer active:cursor-wait">
              <TableCell className="whitespace-nowrap bg-yellow-100 text-sm text-gray-500 text-center">{index + 1}</TableCell>
              <TableCell className="whitespace-nowrap py-2 px-3 text-sm">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0">
                    {company.logo ? (
                      <img className="h-10 w-10 rounded-full" src={company.logo} alt="" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-100" />
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="font-medium text-gray-900">{company.title}</div>
                    <div className="truncate max-w-[170px] text-gray-500 text-xs">{company.street}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                <span
                  className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                    company.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {company.isActive ? "Active" : "Inactive"}
                </span>
              </TableCell>
              <TableCell className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                <div className="text-gray-900">{company.updatedAt ? dayjs(company.updatedAt).fromNow() : "—"}</div>
                <div className="text-gray-500 text-xs">@ {company.updatedAt ? dayjs(company.updatedAt).format("h:mm A MMM D") : "—"}</div>
              </TableCell>
              <TableCell className="whitespace-nowrap px-4 py-2 text-sm text-gray-500 text-right sm:pr-4">
                <button
                  type="button"
                  onClick={() => setSelectedCompanyId(company.id)}
                  className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Add
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </AppTable>
      {companies.length === 0 ? (
        <div className="text-center border-t border-gray-200 bg-white px-4 py-4 sm:px-6">
          <div className="sm:block">
            <p className="text-sm text-gray-700">No record :-(</p>
          </div>
        </div>
      ) : null}
      {companiesData?.logisticsCompanies?.pageInfo?.hasNextPage ? (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-4">
          <div className="flex flex-1 justify-between sm:justify-end">
            <button
              type="button"
              onClick={() =>
                fetchMoreCompanies({
                  variables: {
                    isActive: true,
                    isThirdParty: null,
                    queryType: "top",
                    after: companiesData.logisticsCompanies.pageInfo.endCursor
                  }
                })
              }
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {id ? (
        <div className="flex justify-between gap-5 items-center">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Logistics - {title}</h3>
          <button
            type="button"
            onClick={() => onClose(false)}
            className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      ) : (
        <div>
          {activeCompany ? (
            <h3 className="text-lg font-medium leading-6 text-gray-900">Logistics - {activeCompany.title}</h3>
          ) : (
            <div className="flex justify-between gap-5 items-center">
              <div>
                <h2 className="text-lg font-medium leading-6 text-gray-900">All Logistics Company</h2>
                <p className="mt-1 text-sm text-gray-500">To add a logistics company, you need to select a company first.</p>
              </div>
              <button
                type="button"
                onClick={() => onClose(false)}
                className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                Back
              </button>
            </div>
          )}
        </div>
      )}

      {!activeCompany ? companyList : null}

      {activeCompany ? (
        <div>
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <div className="relative rounded-md border border-gray-300 px-3 py-3">
                <label className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">Title</label>
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="block w-full border-0 p-0 text-gray-900 placeholder-gray-400 focus:ring-0 sm:text-sm"
                  placeholder="Enter the title"
                />
              </div>
            </div>
            <div className="sm:col-span-3">
              <div className="relative rounded-md border border-gray-300 px-3 py-3">
                <label className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">Type</label>
                <select
                  value={chargeBase}
                  onChange={(event) => setChargeBase(Number(event.target.value))}
                  className="block w-full border-0 bg-white p-0 text-gray-900 focus:ring-0 sm:text-sm"
                >
                  {chargeBases.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="sm:col-span-2">
              <div className="relative rounded-md border border-gray-300 px-3 py-3">
                <label className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">Minimum charge</label>
                <input
                  type="number"
                  value={chargeMinimum}
                  onChange={(event) => setChargeMinimum(Number(event.target.value))}
                  className="block w-full border-0 p-0 text-gray-900 placeholder-gray-400 focus:ring-0 sm:text-sm"
                  placeholder="Delivery charge"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <div className="relative rounded-md border border-gray-300 px-3 py-3">
                <label className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">Maximum charge</label>
                <input
                  type="number"
                  value={chargeMaximum}
                  onChange={(event) => setChargeMaximum(Number(event.target.value))}
                  className="block w-full border-0 p-0 text-gray-900 placeholder-gray-400 focus:ring-0 sm:text-sm"
                  placeholder="Delivery charge"
                />
              </div>
            </div>
            {chargeBase === 1 ? (
              <div className="sm:col-span-2">
                <div className="relative rounded-md border border-gray-300 px-3 py-3">
                  <label className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">Delivery charge</label>
                  <input
                    type="number"
                    value={chargeMerchantDefined}
                    onChange={(event) => setChargeMerchantDefined(Number(event.target.value))}
                    className="block w-full border-0 p-0 text-gray-900 placeholder-gray-400 focus:ring-0 sm:text-sm"
                    placeholder="Delivery charge"
                  />
                </div>
              </div>
            ) : null}
            {chargeBase === 2 ? (
              <div className="sm:col-span-2">
                <div className="relative rounded-md border border-gray-300 px-3 py-3">
                  <label className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">Charge per km</label>
                  <input
                    type="number"
                    value={chargePerKm}
                    onChange={(event) => setChargePerKm(Number(event.target.value))}
                    className="block w-full border-0 p-0 text-gray-900 placeholder-gray-400 focus:ring-0 sm:text-sm"
                    placeholder="Delivery charge"
                  />
                </div>
              </div>
            ) : null}
            {chargeBase === 3 ? (
              <div className="sm:col-span-2">
                <div className="relative rounded-md border border-gray-300 px-3 py-3">
                  <label className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">Charge per kg</label>
                  <input
                    type="number"
                    value={chargePerKg}
                    onChange={(event) => setChargePerKg(Number(event.target.value))}
                    className="block w-full border-0 p-0 text-gray-900 placeholder-gray-400 focus:ring-0 sm:text-sm"
                    placeholder="Delivery charge"
                  />
                </div>
              </div>
            ) : null}
            {chargeBase === 5 ? (
              <>
                <div className="sm:col-span-2">
                  <div className="relative rounded-md border border-gray-300 px-3 py-3">
                    <label className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">Same country</label>
                    <input
                      type="number"
                      value={chargeSameCountry}
                      onChange={(event) => setChargeSameCountry(Number(event.target.value))}
                      className="block w-full border-0 p-0 text-gray-900 placeholder-gray-400 focus:ring-0 sm:text-sm"
                      placeholder="Delivery charge"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <div className="relative rounded-md border border-gray-300 px-3 py-3">
                    <label className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">Same city</label>
                    <input
                      type="number"
                      value={chargeSameCity}
                      onChange={(event) => setChargeSameCity(Number(event.target.value))}
                      className="block w-full border-0 p-0 text-gray-900 placeholder-gray-400 focus:ring-0 sm:text-sm"
                      placeholder="Delivery charge"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <div className="relative rounded-md border border-gray-300 px-3 py-3">
                    <label className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">Same sub city</label>
                    <input
                      type="number"
                      value={chargeSameSubCity}
                      onChange={(event) => setChargeSameSubCity(Number(event.target.value))}
                      className="block w-full border-0 p-0 text-gray-900 placeholder-gray-400 focus:ring-0 sm:text-sm"
                      placeholder="Delivery charge"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <div className="relative rounded-md border border-gray-300 px-3 py-3">
                    <label className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">Same area</label>
                    <input
                      type="number"
                      value={chargeSameArea}
                      onChange={(event) => setChargeSameArea(Number(event.target.value))}
                      className="block w-full border-0 p-0 text-gray-900 placeholder-gray-400 focus:ring-0 sm:text-sm"
                      placeholder="Delivery charge"
                    />
                  </div>
                </div>
              </>
            ) : null}
            {chargeBase === 6 ? (
              <div className="sm:col-span-6">
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Condition base charge</h3>
                  <p className="mt-1 text-sm text-gray-500">Delivery charge will be calculated based on purchase amount.</p>
                </div>
                <div className="mt-8 flex flex-col">
                  <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                      <div className="table-source-wrap">
                        <AppTable className="data-table min-w-full divide-y divide-gray-300">
                          <TableHeader className="bg-gray-50">
                            <TableRow>
                              <TableHead scope="col" className="relative w-6 px-4 sm:w-6 sm:px-4">SL</TableHead>
                              <TableHead scope="col" className="whitespace-nowrap px-2 py-3 text-left text-sm font-semibold text-gray-900">Min Purchase</TableHead>
                              <TableHead scope="col" className="whitespace-nowrap px-2 py-3 text-left text-sm font-semibold text-gray-900">Max Purchase</TableHead>
                              <TableHead scope="col" className="whitespace-nowrap px-2 py-3 text-left text-sm font-semibold">Delivery Charge</TableHead>
                              <TableHead scope="col" className="px-4 py-3.5 pl-3 text-right text-sm font-semibold text-gray-900">Action</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody className="divide-y divide-gray-200 bg-white">
                            {chargeConditions.map((condition, index) => (
                              <TableRow key={condition.id}>
                                <TableCell className="whitespace-nowrap bg-yellow-100 text-sm text-gray-500 text-center">{index + 1}</TableCell>
                                <TableCell className="whitespace-nowrap w-8 px-2 py-2 text-sm text-gray-500">
                                  <div className="text-gray-900">{condition.minPurchase}</div>
                                </TableCell>
                                <TableCell className="whitespace-nowrap w-8 px-2 py-2 text-sm text-gray-500">
                                  <div className="text-gray-900">{condition.maxPurchase}</div>
                                </TableCell>
                                <TableCell className="whitespace-nowrap w-8 px-2 py-2 text-sm text-gray-500">
                                  <div className="text-gray-900">{condition.charge}</div>
                                </TableCell>
                                <TableCell className="whitespace-nowrap px-4 py-3 text-sm text-gray-500 text-right">
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveCondition(condition)}
                                    className="inline-flex items-center rounded-md border border-transparent bg-red-500 px-4 py-2 font-medium text-white shadow-sm hover:bg-red-700"
                                  >
                                    Remove
                                  </button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </AppTable>
                        {chargeConditions.length === 0 ? (
                          <div className="text-center border-t border-gray-200 bg-white px-4 py-4 sm:px-6">
                            <p className="text-sm text-gray-700">No record :-(</p>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-2">
                    <div className="relative rounded-md border border-gray-300 px-3 py-3">
                      <label className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">Min Purchase</label>
                      <input
                        type="number"
                        value={newCondition.minPurchase}
                        onChange={(event) => setNewCondition((prev) => ({ ...prev, minPurchase: Number(event.target.value) }))}
                        className="block w-full border-0 p-0 text-gray-900 placeholder-gray-400 focus:ring-0 sm:text-sm"
                        placeholder="Enter min"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <div className="relative rounded-md border border-gray-300 px-3 py-3">
                      <label className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">Max Purchase</label>
                      <input
                        type="number"
                        value={newCondition.maxPurchase}
                        onChange={(event) => setNewCondition((prev) => ({ ...prev, maxPurchase: Number(event.target.value) }))}
                        className="block w-full border-0 p-0 text-gray-900 placeholder-gray-400 focus:ring-0 sm:text-sm"
                        placeholder="Enter max"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <div className="relative rounded-md border border-gray-300 px-3 py-3">
                      <label className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">Delivery Charge</label>
                      <input
                        type="number"
                        value={newCondition.charge}
                        onChange={(event) => setNewCondition((prev) => ({ ...prev, charge: Number(event.target.value) }))}
                        className="block w-full border-0 p-0 text-gray-900 placeholder-gray-400 focus:ring-0 sm:text-sm"
                        placeholder="Enter charge"
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-white shadow sm:rounded-lg mt-4">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="sm:flex sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Add Condition</h3>
                        <div className="mt-2 max-w-xl text-sm text-gray-500">
                          <p>Enter condition details (e.g., title, price, etc.).</p>
                        </div>
                      </div>
                      <div className="mt-5 sm:mt-0 sm:ml-6 sm:flex sm:flex-shrink-0 sm:items-center">
                        <button
                          type="button"
                          onClick={handleAddCondition}
                          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-indigo-700"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
            {chargeBase === 7 ? (
              <div className="sm:col-span-6">
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Area base charge</h3>
                  <p className="mt-1 text-sm text-gray-500">Delivery charge will be calculated based on area.</p>
                  <div className="mt-4 rounded-md border border-dashed border-gray-300 px-4 py-6 text-sm text-gray-500">
                    Area charges will appear here once stoppage configuration is wired.
                  </div>
                </div>
              </div>
            ) : null}
            {credentials.length > 0 ? (
              <div className="sm:col-span-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Api instraction</h3>
                <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  {credentials
                    .slice()
                    .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
                    .map((credential) => (
                      <div key={credential.label} className="sm:col-span-3">
                        <div className="relative rounded-md border border-gray-300 px-3 py-3">
                          <label className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">
                            {credential.label.replace(/_/g, " ")}
                          </label>
                          <input
                            value={credential.value}
                            onChange={(event) => handleCredentialChange(credential.label, event.target.value)}
                            type={credential.sensitive ? "password" : "text"}
                            className="block w-full border-0 p-0 text-gray-900 placeholder-gray-400 focus:ring-0 sm:text-sm"
                            placeholder={`Enter ${credential.label.replace(/_/g, " ")}`}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ) : null}
          </div>
          <div className="pt-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Status</h3>
            <p className="mt-1 text-sm text-gray-500">The details used to determine your category behaviour around the web.</p>
          </div>
          <div className="mt-2">
            <fieldset>
              <div className="mt-4 space-y-4">
                <div className="relative flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="isActive"
                      name="isActive"
                      type="checkbox"
                      checked={isActive}
                      onChange={(event) => setIsActive(event.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="isActive" className="font-medium text-gray-700">
                      Active
                    </label>
                    <p className="text-gray-500">User can view and filter tools.</p>
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
          <div className="pt-5">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => onClose(false)}
                className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving || !logisticsId}
                onClick={handleSave}
                className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
              >
                {id ? "Update" : "Save"}
              </button>
              {id ? (
                <button
                  type="button"
                  disabled={deleting}
                  onClick={handleDelete}
                  className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 disabled:opacity-50"
                >
                  Delete
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
