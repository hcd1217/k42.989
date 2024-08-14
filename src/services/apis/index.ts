export * as axios from "./_axios";

import { OrderSide, OrderType } from "@/common/enums";
import { updateUserPayloadSchema } from "@/common/schema";
import {
  Account,
  AuthenticationPayload,
  Balance,
  BalanceOverview,
  CopyInformation,
  CopyMaster,
  CopyMasterDetail,
  CopyMasterSetting,
  CopyOrder,
  CopyPosition,
  CopySetting,
  CopyTransaction,
  FollowerInformation,
  GenerateMfaLink,
  GenericObject,
  ImageType,
  MarketInformation,
  MarketPrice,
  MasterTraderInformation,
  OpenTrades,
  Order,
  Position,
  PublicCopyMasterDetail,
  RequestPasswordChangePayload,
  SpeTransaction,
  SymbolConfig,
  Trade,
  UserUpdateType,
} from "@/common/types";
import { assetStore } from "@/store/assets";
import authStore from "@/store/auth";
import tradeStore from "@/store/trade";
import { delay, ONE_MINUTE } from "@/utils";
import { avatarUrl } from "@/utils/utility";
import { LRUCache } from "lru-cache";
import queryString from "query-string";
import { z } from "zod";
import logger from "../logger";
import axios, { getApi } from "./_axios";

type UserUpdatePayload = z.infer<typeof updateUserPayloadSchema>;

export default axios;

const cache = new LRUCache({
  max: 500,
  updateAgeOnGet: true,
  ttl: 30e3,
});

export function fetchAllTraders() {
  return _fetchAndCache("traders", _fetch, 10 * ONE_MINUTE);
  function _fetch() {
    return getApi<{ traders: CopyMaster[] }>(
      "/api/copy/traders",
    ).then(({ traders }) =>
      traders.map((el) => ({
        ...el,
        avatar: avatarUrl(el?.avatar) || "",
      })),
    );
  }
}

export function fetchTrader(masterAccountId: string) {
  return _fetchAndCache(
    `traders:${masterAccountId}`,
    _fetch,
    10 * ONE_MINUTE,
  );
  function _fetch() {
    return getApi<PublicCopyMasterDetail>(
      `/api/copy/traders/${masterAccountId}`,
    );
  }
}
export function fetchAllSymbolsApi() {
  logger.debug("Fetching all symbols");
  return _fetchAndCache("symbols", _fetch);
  function _fetch() {
    return getApi<{ symbols: SymbolConfig[] }>(
      "/api/information/symbols",
    ).then((res) => res.symbols);
  }
}

export function fetchOrderBooks(symbol: string) {
  return _fetchAndCache(`orderbook.${symbol}`, _fetch, 500);
  function _fetch() {
    return getApi<{
      a: [number, number, number, number][];
      b: [number, number, number, number][];
    }>(`/api/market/order-book?symbol=${symbol}`);
  }
}

export async function fetchAllMarketInformation() {
  return _fetchAndCache("market.information", _fetch);
  function _fetch() {
    return getApi<MarketInformation[]>("/api/market/information/all");
  }
}

export function fetchMarketInformation(symbol: string) {
  return _fetchAndCache(`market.information.${symbol}`, _fetch);
  function _fetch() {
    return getApi<MarketInformation>(
      `/api/market/information?symbol=${symbol}`,
    );
  }
}

export function fetchMarketPricesApi() {
  return _fetchAndCache("market.prices", _fetch);
  function _fetch() {
    return getApi<MarketPrice>("/api/market/prices");
  }
}

// Auth API
export async function fetchDepositAddressApi(params: {
  chain: string;
  coin: string;
}) {
  const { depositAddress } = await _fetchAndCache(
    `deposit.address.${params.chain}`,
    _fetch,
    30e3,
  );
  return depositAddress;

  function _fetch() {
    return getApi<{ depositAddress: string }>(
      "/api/deposit/address",
      { params },
    );
  }
}

export async function fetchBalancesApi() {
  if (!authStore.getState().me?.id) {
    await delay(10);
    return {
      balances: [],
      overview: { all: { totalInBtc: "0", totalInUsd: "0" } },
    } as {
      overview: BalanceOverview;
      balances: Balance[];
    };
  }
  return getApi<{
    overview: BalanceOverview;
    balances: Balance[];
  }>("/api/balances").then((res) => {
    res.balances.sort((a, b) => a.coin.localeCompare(b.coin));
    return res;
  });
}

