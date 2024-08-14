export type User = {
  id: string;
  depositCode: string;
  affiliateCode: string;
  emailVerified: boolean;
  mobileVerified: boolean;
  kycLevel: number;
  hasMfa: number;
  email: string;
};
