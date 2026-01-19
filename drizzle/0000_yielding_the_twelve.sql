CREATE TABLE "attendance" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"scan_date" date NOT NULL,
	"scanned_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "attendance_user_id_scan_date_unique" UNIQUE("user_id","scan_date")
);
--> statement-breakpoint
CREATE TABLE "daily_pins" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pin" text NOT NULL,
	"date" date NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "daily_pins_date_unique" UNIQUE("date")
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"date" date NOT NULL,
	"time" text NOT NULL,
	"location" text NOT NULL,
	"category" text NOT NULL,
	"tag" text NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "suggestion_likes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"suggestion_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "suggestion_likes_suggestion_id_user_id_unique" UNIQUE("suggestion_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "suggestions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content" text NOT NULL,
	"is_anonymous" boolean DEFAULT false NOT NULL,
	"user_id" uuid NOT NULL,
	"like_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"gender" text NOT NULL,
	"network" text NOT NULL,
	"cluster" text NOT NULL,
	"contact_number" text NOT NULL,
	"email" text,
	"ministry" text NOT NULL,
	"qr_code_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_qr_code_id_unique" UNIQUE("qr_code_id")
);
--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "suggestion_likes" ADD CONSTRAINT "suggestion_likes_suggestion_id_suggestions_id_fk" FOREIGN KEY ("suggestion_id") REFERENCES "public"."suggestions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "suggestion_likes" ADD CONSTRAINT "suggestion_likes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "suggestions" ADD CONSTRAINT "suggestions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "attendance_scan_date_idx" ON "attendance" USING btree ("scan_date");--> statement-breakpoint
CREATE INDEX "attendance_user_id_idx" ON "attendance" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "attendance_scan_date_user_id_idx" ON "attendance" USING btree ("scan_date","user_id");--> statement-breakpoint
CREATE INDEX "users_network_idx" ON "users" USING btree ("network");--> statement-breakpoint
CREATE INDEX "users_ministry_idx" ON "users" USING btree ("ministry");--> statement-breakpoint
CREATE INDEX "users_gender_idx" ON "users" USING btree ("gender");--> statement-breakpoint
CREATE INDEX "users_cluster_idx" ON "users" USING btree ("cluster");