export async function fetchAccountsApi() {
  if (!authStore.getState().me?.id) {
    await delay(10);
    return [] as Account[];
  }

  return _fetchAndCache("accounts", _fetch, 60e3);

  async function _fetch() {
    return getApi<{
      accounts: Account[];
    }>("/api/accounts").then(({ accounts = [] }) => {
      // Memo: funding account is always on top
      return accounts.sort((a) => (a.isFunding ? -1 : 1));
    });
  }
}

export async function fetchTransactions(
  type: string | string[],
  limit: number,
  cursor: number | string,
  reverse: boolean,
) {
  const accountId = assetStore.getState().tradingAccount?.id;
  if (!accountId) {
    logger.trace("No account found");
    await delay(1);
    return [] as SpeTransaction[];
  }
  return getApi<SpeTransaction[]>("/api/transactions/list", {
    params: {
      types: Array.isArray(type) ? type.join(",") : type,
      limit,
      cursor,
      reverse,
    },
  }).then((data) => {
    data.sort((a, b) => b.id.localeCompare(a.id));
    return data;
  });
}

export async function cancelOrderApi(orderId: string) {
  const accountId = assetStore.getState().tradingAccount?.id;
  if (!accountId) {
    await delay(10);
    return;
  }
  await axios
    .post("/api/order/cancel", { orderId, accountId })
    .then((res) => {
      if (res.data.code !== 0) {
        throw new Error("Failed to cancel order");
      } else {
        _reloadOpenTrades();
      }
    });
}

export async function closeOrderApi(
  symbol: string,
  volume: string,
  side: OrderSide,
) {
  const accountId = assetStore.getState().tradingAccount?.id;
  if (!accountId) {
    await delay(10);
    return;
  }
  await axios
    .post("/api/order/create", {
      accountId,
      symbol,
      side,
      volume,
      type: OrderType.MARKET,
    })
    .then((res) => {
      if (res.data.code !== 0) {
        throw new Error("Failed to close order");
      } else {
        _reloadOpenTrades();
      }
    });
}

export async function inquiryApi(data: GenericObject) {
  await axios.post("/api/inquiry", data).then((res) => {
    if (res.data.code !== 0) {
      throw new Error(
        "Failed to send inquiry: You send too many requests",
      );
    }
  });
}

export function getUploadUrlApi(type: ImageType, name: string) {
  return getApi<{ url: string }>(
    `/api/me/upload/url?type=${type}&name=${name}`,
  ).then((res) => res.url);
}

export function updateUserApi(
  type: UserUpdateType,
  payload: Omit<UserUpdatePayload, "type">,
) {
  return axios.post("/api/me/update", {
    type,
    ...payload,
  });
}
export function requestChangePasswordApi(
  payload: RequestPasswordChangePayload,
) {
  return axios.post("/api/auth/change-password/force", {
    ...payload,
  });
}

export function loginHistoryApi() {
  return axios.get("/api/me/login-history");
}

export function generateMfaApi() {
  return axios
    .post<{ result: GenerateMfaLink }>("/api/me/generate/mfa")
    .then((res) => res.data.result);
}
type VerifyCodeType =
  | "EMAIL"
  | "MOBILE"
  | "UPDATE_ANTI_PHISHING_CODE"
  | "NEW_EMAIL";

export function sendVerifyCode(type: VerifyCodeType) {
  return axios.post("/api/me/verify", { type });
}

export async function fetchOpenTrades() {
  const accountId = assetStore.getState().tradingAccount?.id;
  if (!accountId) {
    await delay(10);
    return {
      openOrders: {},
      openPositions: {},
    } as OpenTrades;
  }
  return getApi<OpenTrades>("/api/trades/open", {
    params: { accountId },
  });
}

export async function fetchTrades(symbol?: string) {
  const accountId = assetStore.getState().tradingAccount?.id;
  if (!accountId) {
    await delay(10);
    return [] as Trade[];
  }
  try {
    const trades = await getApi<{ trades: Trade[] }>(
      "/api/trades/list",
      {
        params: { accountId, symbol, limit: 100 },
      },
    ).then((res) => res.trades);
    return trades;
  } catch (err) {
    logger.error("Failed to fetch trades", err);
    return [] as Trade[];
  }
}

export async function fetchClosedPositions(symbol?: string) {
  const accountId = assetStore.getState().tradingAccount?.id;
  if (!accountId) {
    await delay(10);
    return [] as Position[];
  }
  return getApi<{ positions: Position[] }>("/api/positions/closed", {
    params: { accountId, symbol, limit: 100 },
  }).then((res) => res.positions);
}

