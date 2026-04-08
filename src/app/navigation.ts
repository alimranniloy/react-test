export type NavGroup = {
  title: string;
  items: { label: string; href: string; section?: string }[];
};

export const NAVIGATION: NavGroup[] = [
  {
    title: "Dashboard",
    items: [
      { label: "Home", href: "/", section: "Overview" },
      { label: "Create", href: "/create/", section: "Quick Actions" },
      { label: "Inactive", href: "/inactive/", section: "Account" }
    ]
  },
  {
    title: "Content",
    items: [
      { label: "Site", href: "/site/", section: "Site" },
      { label: "Pages", href: "/page/", section: "Site" },
      { label: "Products", href: "/product/", section: "Site" },
      { label: "Themes", href: "/theme/", section: "Site" },
      { label: "Components", href: "/component/", section: "Site" }
    ]
  },
  {
    title: "Tools",
    items: [
      { label: "Tool Pages", href: "/tool/page/", section: "Content" },
      { label: "File", href: "/tool/file/", section: "Content" },
      { label: "Editor", href: "/editor/", section: "Builder" },
      { label: "App", href: "/app/", section: "Builder" }
    ]
  },
  {
    title: "Communication",
    items: [{ label: "Chat", href: "/chat/", section: "Messages" }]
  },
  {
    title: "Settings",
    items: [
      { label: "Setting", href: "/setting/", section: "System" },
      { label: "Help", href: "/help/", section: "Support" },
      { label: "Test", href: "/test/", section: "Support" }
    ]
  },
];
