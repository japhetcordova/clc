import { pgTable, text, timestamp, uuid, date, uniqueIndex, unique } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    gender: text("gender").notNull(), // Male, Female
    network: text("network").notNull(), // Transformers, WOW, Gems, etc.
    cluster: text("cluster").notNull(), // Cluster 1, Cluster 2
    contactNumber: text("contact_number").notNull(),
    email: text("email"),
    ministry: text("ministry").notNull(), // Worship Team, Media, etc.
    qrCodeId: text("qr_code_id").notNull().unique(), // Hashed/Secure ID for QR
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const attendance = pgTable("attendance", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    scanDate: date("scan_date").notNull(), // YYYY-MM-DD
    scannedAt: timestamp("scanned_at").defaultNow().notNull(),
}, (t) => [
    unique().on(t.userId, t.scanDate),
]);

export const dailyPins = pgTable("daily_pins", {
    id: uuid("id").primaryKey().defaultRandom(),
    pin: text("pin").notNull(),
    date: date("date").notNull().unique(), // One pin per day
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Attendance = typeof attendance.$inferSelect;
export type NewAttendance = typeof attendance.$inferInsert;
export type DailyPin = typeof dailyPins.$inferSelect;
