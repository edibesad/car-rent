import { env } from "process";

export const MONGO_DB_URI = env.MONGODB_URI || "mongodb://localhost:27017";
