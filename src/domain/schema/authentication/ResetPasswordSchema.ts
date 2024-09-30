import { getDictionary } from "@/services/languages";
import { FormSchema } from "@/types";
import { REGEX } from "@/utils/regex";
import { t } from "@/utils/utility";

const dictionary = getDictionary();

const ResetPasswordSchema: FormSchema = {
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
          password: {
            $ref: "#/definitions/Password",
            pattern: REGEX.PASSWORD,
          },
          code: {
            $ref: "#/definitions/Code",
          },
        },
        required: ["email", "password", "code"],
      },
      Password: {
        type: "string",
        title: t(dictionary, "New Password"),
      },
      Code: {
        type: "string",
        title: t(dictionary, "Verification Code"),
        minLength: 6,
      },
    },
    properties: {
      email: {
        $ref: "#/definitions/Email",
      },
    },
    required: ["email"],
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
      classNames: "grid-form-root gap-15",
    },
    "email": {
      email: {
        "ui:options": {
          label: false,
          props: {
            withAsterisk: true,
          },
        },
      },
      password: {
        "ui:options": {
          widget: "CustomPasswordWidget",
          label: false,
          props: {
            withAsterisk: true,
          },
        },
      },
      code: {
        "ui:options": {
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

export default ResetPasswordSchema;
