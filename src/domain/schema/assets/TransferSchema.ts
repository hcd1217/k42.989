import { t } from "@/common/utils";
import { getDictionary } from "@/services/languages";
import { FormSchema } from "@/types";

const dictionary = getDictionary();

const TransferSchema: FormSchema = {
  schema: {
    definitions: {
      coin: {
        type: "string",
        enum: ["USDT", "BTC", "ETH"],
        default: "USDT",
        title: t(dictionary, "Choose coin to transfer"),
      },
    },
    properties: {
      coin: {
        $ref: "#/definitions/coin",
      },
      fromAccountId: {
        type: "string",
        title: t(dictionary, "From account"),
      },
      toAccountId: {
        type: "string",
        title: t(dictionary, "To account"),
      },
      amount: {
        type: "number",
        title: t(dictionary, "Amount"),
        minimum: 0.01,
      },
    },
    required: ["coin", "fromAccountId", "toAccountId", "amount"],
  },
  uiSchema: {
    "ui:order": ["fromAccountId", "toAccountId", "*"],
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
    "fromAccountId": {
      "ui:options": {
        label: false,
        widget: "SelectAccountWidget",
      },
    },
    "toAccountId": {
      "ui:options": {
        label: false,
        widget: "SelectAccountWidget",
      },
    },
    "amount": {
      "ui:options": {
        label: false,
        widget: "AmountToTransferWidget",
        props: {
          placeholder: "Min 0.01",
        },
      },
    },
  },
  formData: {},
};

export default TransferSchema;
