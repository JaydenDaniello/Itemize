/**
 * Centralized, validated environment configuration.
 * 
 * Server-only. Throws on startup if required variables are missing.
 * Always import from here instead of using process.env directly.
 */

import { z } from "zod";

const serverSchema = z.object({
    JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
    JWT_ISSUER: z.string().min(1, "JWT_ISSUER is required"),
    JWT_AUDIENCE: z.string().min(1, "JWT_AUDIENCE is required"),
    NODE_ENV: z.enum(["development", "test", "production"]),
});

export const env = (() => {
    const parsed = serverSchema.safeParse(process.env);
    if (!parsed.success) {
        const tree = z.treeifyError(parsed.error);
        console.error("Invalid environment variables:", tree)
        throw new Error("Invalid environment variables. Check server logs.");
    }
    return parsed.data;
})();