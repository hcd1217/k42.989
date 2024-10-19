type BRANDS = "CryptoInvest" | "SecondInvest";
declare namespace NSAppSettings {
  interface BrandConfigsType {
    APP_ID: BRANDS;
    APP_NAME: string;
    APP_API_URL: string;
  }
}
