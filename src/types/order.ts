import { OrderSide, OrderType, TimeInForce } from "@/common/enums";

export type OrderFormData = {
  orderType: OrderType;
  symbol: string;
  orderPrice?: number;
  orderSide: OrderSide;
  leverage?: number;
  volume: number;
  postOnly?: boolean;
  reduceOnly?: boolean;
  base: string;
  quote: string;
  timeInForce: TimeInForce;
};
