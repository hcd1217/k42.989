import { LoginFormData, LoginPayload } from "@/types";
import { extractPhoneNumber } from "@/utils/utility";

export function convertToLoginFormData(formData: LoginFormData) {
  if (formData.type === "1") {
    return {
      email: formData.email?.email || "",
      type: 1,
      password: formData.email?.password || "",
      mfaCode: formData.email?.mfaCode || "",
    } as LoginPayload;
  }
  return {
    type: 2,
    mobile: extractPhoneNumber(formData.mobile),
    password: formData.mobile?.password || "",
    mfaCode: formData.mobile?.mfaCode || "", // TODO: remove this
  } as LoginPayload;
}
