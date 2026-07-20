import dotenv from "dotenv";

dotenv.config();

/** Read a required env var, throwing a clear error if missing in production. */
function required(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (value === undefined || value === "") {
    if (process.env.NODE_ENV === "production") {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    return fallback ?? "";
  }
  return value;
}

function toInt(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

const nodeEnv = process.env.NODE_ENV ?? "development";

export const env = {
  nodeEnv,
  isProd: nodeEnv === "production",
  port: toInt(process.env.PORT, 5000),
  corsOrigins: (process.env.CORS_ORIGINS ?? "http://localhost:3000")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),

  databaseUrl: required("DATABASE_URL"),

  jwt: {
    accessSecret: required("JWT_ACCESS_SECRET", "dev-access-secret"),
    refreshSecret: required("JWT_REFRESH_SECRET", "dev-refresh-secret"),
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? "15m",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? "7d",
  },

  otp: {
    provider: (process.env.OTP_PROVIDER ?? "console") as "console" | "msg91" | "twilio",
    expiryMinutes: toInt(process.env.OTP_EXPIRY_MINUTES, 5),
    length: toInt(process.env.OTP_LENGTH, 6),
    devReturn: process.env.OTP_DEV_RETURN === "true",
    msg91: {
      authKey: process.env.MSG91_AUTH_KEY ?? "",
      senderId: process.env.MSG91_SENDER_ID ?? "",
      templateId: process.env.MSG91_TEMPLATE_ID ?? "",
    },
    twilio: {
      accountSid: process.env.TWILIO_ACCOUNT_SID ?? "",
      authToken: process.env.TWILIO_AUTH_TOKEN ?? "",
      fromNumber: process.env.TWILIO_FROM_NUMBER ?? "",
    },
  },

  uploadDir: process.env.UPLOAD_DIR ?? "uploads",
  publicBaseUrl: process.env.PUBLIC_BASE_URL ?? "http://localhost:5000",

  rateLimit: {
    windowMs: toInt(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
    max: toInt(process.env.RATE_LIMIT_MAX, 300),
  },

  seedAdmin: {
    name: process.env.SEED_ADMIN_NAME ?? "Prime Admin",
    email: process.env.SEED_ADMIN_EMAIL ?? "admin@primepromenade.com",
    password: process.env.SEED_ADMIN_PASSWORD ?? "Admin@12345",
  },
};

export type Env = typeof env;
