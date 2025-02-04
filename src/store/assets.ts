import { AccountType } from "@/common/enums";
import { isFundingAccount, isTradingAccount } from "@/common/logic";
import {
  Account,
  Balance,
  BalanceOverview,
  MasterTraderInformation,
  SpeTransaction,
} from "@/common/types";
import { buildOptions } from "@/common/utils";
import {
  fetchBalancesApi
} from "@/services/apis";
import { create } from "zustand";

interface AssetState {
  balances: Balance[];
  overview: BalanceOverview;
  accounts: Account[];
  masterTraders: MasterTraderInformation[];
  accountById: Record<string, Account>;
  transactions: SpeTransaction[];
  fundingBalances: Balance[];
  tradingBalances: Balance[];
  fundingAccount?: Account;
  tradingAccount?: Account;
  tradingBalanceMap: Record<string, Balance>;
  accountTypes: {
    label: string;
    value: string;
  }[];
  fetchBalances: (item?: {
    balances: Balance[];
    overview: BalanceOverview;
  }) => Promise<void>;
  setAccounts: (accounts: Account[]) => void;
}

export const assetStore = create<AssetState>((set, get) => ({
  overview: {
    all: {
      totalInBtc: "0",
      totalInUsd: "0",
    },
  },
  fundingBalances: [],
  tradingBalances: [],
  masterTraders: [],
  balances: [],
  accounts: [],
  accountById: {},
  transactions: [],
  tradingBalanceMap: {},
  marketPrices: {
    BNBUSDT: 0,
    BTCUSDT: 0,
    ETHUSDT: 0,
    BTC_USDT_SPOT: 0,
    ETH_USDT_SPOT: 0,
  },
  accountTypes: [],

  async fetchBalances(items) {
    const { balances, overview } = items
      ? items
      : await fetchBalancesApi();
    const state = get();
    const fundingBalances = balances.filter(
      (balance) =>
        balance.accountId === state.fundingAccount?.id || "",
    );
    const tradingBalances = balances.filter(
      (balance) =>
        balance.accountId === state.tradingAccount?.id || "",
    );
    const tradingBalanceMap = Object.fromEntries(
      tradingBalances.map((balance) => {
        return [balance.coin, balance];
      }),
    );
    set({
      balances,
      overview,
      fundingBalances,
      tradingBalances,
      tradingBalanceMap,
    });
  },
  setAccounts(accounts: Account[]) {
    const accountTypes = buildOptions(
      accounts.filter((el) => el.type === AccountType.MAIN),
      "name",
      "id",
    );

    set({
      accounts,
      accountById: Object.fromEntries(
        accounts.map((account) => [account.id, account]),
      ),
      fundingAccount: accounts.find(isFundingAccount),
      tradingAccount: accounts.find(isTradingAccount),
      accountTypes,
    });
  },
}));
