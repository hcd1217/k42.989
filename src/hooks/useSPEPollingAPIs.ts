import {
  fetchAccountsApi,
  fetchAllMarketInformation,
  fetchAllSymbolsApi,
  fetchBalancesApi,
  fetchMarketPricesApi,
  fetchMasterTraders,
  getMe,
} from "@/services/apis";
import { assetStore } from "@/store/assets";
import authStore from "@/store/auth";
import tradeStore from "@/store/trade";
import { ONE_MINUTE } from "@/utils";
import useSWR from "swr";

const TIME_F = 30e3;
const TIME_S = ONE_MINUTE;

export function useSPEPollingAPIs() {
  const token =
    typeof window !== "undefined" ? localStorage.__TOKEN__ : null;

  useSWR(["_getMe", token], getMe, {
    onSuccess(data) {
      authStore.getState().setMe(data);
    },
    onErrorRetry(err, key, config, revalidate, { retryCount }) {
      if (retryCount === 3) {
        authStore.getState().logout();
      }
    },
    onError() {
      authStore.getState().logout(false);
    },
  });

  useSWR(
    ["loadMarketPrices"],
    fetchMarketPricesApi, // OK
    {
      refreshInterval: TIME_F,
      refreshWhenHidden: false,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      onSuccess(marketPrices) {
        tradeStore.getState().loadMarketPrices(marketPrices);
      },
    },
  );
  useSWR(
    ["fetchBalances"],
    fetchBalancesApi, // OK
    {
      refreshInterval: TIME_F,
      onSuccess(data) {
        assetStore.getState().fetchBalances(data);
      },
    },
  );
  useSWR(
    ["fetchAccounts"],
    fetchAccountsApi, // OK
    {
      refreshInterval: TIME_F,
      refreshWhenHidden: false,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      onSuccess(accounts) {
        assetStore.getState().setAccounts(accounts);
      },
    },
  );
  useSWR(
    ["fetchMasterTraders"],
    fetchMasterTraders, // OK
    {
      refreshInterval: TIME_F,
      refreshWhenHidden: false,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      onSuccess(masterTraders) {
        assetStore.setState({
          masterTraders,
        });
      },
    },
  );
  useSWR(
    ["loadAllMarketInformation"],
    fetchAllMarketInformation, // OK
    {
      refreshInterval: TIME_S,
      refreshWhenHidden: false,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      onSuccess(data) {
        tradeStore.getState().loadAllMarketInformation(data);
      },
    },
  );
  useSWR(
    ["loadSymbols"],
    fetchAllSymbolsApi, // OK
    {
      refreshWhenHidden: false,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      onSuccess(symbols) {
        tradeStore.getState().loadSymbols(symbols);
      },
    },
  );
}
