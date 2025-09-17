import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const { PORT, SESSION_SECRET_KEY, SHEET_DB } = process.env;
