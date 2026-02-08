CREATE TABLE "cell_group_interests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"birthdate" date NOT NULL,
	"email" text,
	"phone_number" text NOT NULL,
	"gender" text NOT NULL,
	"address" text NOT NULL,
	"preferred_service" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "class_attendance" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"class_level" text NOT NULL,
	"week_number" integer NOT NULL,
	"scan_date" date NOT NULL,
	"scanned_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "class_attendance_user_id_class_level_week_number_unique" UNIQUE("user_id","class_level","week_number")
);
--> statement-breakpoint
CREATE TABLE "class_enrollments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"class_level" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"enrolled_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "class_enrollments_user_id_class_level_unique" UNIQUE("user_id","class_level")
);
--> statement-breakpoint
CREATE TABLE "class_staff" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"class_level" text NOT NULL,
	"role" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mobile_highlights" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title_prefix" text NOT NULL,
	"highlighted_word" text NOT NULL,
	"title_suffix" text NOT NULL,
	"speaker" text NOT NULL,
	"series" text NOT NULL,
	"image_url" text NOT NULL,
	"is_active" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "videos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fb_id" text NOT NULL,
	"title" text,
	"manual_title" text,
	"description" text,
	"thumbnail" text,
	"video_url" text NOT NULL,
	"embed_html" text,
	"is_live" boolean DEFAULT false NOT NULL,
	"published_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "videos_fb_id_unique" UNIQUE("fb_id")
);
--> statement-breakpoint
ALTER TABLE "daily_pins" RENAME TO "announcements";--> statement-breakpoint
ALTER TABLE "attendance" DROP CONSTRAINT "attendance_user_id_scan_date_unique";--> statement-breakpoint
ALTER TABLE "announcements" DROP CONSTRAINT "daily_pins_date_unique";--> statement-breakpoint
ALTER TABLE "attendance" ADD COLUMN "slot" text DEFAULT 'general' NOT NULL;--> statement-breakpoint
ALTER TABLE "announcements" ADD COLUMN "title" text NOT NULL;--> statement-breakpoint
ALTER TABLE "announcements" ADD COLUMN "content" text NOT NULL;--> statement-breakpoint
ALTER TABLE "announcements" ADD COLUMN "type" text NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "schedules" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_premium" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "class_attendance" ADD CONSTRAINT "class_attendance_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_enrollments" ADD CONSTRAINT "class_enrollments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "class_staff" ADD CONSTRAINT "class_staff_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "class_attendance_user_id_idx" ON "class_attendance" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "class_attendance_class_level_idx" ON "class_attendance" USING btree ("class_level");--> statement-breakpoint
CREATE INDEX "class_enrollments_user_id_idx" ON "class_enrollments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "class_enrollments_class_level_idx" ON "class_enrollments" USING btree ("class_level");--> statement-breakpoint
CREATE INDEX "class_staff_user_id_idx" ON "class_staff" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "class_staff_class_level_idx" ON "class_staff" USING btree ("class_level");--> statement-breakpoint
ALTER TABLE "announcements" DROP COLUMN "pin";--> statement-breakpoint
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_user_id_scan_date_slot_unique" UNIQUE("user_id","scan_date","slot");