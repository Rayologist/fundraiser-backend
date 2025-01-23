import { config } from 'dotenv';
import { z } from 'zod';

config();

const configSchema = z
  .object({
    MODE: z.enum(['dev', 'production', 'staging']),
    POSTGRES_HOST: z.string().min(1),
    POSTGRES_PORT: z
      .string()
      .min(1)
      .transform((v) => parseInt(v, 10)),
    POSTGRES_USER: z.string().min(1),
    POSTGRES_PASSWORD: z.string().min(1),
    POSTGRES_DB: z.string().min(1),

    GOOGLE_OAUTH_CLIENT_ID: z.string().min(1),
    GOOGLE_OAUTH_CLIENT_SECRET: z.string().min(1),

    ADMIN_TOKEN: z.string().min(1),
    JWT_SECRET: z.string().min(1),
    COOKIE_SECRET: z.string().min(1),

    SMTP_HOST: z.string().min(1),
    SMTP_USER: z.string().min(1),
    SMTP_PASSWORD: z.string().min(1),
    SMTP_FROM: z.string().min(1),
    SMTP_REPLY_TO: z.string().min(1),

    RECEIPT_PATH: z.string().min(1),
    SEAL_PATH: z.string().min(1),
    SEAL_ORG_IMAGE: z.string().min(1),
    SEAL_HANDLER_IMAGE: z.string().min(1),
    SEAL_PRESIDENT_IMAGE: z.string().min(1),

    INSTITUTION_NAME: z.string().min(1),
    INSTITUTION_TAX_ID: z.string().min(1),
    INSTITUTION_ADDRESS: z.string().min(1),
    INSTITUTION_EMAIL: z.string().min(1),
    INSTITUTION_PHONE: z.string().min(1),

    TMP_DIR: z.string().min(1),
    CLIENT_URL: z.string().min(1),
    SERVER_URL: z.string().min(1),

    NEWEBPAY_HASH_KEY: z.string().min(1),
    NEWEBPAY_HASH_IV: z.string().min(1),
    NEWEBPAY_MERCHANT_ID: z.string().min(1),

    EMAIL_PATH: z.string().min(1),
    EMAIL_RECEIPT_SUBJECT: z.string().min(1),
    EMAIL_RECEIPT_TEMPLATE: z.string().min(1),

    TAX_ID_KEY: z.string().min(1),
    TAX_ID_IV: z.string().min(1),

    PRODUCT_DESCRIPTION: z.string().min(1),
  })
  .transform((env) => ({
    mode: env.MODE,
    postgresHost: env.POSTGRES_HOST,
    postgresPort: env.POSTGRES_PORT,
    postgresUser: env.POSTGRES_USER,
    postgresPassword: env.POSTGRES_PASSWORD,
    postgresDb: env.POSTGRES_DB,

    adminToken: env.ADMIN_TOKEN,

    smtpHost: env.SMTP_HOST,
    smtpUser: env.SMTP_USER,
    smtpPassword: env.SMTP_PASSWORD,
    smtpFrom: env.SMTP_FROM,
    smtpReplyTo: env.SMTP_REPLY_TO,

    receiptPath: env.RECEIPT_PATH,
    sealPath: env.SEAL_PATH,
    sealOrgImage: env.SEAL_ORG_IMAGE,
    sealHandlerImage: env.SEAL_HANDLER_IMAGE,
    sealPresidentImage: env.SEAL_PRESIDENT_IMAGE,

    institutionName: env.INSTITUTION_NAME,
    institutionTaxId: env.INSTITUTION_TAX_ID,
    institutionAddress: env.INSTITUTION_ADDRESS,
    institutionEmail: env.INSTITUTION_EMAIL,
    institutionPhone: env.INSTITUTION_PHONE,

    googleOAuthClientId: env.GOOGLE_OAUTH_CLIENT_ID,
    googleOAuthClientSecret: env.GOOGLE_OAUTH_CLIENT_SECRET,

    jwtSecret: env.JWT_SECRET,
    cookieSecret: env.COOKIE_SECRET,
    clientUrl: env.CLIENT_URL,
    serverUrl: env.SERVER_URL,

    newebpayHashKey: env.NEWEBPAY_HASH_KEY,
    newebpayHashIV: env.NEWEBPAY_HASH_IV,
    newebpayMerchantId: env.NEWEBPAY_MERCHANT_ID,

    tmpdir: env.TMP_DIR,

    emailPath: env.EMAIL_PATH,
    emailReceiptSubject: env.EMAIL_RECEIPT_SUBJECT,
    emailReceiptTemplate: env.EMAIL_RECEIPT_TEMPLATE,

    taxIdKey: env.TAX_ID_KEY,
    taxIdIV: env.TAX_ID_IV,

    productDescription: env.PRODUCT_DESCRIPTION,
  }));

export type Env = z.infer<typeof configSchema>;
export const env = configSchema.parse(process.env);
export default () => env;
