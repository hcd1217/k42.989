import { verificationCodeSchema } from "@/common/schema";
import { t as _t, t } from "@/common/utils";
import { getDictionary } from "@/services/languages";
import logger from "@/services/logger";
import { z } from "zod";

const dictionary = getDictionary();
export const msgPasswordErr =
  "Password is 8-20 characters, must contains uppercase and lowercase letters and numbers";
export const passwordSchemaValidate = () => {
  return z
    .string()
    .min(8, {
      message: _t(dictionary, msgPasswordErr),
    })
    .max(20, {
      message: _t(dictionary, msgPasswordErr),
    })
    .regex(/[A-Z]/, {
      message: _t(dictionary, msgPasswordErr),
    })
    .regex(/[a-z]/, {
      message: _t(dictionary, msgPasswordErr),
    })
    .regex(/[0-9]/, {
      message: _t(dictionary, msgPasswordErr),
    });
};

export function _validateVerificationCode(
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
    return t(dictionary, "Invalid verification code");
  }
}

export const antiPhishingCodeValidate = () => {
  return z
    .string()
    .min(3, { message: _t(dictionary, "3-10 digits or letters") })
    .max(10, { message: _t(dictionary, "3-10 digits or letters") });
};

export const emailVerificationCodeValidate = () => {
  z.string().min(6).max(8);
  return z
    .string()
    .min(6)
    .max(20)
    .min(6, { message: _t(dictionary, "Verification code error") })
    .max(8, { message: _t(dictionary, "Verification code error") });
};

export const requiredFieldValidate = () => {
  return z
    .string()
    .min(1, { message: _t(dictionary, "It cannot be empty") });
};

export const emailValidate = () => {
  return z
    .string()
    .email({ message: _t(dictionary, "Invalid email address") });
};
