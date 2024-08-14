import { t } from "@/common/utils";
import { getDictionary } from "@/services/languages";
import { FormSchema } from "@/types";

const dictionary = getDictionary();

const DepositSchema: FormSchema = {
  schema: {
    definitions: {
      coin: {
        type: "string",
        enum: ["USDT", "BTC", "ETH"],
        title: t(dictionary, "Choose coin to deposit"),
      },
      qrcode: {
        type: "string",
        title: "",
        readOnly: true,
      },
      chain: {
        type: "string",
        title: "",
      },
      walletAddress: {
        type: "string",
        title: "",
        readOnly: true,
      },
      info: {
        type: "string",
        readOnly: true,
      },
      infoETH: {
        type: "object",
        title: "",
        properties: {
          chain: {
            type: "string",
            enum: ["Ethereum", "Binance Smart Chain"],
            default: "Ethereum",
            title: t(dictionary, "Chain"),
          },
          walletAddress: {
            $ref: "#/definitions/walletAddress",
            readOnly: true,
          },
          info: {
            $ref: "#/definitions/info",
          },
        },
      },
      infoBTC: {
        type: "object",
        title: "",
        properties: {
          chain: {
            type: "string",
            enum: ["Bitcoin"],
            default: "Bitcoin",
            title: t(dictionary, "Chain"),
          },
          walletAddress: {
            $ref: "#/definitions/walletAddress",
            readOnly: true,
          },
          info: {
            $ref: "#/definitions/info",
          },
        },
        required: ["walletAddress", "chain"],
      },
      infoUSDT: {
        type: "object",
        title: "",
        properties: {
          chain: {
            type: "string",
            enum: ["TRON network", "Binance Smart Chain"],
            default: "TRON network",
            title: t(dictionary, "Chain"),
          },
          walletAddress: {
            $ref: "#/definitions/walletAddress",
          },
          info: {
            $ref: "#/definitions/info",
          },
        },
        required: ["walletAddress", "chain"],
      },
    },
    properties: {
      coin: {
        $ref: "#/definitions/coin",
      },
    },
    required: ["coin"],
    allOf: [
      {
        if: {
          properties: {
            coin: {
              const: "USDT",
            },
          },
        },
        then: {
          properties: {
            infoUSDT: {
              $ref: "#/definitions/infoUSDT",
            },
          },
        },
      },
      {
        if: {
          properties: {
            coin: {
              const: "BTC",
            },
          },
        },
        then: {
          properties: {
            infoBTC: {
              $ref: "#/definitions/infoBTC",
            },
          },
        },
      },
      {
        if: {
          properties: {
            coin: {
              const: "ETH",
            },
          },
        },
        then: {
          properties: {
            infoETH: {
              $ref: "#/definitions/infoETH",
            },
          },
        },
      },
    ],
  },
  uiSchema: {
    "ui:order": ["coin", "*"],
    "ui:options": {
      submitButtonOptions: {
        props: {
          fullWidth: true,
        },
        submitText: t(dictionary, "Confirm"),
      },
      label: false,
      classNames: "grid-form-root gap-15",
    },
    "coin": {
      "ui:options": {
        label: false,
        widget: "SelectCoinWidget",
      },
    },
    "infoUSDT": {
      chain: {
        "ui:options": {
          label: false,
          widget: "SelectChainWidget",
          props: {
            withAsterisk: true,
          },
        },
      },
      walletAddress: {
        "ui:options": {
          label: false,
          widget: "QrCodeWidget",
          props: {
            withAsterisk: true,
          },
        },
      },
      info: {
        "ui:options": {
          label: false,
          widget: "InfoDepositCoinWidget",
        },
      },
    },
    "infoBTC": {
      chain: {
        "ui:options": {
          label: false,
          widget: "SelectChainWidget",
          props: {
            withAsterisk: true,
          },
        },
      },
      walletAddress: {
        "ui:options": {
          label: false,
          widget: "QrCodeWidget",
          props: {
            withAsterisk: true,
          },
        },
      },
      info: {
        "ui:options": {
          label: false,
          widget: "InfoDepositCoinWidget",
        },
      },
    },
    "infoETH": {
      chain: {
        "ui:options": {
          label: false,
          widget: "SelectChainWidget",
          props: {
            withAsterisk: true,
          },
        },
      },
      walletAddress: {
        "ui:options": {
          label: false,
          widget: "QrCodeWidget",
          props: {
            withAsterisk: true,
          },
        },
      },
      info: {
        "ui:options": {
          label: false,
          widget: "InfoDepositCoinWidget",
        },
      },
    },
  },
  formData: {},
};

export default DepositSchema;
