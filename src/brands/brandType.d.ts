type BRANDS = "CryptoInvest" | "SecondInvest";

declare namespace NSAppSettings {
  type BrandConfigsType = {
    APP_ID: BRANDS;
    APP_NAME: string;
    APP_API_URL: string;
    APP_ROLES: string[];
    APP_PERMISSIONS: string[];
    APP_FEATURES: string[];
  };
}
