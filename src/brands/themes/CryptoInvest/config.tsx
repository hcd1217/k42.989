export const configs: NSAppSettings.BrandConfigsType = {
  APP_ID: "SecondInvest",
  APP_NAME: "Crypto Copy Invest",
  APP_API_URL: import.meta.env.APP_API_URL,
  APP_ROLES: ["ADMIN", "USER", "GUEST"],
  APP_FEATURES: ["kyc-advance", "login-not-mfa"],
  APP_PERMISSIONS: ["trade:future", "trade:spot"],
};
