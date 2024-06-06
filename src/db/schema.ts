import {
  bigint,
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const roles = pgEnum("roles", ["user", "admin"]);

export const user = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: varchar("first_name", { length: 30 }).notNull(),
  lastName: varchar("last_name", { length: 30 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: text("password"),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
  role: roles("roles").default("user"),
  isVerified: boolean("is_verified").default(false),
});

export const userOtps = pgTable("user_otps", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 100 }).notNull(),
  otp: integer("otp").notNull(),
  expiresAt: bigint("expires_at", { mode: "number" }).notNull(),
});

export const dbSchema = {
  user,
  userOtps,
};

export type dbSchemaType = typeof dbSchema;
