import { useEffect, useMemo, useState } from "react";
import { useMutation } from "@apollo/client";
import { SELF_SITE_UPDATE } from "@/graphql/queries/site";
import { useAuthStore } from "@/store/useAuthStore";
import { useSiteStore } from "@/store/useSiteStore";
import FilePondUploader from "@/components/FilePondUploader";

const tabs = [
  { name: "General" },
  { name: "Meta" },
  { name: "Domain" },
  { name: "Config" },
  { name: "Design" },
  { name: "Notification" },
  { name: "Connection" },
  { name: "Social" },
  { name: "Fraud Protection" },
  { name: "Notice" },
  { name: "Account" },
  { name: "Addons" }
];

export default function Setting() {
  const site = useSiteStore((state) => state.site);
  const user = useAuthStore((state) => state.user);
  const siteId = site?.id ?? null;
  const [selectedTab, setSelectedTab] = useState("General");
  const [form, setForm] = useState<Record<string, any>>({});
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [desktopLogoFile, setDesktopLogoFile] = useState<File | null>(null);
  const [phoneLogoFile, setPhoneLogoFile] = useState<File | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);

  const [updateSite, { loading }] = useMutation(SELF_SITE_UPDATE);

  useEffect(() => {
    if (!site) return;
    setForm({
      title: site.title ?? "",
      metaTitle: site.metaTitle ?? "",
      metaDescription: site.metaDescription ?? "",
      email: site.email ?? "",
      phone: site.phone ?? "",
      street: site.street ?? "",
      locale: site.locale ?? "",
      currency: site.currency ?? "",
      domain: site.domain ?? "",
      hostname: site.hostname ?? "",
      notice: site.notice ?? "",
      favicon: site.favicon ?? "",
      desktopLogo: site.desktopLogo ?? "",
      phoneLogo: site.phoneLogo ?? "",
      coverImage: site.coverImage ?? "",
      isOtp: site.isOtp ?? false,
      isGuest: site.isGuest ?? false,
      isPublic: site.isPublic ?? false,
      isActive: site.isActive ?? false,
      isFraudCheck: site.isFraudCheck ?? false,
      fraudTransactionLimit: site.fraudTransactionLimit ?? 0,
      fraudWindowTime: site.fraudWindowTime ?? 0,
      sendSmsPerEvent: site.sendSmsPerEvent ?? 0,
      sendSmsPerOrder: site.sendSmsPerOrder ?? 0,
      social: site.social ?? {}
    });
  }, [site]);

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleUpdate = async () => {
    if (!user?.id || !siteId) return;
    await updateSite({
      variables: {
        userId: user.id,
        siteId,
        title: form.title,
        metaTitle: form.metaTitle,
        metaDescription: form.metaDescription,
        email: form.email,
        phone: form.phone,
        street: form.street,
        locale: form.locale,
        currency: form.currency,
        domain: form.domain,
        hostname: form.hostname,
        notice: form.notice,
        favicon: faviconFile ?? null,
        desktopLogo: desktopLogoFile ?? null,
        phoneLogo: phoneLogoFile ?? null,
        coverImage: coverImageFile ?? null,
        isOtp: form.isOtp,
        isGuest: form.isGuest,
        isPublic: form.isPublic,
        isActive: form.isActive,
        isFraudCheck: form.isFraudCheck,
        fraudTransactionLimit: Number(form.fraudTransactionLimit) || 0,
        fraudWindowTime: Number(form.fraudWindowTime) || 0,
        sendSmsPerEvent: Number(form.sendSmsPerEvent) || 0,
        sendSmsPerOrder: Number(form.sendSmsPerOrder) || 0,
        social: form.social
      }
    });
  };

  const social = useMemo(() => {
    const raw = form.social;
    if (!raw) return {};
    if (typeof raw === "string") {
      try {
        return JSON.parse(raw);
      } catch {
        return {};
      }
    }
    return raw;
  }, [form.social]);

  return (
    <div className="flex-1">
      <div className="relative mx-auto px-4">
        <div className="pb-[60px] pt-[70px] md:pt-0 sm:pb-4">
          <div className="sm:flex-auto relative">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center">Settings</h1>
            <div
              className="absolute z-0 duration-1000 -inset-2 transitiona-all opacity-20 rounded-xl blur-lg filter group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200"
              style={{
                background:
                  "linear-gradient(90deg, rgb(68, 255, 154) -0.55%, rgb(68, 176, 255) 22.86%, rgb(162 147 186) 48.36%, rgb(255, 102, 68) 73.33%, rgb(235, 255, 112) 99.34%)"
              }}
            />
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
                        <div>{item.name}</div>
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              {selectedTab === "General" ? (
                <div className="mt-10 divide-y divide-gray-200">
                  <div className="space-y-1">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Configure</h3>
                    <p className="max-w-2xl text-sm text-gray-500">
                      Customize and Configure Platform Settings for Optimal Performance and Control
                    </p>
                  </div>
                  <div className="mt-6">
                    <div className="space-y-4">
                      <div className="w-full relative rounded-md border border-gray-300 px-3 py-3">
                        <label className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">
                          Title
                        </label>
                        <input
                          value={form.title ?? ""}
                          onChange={(event) => handleChange("title", event.target.value)}
                          className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
                          placeholder="Enter title"
                        />
                      </div>
                      <div className="w-full relative rounded-md border border-gray-300 px-3 py-3">
                        <label className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">
                          Description
                        </label>
                        <textarea
                          value={form.metaDescription ?? ""}
                          onChange={(event) => handleChange("metaDescription", event.target.value)}
                          className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
                          placeholder="Enter description"
                        />
                      </div>
                      <div className="w-full relative rounded-md border border-gray-300 px-3 py-3">
                        <label className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">
                          Phone
                        </label>
                        <input
                          value={form.phone ?? ""}
                          onChange={(event) => handleChange("phone", event.target.value)}
                          className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
                          placeholder="Enter phone"
                        />
                      </div>
                      <div className="w-full relative rounded-md border border-gray-300 px-3 py-3">
                        <label className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">
                          Email
                        </label>
                        <input
                          value={form.email ?? ""}
                          onChange={(event) => handleChange("email", event.target.value)}
                          className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
                          placeholder="Enter email"
                        />
                      </div>
                      <div className="w-full relative rounded-md border border-gray-300 px-3 py-3">
                        <label className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">
                          Street
                        </label>
                        <input
                          value={form.street ?? ""}
                          onChange={(event) => handleChange("street", event.target.value)}
                          className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
                          placeholder="Enter street"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {selectedTab === "Meta" ? (
                <div className="mt-10 divide-y divide-gray-200">
                  <div className="space-y-1">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Meta</h3>
                    <p className="max-w-2xl text-sm text-gray-500">SEO and metadata information.</p>
                  </div>
                  <div className="mt-6 space-y-4">
                    <div className="w-full relative rounded-md border border-gray-300 px-3 py-3">
                      <label className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">
                        Meta Title
                      </label>
                      <input
                        value={form.metaTitle ?? ""}
                        onChange={(event) => handleChange("metaTitle", event.target.value)}
                        className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
                        placeholder="Enter meta title"
                      />
                    </div>
                    <div className="w-full relative rounded-md border border-gray-300 px-3 py-3">
                      <label className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">
                        Meta Description
                      </label>
                      <textarea
                        value={form.metaDescription ?? ""}
                        onChange={(event) => handleChange("metaDescription", event.target.value)}
                        className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
                        placeholder="Enter meta description"
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              {selectedTab === "Domain" ? (
                <div className="mt-10 divide-y divide-gray-200">
                  <div className="space-y-1">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Domain</h3>
                    <p className="max-w-2xl text-sm text-gray-500">Configure your domain and hostname.</p>
                  </div>
                  <div className="mt-6 space-y-4">
                    <div className="w-full relative rounded-md border border-gray-300 px-3 py-3">
                      <label className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">
                        Domain
                      </label>
                      <input
                        value={form.domain ?? ""}
                        onChange={(event) => handleChange("domain", event.target.value)}
                        className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
                        placeholder="Enter domain"
                      />
                    </div>
                    <div className="w-full relative rounded-md border border-gray-300 px-3 py-3">
                      <label className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">
                        Hostname
                      </label>
                      <input
                        value={form.hostname ?? ""}
                        onChange={(event) => handleChange("hostname", event.target.value)}
                        className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
                        placeholder="Enter hostname"
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              {selectedTab === "Config" ? (
                <div className="mt-10 divide-y divide-gray-200">
                  <div className="space-y-1">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Config</h3>
                    <p className="max-w-2xl text-sm text-gray-500">Localization and currency settings.</p>
                  </div>
                  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="w-full relative rounded-md border border-gray-300 px-3 py-3">
                      <label className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">
                        Locale
                      </label>
                      <input
                        value={form.locale ?? ""}
                        onChange={(event) => handleChange("locale", event.target.value)}
                        className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
                        placeholder="Enter locale"
                      />
                    </div>
                    <div className="w-full relative rounded-md border border-gray-300 px-3 py-3">
                      <label className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">
                        Currency
                      </label>
                      <input
                        value={form.currency ?? ""}
                        onChange={(event) => handleChange("currency", event.target.value)}
                        className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
                        placeholder="Enter currency"
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              {selectedTab === "Design" ? (
                <div className="mt-10 divide-y divide-gray-200">
                  <div className="space-y-1">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Design</h3>
                    <p className="max-w-2xl text-sm text-gray-500">Update logos and branding assets.</p>
                  </div>
                  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="relative rounded-md border border-gray-300 px-3 py-3">
                      <label className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">
                        Favicon
                      </label>
                      <FilePondUploader
                        files={form.favicon ? [form.favicon] : []}
                        accepted="image/*"
                        onAdded={(file) => setFaviconFile(file)}
                        onRemove={() => setFaviconFile(null)}
                      />
                    </div>
                    <div className="relative rounded-md border border-gray-300 px-3 py-3">
                      <label className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">
                        Phone Logo
                      </label>
                      <FilePondUploader
                        files={form.phoneLogo ? [form.phoneLogo] : []}
                        accepted="image/*"
                        onAdded={(file) => setPhoneLogoFile(file)}
                        onRemove={() => setPhoneLogoFile(null)}
                      />
                    </div>
                    <div className="relative rounded-md border border-gray-300 px-3 py-3">
                      <label className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">
                        Desktop Logo
                      </label>
                      <FilePondUploader
                        files={form.desktopLogo ? [form.desktopLogo] : []}
                        accepted="image/*"
                        onAdded={(file) => setDesktopLogoFile(file)}
                        onRemove={() => setDesktopLogoFile(null)}
                      />
                    </div>
                    <div className="relative rounded-md border border-gray-300 px-3 py-3">
                      <label className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">
                        Cover
                      </label>
                      <FilePondUploader
                        files={form.coverImage ? [form.coverImage] : []}
                        accepted="image/*"
                        onAdded={(file) => setCoverImageFile(file)}
                        onRemove={() => setCoverImageFile(null)}
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              {selectedTab === "Notification" ? (
                <div className="mt-10 divide-y divide-gray-200">
                  <div className="space-y-1">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Notification</h3>
                    <p className="max-w-2xl text-sm text-gray-500">SMS limits and notification config.</p>
                  </div>
                  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="w-full relative rounded-md border border-gray-300 px-3 py-3">
                      <label className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">
                        Send SMS per Event
                      </label>
                      <input
                        type="number"
                        value={form.sendSmsPerEvent ?? 0}
                        onChange={(event) => handleChange("sendSmsPerEvent", event.target.value)}
                        className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
                      />
                    </div>
                    <div className="w-full relative rounded-md border border-gray-300 px-3 py-3">
                      <label className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">
                        Send SMS per Order
                      </label>
                      <input
                        type="number"
                        value={form.sendSmsPerOrder ?? 0}
                        onChange={(event) => handleChange("sendSmsPerOrder", event.target.value)}
                        className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              {selectedTab === "Connection" ? (
                <div className="mt-10 divide-y divide-gray-200">
                  <div className="space-y-1">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Connection</h3>
                    <p className="max-w-2xl text-sm text-gray-500">Manage integration with partners and external services.</p>
                  </div>
                  <div className="mt-6 text-sm text-gray-500">Connection configuration will appear here.</div>
                </div>
              ) : null}

              {selectedTab === "Social" ? (
                <div className="mt-10 divide-y divide-gray-200">
                  <div className="space-y-1">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Social</h3>
                    <p className="max-w-2xl text-sm text-gray-500">Social profile links.</p>
                  </div>
                  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {["facebook", "instagram", "twitter", "youtube"].map((key) => (
                      <div key={key} className="w-full relative rounded-md border border-gray-300 px-3 py-3">
                        <label className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">
                          {key}
                        </label>
                        <input
                          value={social[key] ?? ""}
                          onChange={(event) =>
                            handleChange("social", {
                              ...social,
                              [key]: event.target.value
                            })
                          }
                          className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
                          placeholder={`Enter ${key} url`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {selectedTab === "Fraud Protection" ? (
                <div className="mt-10 divide-y divide-gray-200">
                  <div className="space-y-1">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Fraud Protection</h3>
                    <p className="max-w-2xl text-sm text-gray-500">Control fraud checks and thresholds.</p>
                  </div>
                  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="w-full relative rounded-md border border-gray-300 px-3 py-3">
                      <label className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">
                        Fraud Transaction Limit
                      </label>
                      <input
                        type="number"
                        value={form.fraudTransactionLimit ?? 0}
                        onChange={(event) => handleChange("fraudTransactionLimit", event.target.value)}
                        className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
                      />
                    </div>
                    <div className="w-full relative rounded-md border border-gray-300 px-3 py-3">
                      <label className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900">
                        Fraud Window Time
                      </label>
                      <input
                        type="number"
                        value={form.fraudWindowTime ?? 0}
                        onChange={(event) => handleChange("fraudWindowTime", event.target.value)}
                        className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
                      />
                    </div>
                    <div className="w-full flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={Boolean(form.isFraudCheck)}
                        onChange={(event) => handleChange("isFraudCheck", event.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">Enable fraud checks</span>
                    </div>
                  </div>
                </div>
              ) : null}

              {selectedTab === "Notice" ? (
                <div className="mt-10 divide-y divide-gray-200">
                  <div className="space-y-1">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Notice</h3>
                    <p className="max-w-2xl text-sm text-gray-500">Public notice and announcements.</p>
                  </div>
                  <div className="mt-6">
                    <textarea
                      value={form.notice ?? ""}
                      onChange={(event) => handleChange("notice", event.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      rows={6}
                      placeholder="Enter notice text"
                    />
                  </div>
                </div>
              ) : null}

              {selectedTab === "Account" ? (
                <div className="mt-10 divide-y divide-gray-200">
                  <div className="space-y-1">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Account</h3>
                    <p className="max-w-2xl text-sm text-gray-500">Account level flags.</p>
                  </div>
                  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {["isOtp", "isGuest", "isPublic", "isActive"].map((key) => (
                      <div key={key} className="w-full flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={Boolean(form[key])}
                          onChange={(event) => handleChange(key, event.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-700">{key}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {selectedTab === "Addons" ? (
                <div className="mt-10 divide-y divide-gray-200">
                  <div className="space-y-1">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Addons</h3>
                    <p className="max-w-2xl text-sm text-gray-500">Additional modules and tools.</p>
                  </div>
                  <div className="mt-6 text-sm text-gray-500">Addon configuration will appear here.</div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="pt-5">
            <div className="flex justify-end">
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
    </div>
  );
}
