type EmailFormData = {
  email: string;
};

type PasswordFormData = {
  password: string;
};

type MobileFormData = {
  phoneLocale: string;
  mobile: string;
};

export type ResetPasswordFormData = {
  type: "1" | "2";
  email: EmailFormData &
    PasswordFormData & { code: string; mfaCode?: string };
  mobile?: MobileFormData &
    PasswordFormData & { code: string; mfaCode?: string };
};

export type ResetPasswordPayload = LoginPayload & {
  code: string;
};

export type ForgotPasswordFormData = {
  type: "1" | "2";
  email: EmailFormData;
  mobile?: MobileFormData;
};

export type ForgotPasswordPayload = {
  email?: string;
  mobile?: string;
  type: 1 | 2;
};

export type SignupFormData = {
  type: "1" | "2";
  email: EmailFormData & PasswordFormData;
  mobile?: MobileFormData & PasswordFormData;
};

export type SignupPayload = ForgotPasswordPayload & {
  password: string;
};

export type LoginFormData = {
  type: "1" | "2";
  email: SignupFormData["email"] & {
    is2fa: boolean;
    mfaCode?: string;
  };
  mobile?: SignupFormData["mobile"] & {
    is2fa: boolean;
    mfaCode?: string;
  };
};

export type LoginPayload = SignupPayload & {
  mfaCode?: string;
};

export type SuccessPayload = {
  success: boolean;
};
