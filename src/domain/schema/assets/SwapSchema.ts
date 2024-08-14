import {
  CoinsAsName,
  SwapSideAsName,
  swapSides,
} from "@/domain/marketPrice";
import { FormSchema } from "@/types";

const SwapSchema: FormSchema = {
  schema: {
    properties: {
      accountId: {
        type: "string",
      },
      side: {
        type: "string",
        enum: swapSides,
        default: swapSides[0],
      },
    },
    dependencies: {
      side: {
        oneOf: [
          {
            properties: {
              symbolFrom: {
                type: "string",
                enum: [CoinsAsName.USDT],
                default: CoinsAsName.USDT,
              },
              side: {
                enum: [SwapSideAsName.BUY],
              },
              symbolTo: {
                type: "string",
                enum: [CoinsAsName.BTC, CoinsAsName.ETH],
                default: CoinsAsName.BTC,
              },
              infoPrice: {
                type: "string",
              },
              volume: {
                type: ["number", "string"],
                title: "Volume",
              },
            },
          },
          {
            properties: {
              symbolFrom: {
                type: "string",
                enum: [CoinsAsName.BTC, CoinsAsName.ETH],
                default: CoinsAsName.BTC,
              },
              side: {
                enum: [SwapSideAsName.SELL],
              },
              symbolTo: {
                type: "string",
                enum: [CoinsAsName.USDT],
                default: CoinsAsName.USDT,
              },
              infoPrice: {
                type: "string",
              },
              volume: {
                type: ["number", "string"],
                title: "Volume",
              },
            },
          },
        ],
      },
    },
  },
  uiSchema: {
    "ui:order": ["accountId", "symbolFrom", "side", "symbolTo", "*"],
    "ui:options": {
      classNames: "grid-form-root gap-0",
    },
    "ui:submitButtonOptions": {
      submitText: "Swap",
      props: {
        fullWidth: true,
      },
    },
    "symbolFrom": {
      "ui:options": {
        widget: "CoinSwapWidget",
        label: false,
      },
    },
    "symbolTo": {
      "ui:options": {
        widget: "CoinSwapWidget",
        label: false,
      },
    },
    "volume": {
      "ui:options": {
        widget: "hidden",
        label: false,
      },
    },
    "side": {
      "ui:options": {
        widget: "SwapSwitchWidget",
        label: false,
      },
    },
    "infoPrice": {
      "ui:options": {
        widget: "MarketPriceInfoWidget",
        label: false,
      },
    },
    "accountId": {
      "ui:options": {
        widget: "FundingAccountWidget",
        label: false,
      },
    },
  },
  formData: {
    accountId: "{{FUNDING_ACCOUNT_ID}}",
    side: "SELL",
    volume: "0.1",
  },
};

export default SwapSchema;
