import AssetWrapper from "@/layouts/AssetWrapper";
import AuthWrapper from "@/layouts/AuthWrapper";
import CopyTradeWrapper from "@/layouts/CopyTradeWrapper";
import GuestWrapper from "@/layouts/GuestWrapper";
import HistoryWrapper from "@/layouts/HistoryWrapper";
import ServiceWrapper from "@/layouts/ServiceWrapper";
import TradeWrapper from "@/layouts/TradeWrapper";
import { ProtectedRoute } from "@/router/auth";
import { useMemo } from "react";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
} from "react-router-dom";

export const createAppRouter = () =>
  createBrowserRouter([
    {
      path: "/",
      lazy: async () => {
        const Page = await import("@/routes/top-page-invest");
        return {
          element: (
            <ServiceWrapper>
              <Page.default />
            </ServiceWrapper>
          ),
        };
      },
    },
    // others
    {
      path: "/*",
      lazy: async () => {
        const NotFoundRoute = await import("@/routes/blank-page");
        return { Component: NotFoundRoute.default };
      },
    },
  ]);

export const AppRouter = () => {
  const router = useMemo(() => createAppRouter(), []);
  return <RouterProvider router={router} />;
};
