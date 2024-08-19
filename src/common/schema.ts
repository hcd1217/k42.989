import { z } from "zod";

import { UserUpdateType } from "./types";

export const booleanSchema = z.boolean();

export const stringSchema = z.string();

export const emailSchema = z.string().email();

export const numberSchema = z.number();

export const optionalNumberSchema = z.number().optional();

export const optionalStringSchema = stringSchema.optional();

export const speNumberSchema = stringSchema.or(numberSchema);

export const nullableSpeNumberSchema = speNumberSchema
  .or(z.null())
  .transform((val) => val ?? 0);

export const limitSchema = stringSchema
  .or(numberSchema)
  .default(100)
  .transform((v: string | number) => {
    return Math.max(Math.min(Number(v), 100), 1);
  });

export const querySchema = z.object({
  reverse: stringSchema.transform((v) => v === "true").optional(),
  cursor: optionalStringSchema,
  limit: limitSchema,
});

export const coinSchema = z.enum(["BTC", "ETH", "USDT"]);

export const addressSchema = stringSchema;

export const txSchema = stringSchema;

export const chainSchema = z.enum([
  "Ethereum",
  "TRON network",
  "Bitcoin",
]);

export const userKycDataSchema = z.object({
  country: optionalStringSchema,
  firstName: optionalStringSchema,
  lastName: optionalStringSchema,
  kanaFirstName: optionalStringSchema,
  kanaLastName: optionalStringSchema,
  romanjiFirstName: optionalStringSchema,
  romanjiLastName: optionalStringSchema,
  fullName: optionalStringSchema,
  dateOfBirth: optionalStringSchema,
  idNumber: optionalStringSchema,
  idType: z
    .enum(["ID", "DRIVER_LICENSE", "PASSPORT", "OTHER"])
    .optional(),
  address: optionalStringSchema,
  images: z
    .object({
      IDCertificateFront: optionalStringSchema,
      IDCertificateBack: optionalStringSchema,
      proofOfAddress: optionalStringSchema,
      selfie: optionalStringSchema,
      selfieWithDocument: optionalStringSchema,
    })
    .optional(),
});

export const userConfigSchema = z.object({
  leverages: z.record(
    stringSchema,
    numberSchema.int().positive().min(1).max(200),
  ),
});

export const dateSchema = z
  .string()
  .or(z.date())
  .transform((val) => {
    if (typeof val === "string") {
      return new Date(val);
    }
    return val;
  });

export const nullableString = stringSchema
  .nullable()
  .optional()
  .transform((val) => val ?? null);

export const nullableBoolean = z
  .boolean()
  .nullable()
  .optional()
  .transform((val) => val ?? null);

export const nullablePositiveInteger = z
  .number()
  .int()
  .positive()
  .nullable()
  .optional()
  .transform((val) => val ?? null);

export const periodPerformanceSchema = z.object({
  // orderData: z.object({
  //   init: speNumberSchema,
  //   amount: speNumberSchema,
  //   maxAsset: speNumberSchema,
  //   minAsset: speNumberSchema,
  //   position: speNumberSchema,
  //   first: speNumberSchema,
  //   last: speNumberSchema,
  //   total: speNumberSchema,
  //   positionCnt: speNumberSchema,
  //   entryTime: speNumberSchema,
  //   avgPrice: speNumberSchema,
  //   hold: speNumberSchema,
  //   profit: speNumberSchema,
  //   roi: speNumberSchema,
  //   maxDrawDown: speNumberSchema,
  //   win: speNumberSchema,
  //   lose: speNumberSchema,
  // }),
  pnl: nullableSpeNumberSchema,
  avgHoldTime: nullableSpeNumberSchema,
  roi: nullableSpeNumberSchema,
  totalWin: nullableSpeNumberSchema,
  totalLose: nullableSpeNumberSchema,
  winRate: nullableSpeNumberSchema,
  totalPosition: nullableSpeNumberSchema,
  totalOrder: nullableSpeNumberSchema,
  avgPnlPerTrade: nullableSpeNumberSchema,
  avgPnlPerPosition: nullableSpeNumberSchema,
  weeklyTrade: nullableSpeNumberSchema,
  lastTrade: nullableSpeNumberSchema,
  profitToLoss: nullableSpeNumberSchema,
  maxDrawDown: nullableSpeNumberSchema,
});

export const copyMasterPerformanceSchema = z.object({
  all: periodPerformanceSchema,
  w: periodPerformanceSchema.optional(),
  m: periodPerformanceSchema.optional(),
  q: periodPerformanceSchema.optional(),
  roiSeries: numberSchema.array(),
  aum: optionalNumberSchema,
  totalProfitSharing: optionalNumberSchema,
  settledAmount: optionalNumberSchema,
  unSettledAmount: optionalNumberSchema,
  ranking: numberSchema.int().min(0).optional(),
});

