import { getDictionary } from "@/services/languages";
import { FormSchema } from "@/types";
import { REGEX } from "@/utils/regex";
import { t } from "@/utils/utility";

const dictionary = getDictionary();

const ForgotPasswordSchema: FormSchema = {
  schema: {
    definitions: {
      Email: {
        type: "object",
        title: "",
        properties: {
          email: {
            type: "string",
            title: t(dictionary, "Email"),
            pattern: REGEX.EMAIL,
          },
        },
        required: ["email"],
      },
    },
    properties: {
      email: {
        $ref: "#/definitions/Email",
      },
    },
  },
  uiSchema: {
    "ui:options": {
      submitButtonOptions: {
        props: {
          fullWidth: true,
          size: "lg",
        },
        submitText: "Submit",
      },
      // label: false,
      classNames: "grid-form-root gap-15",
    },
    "email": {
      email: {
        "ui:options": {
          placeholder: "Email",
          label: false,
          props: {
            withAsterisk: true,
          },
        },
      },
    },
  },
  formData: {},
};

export default ForgotPasswordSchema;
