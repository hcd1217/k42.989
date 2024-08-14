import {
  ForgotPasswordFormData,
  ForgotPasswordPayload,
} from "@/types";
import { extractPhoneNumber } from "@/utils/utility";

export function convertToForgotPasswordFormData(
  formData: ForgotPasswordFormData,
) {
  if (formData.type === "1") {
    return {
      email: formData.email?.email,
      type: 1,
    } as ForgotPasswordPayload;
  }
  return {
    mobile: extractPhoneNumber(formData.mobile),
    type: 2,
  } as ForgotPasswordPayload;
}
