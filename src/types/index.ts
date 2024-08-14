export * from "@/common/types";
export * from "./asset";
export * from "./auth";
export * from "./form";
export * from "./order";

export type RouteConfig = {
  path: string;
  element: React.JSX.Element;
};

export type SPEResponse = {
  code: number;
  message: string;
  result: unknown | null;
};

export type GridTradeProps = {
  isFuture?: boolean;
  isSpot?: boolean;
  symbol: string;
  base: string;
  quote: string;
};
