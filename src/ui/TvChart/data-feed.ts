import { SYMBOL_MAP } from "@/common/configs";
import { KLine } from "@/common/types";
import { last } from "@/common/utils";
import logger from "@/services/logger";
import { delay } from "@/utils";
import axios from "axios";
import {
  Bar,
  ErrorCallback,
  HistoryCallback,
  IBasicDataFeed,
  LibrarySymbolInfo,
  OnReadyCallback,
  PeriodParams,
  ResolutionString,
  ResolveCallback,
  SearchSymbolsCallback,
  SubscribeBarsCallback,
  SymbolResolveExtension,
} from "public/tv/charting_library/charting_library";
import { intervals, steps, supported_resolutions } from "./config";

const timers = new Map<string, NodeJS.Timeout>();

/* eslint-disable @typescript-eslint/no-empty-function */
export default (symbol: string, isSpot: boolean) => {
  let lastBar: Bar | undefined = undefined;
  let lastCheck = 0;
  const SPOT_KLINE = "https://api.binance.com/api/v3/klines";
  const FUTURE_KLINE = "https://fapi.binance.com/fapi/v1/klines";

  const url = `${isSpot ? SPOT_KLINE : FUTURE_KLINE}?symbol=${
    SYMBOL_MAP.BINANCE[symbol]
  }`;
  logger.trace("data-feed", symbol, url);

  return {
    searchSymbols: (
      userInput: string,
      exchange: string,
      symbolType: string,
      onResult: SearchSymbolsCallback,
    ) => {
      if (
        symbolType !== "crypto" ||
        exchange !== "SPE" ||
        !symbol.includes(userInput)
      ) {
        onResult([]);
        return;
      }
      onResult([
        {
          symbol,
          full_name: symbol,
          description: "",
          exchange: "SPE",
          ticker: symbol,
          type: "crypto",
        },
      ]);
    },
    resolveSymbol: async (
      symbolName: string,
      onResolve: ResolveCallback,
      onError: ErrorCallback,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _?: SymbolResolveExtension,
    ) => {
      if (symbolName !== symbol) {
        onError("Invalid Symbol!!!");
      }
      await delay(10);
      onResolve({
        // cspell: ignore minmov, pricescale, has_intraday
        ticker: symbolName,
        name: symbolName,
        full_name: symbolName,
        exchange: "SPE",
        listed_exchange: "SPE",
        description: "",
        type: "crypto",
        session: "24x7",
        timezone: "Etc/UTC",
        minmov: 1,
        pricescale: 100,
        has_intraday: true,
        has_weekly_and_monthly: true,
        supported_resolutions,
        volume_precision: 2,
        format: "price",
      });
    },
    getBars: (
      _: LibrarySymbolInfo,
      resolution: ResolutionString,
      periodParams: PeriodParams,
      onResult: HistoryCallback,
      onError: ErrorCallback,
    ) => {
      const { from, to, countBack, firstDataRequest } = periodParams;
      const step = steps[resolution];
      const interval = intervals[resolution];
      const endTime = to * 1e3;
      const limit = countBack ? Math.min(countBack, 200) : countBack;
      const startTime = Math.max(from * 1e3, endTime - 199 * step);
      const base = `${url}&interval=${interval}&endTime=${endTime}`;
      const _url = firstDataRequest
        ? `${base}&startTime=${startTime}`
        : `${base}&limit=${limit}`;
      axios
        .get<KLine>(_url)
        .then((response) => {
          const bars: Bar[] = response.data.map((kline) => ({
            time: kline[0],
            close: parseFloat(kline[4]),
            open: parseFloat(kline[1]),
            high: parseFloat(kline[2]),
            low: parseFloat(kline[3]),
            volume: parseFloat(kline[5]),
          }));
          onResult(bars, { noData: !bars.length });
        })
        .catch((error) => {
          logger.error("getBars", error);
          onError("Cannot get bar!!!");
        });
    },
    subscribeBars: (
      symbolInfo: LibrarySymbolInfo,
      resolution: ResolutionString,
      onTick: SubscribeBarsCallback,
      listenerGuid: string,
      onResetCacheNeededCallback: () => void,
    ) => {
      timers.set(
        listenerGuid,
        setTimeout(
          _sync,
          1e3,
          listenerGuid,
          symbolInfo.name,
          resolution,
          onTick,
          onResetCacheNeededCallback,
        ),
      );
    },
    unsubscribeBars: (listenerGuid: string) => {
      clearTimeout(timers.get(listenerGuid));
    },
    onReady: async (callback: OnReadyCallback) => {
      await delay(10);
      callback({
        supported_resolutions,
        exchanges: [
          {
            value: "SPE",
            name: "SPE",
            desc: "SPE",
          },
        ],
      });
    },
  } satisfies IBasicDataFeed;

  function _sync(
    listenerGuid: string,
    symbolName: string,
    resolution: ResolutionString,
    onTick: SubscribeBarsCallback,
    onResetCacheNeededCallback: () => void,
  ) {
    logger.trace("sync...");
    const latestPrice = Number(
      localStorage[`__LAST_PRICE_${symbolName}__`] || 0,
    );
    logger.trace("latestPrice", latestPrice);
    const interval = intervals[resolution];
    const endTime = Math.floor(Date.now() / 1e3) * 1e3;
    const _url = `${url}&interval=${interval}&endTime=${endTime}&limit=1`;
    if (lastBar && lastCheck + 30e3 > Date.now()) {
      if (latestPrice !== lastBar.close) {
        lastBar.close = latestPrice;
        onTick(lastBar);
      }
    } else {
      axios
        .get<KLine>(_url)
        .then((response) => {
          lastCheck = Date.now();
          const bars: Bar[] = response.data.map((kline) => ({
            time: kline[0],
            close: parseFloat(kline[4]),
            open: parseFloat(kline[1]),
            high: parseFloat(kline[2]),
            low: parseFloat(kline[3]),
            volume: parseFloat(kline[5]),
          }));
          lastBar = last(bars);
          if (lastBar) {
            lastBar.close = latestPrice || lastBar.close;
            onTick(lastBar);
          }
        })
        .catch((error) => {
          logger.error("getBars", error);
          onResetCacheNeededCallback();
        });
    }
    timers.set(
      listenerGuid,
      setTimeout(
        _sync,
        1e3,
        listenerGuid,
        symbolName,
        resolution,
        onTick,
        onResetCacheNeededCallback,
      ),
    );
  }
};
