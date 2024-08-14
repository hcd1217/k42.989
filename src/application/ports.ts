import { DepositAddressFormData, GetAccountsFormData } from "@/types";

export interface DepositService {
  getDepositAddress(
    formData: DepositAddressFormData,
  ): Promise<unknown>;
}

export interface AccountService {
  getAccounts(formData: GetAccountsFormData): Promise<unknown>;
}

export interface MarketPricesStorageService {
  base: string;
  quote: string;
  getAvailableBalanceByToken: (token: string) => string;
}

type BN = string | number;
export interface SpotTradeFormulaService {
  base: string;
  quote: string;
  quoteAvailable: string;
  baseAvailable: string;
  lastPrices: {
    spot: BN;
    future: BN;
  };
  orderPrice: (
    orderPrice: BN,
    qty: BN,
    isBuying: boolean,
  ) => {
    orderPrice: BN;
    orderValue: BN;
    percentQtyBuy: BN;
    percentQtySell: BN;
    maxBuyingAmount: BN;
    maxSellingAmount: BN;
  };
  qty: (
    qty: BN,
    orderPrice: BN,
    isBuying: boolean,
  ) => {
    qty: BN;
    orderValue: BN;
    percentQty: BN;
  };
  percentQty: (
    percent: BN,
    orderPrice: BN,
    isBuying: boolean,
  ) => {
    percentQty: BN;
    orderValue: BN;
    qty: BN;
  };
  orderValue: (
    value: BN,
    orderPrice: BN,
    isBuying: boolean,
  ) => {
    orderValue: BN;
    qty: BN;
    percentQty: BN;
  };
  getAvailableBalanceByToken: (token: string) => BN;
}