export async function fetchOpenPositions(symbol?: string) {
  const accountId = assetStore.getState().tradingAccount?.id;
  if (!accountId) {
    await delay(10);
    return [] as Position[];
  }
  return getApi<{ positions: Position[] }>("/api/positions/open", {
    params: { accountId, symbol, limit: 100 },
  }).then((res) => res.positions);
}

export async function fetchActiveOrders(symbol?: string) {
  const accountId = assetStore.getState().tradingAccount?.id;
  if (!accountId) {
    await delay(10);
    return [] as Order[];
  }
  return getApi<{ orders: Order[] }>("/api/orders/active", {
    params: { accountId, symbol, limit: 100 },
  }).then((res) => res.orders);
}

export async function fetchOrders(symbol?: string) {
  const accountId = assetStore.getState().tradingAccount?.id;
  if (!accountId) {
    await delay(10);
    return [] as Order[];
  }
  const orders = await getApi<{ orders: Order[] }>(
    "/api/orders/list",
    {
      params: { accountId, symbol, limit: 100 },
    },
  ).then((res) => res?.orders || []);
  logger.trace("Fetched orders", orders);
  return orders;
}

export async function getMe(): Promise<AuthenticationPayload> {
  if (!localStorage.__TOKEN__) {
    throw new Error("Not logged in");
  }
  const me = await getApi<AuthenticationPayload>("/api/me");
  if (!me?.id) {
    throw new Error("Failed to get me");
  }
  return me;
}

export async function checkMfa({
  email,
  mobile,
  type,
}: {
  type: 1 | 2;
  mobile?: string;
  email?: string;
}): Promise<{ hasMfa: boolean }> {
  type MfaCheckResponse = {
    result: {
      hasMfa: boolean;
    };
  };

  return axios
    .post<MfaCheckResponse>("/api/check", { email, mobile, type })
    .then((res) => {
      const hasMfa = Boolean(res.data?.result?.hasMfa);
      return { hasMfa };
    })
    .catch((err) => {
      logger.error("Failed to check MFA", err);
      return { hasMfa: false };
    });
}

export function fetch<T>(url: string) {
  return axios
    .get<{ result: T }>(url)
    .then((response) => response.data.result);
}

// Copy API
//

export async function remarkFollowerApi(
  accountId: string,
  remark: string,
) {
  await axios
    .post("/api/copy/master/follower/remark", {
      accountId,
      remark,
    })
    .then((res) => {
      if (res.data.code !== 0) {
        throw new Error("Failed to pause follower");
      }
    });
}

export async function addCopyFundApi(
  masterAccountId: string,
  fromAccountId: string,
  amount: number,
) {
  await axios
    .post("/api/copy/fund", {
      masterAccountId,
      fromAccountId,
      amount,
    })
    .then((res) => {
      if (res.data.code !== 0) {
        throw new Error("Failed to add fund");
      }
    });
}

export async function withdrawCopyFundApi(
  masterAccountId: string,
  fromAccountId: string,
  amount: number,
) {
  await axios
    .post("/api/copy/fund/withdraw", {
      masterAccountId,
      fromAccountId,
      amount,
    })
    .then((res) => {
      if (res.data.code !== 0) {
        throw new Error("Failed to add fund");
      }
    });
}

export function fetchCopySetting(masterAccountId: string) {
  return getApi<CopySetting>(
    `/api/copy/mine/setting?masterAccountId=${masterAccountId}`,
  );
}

export function followApi(
  masterAccountId: string,
  ratio: number,
  amount: number,
) {
  return axios
    .post("/api/copy/follow", {
      masterAccountId,
      ratio,
      amount,
    })
    .then((res) => {
      if (res.data.code !== 0) {
        throw new Error("Failed to follow");
      }
    });
}

export function saveCopySetting(setting: CopySetting) {
  return axios.post("/api/copy/mine/setting", setting).then((res) => {
    if (res.data.code !== 0) {
      throw new Error("Failed to pause follower");
    }
  });
}

export function unFollowApi(masterAccountId: string) {
  return axios
    .post("/api/copy/un-follow", {
      masterAccountId,
    })
    .then((res) => {
      if (res.data.code !== 0) {
        throw new Error("Failed to pause follower");
      }
    });
}

