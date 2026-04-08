import { useMemo, useState } from "react";
import { useMutation } from "@apollo/client";
import { SELF_SITE_UPDATE } from "@/graphql/queries/site";
import { useAuthStore } from "@/store/useAuthStore";
import { useSiteStore } from "@/store/useSiteStore";

const tabs = [
  { name: "All" },
  { name: "Official" },
  { name: "Paid" },
  { name: "Free" }
];

const marketplace = [
  {
    title: "Foodi",
    code: "foodi",
    subTitle: "Simple, clean",
    price: "Paid",
    url: "https://foodi.store.bponi.com/",
    image: "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/a902a251-67df-4a10-83eb-6cc3a2b96203.png",
    tag: "official, all, paid"
  },
  {
    title: "Edge",
    code: "edge",
    subTitle: "Simple, clean",
    price: "Paid",
    url: "https://edge.store.bponi.com/",
    image: "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/d2e70897-d7ee-448c-b887-d8cefc7b5fbd.png",
    tag: "official, all, paid"
  },
  {
    title: "Zero",
    code: "zero",
    subTitle: "Simple, clean",
    price: "Paid",
    url: "https://zero.store.bponi.com/",
    image: "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/a6d53c73-4cd5-4142-9ee0-5779f1c56685.png",
    tag: "official, all, paid"
  },
  {
    title: "Dropy",
    code: "dropy",
    subTitle: "Simple, clean",
    price: "Paid",
    url: "https://dropy.store.bponi.com/",
    image: "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/b5090d8c-f332-4afb-a806-35d8e9cc364c.png",
    tag: "official, all, paid"
  },
  {
    title: "Mohnaz Pro",
    code: "mohnazpro",
    subTitle: "Simple, clean",
    price: "Paid",
    url: "https://mohnazpro.store.bponi.com/",
    image: "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/5040aaed-6003-40f7-862b-8dbac4f8e0a7.png",
    tag: "official, all, paid"
  },
  {
    title: "Fabri",
    code: "fabri",
    subTitle: "Simple, clean",
    price: "Paid",
    url: "https://fabrilife.store.bponi.com/",
    image: "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/3c68a9f3-acc3-4594-b0e0-e97e47f9a0e0.png",
    tag: "official, all, paid"
  },
  {
    title: "Tech",
    code: "tech",
    subTitle: "Simple, clean",
    price: "Paid",
    url: "https://storetech.store.bponi.com/",
    image: "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/eedd3a4b-04b9-41a3-a313-2570487af11c.png",
    tag: "official, all, paid"
  },
  {
    title: "Book",
    code: "book",
    subTitle: "Simple, clean",
    price: "Paid",
    url: "https://boisodai.store.bponi.com/",
    image: "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/1fd2267b-9541-4428-86fa-26860cd0ca7f.png",
    tag: "official, all, paid"
  },
  {
    title: "Bookfy",
    code: "bookfy",
    subTitle: "Simple, clean",
    price: "Paid",
    url: "https://alhudashop.store.bponi.com/",
    image: "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/644c82d3-d71c-439c-badf-eeb83e42ed80.png",
    tag: "official, all, paid"
  },
  {
    title: "Boi",
    code: "boi",
    subTitle: "Simple, clean",
    price: "Paid",
    url: "https://boiadda.store.bponi.com/",
    image: "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/9b242027-c48e-4bd5-8a0a-b9226926adc4.png",
    tag: "official, all, paid"
  },
  {
    title: "Bing",
    code: "bing",
    subTitle: "Simple, clean",
    price: "Paid",
    url: "https://bing.store.bponi.com/",
    image: "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/14e9eed2-dbfc-4aa4-8ab7-90b778b802d8.png",
    tag: "official, all, paid"
  },
  {
    title: "Petra",
    code: "petra",
    subTitle: "Simple, clean",
    price: "Paid",
    url: "https://petra.store.bponi.com/",
    image: "https://bponi.sgp1.cdn.digitaloceanspaces.com/bponi/file/37efe0c5-64da-4bad-86d2-e31d299f2807.png",
    tag: "official, all, paid"
  }
];

export default function Theme() {
  const site = useSiteStore((state) => state.site);
  const user = useAuthStore((state) => state.user);
  const [selectedTab, setSelectedTab] = useState("All");
  const [updateSite, { loading }] = useMutation(SELF_SITE_UPDATE);

  const filtered = useMemo(() => {
    return marketplace.filter((item) => item.tag.includes(selectedTab.toLowerCase()));
  }, [selectedTab]);

  const handleUpdate = async (theme: string) => {
    if (!user?.id || !site?.id) return;
    await updateSite({
      variables: {
        userId: user.id,
        siteId: site.id,
        theme,
        desktopTheme: theme
      }
    });
  };

  return (
    <div className="flex-1">
      <div className="pb-[60px] pt-[70px] md:pt-0 sm:pb-4 px-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Theme</h1>
        </div>
        <div>
          <div className="py-6">
            <div className="lg:hidden">
              <label htmlFor="selected-tab" className="sr-only">
                Select a tab
              </label>
              <select
                id="selected-tab"
                name="selected-tab"
                value={selectedTab}
                onChange={(event) => setSelectedTab(event.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm"
              >
                {tabs.map((item) => (
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
                      key={item.name}
                      type="button"
                      onClick={() => setSelectedTab(item.name)}
                      className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                        item.name === selectedTab
                          ? "border-purple-500 text-purple-600"
                          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                      }`}
                    >
                      {item.name}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((item) => (
                <div
                  key={item.code}
                  className="z-[1] shadow-lg rounded-lg cursor-pointer hover:-translate-y-2 duration-500"
                >
                  <div className="relative flex items-center max-w-[50rem] bg-gray-800 rounded-t-lg py-2 px-24">
                    <div className="flex space-x-1 absolute top-2/4 left-4 -translate-y-1">
                      <span className="w-2 h-2 bg-gray-600 rounded-full" />
                      <span className="w-2 h-2 bg-gray-600 rounded-full" />
                      <span className="w-2 h-2 bg-gray-600 rounded-full" />
                    </div>
                    <div className="items-center h-full bg-gray-700 text-sm text-gray-400 rounded-sm truncate max-w-[170px] whitespace-nowrap px-2">
                      {item.url}
                    </div>
                  </div>
                  <a href={item.url} target="_blank" rel="noreferrer" className="bg-gray-800 rounded-b-lg block">
                    <img className="w-full h-auto max-h-[400px] rounded-b-lg object-contain" src={item.image} alt={item.title} />
                  </a>
                  <div className="flex items-start justify-between p-3">
                    <a href={item.url} target="_blank" rel="noreferrer" className="-mt-[1px] flex flex-col truncate ltr:mr-auto ltr:pl-2.5">
                      <h3 className="mb-0.5 truncate font-medium text-dark-100">
                        <div>{item.title}</div>
                      </h3>
                      <div className="font-medium text-[10px] hover:text-brand">{item.subTitle}</div>
                    </a>
                    <div className="flex flex-shrink-0 flex-col items-end pl-2.5">
                      {item.price === "Free" ? (
                        <button
                          type="button"
                          disabled={loading}
                          onClick={() => handleUpdate(item.code)}
                          className="rounded-2xl bg-light-500 px-4 py-2 text-sm font-semibold uppercase text-md bg-green-300 disabled:opacity-50"
                        >
                          Save
                        </button>
                      ) : (
                        <div className="rounded-2xl bg-light-500 px-1.5 py-0.5 text-13px font-semibold uppercase text-md">
                          {item.price}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
