import { ResetPasswordFormData, ResetPasswordPayload } from "@/types";
import { extractPhoneNumber } from "@/utils/utility";

export function convertToResetPasswordFormData(
  formData: ResetPasswordFormData,
) {
  if (formData.type === "1") {
    return {
      type: 1,
      email: formData.email.email || "",
      password: formData.email?.password || "",
      code: formData.email?.code || "",
      mfaCode: formData.email?.mfaCode || "",
    } as ResetPasswordPayload;
  }
  return {
    type: 2,
    mobile: extractPhoneNumber(formData.mobile),
    password: formData.mobile?.password || "",
    code: formData.mobile?.code || "",
    mfaCode: formData.mobile?.mfaCode || "",
  } as ResetPasswordPayload;
}