export const authenticationPayloadSchema = z.object({
  id: stringSchema,
  uid: stringSchema,
  nickName: optionalStringSchema,
  avatar: optionalStringSchema,
  depositCode: stringSchema,
  fiatDepositMemo: optionalStringSchema,
  affiliateCode: stringSchema,
  emailVerified: booleanSchema,
  mobileVerified: booleanSchema,
  hasMfa: booleanSchema,
  hasAntiPhishingCode: booleanSchema,
  kycLevel: numberSchema.int().positive().min(0).max(4),
  email: optionalStringSchema,
  mobile: optionalStringSchema,
  isCopyMaster: booleanSchema,
  masterAccountId: optionalStringSchema,
  config: userConfigSchema.optional(),
  accounts: z
    .object({
      fundingAccountId: optionalStringSchema,
      tradingAccountId: optionalStringSchema,
    })
    .optional(),
});

export const baseMenuSchema = z.object({
  icon: z.string().optional(),
  type: z.enum(["link", "group", "panel", "custom"]),
  label: z.string(),
  url: z.string().optional(),
  description: z.string().optional(),
  panelFooter: z
    .object({
      title: z.string(),
      description: z.string().optional(),
      button: z
        .object({
          label: z.string(),
          url: z.string(),
        })
        .optional(),
    })
    .optional(),
});

export type Menu = z.infer<typeof baseMenuSchema> & {
  children?: Menu[];
};

const menuSchema: z.ZodType<Menu> = baseMenuSchema.and(
  z.object({
    children: z.lazy(() => menuSchema.array().optional()),
  }),
);

const linkSchema = z.object({
  label: z.string(),
  url: z.string(),
});

const iconSchema = z.object({
  icon: z.string(),
  url: z.string(),
});

const applicationHeaderSchema = z.object({
  menu: menuSchema.array(),
});

export const applicationFooterSchema = z.object({
  copyRight: z.string(),
  privacyTerms: linkSchema,
  termOfService: linkSchema,
  socials: iconSchema.array(),
  groups: z
    .object({
      name: z.string(),
      links: linkSchema.array(),
    })
    .array(),
});

export const applicationSchema = z.object({
  version: z.string(),
  applications: z.object({
    name: z.string(),
    logo: z.object({
      pc: z.string(),
      mobile: z.string().optional(),
    }),
    features: z.object({
      register: z.object({
        email: booleanSchema,
        mobile: booleanSchema,
      }),
      symbols: z
        .object({
          id: z.string(),
          name: z.string(),
          symbol: z.string(),
          description: z.string(),
          baseAssetId: z.string(),
          quoteAssetId: z.string(),
          minPrice: z.string(),
          maxPrice: z.string(),
          tickSize: z.string(),
          minVolume: z.string(),
          maxVolume: z.string(),
          volumeStepSize: z.string(),
          minValue: z.string(),
          maxValue: z.string(),
          baseAssetPrecision: z.number(),
          quoteAssetPrecision: z.number(),
          baseCommissionPrecision: z.number(),
          quoteCommissionPrecision: z.number(),
          isSpot: booleanSchema,
          isFuture: booleanSchema,
          defaultLeverage: z.number(),
        })
        .array(),
    }),
    layout: z.object({
      header: z.object({
        common: applicationHeaderSchema,
        pc: applicationHeaderSchema.optional(),
        mobile: applicationHeaderSchema.optional(),
      }),
      footer: z
        .object({
          common: applicationFooterSchema,
          pc: applicationFooterSchema.optional(),
          mobile: applicationFooterSchema.optional(),
        })
        .optional(),
    }),
  }),
});

export const updateUserPayloadSchema = z
  .object({
    type: z.enum([
      UserUpdateType.NICK_NAME,
      UserUpdateType.AVATAR,
      UserUpdateType.UPDATE_PASSWORD,
      UserUpdateType.KYC_DATA,
      UserUpdateType.ADD_EMAIL,
      UserUpdateType.ADD_MOBILE,
      UserUpdateType.ADD_MFA,
      UserUpdateType.UPDATE_MFA,
      UserUpdateType.VERIFY_EMAIL,
      UserUpdateType.VERIFY_MOBILE,
      UserUpdateType.UPDATE_ANTI_PHISHING_CODE,
    ]),
    avatar: optionalStringSchema,
    nickName: optionalStringSchema,
    emailVerificationCode: optionalStringSchema,
    mobileVerificationCode: optionalStringSchema,
    kycData: userKycDataSchema.optional(),
    mobile: optionalStringSchema,
    antiPhishingCode: optionalStringSchema,
    email: z.string().email().optional(),
    password: optionalStringSchema,
    currentPassword: optionalStringSchema,
    mfaSecret: optionalStringSchema,
    mfaCode: optionalStringSchema,
    oldMfaCode: optionalStringSchema,
    verificationCode: optionalStringSchema,
  })
  .partial()
  .required({ type: true });

export const verificationCodeSchema = z
  .string()
  .length(6)
  .transform((val) => {
    if (isNaN(Number(val))) {
      throw new Error("Verification code error");
    }
    return val.toUpperCase();
  });
