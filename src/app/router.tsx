import { createBrowserRouter } from "react-router-dom";
import Layout from "@/app/Layout";
import RequireAuth from "@/app/RequireAuth";
import Login from "@/pages/Login";
import Logout from "@/pages/Logout";
import NotFound from "@/pages/NotFound";
import Sites from "@/siteAdmin/pages/Sites";
import SiteOverview from "@/siteAdmin/pages/SiteOverview";
import Pages from "@/siteAdmin/pages/Pages";
import CreateSite from "@/siteAdmin/pages/CreateSite";
import SiteUpdate from "@/siteAdmin/pages/SiteUpdate";
import PageUpdate from "@/siteAdmin/pages/PageUpdate";
import Themes from "@/siteAdmin/pages/Themes";
import ThemeUpdate from "@/siteAdmin/pages/ThemeUpdate";
import ThemeApply from "@/siteAdmin/pages/ThemeApply";
import Components from "@/siteAdmin/pages/Components";
import ComponentAction from "@/siteAdmin/pages/ComponentAction";
import ToolPages from "@/siteAdmin/pages/tools/ToolPages";
import ToolPageAction from "@/siteAdmin/pages/tools/ToolPageAction";
import ToolFiles from "@/siteAdmin/pages/tools/ToolFiles";
import ToolFileAction from "@/siteAdmin/pages/tools/ToolFileAction";
import ToolFileBulk from "@/siteAdmin/pages/tools/ToolFileBulk";
import ProductList from "@/siteAdmin/pages/ProductList";
import ProductUpdate from "@/siteAdmin/pages/ProductUpdate";
import EditorHub from "@/siteAdmin/pages/EditorHub";
import ExtraApp from "@/siteAdmin/pages/ExtraApp";
import TestPage from "@/siteAdmin/pages/TestPage";
import Inactive from "@/siteAdmin/pages/Inactive";
import Chat from "@/siteAdmin/pages/Chat";
import Studio from "@/siteAdmin/pages/Studio";
import ApiSettings from "@/siteAdmin/pages/ApiSettings";

function getBasename(): string {
  // In dev we serve at `/` so routing works out-of-the-box.
  if (import.meta.env.DEV) return "/";
  if (typeof window === "undefined") return "/admin";
  const firstSegment = window.location.pathname.split("/")[1];
  if (!firstSegment) return "/admin";
  return `/${firstSegment}`;
}

export const router = createBrowserRouter(
  [
    { path: "/login/", element: <Login /> },
    {
      path: "/studio/",
      element: (
        <RequireAuth>
          <Studio />
        </RequireAuth>
      )
    },
    {
      path: "/",
      element: (
        <RequireAuth>
          <Layout />
        </RequireAuth>
      ),
      children: [
        { index: true, element: <Sites /> },
        { path: "site/", element: <SiteOverview /> },
        { path: "site/update/", element: <SiteUpdate /> },
        { path: "page/", element: <Pages /> },
        { path: "page/update/", element: <PageUpdate /> },
        { path: "product/", element: <ProductList /> },
        {
          path: "product/update/",
          element: <ProductUpdate />
        },
        { path: "theme/", element: <Themes /> },
        { path: "theme/update/", element: <ThemeUpdate /> },
        { path: "theme/apply/", element: <ThemeApply /> },
        { path: "component/", element: <Components /> },
        {
          path: "component/create/",
          element: <ComponentAction />
        },
        {
          path: "component/update/",
          element: <ComponentAction />
        },
        { path: "tool/page/", element: <ToolPages /> },
        {
          path: "tool/page/create/",
          element: <ToolPageAction />
        },
        {
          path: "tool/page/update/",
          element: <ToolPageAction />
        },
        { path: "tool/file/", element: <ToolFiles /> },
        {
          path: "tool/file/create/",
          element: <ToolFileAction />
        },
        {
          path: "tool/file/update/",
          element: <ToolFileAction />
        },
        { path: "tool/file/bulk/", element: <ToolFileBulk /> },
        { path: "editor/", element: <EditorHub /> },
        { path: "app/", element: <ExtraApp /> },
        { path: "setting/", element: <SiteUpdate /> },
        { path: "api/", element: <ApiSettings /> },
        { path: "test/", element: <TestPage /> },
        { path: "help/", element: <TestPage /> },
        { path: "create/", element: <CreateSite /> },
        { path: "inactive/", element: <Inactive /> },
        { path: "chat/", element: <Chat /> },
        { path: "logout/", element: <Logout /> },
        { path: "*", element: <NotFound /> }
      ]
    }
  ],
  { basename: getBasename() }
);
