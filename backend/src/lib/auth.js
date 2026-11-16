import dotenv from 'dotenv';
dotenv.config();
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/db.js";
import * as schema from "../db/schema.js";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  emailAndPassword: { enabled: true },
  trustedOrigins: [process.env.TRUSTED_ORIGIN || "http://localhost:5173"],

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "guest",
        input: false,
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // ვიღებთ ემაილებს და ვარჩევთ მასივად (მაგ: "admin1@mail.com,admin2@mail.com")
          const editorEmails = process.env.EDITOR_EMAILS 
            ? process.env.EDITOR_EMAILS.split(",").map(e => e.trim().toLowerCase())
            : [];

          const isEditor = editorEmails.includes(user.email.toLowerCase());

          return {
            data: { ...user, role: isEditor ? "Editor" : "guest" },
          };
        },
      },
    },
  },
});