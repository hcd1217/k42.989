export type ResetPasswordFormData = {
  email: {
    email: string;
    password: string;
    code: string;
    mfaCode?: string;
  };
};

export type ForgotPasswordFormData = {
  email: {
    email: string;
  };
};
