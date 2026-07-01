CREATE TABLE "api_keys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"prefix" text NOT NULL,
	"key" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"last_used_at" timestamp with time zone DEFAULT now(),
	"revoked_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now()
);
