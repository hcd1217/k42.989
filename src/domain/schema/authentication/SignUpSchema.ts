import { t } from "@/common/utils";
import { getDictionary } from "@/services/languages";
import { FormSchema } from "@/types";
import { REGEX } from "@/utils/regex";

const dictionary = getDictionary();

const SignUpSchema: FormSchema = {
  schema: {
    definitions: {
      PhoneNumber: {
        type: "object",
        title: "",
        properties: {
          phoneLocale: {
            $ref: "#/definitions/PhoneLocal",
          },
          mobile: {
            title: "Phone",
            type: "string",
          },
          password: {
            $ref: "#/definitions/Password",
            pattern: REGEX.PASSWORD,
          },
        },
        required: ["phoneLocale", "mobile", "password"],
      },
      Email: {
        type: "object",
        title: "",
        properties: {
          email: {
            type: "string",
            title: "Email",
            pattern: REGEX.EMAIL,
          },
          password: {
            $ref: "#/definitions/Password",
            pattern: REGEX.PASSWORD,
          },
        },
        required: ["email", "password"],
      },
      Password: {
        type: "string",
        title: "Password",
      },
      type: {
        type: "string",
        enum: ["1", "2"],
        default: "1",
      },
      PhoneLocal: {
        type: "string",
        default: "+81 Japan",
        title: "Region",
      },
    },
    properties: {
      type: {
        $ref: "#/definitions/type",
      },
    },
    if: {
      properties: {
        type: {
          const: "1",
        },
      },
    },
    then: {
      properties: {
        email: {
          $ref: "#/definitions/Email",
        },
      },
      required: ["email"],
    },
    else: {
      properties: {
        mobile: {
          $ref: "#/definitions/PhoneNumber",
        },
      },
      required: ["mobile"],
    },
  },
  uiSchema: {
    "ui:options": {
      submitButtonOptions: {
        props: {
          fullWidth: true,
          size: "lg",
        },
        submitText: t(dictionary, "Sign Up"),
      },
      // label: false,
      classNames: "grid-form-root gap-15",
    },
    "type": {
      "ui:options": {
        widget: "TabWidget",
        label: false,
      },
    },
    "mobile": {
      phoneLocale: {
        "ui:options": {
          widget: "PhoneLocalWidget",
          classNames: "span-9",
          label: false,
          props: {
            withAsterisk: true,
          },
        },
      },
      mobile: {
        "ui:options": {
          placeholder: "Mobile",
          label: false,
          classNames: "span-15",
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
      password: {
        "ui:options": {
          widget: "CustomPasswordWidget",
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

export default SignUpSchema;
