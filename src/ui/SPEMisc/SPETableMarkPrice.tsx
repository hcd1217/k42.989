import tradeStore from "@/store/trade";
import { SPETableNumber } from "./SPETableNumber";

export function SPETableMarkPrice({ symbol }: { symbol: string }) {
  const { marketInformation } = tradeStore();
  return (
    <SPETableNumber value={marketInformation[symbol]?.markPrice} />
  );
}
