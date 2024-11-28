import BN from "@/common/big-number";
import { OrderSide } from "@/common/enums";
import { profit } from "@/common/logic";
import tradeStore from "@/store/trade";
import { useMemo } from "react";
import { SPETableNumber } from "./SPETableNumber";

export function SPEUnrealizedPnL({
  position,
}: {
  position: {
    symbol: string;
    side: OrderSide;
    volume: number;
    entryPrice: number;
    fee: number;
  };
}) {
  const { marketInformation } = tradeStore();
  const { prefix, unRealizedPnl, color } = useMemo(() => {
    const unRealizedPnl = profit(
      position.entryPrice,
      marketInformation[position.symbol]?.markPrice || 0,
      position.volume,
      position.side,
      position.fee,
    );
    const isProfit = BN.gt(unRealizedPnl, 0);
    return {
      unRealizedPnl,
      color: isProfit ? "green" : "red",
      prefix: isProfit ? "+" : "",
    };
  }, [
    marketInformation,
    position.entryPrice,
    position.fee,
    position.side,
    position.symbol,
    position.volume,
  ]);
  return (
    <>
      <SPETableNumber
        prefix={prefix}
        value={unRealizedPnl}
        color={color}
      />
    </>
  );
}
