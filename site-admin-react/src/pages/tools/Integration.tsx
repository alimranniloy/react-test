import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { SELF_SITE_UPDATE } from "@/graphql/queries/site";
import { useAuthStore } from "@/store/useAuthStore";
import { useSiteStore } from "@/store/useSiteStore";

const tabs = ["Head", "Foot", "Pixel"] as const;

export default function Integration() {
  const site = useSiteStore((state) => state.site);
  const user = useAuthStore((state) => state.user);
  const siteId = site?.id ?? null;
  const [selectedTab, setSelectedTab] = useState<(typeof tabs)[number]>("Head");
  const [head, setHead] = useState(site?.head ?? "");
  const [foot, setFoot] = useState(site?.foot ?? "");
  const [pixel, setPixel] = useState(site?.pixel ?? "");
  const [token, setToken] = useState(site?.token ?? "");

  const [updateSite, { loading }] = useMutation(SELF_SITE_UPDATE);

  const handleUpdate = async () => {
    if (!user?.id || !siteId) return;
    await updateSite({
      variables: {
        userId: user.id,
        siteId,
        head,
        foot,
        pixel,
        token
      }
    });
  };

  const mobileOptions = useMemo(() => tabs.map((tab) => ({ name: tab })), []);

  return (
    <div className="flex-1">
      <div className="pb-[60px] pt-[70px] md:pt-0 sm:pb-4">
        <div className="sm:px-6 md:px-0">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Intregation</h1>
        </div>
        <div className="sm:px-6 md:px-0">
          <div className="py-6">
            <div className="lg:hidden">
              <label htmlFor="selected-tab" className="sr-only">
                Select a tab
              </label>
              <select
                id="selected-tab"
                name="selected-tab"
                value={selectedTab}
                onChange={(event) => setSelectedTab(event.target.value as (typeof tabs)[number])}
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm"
              >
                {mobileOptions.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="hidden lg:block">
              <div className="border-b border-gray-200">
                <nav className="overflow-x-auto -mb-px flex space-x-8">
                  {tabs.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setSelectedTab(item)}
                      className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                        item === selectedTab
                          ? "border-purple-500 text-purple-600"
                          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {selectedTab === "Head" ? (
              <div className="mt-10 divide-y divide-gray-200">
                <div className="space-y-1">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Head</h3>
                  <p className="max-w-2xl text-sm text-gray-500">This information will be displayed publicly so be careful what you share.</p>
                </div>
                <div className="mt-6">
                  <textarea
                    value={head}
                    onChange={(event) => setHead(event.target.value)}
                    rows={16}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-mono"
                  />
                </div>
              </div>
            ) : null}

            {selectedTab === "Foot" ? (
              <div className="mt-10 divide-y divide-gray-200">
                <div className="space-y-1">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Foot</h3>
                  <p className="max-w-2xl text-sm text-gray-500">This information will be displayed publicly so be careful what you share.</p>
                </div>
                <div className="mt-6">
                  <textarea
                    value={foot}
                    onChange={(event) => setFoot(event.target.value)}
                    rows={16}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-mono"
                  />
                </div>
              </div>
            ) : null}

            {selectedTab === "Pixel" ? (
              <div className="mt-10 divide-y divide-gray-200">
                <div className="space-y-1">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Pixel & Token</h3>
                  <p className="max-w-2xl text-sm text-gray-500">Manage your tracking pixels and API tokens here.</p>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <label htmlFor="pixel" className="block text-sm font-medium text-gray-700">
                      Pixel ID / Script
                    </label>
                    <div className="mt-1">
                      <input
                        value={pixel}
                        onChange={(event) => setPixel(event.target.value)}
                        type="text"
                        name="pixel"
                        id="pixel"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border"
                        placeholder="Enter Pixel ID"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="token" className="block text-sm font-medium text-gray-700">
                      Access Token
                    </label>
                    <div className="mt-1">
                      <input
                        value={token}
                        onChange={(event) => setToken(event.target.value)}
                        type="text"
                        name="token"
                        id="token"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border"
                        placeholder="Enter Access Token"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="pt-5">
          <div className="flex justify-end">
            <Link
              to="/"
              className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="button"
              onClick={handleUpdate}
              disabled={loading}
              className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
