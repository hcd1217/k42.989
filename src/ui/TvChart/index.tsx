import logger from "@/services/logger";
import { useMantineColorScheme } from "@mantine/core";
import { ResolutionString } from "public/tv/charting_library";
import { useEffect, useRef, useState } from "react";
import dataFeed from "./data-feed";

type Theme = "Light" | "Dark";

export const TVChart = ({
  base = "BTC",
  quote = "USDT",
  isSpot = true,
  theme = "Dark",
}: {
  base?: string;
  quote?: string;
  isSpot?: boolean;
  theme?: Theme;
}) => {
  const chartContainerRef = useRef(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [widget, setWidget] = useState<any>(null);
  const { colorScheme } = useMantineColorScheme();

  useEffect(() => {
    if (widget) {
      return;
    }
    const symbol = isSpot
      ? `${base}_${quote}_SPOT`
      : `${base}${quote}`;
    if (chartContainerRef.current) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const wg = new TradingView.widget({
        container: chartContainerRef.current,
        symbol,
        drawings_access: {
          type: "white",
          tools: [],
        },
        locale: "en",
        library_path: "/tv/charting_library/",
        datafeed: dataFeed(symbol, isSpot),
        interval: "1h" as ResolutionString,
        debug: false,
        theme: colorScheme as Theme,
        autosize: true,

        overrides: {
          // "paneProperties.background": "#ff0000",
        },
        studies_overrides: {
          // "paneProperties.background": "#ff0000",
        },
        disabled_features: [
          "symbol_info",
          "widget_logo",
          "left_toolbar",
          "header_symbol_search",
          "header_screenshot",
          "symbollist_context_menu", // cspell: disable-line
          "auto_enable_symbol_labels",
        ],
      });
      wg.onChartReady(() => {
        wg.changeTheme(colorScheme as Theme);
      });
      setWidget(wg);
      return () => widget && widget.remove();
    }
  }, [base, isSpot, theme, colorScheme, quote, widget]);

  useEffect(() => {
    try {
      widget?.changeTheme(colorScheme as Theme);
    } catch (e: unknown) {
      logger.trace(e);
    }
  }, [colorScheme, widget]);

  return (
    <>
      <div
        ref={chartContainerRef}
        style={{ height: "100%", minHeight: "500px" }}
      />
    </>
  );
};
