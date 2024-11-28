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

export const useUser = () => {
  const { me, token } = authStore();
  return useSWR(["_getMe", me?.id, token], getMe, {
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
};

export function useSPEPollingAPIs() {
  const { me } = authStore();
  useSWR(
    ["loadMarketPrices", me?.id],
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
    ["fetchBalances", me?.id],
    fetchBalancesApi, // OK
    {
      refreshInterval: TIME_F,
      onSuccess(data) {
        assetStore.getState().fetchBalances(data);
      },
    },
  );
  useSWR(
    ["fetchAccounts", me?.id],
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
    ["fetchMasterTraders", me?.id],
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
    ["loadAllMarketInformation", me?.id],
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
    ["loadSymbols", me?.id],
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
