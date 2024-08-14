import { SignupFormData, SignupPayload } from "@/types";
import { extractPhoneNumber } from "@/utils/utility";

export function convertToSignUpFormData(formData: SignupFormData) {
  if (formData.type === "1") {
    return {
      email: formData.email?.email,
      type: 1,
      password: formData.email.password,
    } as SignupPayload;
  }
  return {
    type: 2,
    mobile: extractPhoneNumber(formData.mobile),
    password: formData.mobile?.password || "",
  } as SignupPayload;
}
