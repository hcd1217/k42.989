import { TransactionStatus } from "./enums";

export const APP_CONFIG = {
  INTERNAL_TRANSFER_FEE: 1,
  FIAT_DEPOSIT: true,
  WITHDRAW: {
    MFA: true,
  },
  WITHDRAW_FEE_MAPS: {
    "TRON network": {
      USDT: 5,
    },
    "Ethereum": {
      USDT: 20,
      ETH: 0.003,
    },
    "Bitcoin": {
      BTC: 0.0007,
    },
  } as Record<string, Record<string, number>>,
};

export const MMR = [
  [10000, 0.02],
  [30000, 0.03],
  [50000, 0.05],
];

export const S3_HOST =
  "https://cci-prod-0801.s3.ap-southeast-1.amazonaws.com";
export const PROFILE_IMAGE_PREFIX = `${S3_HOST}/upload/images/traders`;

export const MASTER_SHARE_PERCENT = 10;

export const DEFAULT_LEVERAGE = 20;

export const SWAP_RATE = 0.01;

export const ROWS_PER_PAGE = 10;

export const ORDER_BOOK_LIMIT = 100;

export const DISPLAY_ORDERS: Record<string, number> = {
  BTC: 1,
  ETH: 2,
  USDT: 3,
};

export const STATUS_COLORS: Record<TransactionStatus, string> = {
  DONE: "green",
  FAILED: "red",
  PENDING: "orange",
  PROCESSING: "blue",
};

export const ASSET_COIN_LIST: Record<string, string> = {
  BTC: "Bitcoin",
  ETH: "Ethereum",
  USDT: "Tether (USDT)",
};

export const SYMBOL_MAP = {
  BINANCE: {
    BTC_USDT_SPOT: "BTCUSDT",
    ETH_USDT_SPOT: "ETHUSDT",
    BTCUSDT: "BTCUSDT",
    ETHUSDT: "ETHUSDT",
    BNBUSDT: "BNBUSDT",
  } as Record<string, string>,
};

export const AFFILIATE_REWARD_RATIO = 0.36;

export const FEE = {
  // https://www.binance.com/en/fee/schedule
  SPOT: {
    MAKER: 0.0015,
    TAKER: 0.0015,
  },
  // https://www.binance.com/en/fee/futureFee
  FUTURE: {
    MAKER: 0.001,
    TAKER: 0.001,
  },
};

export const SYMBOL_LISTS = [
  {
    icon: "/images/btc.svg",
    symbol: "BTCUSDT",
    isFuture: true,
    base: "BTC",
    quote: "USDT",
    dayChange: 1,
    volume: 0,
  },
  {
    icon: "/images/eth.svg",
    symbol: "ETHUSDT",
    isFuture: true,
    base: "ETH",
    quote: "USDT",
    dayChange: 1,
    volume: 0,
  },
  {
    icon: "/images/bnb.svg",
    symbol: "BNBUSDT",
    isFuture: true,
    base: "BNB",
    quote: "USDT",
    dayChange: 1,
    volume: 0,
  },
  {
    icon: "/images/btc.svg",
    symbol: "BTC_USDT_SPOT",
    isFuture: false,
    base: "BTC",
    quote: "USDT",
    dayChange: 1,
    volume: 0,
  },
  {
    icon: "/images/eth.svg",
    symbol: "ETH_USDT_SPOT",
    isFuture: false,
    base: "ETH",
    quote: "USDT",
  },
];