export async function pauseFollowerApi(accountId: string) {
  await axios
    .post("/api/copy/master/pause", {
      accountId,
      pausedByMaster: true,
    })
    .then((res) => {
      if (res.data.code !== 0) {
        throw new Error("Failed to pause follower");
      }
    });
}

export async function fetchMyMasterDetail() {
  return getApi<CopyMasterDetail>("/api/copy/master/me");
}

export async function fetchMyCopyInformation() {
  return getApi<CopyInformation>("/api/copy/mine/information");
}

export async function updateMasterSettingApi(
  params: CopyMasterSetting,
) {
  await axios.post("/api/copy/master/me/update", params);
}

export async function fetchCopyOrders(
  cursor: string,
  reverse: boolean,
  limit: number,
) {
  const base = "/api/copy/mine/orders";
  return getApi<{ orders: CopyOrder[] }>(
    `${base}?reverse=${reverse}&cursor=${cursor || ""}&limit=${limit || 10
    }`,
  ).then((res) => res.orders);
}

export async function fetchCopyTransactions(
  cursor: string,
  limit: number,
  reverse: boolean,
) {
  const base = "/api/copy/master/me/transactions";
  return getApi<{ transactions: CopyTransaction[] }>(
    `${base}?reverse=${reverse}&cursor=${cursor || ""}&limit=${limit || 10
    }`,
  ).then((res) => res.transactions);
}

export async function fetchMasterCopyOrders(
  masterAccountId: string,
  cursor: string,
  reverse: boolean,
  limit: number,
) {
  const base = "/api/copy/master/orders";
  return getApi<{ orders: CopyOrder[] }>(
    `${base}?${queryString.stringify({
      cursor,
      reverse,
      limit,
      masterAccountId,
    })}`,
  ).then((res) => res.orders);
}

export async function fetchMasterOpenCopyPositions(
  masterAccountId: string,
) {
  const path =
    "/api/copy/master/positions/open?masterAccountId=" +
    masterAccountId;
  return getApi<{ positions: CopyPosition[] }>(path).then(
    (res) => res.positions,
  );
}

export async function fetchCopyOpenPositions(
  masterAccountId?: string,
) {
  let path = "/api/copy/mine/positions";
  if (masterAccountId) {
    path = `/api/copy/mine/positions/open?masterAccountId=${masterAccountId}`;
  }
  return getApi<{ positions: CopyPosition[] }>(path).then(
    (res) => res.positions,
  );
}

export async function fetchClosedCopyPositions() {
  const path = "/api/copy/master/me/positions/history";
  return getApi<{ positions: CopyPosition[] }>(path).then(
    (res) => res.positions,
  );
}

export async function fetchFollowerInformation() {
  const path = "/api/copy/master/me/followers";
  return getApi<{ accounts: FollowerInformation[] }>(path).then(
    (res) => res.accounts,
  );
}

export async function fetchMasterTraders() {
  const me = authStore.getState().me;
  if (!me || me.isCopyMaster) {
    return [] as MasterTraderInformation[];
  }
  logger.debug("Fetching master traders...");
  return _fetchAndCache("masterTraders", _fetch, 10 * ONE_MINUTE);
  function _fetch() {
    return getApi<{ traders: MasterTraderInformation[] }>(
      "/api/copy/mine/traders",
    ).then((res) => res.traders);
  }
}

function _reloadOpenTrades() {
  setTimeout(() => {
    tradeStore.getState().loadOpenTrades();
  }, 3e3);
}

async function _fetchAndCache<
  T extends GenericObject | GenericObject[],
>(key: string, fn: () => Promise<T>, ttl = 3e3) {
  if (cache.has(`fetchAndCache.${key}`)) {
    await delay(1);
    const res = cache.get(`fetchAndCache.${key}`) as T;
    return res;
  }
  return fn().then((res) => {
    cache.set(`fetchAndCache.${key}`, res, { ttl });
    return res;
  });
}
export async function login({
  email,
  mobile,
  mfaCode,
  password,
}: {
  password: string;
  mobile?: string;
  email?: string;
  mfaCode?: string;
}): Promise<{ token: string; forceChangePassword: boolean }> {
  try {
    const res = await axios.post("/api/login", {
      type: email ? 1 : 2,
      email,
      mobile,
      password,
      mfaCode,
    });
    const token = res.data?.result?.token;
    if (token) {
      return res.data?.result;
    } else {
      throw new Error(res.data.message || "Token not found");
    }
  } catch (err) {
    throw new Error(
      (err as Error)?.message || "Something went wrong",
    );
  }
}
