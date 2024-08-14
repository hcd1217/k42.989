import {
  MarketInformation,
  MarketPrice,
  OpenTrades,
  SymbolConfig,
} from "@/common/types";
import {
  fetchAllMarketInformation,
  fetchAllSymbolsApi,
  fetchMarketInformation,
  fetchMarketPricesApi,
  fetchOpenTrades,
} from "@/services/apis";
import { create } from "zustand";

interface TradeState {
  symbols: SymbolConfig[];
  symbolMap: Record<string, SymbolConfig>;
  marketPrices: MarketPrice;
  marketInformation: Record<string, MarketInformation>;
  openTrades: OpenTrades;
  loadSymbols: () => Promise<void>;
  loadOpenTrades: () => Promise<void>;
  loadMarketPrices: () => Promise<void>;
  loadMarketInformation: (symbol: string) => Promise<void>;
  loadAllMarketInformation: () => Promise<void>;
}

const tradeStore = create<TradeState>((set, get) => ({
  symbols: [],
  symbolMap: {},
  marketPrices: {},
  marketInformation: {},
  openTrades: {
    openOrders: {},
    openPositions: {},
  },
  async loadSymbols() {
    const symbols = await fetchAllSymbolsApi();
    set({
      symbols,
      symbolMap: Object.fromEntries(
        symbols.map((symbol) => [symbol.symbol, symbol]),
      ),
    });
  },
  async loadMarketPrices() {
    set({ marketPrices: await fetchMarketPricesApi() });
  },

  async loadOpenTrades() {
    set({ openTrades: await fetchOpenTrades() });
  },

  async loadAllMarketInformation() {
    const data = await fetchAllMarketInformation();
    set({
      marketInformation: Object.fromEntries(
        data.map((info) => [info.symbol, info]),
      ),
    });
  },

  async loadMarketInformation(symbol: string) {
    const data = await fetchMarketInformation(symbol);
    set({
      marketInformation: {
        ...get().marketInformation,
        [symbol]: data,
      },
    });
  },
}));

export default tradeStore;
