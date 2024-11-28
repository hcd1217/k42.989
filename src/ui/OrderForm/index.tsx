import tradeStore from "@/store/trade";
import { GridTradeProps } from "@/types";
import { Box } from "@mantine/core";
import { TradeForm } from "./TradeForm";

export default function OrderForm({
  symbol,
  base,
  quote,
  isFuture,
}: GridTradeProps) {
  return (
    <Box className="space-y-20">
      <TradeForm
        {...{
          symbol,
          base,
          quote,
          isFuture,
        }}
        onSuccess={() => {
          setTimeout(() => {
            tradeStore.getState().loadOpenTrades();
            setTimeout(() => {
              tradeStore.getState().loadOpenTrades();
            }, 5e3);
          }, 2e3);
        }}
      />
    </Box>
  );
}
