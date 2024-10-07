import {
  stringSchema,
  verificationCodeSchema,
} from "@/common/schema";
import { getDictionary } from "@/services/languages";
import logger from "@/services/logger";
import { t as _t } from "@/utils/utility";
import { z } from "zod";

const dictionary = getDictionary();
export const msgPasswordErr =
  "Password is 8-20 characters, must contains uppercase and lowercase letters and numbers";

const message = _t(dictionary, msgPasswordErr);
export const passwordSchema = stringSchema
  .min(8, { message })
  .max(20, { message })
  .regex(/[A-Z]/, { message })
  .regex(/[a-z]/, { message })
  .regex(/[0-9]/, { message });

export function validateVerificationCode(
  value: string | number | undefined,
) {
  if (value === "") {
    return null;
  }
  try {
    verificationCodeSchema.parse(value);
    return null;
  } catch (error) {
    logger.error(error);
    return _t(dictionary, "Invalid verification code");
  }
}
export const emailVerificationCodeSchema = stringSchema
  .min(6)
  .max(20)
  .min(6, { message: _t(dictionary, "Verification code error") })
  .max(8, { message: _t(dictionary, "Verification code error") });

export const requiredFieldSchema = stringSchema.min(1, {
  message: _t(dictionary, "Required"),
});

export const numberValidate = z
  .number()
  .gt(0, { message: _t(dictionary, "Enter amount greater than 0") });

export const emailValidate = (value: string | undefined) => {
  try {
    z.string()
      .trim()
      .min(1, { message: _t(dictionary, "Field is required") })
      .email({ message: _t(dictionary, "Invalid Email") })
      .parse(value);
    return null;
  } catch (e) {
    if (e instanceof z.ZodError) {
      return e.issues[0].message;
    }
    return null;
  }
};

export const passwordValidate = (value: string | undefined) => {
  try {
    passwordSchema.parse(value);
    return null;
  } catch (e) {
    if (e instanceof z.ZodError) {
      return e.issues[0].message;
    }
    return null;
  }
};

export const requiredValidate = (value: string | undefined) => {
  try {
    requiredFieldSchema.parse(value);
    return null;
  } catch (e) {
    if (e instanceof z.ZodError) {
      return e.issues[0].message;
    }
    return null;
  }
};
