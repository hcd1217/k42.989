type WithdrawInfoFormData = {
  chain: string;
  address: string;
  amount: number;
};
export type WithdrawFormData = WithdrawData & {
  infoBTC: WithdrawInfoFormData;
  infoETH: WithdrawInfoFormData;
  infoUSDT: WithdrawInfoFormData;
};

export type WithdrawData = {
  coin: string;
  chain: string;
  address: string;
  amount: number;
  mfaCode?: string;
  verificationCode?: string;
};

export type SwapFormData = {
  accountId: string;
  symbolFrom: string;
  symbolTo: string;
  side: string;
  volume: number;
};

export type DepositFormData = {
  fromAddress: string;
  txId: string;
  walletAddress: string;
  amount: number;
  coin: string;
  chain: string;
  infoBTC: DepositFormData;
  infoETH: DepositFormData;
  infoUSDT: DepositFormData;
};

export type DepositAddressFormData = {
  coin: string;
  chain: string;
};

export type DepositAddressPayload = {
  depositAddress: string;
};

export type TransferAssetsFormData = {
  coin: string;
  amount: string | number;
  fromAccountId: string;
  toAccountId: string;
};

export type GetAccountsFormData = {
  coin: string;
  amount: string | number;
  fromAccountId: string;
  toAccountId: string;
};

export type TransferFormData = {
  coin: string;
  amount: number;
  toAccountId: string;
  fromAccountId: string;
};

export type Referral = {
  tierLevel: number;
  contact: string;
  totalTradingFee: number;
  totalRebate: number;
  userDepositCode: string;
  referredAt: number;
};

export type RebateDetail = {
  coin: string;
  fee: number;
  amount: number;
  type: string;
  updatedAt: string;
};
