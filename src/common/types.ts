import { z } from "zod";
import {
  AccountType,
  OrderSide,
  OrderStatus,
  OrderType,
  TransactionStatus,
  TransactionType,
} from "./enums";
import {
  applicationFooterSchema,
  applicationSchema,
  authenticationPayloadSchema,
  userConfigSchema,
} from "./schema";

export enum UserUpdateType {
  NICK_NAME = "NICK_NAME",
  AVATAR = "AVATAR",
  UPDATE_PASSWORD = "UPDATE_PASSWORD",
  KYC_DATA = "KYC_DATA",
  ADD_EMAIL = "ADD_EMAIL",
  ADD_MOBILE = "ADD_MOBILE",
  ADD_MFA = "ADD_MFA",
  UPDATE_MFA = "UPDATE_MFA",
  VERIFY_EMAIL = "VERIFY_EMAIL",
  VERIFY_MOBILE = "VERIFY_MOBILE",
  UPDATE_ANTI_PHISHING_CODE = "UPDATE_ANTI_PHISHING_CODE",
}

export enum ImageType {
  AVATAR = "AVATAR",
  KYC_DATA_LEVEL_1_FRONT = "KYC_DATA_LEVEL_1_FRONT",
  KYC_DATA_LEVEL_1_BACK = "KYC_DATA_LEVEL_1_BACK",
  KYC_DATA_LEVEL_2_FRONT = "KYC_DATA_LEVEL_2_FRONT",
  KYC_DATA_LEVEL_2_BACK = "KYC_DATA_LEVEL_2_BACK",
}

export type GenericObject = Record<string, unknown>;

export type SPENumber = string | number;

export enum Side {
  BUY = "BUY",
  SELL = "SELL",
}

export type MarketInformation = {
  symbol: string;
  markPrice: number;
  indexPrice: number;
  lastPrice: number;
  change: number;
  percent: number;
  high: number;
  low: number;
  volume: number;
  fundingRate: number;
  turnOver: number;
  nextFundingTime: number;
  openInterest: number;
};

export type SymbolConfig = {
  id: string;
  name: string;
  symbol: string;
  description: string;
  minPrice: string;
  maxPrice: string;
  tickSize: string;
  minVolume: string;
  maxVolume: string;
  volumeStepSize: string;
  minValue: string;
  maxValue: string;
  baseAssetPrecision: number;
  quoteAssetPrecision: number;
  baseCommissionPrecision: number;
  quoteCommissionPrecision: number;
  isSpot: boolean;
  isFuture: boolean;
  defaultLeverage: string;
};

export type Account = {
  id: string;
  name: string;
  isFunding: boolean;
  isCopyMaster: boolean;
  type: AccountType;
};

export type UserConfig = z.infer<typeof userConfigSchema>;

export type BalanceOverview = {
  all: {
    totalInUsd: string;
    totalInBtc: string;
  };
  [key: string]: {
    totalInUsd: string;
    totalInBtc: string;
  };
};

// "BTC_USDT_SPOT": number,
export type MarketPrice = Record<string, number>;

export type CopyPosition = Position & {
  followerAverageEntryPrice: number;
  followerVolume: number;
  followerMargin: number;
  followerFee: number;
  trader?: {
    name: string;
    avatar: string;
  };
};

export type CopyOrder = Order & {
  totalFollowers: number;
  trader?: {
    name: string;
    avatar: string;
  };
};

export type CopyTransaction = {
  id: string;
  createdAt: number;
  uid: string;
  remark?: string;
  type: string;
  amount: number;
};

export type FollowerInformation = {
  accountId: string;
  uid: string;
  invested: number;
  current: number;
  settled: number;
  unSettled: number;
  totalCopyPositions: number;
  unrealizedPnl: number;
  realizedPnl: number;
  followFrom: number;
  remark?: string;
  pausedByMaster?: boolean;
  positions?: Record<string, number>; // BTCUSDT: 0.1
};

export type Position = {
  positionId: string;
  symbol: string;
  side: OrderSide;
  volume: number;
  closedVolume: number;
  averageClosePrice: number;
  maxOpenInterest: number;
  fee: number;
  entryPrice: number;
  markPrice: number;
  takeProfitPrice: number;
  stopLossPrice: number;
  trailingStop: number;
  liquidationPrice: number;
  leverage: number;
  margin: number;
  marginLevel: number;
  accumulatedFee: number;
  realizedPnl: number;
  unRealizedPnl: number;
  createdAt: number;
  closedAt?: number;
};

export type Order = {
  id: string;
  symbol: string;
  orderId: string;
  type: OrderType;
  status: OrderStatus;
  side: OrderSide;
  volume: string;
  reduceVolume: string;
  filled?: string;
  avgPrice?: string;
  price?: string;
  leverage?: number;
  realizedPnl?: number;
  reduceOnly?: boolean;
  postOnly?: boolean;
  createdAt: number;
};

export type Trade = {
  symbol: string;
  tradeId: string;
  volume?: string;
  side: OrderSide;
  price?: string;
  fee?: string;
  isMaker?: boolean;
  createdAt: number;
};

export type Balance = {
  accountId: string;
  name: string;
  coin: string;
  coinName: string;
  amount: string;
  usdValue: string;
  btcValue: string;
  locked: string;
  lockedUsdValue: string;
  lockedBtcValue: string;
  equity: string;
  unRealizedPnl: string;
  margin: string;
  availableMargin: string;
};

