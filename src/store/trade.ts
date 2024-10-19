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
  loadSymbols: (items?: SymbolConfig[]) => Promise<void>;
  loadOpenTrades: (items?: OpenTrades) => Promise<void>;
  loadMarketPrices: (item?: MarketPrice) => Promise<void>;
  loadMarketInformation: (
    symbol: string,
    item?: MarketInformation,
  ) => Promise<void>;
  loadAllMarketInformation: (
    items?: MarketInformation[],
  ) => Promise<void>;
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
  async loadSymbols(items) {
    const symbols = items ? items : await fetchAllSymbolsApi();
    set({
      symbols,
      symbolMap: Object.fromEntries(
        symbols.map((symbol) => [symbol.symbol, symbol]),
      ),
    });
  },
  async loadMarketPrices(item) {
    set({ marketPrices: item ? item : await fetchMarketPricesApi() });
  },

  async loadOpenTrades(item) {
    set({ openTrades: item ? item : await fetchOpenTrades() });
  },

  async loadAllMarketInformation(items) {
    const data = items ? items : await fetchAllMarketInformation();
    set({
      marketInformation: Object.fromEntries(
        data.map((info) => [info.symbol, info]),
      ),
    });
  },

  async loadMarketInformation(symbol: string, item) {
    const data = item ? item : await fetchMarketInformation(symbol);
    set({
      marketInformation: {
        ...get().marketInformation,
        [symbol]: data,
      },
    });
  },
}));

export default tradeStore;
