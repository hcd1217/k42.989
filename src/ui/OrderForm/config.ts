import { cleanObj } from "@/common/utils";
import authStore from "@/store/auth";
import { OrderFormData } from "@/types";

export function convertToSpotTradeFormData(data: OrderFormData) {
  const accountId =
    authStore.getState().me?.accounts?.tradingAccountId || "";
  return cleanObj({
    accountId,
    symbol: data.symbol,
    side: data.orderSide,
    volume: data.volume.toString(),
    type: data.orderType.toUpperCase(),
    price: data.orderPrice?.toString(),
    postOnly: data.postOnly,
    reduceOnly: data.reduceOnly,
    timeInForce: data.timeInForce,
    leverage: data.leverage || 1,
    // leverage
    // triggerPrice
    // triggerBy
    // triggerDirection
    // takeProfit
    // takeProfitTriggerBy
    // stopLoss
    // stopLossTriggerBy
    // clientOrderId
  });
}