export type SPEOrderBook = Record<
  string,
  {
    a: number[][];
    b: number[][];
    T?: number;
    d?: number;
    last?: number;
    lastUpdated?: number;
  }
>;

export type Application = z.infer<typeof applicationSchema>;

export type ApplicationFooter = z.infer<
  typeof applicationFooterSchema
>;

export type { Menu } from "./schema";

// https://binance-docs.github.io/apidocs/futures/en/#kline-candlestick-data
export type KLine = [
  number, // 1499040000000,      // Open time
  string, // "0.01634790",       // Open
  string, // "0.80000000",       // High
  string, // "0.01575800",       // Low
  string, // "0.01577100",       // Close
  string, // "148976.11427815",  // Volume
  number, // 1499644799999,      // Close time
  string, // "2434.19055334",    // Quote asset volume
  number, // 308,                // Number of trades
  string, // "1756.87402397",    // Taker buy base asset volume
  string, // "28.46694368",      // Taker buy quote asset volume
  string, // "17928899.62484339" // Ignore.
][];

export type AuthenticationPayload = z.infer<
  typeof authenticationPayloadSchema
>;

export type SpeTransaction = {
  id: string;
  accountId: string;
  type: TransactionType;
  status: TransactionStatus;
  from: string;
  to: string;
  asset: string;
  toAsset: string;
  amount: string;
  fee: string;
  toAmount: string;
  jpyAmount: string;
  createdAt: number;
  updatedAt: number;
};

export type TradeList = {
  price: string;
  volume: string;
  side: Side;
  timestamp: number;
};

export type OpenTrades = {
  openOrders: Record<string, number>;
  openPositions: Record<string, number>;
};

export type CopySetting = {
  masterAccountId: string;
  ratio: number; // in percentage
  maxAmount: number;
  minAmount: number;
  maxMarginPerMonth: number;
  tpRatio: number; // in percentage
  slRatio: number; // in percentage
};

export type MasterTraderInformation = {
  masterAccountId: string;
  name: string;
  shares: {
    master: number;
  };
  ratio: number;
  paused: boolean;
  avatar: string;
  asset: number;
  netPnL: number;
  totalPositions: number;
  invested: number;
  withdraw: number;
  withDrawable: number;
};

export type CopyInformation = {
  total: number;
  unRealizedPnl: number;
  netPnL: number;
  available: number;
  withDrawable: number;
  settled: number;
  unSettled: number;
};

export type CopyMasterDetail = {
  avatar: string;
  name: string;
  publicProfile: boolean;
  shareHistory: boolean;
  minAmount: number;
  maxAmount: number;
  bio: string;
  profitSharing: {
    total: number;
    settled: number;
    unSettled: number;
  };
  followers: {
    current: number;
    max: number;
    cum: number;
    aum: number;
  };
  shares: {
    master: number;
  };
};

export type CopyMasterSetting = {
  avatar: string;
  name: string;
  bio: string;
  maxAmount: number;
  minAmount: number;
  maxFollowers: number;
  shareHistory: boolean;
  publicProfile: boolean;
};

export type CopyMaster = {
  name: string;
  avatar: string;
  ranking: number;
  masterAccountId: string;
  aum: number;
  pnlRatio: number;
  avgPnl: number;
  weeklyTrade: number;
  profit: number;
  winRate: number;
  roi: number;
  avgHoldingTime: number;
  roi90d: number;
  drawDown: number;
  followers: number;
  series: number[];
};

export type MasterPerformance = {
  roi: number;
  drawDown: number;
  pnlRatio: number;
  totalWin: number;
  totalLoss: number;
  followerPnL: number;
  avgPnL: number;
  pToL: number;
  totalTrades: number;
  avgHoldingTime: number;
  volatility: number;
  lastTrade: number; // timestamp
};

export type CopyMasterPerformance = {
  pnl: SPENumber;
  avgHoldTime: SPENumber;
  roi: SPENumber;
  totalWin: SPENumber;
  totalLose: SPENumber;
  winRate: SPENumber;
  totalPosition: SPENumber;
  totalOrder: SPENumber;
  avgPnlPerTrade: SPENumber;
  avgPnlPerPosition: SPENumber;
  weeklyTrade: SPENumber;
  lastTrade: SPENumber;
  profitToLoss: SPENumber;
  maxDrawDown: SPENumber;
};

export type PublicCopyMasterDetail = {
  name: string;
  avatar: string;
  masterAccountId: string;
  aum: number;
  sharing: number;
  performance: {
    all: CopyMasterPerformance;
    w?: CopyMasterPerformance;
    m?: CopyMasterPerformance;
    q?: CopyMasterPerformance;
  };
  followers: number;
  series: number[];
  pnlRatio: number; // TODO: calculate pnl ratio
};

export type GenerateMfaLink = {
  issuer: string;
  label: string;
  path: string;
  secret: string;
};

export type RequestPasswordChangePayload = {
  oldPassword: string;
  newPassword: string;
  verificationCode: string;
  userId: string;
};

export type LoginHistory = {
  ip: string;
  timestamp: number;
  userAgent: string;
  status: string;
};
