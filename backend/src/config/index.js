import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const {
  PORT,
  SESSION_SECRET_KEY,
  GOOGLE_SHEET_URL,
  SHEET_DB,
  CORS_ORIGIN,
} = process.env;
