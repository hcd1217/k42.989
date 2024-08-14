import BN from "@/common/big-number";
import { MarketPrice } from "@/common/types";

export type SWAP_SIDE = "BUY" | "SELL";
export type SWAP_SYMBOL =
  | "ETHUSDT"
  | "BNBUSDT"
  | "BTCUSDT"
  | "ETH_USDT_SPOT"
  | "BTC_USDT_SPOT";

export const swapSymbols: SWAP_SYMBOL[] = [
  "BNBUSDT",
  "ETHUSDT",
  "BTCUSDT",
];

export const CoinsAsName: Record<string, string> = {
  BTC: "BTC",
  ETH: "ETH",
  USDT: "USDT",
};

export const swapSides: SWAP_SIDE[] = ["BUY", "SELL"];

export const SwapSideAsName: Record<SWAP_SIDE, SWAP_SIDE> = {
  BUY: "BUY",
  SELL: "SELL",
};

export function convertCoinToCoinUsingRate(
  from: string,
  to: string,
  marketPrices: MarketPrice,
) {
  const quoteCoin = from === "USDT" ? from : to;
  const baseCoin = to === "USDT" ? from : to;
  const symbol = `${baseCoin}_${quoteCoin}_SPOT`;
  const price = marketPrices[symbol] || 0;
  const reversedPrice = BN.div(1, price);
  return {
    quoteCoin,
    baseCoin,
    price,
    reversedPrice,
  };
}
