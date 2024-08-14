import { t } from "@/common/utils";
import { getDictionary } from "@/services/languages";
import { FormSchema } from "@/types";

const dictionary = getDictionary();

const WithdrawSchema: FormSchema = {
  schema: {
    definitions: {
      coin: {
        type: "string",
        enum: ["USDT", "BTC", "ETH"],
        default: "USDT",
        title: t(dictionary, "Choose coin to withdraw"),
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
      address: {
        type: "string",
        title: t(dictionary, "Address"),
        default: "",
      },
      amount: {
        type: "number",
        title: t(dictionary, "Amount"),
        minimum: 0.01,
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
          amount: {
            $ref: "#/definitions/amount",
          },
          address: {
            $ref: "#/definitions/address",
          },
        },
        required: ["amount", "chain", "address"],
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
          amount: {
            $ref: "#/definitions/amount",
          },
          address: {
            $ref: "#/definitions/address",
          },
        },
        required: ["address", "amount", "chain"],
      },
      infoUSDT: {
        type: "object",
        title: "",
        properties: {
          chain: {
            type: "string",
            enum: ["Ethereum", "Binance Smart Chain"],
            default: "Ethereum",
            title: t(dictionary, "Chain"),
          },
          amount: {
            $ref: "#/definitions/amount",
          },
          address: {
            $ref: "#/definitions/address",
          },
        },
        required: ["amount", "address", "chain"],
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
        submitText: t(dictionary, "Submit"),
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
      address: {
        "ui:options": {
          widget: "WithdrawAddressWidget",
          label: false,
          props: {
            placeholder: t(dictionary, "Please enter address"),
          },
        },
      },
      amount: {
        "ui:options": {
          label: false,
          widget: "AmountToWithdrawWidget",
          props: {
            placeholder: "Min 0.01",
          },
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
      address: {
        "ui:options": {
          widget: "WithdrawAddressWidget",
          label: false,
          props: {
            placeholder: t(dictionary, "Please enter address"),
          },
        },
      },
      amount: {
        "ui:options": {
          label: false,
          widget: "AmountToWithdrawWidget",
          props: {
            placeholder: "Min 0.01",
          },
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
      address: {
        "ui:options": {
          widget: "WithdrawAddressWidget",
          label: false,
          props: {
            placeholder: t(dictionary, "Please enter address"),
          },
        },
      },
      amount: {
        "ui:options": {
          label: false,
          widget: "AmountToWithdrawWidget",
          props: {
            placeholder: "Min 0.01",
          },
        },
      },
    },
  },
  formData: {
    coin: "USDT",
  },
};

export default WithdrawSchema;
