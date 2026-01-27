import { pgTable, text, timestamp, uuid, date, uniqueIndex, unique, integer, boolean, index, jsonb } from "drizzle-orm/pg-core";

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
    isPremium: boolean("is_premium").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [
    // Indexes for demographic filtering and grouping
    index("users_network_idx").on(t.network),
    index("users_ministry_idx").on(t.ministry),
    index("users_gender_idx").on(t.gender),
    index("users_cluster_idx").on(t.cluster),
]);

export const attendance = pgTable("attendance", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    scanDate: date("scan_date").notNull(), // YYYY-MM-DD
    scannedAt: timestamp("scanned_at").defaultNow().notNull(),
}, (t) => [
    unique().on(t.userId, t.scanDate),
    // Indexes for performance optimization
    index("attendance_scan_date_idx").on(t.scanDate), // For date filtering and trending
    index("attendance_user_id_idx").on(t.userId), // For joins with users table
    index("attendance_scan_date_user_id_idx").on(t.scanDate, t.userId), // Composite for common queries
]);

export const dailyPins = pgTable("daily_pins", {
    id: uuid("id").primaryKey().defaultRandom(),
    pin: text("pin").notNull(),
    date: date("date").notNull().unique(), // One pin per day
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const events = pgTable("events", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    date: date("date").notNull(),
    time: text("time").notNull(),
    location: text("location").notNull(),
    schedules: jsonb("schedules").$type<{ date: string; time: string; location: string }[]>().default([]).notNull(),
    category: text("category").notNull(), // special, regular, leadership
    tag: text("tag").notNull(),
    image: text("image"),
    maxCapacity: text("max_capacity"), // Maximum attendees
    registrationLink: text("registration_link"), // External registration URL
    contactPerson: text("contact_person"), // Event coordinator/contact
    googleMapsLink: text("google_maps_link"), // Link to Google Maps location
    interestedCount: integer("interested_count").default(0).notNull(), // Number of interested people
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const suggestions = pgTable("suggestions", {
    id: uuid("id").primaryKey().defaultRandom(),
    content: text("content").notNull(),
    isAnonymous: boolean("is_anonymous").notNull().default(false),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    likeCount: integer("like_count").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const suggestionLikes = pgTable("suggestion_likes", {
    id: uuid("id").primaryKey().defaultRandom(),
    suggestionId: uuid("suggestion_id").references(() => suggestions.id, { onDelete: "cascade" }).notNull(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [
    unique().on(t.suggestionId, t.userId),
]);

export const mobileHighlights = pgTable("mobile_highlights", {
    id: uuid("id").primaryKey().defaultRandom(),
    titlePrefix: text("title_prefix").notNull(), // e.g. "When you"
    highlightedWord: text("highlighted_word").notNull(), // e.g. "declare"
    titleSuffix: text("title_suffix").notNull(), // e.g. "The Lord listens."
    speaker: text("speaker").notNull(),
    series: text("series").notNull(),
    imageUrl: text("image_url").notNull(),
    isActive: boolean("is_active").notNull().default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const announcements = pgTable("announcements", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    content: text("content").notNull(),
    type: text("type").notNull(), // Admin, News, Community
    date: date("date").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const cellGroupInterests = pgTable("cell_group_interests", {
    id: uuid("id").primaryKey().defaultRandom(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    birthdate: date("birthdate").notNull(),
    email: text("email"),
    phoneNumber: text("phone_number").notNull(),
    gender: text("gender").notNull(),
    address: text("address").notNull(),
    preferredService: text("preferred_service").notNull(), // Morning, Afternoon
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Attendance = typeof attendance.$inferSelect;
export type NewAttendance = typeof attendance.$inferInsert;
export type DailyPin = typeof dailyPins.$inferSelect;
export type ChurchEvent = typeof events.$inferSelect;
export type NewChurchEvent = typeof events.$inferInsert;
export type Suggestion = typeof suggestions.$inferSelect;
export type NewSuggestion = typeof suggestions.$inferInsert;
export type SuggestionLike = typeof suggestionLikes.$inferSelect;
export type NewSuggestionLike = typeof suggestionLikes.$inferInsert;
export type MobileHighlight = typeof mobileHighlights.$inferSelect;
export type NewMobileHighlight = typeof mobileHighlights.$inferInsert;
export type Announcement = typeof announcements.$inferSelect;
export type NewAnnouncement = typeof announcements.$inferInsert;
export type CellGroupInterest = typeof cellGroupInterests.$inferSelect;
export type NewCellGroupInterest = typeof cellGroupInterests.$inferInsert;
