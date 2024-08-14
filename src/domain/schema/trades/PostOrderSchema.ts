import { t } from "@/common/utils";
import { getDictionary } from "@/services/languages";
import { FormSchema } from "@/types";

const dictionary = getDictionary();

const PostOrderSchema: FormSchema = {
  schema: {
    type: "object",
    definitions: {
      reduceOnly: {
        type: "boolean",
        default: false,
      },
      orderPrice: {
        type: "number",
      },
      triggerPrice: {
        type: "number",
      },
      triggerDirection: {
        type: "string",
        enum: ["UP", "DOWN"],
        default: "UP",
      },
      leverage: {
        type: "number",
        enum: [1, 5, 10, 20, 50, 100],
        default: 5,
      },
    },
    properties: {
      symbol: {
        type: "string",
      },
      uiBalance: {
        type: ["number", "string"],
        readOnly: true,
      },
      base: {
        type: "string",
      },
      quote: {
        type: "string",
      },
      orderSide: {
        type: "string",
        enum: ["BUY", "SELL", "LONG", "SHORT"],
        default: "BUY",
      },
      orderType: {
        type: "string",
        enum: ["Market", "Limit", "Conditional"],
        default: "Market",
      },
      volume: {
        type: "number",
        title: t(dictionary, "Volume"),
      },
      postOnly: {
        type: "boolean",
        default: false,
      },
      timeInForce: {
        type: "string",
        enum: ["GTC", "IOC", "FOK"],
        default: "GTC",
      },
      isFuture: {
        type: "boolean",
        default: true,
      },
      uiSubmit: {
        type: "string",
        readOnly: true,
      },
    },
    allOf: [
      {
        if: {
          properties: {
            isFuture: {
              const: true,
            },
          },
        },
        then: {
          properties: {
            leverage: {
              $ref: "#/definitions/leverage",
            },
            reduceOnly: {
              $ref: "#/definitions/reduceOnly",
            },
          },
        },
      },
      {
        if: {
          properties: {
            type: {
              not: {
                const: "Conditional",
              },
            },
          },
        },
        then: {
          properties: {
            triggerPrice: {
              $ref: "#/definitions/triggerPrice",
            },
            triggerDirection: {
              $ref: "#/definitions/triggerDirection",
            },
          },
        },
      },
      {
        if: {
          properties: {
            orderType: {
              const: "Conditional",
            },
          },
        },
        then: {
          properties: {
            orderPrice: {
              $ref: "#/definitions/orderPrice",
            },
          },
        },
      },
      {
        if: {
          properties: {
            orderType: {
              const: "Limit",
            },
          },
        },
        then: {
          properties: {
            orderPrice: {
              $ref: "#/definitions/orderPrice",
            },
          },
        },
      },
    ],
  },
  uiSchema: {
    "ui:order": [
      "orderSide",
      "orderType",
      "uiBalance",
      "leverage",
      "triggerPrice",
      "triggerDirection",
      "orderPrice",
      "volume",
      "postOnly",
      "reduceOnly",
      "timeInForce",
      "uiSubmit",
      "*",
    ],
    "ui:options": {
      submitButtonOptions: {
        norender: true,
      },
      classNames: "grid-form-root gap-10",
    },
    "symbol": {
      "ui:widget": "hidden",
    },
    "leverage": {
      "ui:options": {
        widget: "LeverageWidget",
        label: false,
      },
    },
    "base": {
      "ui:widget": "hidden",
    },
    "quote": {
      "ui:widget": "hidden",
    },
    "isFuture": {
      "ui:widget": "hidden",
    },
    "orderSide": {
      "ui:options": {
        widget: "OrderSideWidget",
        label: false,
      },
    },
    "orderType": {
      "ui:options": {
        widget: "OrderTypeWidget",
        label: false,
      },
    },
    "uiBalance": {
      "ui:options": {
        widget: "UiBalanceWidget",
        label: false,
      },
    },
    "triggerPrice": {
      "ui:options": {
        widget: "TriggerPriceInputFieldWidget",
        label: false,
        props: {
          suffix: "USDT",
        },
      },
    },
    "triggerDirection": {
      "ui:options": {
        widget: "TriggerDirectionWidget",
        label: false,
      },
    },
    "orderPrice": {
      "ui:options": {
        widget: "OrderPriceInputFieldWidget",
        label: false,
        props: {
          suffix: "USDT",
        },
      },
    },
    "volume": {
      "ui:options": {
        widget: "VolumeInputFieldWidget",
        label: false,
      },
    },
    "postOnly": {
      "ui:options": {
        widget: "PostOnlyWidget",
        label: false,
      },
    },
    "reduceOnly": {
      "ui:options": {
        widget: "ReduceOnlyWidget",
        label: false,
      },
    },
    "timeInForce": {
      "ui:options": {
        widget: "TimeInForceWidget",
        label: false,
      },
    },
    "uiSubmit": {
      "ui:options": {
        widget: "PlaceOrderButtonsWidget",
        label: false,
      },
    },
  },
  formData: {},
};

export default PostOrderSchema;
