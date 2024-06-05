CREATE TABLE IF NOT EXISTS "user_otps" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(100) NOT NULL,
	"otp" integer NOT NULL,
	"expires_at" bigint NOT NULL
);
