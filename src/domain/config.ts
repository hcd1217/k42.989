// TODO: change image
import bnb from "@/assets/images/coin/bnb.svg";
import btc from "@/assets/images/coin/btc.svg";
import eth from "@/assets/images/coin/eth.svg";
import usdt from "@/assets/images/coin/usdt.svg";

import { ASSET_COIN_LIST } from "@/common/configs";

export const IS_DEV =
  true &&
  ["localhost", "127.0.0.1", "0.0.0.0"].includes(
    window.location.hostname,
  );

export const COIN_IMAGES: Record<string, string> = {
  BTC: btc,
  ETH: eth,
  USDT: usdt,
  BTCUSDT: btc,
  ETHUSDT: eth,
  BNBUSDT: bnb,
  BTC_USDT_SPOT: btc,
  ETH_USDT_SPOT: eth,
};

export const ASSET_COIN_OPTIONS = Object.entries(ASSET_COIN_LIST).map(
  ([coin, name]) => ({
    label: name,
    value: coin,
    image: COIN_IMAGES[coin] || "",
  }),
);

export const MODAL_STYLES = {
  centered: true,
  withinPortal: true,
  size: "lg",
  padding: "xl",
  portalProps: {},
  styles: {
    title: {
      fontSize: "20px",
    },
  },
};
