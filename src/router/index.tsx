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
    {
      path: "/copy-trading",
      lazy: async () => {
        const Page = await import("@/routes/copy-trade-invest");
        return {
          element: (
            <ServiceWrapper>
              <Page.default />
            </ServiceWrapper>
          ),
        };
      },
    },
    {
      path: "/copy-trading/:id",
      lazy: async () => {
        const Page = await import("@/routes/copy-trade-detail");
        return {
          element: (
            <ServiceWrapper>
              <Page.default />
            </ServiceWrapper>
          ),
        };
      },
    },
    {
      path: "/trade/spot/:base/:quote",
      lazy: async () => {
        const Page = await import("@/routes/spot");
        return {
          element: (
            <TradeWrapper>
              <Page.default />
            </TradeWrapper>
          ),
        };
      },
    },
    {
      path: "/trade/futures/:base/:quote",
      lazy: async () => {
        const Page = await import("@/routes/future");
        return {
          element: (
            <TradeWrapper>
              <Page.default />
            </TradeWrapper>
          ),
        };
      },
    },

    // Guest only
    {
      path: "/login",
      lazy: async () => {
        const Page = await import("@/routes/login");
        return {
          element: (
            <GuestWrapper>
              <Page.default />
            </GuestWrapper>
          ),
        };
      },
    },
    {
      path: "/logout",
      lazy: async () => {
        const Page = await import("@/routes/logout");
        return {
          element: (
            <GuestWrapper>
              <Page.default />
            </GuestWrapper>
          ),
        };
      },
    },
    {
      path: "/register/:referer",
      lazy: async () => {
        const Page = await import("@/routes/sign-up");
        return {
          element: (
            <GuestWrapper>
              <Page.default />
            </GuestWrapper>
          ),
        };
      },
    },
    {
      path: "/register",
      lazy: async () => {
        const Page = await import("@/routes/sign-up");
        return {
          element: (
            <GuestWrapper>
              <Page.default />
            </GuestWrapper>
          ),
        };
      },
    },
    {
      path: "/reset-password",
      lazy: async () => {
        const Page = await import("@/routes/reset-password");
        return {
          element: (
            <GuestWrapper>
              <Page.default />
            </GuestWrapper>
          ),
        };
      },
    },
    {
      path: "/forgot-password",
      lazy: async () => {
        const Page = await import("@/routes/forgot-password");
        return {
          element: (
            <GuestWrapper>
              <Page.default />
            </GuestWrapper>
          ),
        };
      },
    },
    // authenticated
    {
      path: "",
      element: (
        <ProtectedRoute>
          <AuthWrapper>
            <Outlet />
          </AuthWrapper>
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/wallet",
          lazy: async () => {
            const Page = await import("@/routes/wallet");
            return {
              element: (
                <AssetWrapper>
                  <Page.default />
                </AssetWrapper>
              ),
            };
          },
          // element: "Wallet",
          // wrapper: "AssetWrapper",
          // authOnly: true,
        },
        {
          path: "/wallet/records/swap",
          lazy: async () => {
            const Page = await import("@/routes/wallet/history/swap");
            return {
              element: (
                <HistoryWrapper>
                  <Page.default />
                </HistoryWrapper>
              ),
            };
          },
        },
        {
          path: "/wallet/records/deposit",
          lazy: async () => {
            const Page = await import(
              "@/routes/wallet/history/deposit"
            );
            return {
              element: (
                <HistoryWrapper>
                  <Page.default />
                </HistoryWrapper>
              ),
            };
          },
          // element: "DepositHistory",
          // wrapper: "HistoryWrapper",
          // authOnly: true,
        },
        {
          path: "/wallet/records/fiat-deposit",
          lazy: async () => {
            const Page = await import(
              "@/routes/wallet/history/fiat-deposit"
            );
            return {
              element: (
                <HistoryWrapper>
                  <Page.default />
                </HistoryWrapper>
              ),
            };
          },
          // element: "FiatDeposit",
          // wrapper: "HistoryWrapper",
          // authOnly: true,
        },
        {
          path: "/wallet/records/withdraw",
          lazy: async () => {
            const Page = await import(
              "@/routes/wallet/history/withdraw"
            );
            return {
              element: (
                <HistoryWrapper>
                  <Page.default />
                </HistoryWrapper>
              ),
            };
          },
          // element: "WithdrawHistory",
          // wrapper: "HistoryWrapper",
          // authOnly: true,
        },
        {
          path: "/wallet/records/others",
          lazy: async () => {
            const Page = await import(
              "@/routes/wallet/history/others"
            );
            return {
              element: (
                <HistoryWrapper>
                  <Page.default />
                </HistoryWrapper>
              ),
            };
          },
          // element: "OthersHistory",
          // wrapper: "HistoryWrapper",
          // authOnly: true,
        },

        {
          path: "/copy/master/positions",
          lazy: async () => {
            const Page = await import(
              "@/routes/copy/master-positions"
            );
            return {
              element: (
                <CopyTradeWrapper>
                  <Page.default />
                </CopyTradeWrapper>
              ),
            };
          },
          // element: "MasterPositions",
          // wrapper: "CopyTradeWrapper",
          // authOnly: true,
        },
        {
          path: "/copy/master/followers",
          lazy: async () => {
            const Page = await import(
              "@/routes/copy/followers-positions"
            );
            return {
              element: (
                <CopyTradeWrapper>
                  <Page.default />
                </CopyTradeWrapper>
              ),
            };
          },
          // element: "FollowerPositions",
          // wrapper: "CopyTradeWrapper",
          // authOnly: true,
        },
        {
          path: "/copy/master/orders",
          lazy: async () => {
            const Page = await import("@/routes/copy/master-orders");
            return {
              element: (
                <CopyTradeWrapper>
                  <Page.default />
                </CopyTradeWrapper>
              ),
            };
          },
          // element: "MasterOrders",
          // wrapper: "CopyTradeWrapper",
          // authOnly: true,
        },
        {
          path: "/copy/master/transactions",
          lazy: async () => {
            const Page = await import(
              "@/routes/copy/master-transactions"
            );
            return {
              element: (
                <CopyTradeWrapper>
                  <Page.default />
                </CopyTradeWrapper>
              ),
            };
          },
          // element: "MasterTransactions",
          // wrapper: "CopyTradeWrapper",
          // authOnly: true,
        },
        {
          path: "/copy/mine/traders",
          lazy: async () => {
            const Page = await import("@/routes/copy/my-traders");
            return {
              element: (
                <CopyTradeWrapper>
                  <Page.default />
                </CopyTradeWrapper>
              ),
            };
          },
          // element: "MyTraders",
          // wrapper: "CopyTradeWrapper",
          // authOnly: true,
        },
        {
          path: "/copy/mine/positions",
          lazy: async () => {
            const Page = await import("@/routes/copy/my-positions");
            return {
              element: (
                <CopyTradeWrapper>
                  <Page.default />
                </CopyTradeWrapper>
              ),
            };
          },
          // element: "MyPositions",
          // wrapper: "CopyTradeWrapper",
          // authOnly: true,
        },
        {
          path: "/copy/mine/orders",
          lazy: async () => {
            const Page = await import("@/routes/copy/my-orders");
            return {
              element: (
                <CopyTradeWrapper>
                  <Page.default />
                </CopyTradeWrapper>
              ),
            };
          },
          // element: "MyOrders",
          // wrapper: "CopyTradeWrapper",
          // authOnly: true,
        },
        {
          path: "/copy/mine/transactions",
          lazy: async () => {
            const Page = await import(
              "@/routes/copy/my-transactions"
            );
            return {
              element: (
                <CopyTradeWrapper>
                  <Page.default />
                </CopyTradeWrapper>
              ),
            };
          },
          // element: "MyTransactions",
          // wrapper: "CopyTradeWrapper",
          // authOnly: true,
        },
        {
          path: "/user",
          lazy: async () => {
            const Page = await import("@/routes/user");
            return {
              element: (
                <TradeWrapper>
                  <Page.default />
                </TradeWrapper>
              ),
            };
          },
          // element: "User",
          // wrapper: "TradeWrapper",
          // authOnly: true,
        },
        {
          path: "/user/invite",
          lazy: async () => {
            const Page = await import("@/routes/user-invite");
            return {
              element: (
                <TradeWrapper>
                  <Page.default />
                </TradeWrapper>
              ),
            };
          },
          // element: "Invite",
          // wrapper: "TradeWrapper",
          // authOnly: true,
        },
        {
          path: "/user/bind-ga",
          lazy: async () => {
            const Page = await import("@/routes/user-bind-ga");
            return {
              element: (
                <TradeWrapper>
                  <Page.default />
                </TradeWrapper>
              ),
            };
          },
          // element: "BindGA",
          // wrapper: "TradeWrapper",
          // authOnly: true,
        },
        {
          path: "/user/rebind-ga",
          lazy: async () => {
            const Page = await import("@/routes/user-rebind-ga");
            return {
              element: (
                <TradeWrapper>
                  <Page.default />
                </TradeWrapper>
              ),
            };
          },
          // element: "ReBindGA",
          // wrapper: "TradeWrapper",
          // authOnly: true,
        },
        {
          path: "/user/kyc",
          lazy: async () => {
            const Page = await import("@/routes/user-kyc");
            return {
              element: (
                <TradeWrapper>
                  <Page.default />
                </TradeWrapper>
              ),
            };
          },
          // element: "KYC",
          // wrapper: "TradeWrapper",
          // authOnly: true,
        },
        {
          path: "/user/modify-password",
          lazy: async () => {
            const Page = await import(
              "@/routes/user-modify-password"
            );
            return {
              element: (
                <TradeWrapper>
                  <Page.default />
                </TradeWrapper>
              ),
            };
          },
          // element: "ModifyPassword",
          // wrapper: "TradeWrapper",
          // authOnly: true,
        },
      ],
    },
    {
      path: "/privacy-policy",
      lazy: async () => {
        const Page = await import("@/routes/privacy-policy");
        return {
          element: (
            <ServiceWrapper>
              <Page.default />
            </ServiceWrapper>
          ),
        };
      },
    },
    {
      path: "/terms-conditions",
      lazy: async () => {
        const Page = await import(
          "@/routes/terms-service-conditions"
        );
        return {
          element: (
            <ServiceWrapper>
              <Page.default />
            </ServiceWrapper>
          ),
        };
      },
    },
    {
      path: "/risk-disclosure",
      lazy: async () => {
        const Page = await import(
          "@/routes/terms-service-risk-disclosure"
        );
        return {
          element: (
            <ServiceWrapper>
              <Page.default />
            </ServiceWrapper>
          ),
        };
      },
    },
    {
      path: "/about",
      lazy: async () => {
        const Page = await import("@/routes/about");
        return {
          element: (
            <ServiceWrapper>
              <Page.default />
            </ServiceWrapper>
          ),
        };
      },
    },
    {
      path: "/inquiry",
      lazy: async () => {
        const Page = await import("@/routes/inquiry");
        return {
          element: (
            <ServiceWrapper>
              <Page.default />
            </ServiceWrapper>
          ),
        };
      },
    },
    {
      path: "/referer",
      lazy: async () => {
        const Page = await import(
          "@/routes/crypto-copy-invest-information/induction"
        );
        return {
          element: (
            <ServiceWrapper>
              <Page.default />
            </ServiceWrapper>
          ),
        };
      },
    },
    {
      path: "/referral-program",
      lazy: async () => {
        const Page = await import(
          "@/routes/crypto-copy-invest-information/referral-program"
        );
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
