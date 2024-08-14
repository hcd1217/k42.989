import routes from "@/router";
import { getMe } from "@/services/apis";
import appStore from "@/store/app";
import { resolver, theme } from "@/styles/theme/mantine-theme";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { useEffect, useMemo } from "react";
import { RouteObject, useRoutes } from "react-router-dom";
import { useBoolean } from "usehooks-ts";
import useSPEInterval from "./hooks/useSPEInterval";
import logger from "./services/logger";
import { assetStore } from "./store/assets";
import authStore from "./store/auth";
import tradeStore from "./store/trade";
import { SPELoading } from "./ui/SPEMisc";
import { ONE_MINUTE } from "./utils";

async function _getMe(retry = 3) {
  try {
    await getMe().then((me) => authStore.getState().setMe(me));
  } catch (e) {
    if (retry > 0) {
      await _getMe(retry - 1);
      return;
    }
    authStore.getState().logout();
    throw e;
  }
}

export default function App() {
  const { value: loaded, setTrue } = useBoolean(false);
  const { loading } = appStore();
  useSPEInterval(_loadAPIs, 30e3, true);
  useEffect(() => {
    if (loaded) {
      return;
    }
    localStorage.__APP_NAME__ = "Crypto Copy Invest";
    if (localStorage.__TOKEN__) {
      _getMe()
        .catch((e) => {
          logger.error(e);
        })
        .finally(() => {
          setTrue();
          _loadAPIs();
        });
    } else {
      setTrue();
      _loadAPIs();
    }
    tradeStore.getState().loadSymbols();
  }, [loaded, setTrue]);

  const routes = useMemo(() => {
    return _buildRoutes(loaded);
  }, [loaded]);

  useSPEInterval(() => {
    tradeStore.getState().loadAllMarketInformation();
  }, ONE_MINUTE);
  logger.trace("App loaded", loading);

  return (
    <MantineProvider
      theme={theme}
      cssVariablesResolver={resolver}
      defaultColorScheme="dark"
    >
      <ModalsProvider>{useRoutes(routes)}</ModalsProvider>
      <Notifications />
    </MantineProvider>
  );
}

function _buildRoutes(loaded: boolean) {
  if (!loaded) {
    return [
      {
        path: "/*",
        element: <SPELoading />,
      } as RouteObject,
    ];
  }
  return routes;
}

function _loadAPIs() {
  tradeStore.getState().loadMarketPrices();
  assetStore
    .getState()
    .fetchAccounts()
    .then(() => {
      assetStore.getState().fetchBalances();
    });
}
