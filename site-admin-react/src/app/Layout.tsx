import { type ComponentType, type SVGProps, useMemo, useState } from "react";
import {
  BanknotesIcon,
  Bars3Icon,
  BellIcon,
  BoltIcon,
  ChatBubbleLeftRightIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  DevicePhoneMobileIcon,
  DocumentTextIcon,
  FolderIcon,
  HomeIcon,
  KeyIcon,
  MagnifyingGlassIcon,
  MegaphoneIcon,
  PresentationChartLineIcon,
  SparklesIcon,
  Squares2X2Icon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { useSiteAdminStore } from "@/siteAdmin/store/useSiteAdminStore";
import ToastStack from "@/siteAdmin/components/ToastStack";

type NavEntry = {
  label: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  badge?: string;
};

const PRIMARY_NAV: NavEntry[] = [
  { label: "Setup", href: "/create/", icon: SparklesIcon },
  { label: "Home", href: "/", icon: HomeIcon },
  { label: "AI Agents", href: "/chat/", icon: ChatBubbleLeftRightIcon, badge: "NEW" },
  { label: "Getting Paid", href: "/product/", icon: BanknotesIcon },
  { label: "Sales", href: "/page/", icon: DocumentTextIcon },
  { label: "Apps", href: "/app/", icon: Squares2X2Icon },
  { label: "Site & Mobile App", href: "/site/", icon: DevicePhoneMobileIcon },
  { label: "Theme", href: "/theme/", icon: MegaphoneIcon },
  { label: "File", href: "/tool/file/", icon: FolderIcon },
  { label: "Customers & Leads", href: "/component/", icon: UserGroupIcon },
  { label: "Analytics", href: "/tool/page/", icon: PresentationChartLineIcon },
  { label: "Editor", href: "/editor/", icon: BoltIcon },
  { label: "Settings", href: "/setting/", icon: Cog6ToothIcon },
  { label: "API", href: "/api/", icon: KeyIcon },
];

function SidebarLink(props: NavEntry & { onClick?: () => void }) {
  const Icon = props.icon;

  return (
    <NavLink
      to={props.href}
      onClick={props.onClick}
      end={props.href === "/"}
      className={({ isActive }) =>
        [
          "group flex items-center justify-between gap-3 px-4 py-3 text-[12.5px] leading-none transition",
          isActive
            ? "bg-[#eef2f7] text-[#111827]"
            : "text-[#4b5563] hover:bg-[#f6f8fb] hover:text-[#111827]",
        ].join(" ")
      }
      style={{ borderRadius: 6 }}
    >
      <div className="flex min-w-0 items-center gap-3">
        <Icon className="h-4 w-4 shrink-0" />
        <span className="truncate">{props.label}</span>
      </div>
      {props.badge ? (
        <span
          className="shrink-0 bg-[#f7b500] px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-slate-950"
          style={{ borderRadius: 999 }}
        >
          {props.badge}
        </span>
      ) : (
        <ChevronDownIcon className="h-3 w-3 shrink-0 rotate-[-90deg] text-[#9aa3b2] transition group-hover:text-[#6b7280]" />
      )}
    </NavLink>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    await logout();
    navigate("/login/", { replace: true });
    onNavigate?.();
  };

  return (
    <div className="flex h-full flex-col bg-white text-[#111827]">
      <div className="border-b border-[#e7ebf1] px-4 py-4">
        <button
          type="button"
          className="flex h-9 w-full items-center justify-between border border-[#dce3ec] bg-white px-3.5 text-[12px] font-semibold text-[#1f2430]"
          style={{ borderRadius: 999 }}
        >
          <span>Quick Actions</span>
          <ChevronDownIcon className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="border-b border-[#e7ebf1] px-4 py-4">
        <button
          type="button"
          onClick={() => {
            navigate("/create/");
            onNavigate?.();
          }}
          className="flex w-full items-center justify-between text-left text-[12px] font-semibold text-[#111827]"
        >
          <span>Let's set up your business</span>
          <ChevronDownIcon className="h-3.5 w-3.5 rotate-[-90deg] text-[#98a1b2]" />
        </button>
        <div className="mt-3 text-[11px] text-[#7b8494]">2/5 completed</div>
        <div className="mt-2 h-1 overflow-hidden bg-[#edf1f5]" style={{ borderRadius: 999 }}>
          <div className="h-full w-[40%] bg-[#7a5cff]" style={{ borderRadius: 999 }} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-0.5">
          {PRIMARY_NAV.map((item) => (
            <SidebarLink key={item.href} {...item} onClick={onNavigate} />
          ))}
        </div>
      </div>

      <div className="mt-auto border-t border-[#e7ebf1] px-4 py-4">
        <button
          type="button"
          onClick={() => {
            navigate("/");
            onNavigate?.();
          }}
          className="flex w-full items-center gap-2.5 border border-[#dce3ec] bg-[#f7f9fc] px-3.5 py-3 text-[12px] font-medium text-[#111827] transition hover:bg-[#eef3f8]"
          style={{ borderRadius: 7 }}
        >
          <SparklesIcon className="h-4 w-4" />
          <span>Design Site</span>
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-2 w-full px-3.5 py-2 text-left text-[10.5px] text-[#7b8494] transition hover:text-[#111827]"
          style={{ borderRadius: 7 }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default function Layout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const sites = useSiteAdminStore((state) => state.sites);
  const siteId = useSiteAdminStore((state) => state.siteId);
  const location = useLocation();

  const currentSite = useMemo(() => {
    if (!siteId) return sites[0] ?? null;
    return sites.find((site) => site.id === siteId) ?? sites[0] ?? null;
  }, [siteId, sites]);

  const outletWidthClass = useMemo(() => {
    if (
      location.pathname.startsWith("/theme/") ||
      location.pathname.startsWith("/editor/") ||
      location.pathname.startsWith("/tool/file/")
    ) {
      return "max-w-[1440px]";
    }
    return "max-w-[960px]";
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#edf0f5] text-[#1f2430]">
      <ToastStack />

      <header className="fixed inset-x-0 top-0 z-40 h-[64px] border-b border-[#d9dee7] bg-white">
        <div className="flex h-full items-stretch">
          <div className="hidden w-[152px] shrink-0 items-center border-r border-[#e4e8ef] px-5 lg:flex">
            <div className="text-[18px] font-bold tracking-[-0.04em] text-[#1f2430]">Bponi Site</div>
          </div>

          <div className="flex min-w-0 flex-1 items-center gap-3 px-3 sm:px-4 lg:px-6">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="inline-flex h-9 w-9 items-center justify-center text-[#4b5563] lg:hidden"
              style={{ borderRadius: 6 }}
            >
              <Bars3Icon className="h-5 w-5" />
            </button>

            <div className="text-[17px] font-bold tracking-[-0.04em] text-[#1f2430] lg:hidden">Bponi Site</div>

            <div className="hidden min-w-0 items-center gap-2.5 text-[12px] text-[#5f6778] sm:flex">
              <div
                className="flex items-center gap-1.5 border border-[#dde3eb] bg-white px-3 py-2.5 font-medium text-[#1f2430]"
                style={{ borderRadius: 6 }}
              >
                <span className="max-w-[164px] truncate">{currentSite?.title || "My Site 1"}</span>
                <ChevronDownIcon className="h-4 w-4 text-[#7a8294]" />
              </div>
              <button type="button" className="hidden hover:text-[#1f2430] xl:inline-flex">
                Explore
              </button>
              <button type="button" className="hidden hover:text-[#1f2430] xl:inline-flex">
                Hire a Professional
              </button>
              <button type="button" className="hidden hover:text-[#1f2430] xl:inline-flex">
                Help
              </button>
              <button
                type="button"
                className="hidden bg-[#7f39fb] px-3 py-1.5 text-[10.5px] font-semibold text-white xl:inline-flex"
                style={{ borderRadius: 999 }}
              >
                Upgrade
              </button>
            </div>

            <div className="mx-auto hidden max-w-[640px] flex-1 xl:flex">
              <div
                className="flex h-10 w-full items-center gap-2 border border-[#d7deea] bg-[#f5f8fd] px-3.5"
                style={{ borderRadius: 999 }}
              >
                <MagnifyingGlassIcon className="h-4 w-4 text-[#7b8395]" />
                <input
                  type="text"
                  placeholder="Search for tools, apps, help & more..."
                  className="w-full bg-transparent text-[12.5px] text-[#334155] outline-none placeholder:text-[#8e98ab]"
                />
              </div>
            </div>

            <div className="ml-auto flex items-center gap-1.5">
              <button
                type="button"
                className="hidden h-9 w-9 items-center justify-center text-[#667085] sm:inline-flex"
                style={{ borderRadius: 999 }}
              >
                <Squares2X2Icon className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="hidden h-9 w-9 items-center justify-center text-[#667085] sm:inline-flex"
                style={{ borderRadius: 999 }}
              >
                <BellIcon className="h-4 w-4" />
              </button>
              <div
                className="flex h-9 w-9 items-center justify-center bg-[#116dff] text-[11px] font-semibold text-white"
                style={{ borderRadius: 999 }}
              >
                {(user?.name?.trim().charAt(0) || "U").toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </header>

      {mobileSidebarOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-950/45"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[360px] pt-[64px]">
            <SidebarContent onNavigate={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      ) : null}

      <aside className="fixed bottom-0 left-0 top-[64px] hidden w-[232px] border-r border-[#e4e8ef] lg:block">
        <SidebarContent />
      </aside>

      <div className="pt-[64px] lg:pl-[232px]">
        <main className="min-h-[calc(100vh-64px)] px-3 py-4 sm:px-4 sm:py-4 lg:px-6 lg:py-5">
          <div className={`mx-auto ${outletWidthClass}`}>
            <Outlet />
          </div>
        </main>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-black/5 bg-[#a249cc] px-4 py-2.5 text-white lg:left-[232px]">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-center gap-2 text-center sm:flex-row sm:gap-3">
          <span className="text-[11px] font-semibold">Upgrade to Premium.</span>
          <span className="text-[11px] text-white/80">
            Get your own custom domain and accept payments online.
          </span>
          <button
            type="button"
            className="bg-white px-3 py-1 text-[10px] font-semibold text-[#a249cc]"
            style={{ borderRadius: 999 }}
          >
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
}
