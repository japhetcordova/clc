import { router, publicProcedure } from "./trpc";
import { z } from "zod";
import { db } from "@/db";
import { users, attendance, events, dailyPins } from "@/db/schema";
import { eq, and, desc, sql, count, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const appRouter = router({
    getUsers: publicProcedure
        .input(z.object({
            page: z.number().default(1),
            pageSize: z.number().default(15),
            sort: z.string().optional(),
            order: z.enum(["asc", "desc"]).optional(),
        }))
        .query(async ({ input }) => {
            const { page, pageSize, sort, order } = input;

            let orderBy;
            if (sort === "name") {
                orderBy = order === "asc" ? asc(users.lastName) : desc(users.lastName);
            } else {
                orderBy = desc(users.createdAt);
            }

            const members = await db.select().from(users)
                .orderBy(orderBy)
                .limit(pageSize)
                .offset((page - 1) * pageSize);

            const [total] = await db.select({ value: count() }).from(users);

            return {
                members,
                total: total.value,
                totalPages: Math.ceil(total.value / pageSize),
            };
        }),

    markAttendance: publicProcedure
        .input(z.object({ qrCodeId: z.string() }))
        .mutation(async ({ input }) => {
            const { qrCodeId } = input;
            const [user] = await db.select().from(users).where(eq(users.qrCodeId, qrCodeId)).limit(1);
            if (!user) throw new Error("User not found");

            const today = new Date().toISOString().split('T')[0];
            const [existing] = await db.select()
                .from(attendance)
                .where(and(eq(attendance.userId, user.id), eq(attendance.scanDate, today)))
                .limit(1);

            if (existing) return { success: false, message: "Already marked" };

            await db.insert(attendance).values({
                userId: user.id,
                scanDate: today,
            });

            revalidatePath("/admin");
            return { success: true, user };
        }),

    getEvents: publicProcedure
        .query(async () => {
            return db.select().from(events).orderBy(desc(events.createdAt));
        }),

    createEvent: publicProcedure
        .input(z.object({
            title: z.string(),
            description: z.string(),
            date: z.string(),
            time: z.string(),
            location: z.string(),
            category: z.string(),
            tag: z.string(),
            image: z.string().optional(),
        }))
        .mutation(async ({ input }) => {
            const [newEvent] = await db.insert(events).values(input).returning();
            revalidatePath("/admin/events");
            revalidatePath("/events");
            return { success: true, event: newEvent };
        }),

    updateEvent: publicProcedure
        .input(z.object({
            id: z.string(),
            data: z.any(),
        }))
        .mutation(async ({ input }) => {
            const [updatedEvent] = await db.update(events)
                .set(input.data)
                .where(eq(events.id, input.id))
                .returning();
            revalidatePath("/admin/events");
            return { success: true, event: updatedEvent };
        }),

    deleteEvent: publicProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ input }) => {
            await db.delete(events).where(eq(events.id, input.id));
            revalidatePath("/admin/events");
            return { success: true };
        }),

    createSuggestion: publicProcedure
        .input(z.object({
            content: z.string().min(1).max(500),
            isAnonymous: z.boolean(),
            userId: z.string(),
        }))
        .mutation(async ({ input }) => {
            const { suggestions } = await import("@/db/schema");
            const [created] = await db.insert(suggestions).values(input).returning();
            revalidatePath("/suggestions");
            return { success: true, suggestion: created };
        }),

    getAdminDashboard: publicProcedure
        .input(z.object({
            date: z.string().optional(),
            ministry: z.string().optional(),
            network: z.string().optional(),
            gender: z.string().optional(),
            cluster: z.string().optional(),
            page: z.number().default(1),
            atSort: z.string().optional(),
            atOrder: z.enum(["asc", "desc"]).default("desc"),
            memSort: z.string().optional(),
            memOrder: z.enum(["asc", "desc"]).default("desc"),
        }))
        .query(async ({ input }) => {
            const filterDate = input.date || new Date().toISOString().split('T')[0];

            const filters = [eq(attendance.scanDate, filterDate)];
            if (input.ministry && input.ministry !== "all") {
                filters.push(eq(users.ministry, input.ministry));
            }
            if (input.network && input.network !== "all") {
                filters.push(eq(users.network, input.network));
            }
            if (input.gender && input.gender !== "all") {
                filters.push(eq(users.gender, input.gender));
            }
            if (input.cluster && input.cluster !== "all") {
                filters.push(eq(users.cluster, input.cluster));
            }

            const sortFieldMap: Record<string, any> = {
                scannedAt: attendance.scannedAt,
                time: attendance.scannedAt,
                firstName: users.firstName,
                lastName: users.lastName,
                name: users.lastName,
                member: users.lastName,
                ministry: users.ministry,
                cluster: users.cluster,
                network: users.network,
                gender: users.gender,
                createdAt: users.createdAt,
                joined: users.createdAt,
                contact: users.contactNumber,
            };

            const attendanceSortField = (input.atSort === 'member' || input.atSort === 'name') ? users.lastName : (sortFieldMap[input.atSort!] || attendance.scannedAt);
            const memberSortField = (input.memSort === 'name' || input.memSort === 'member') ? users.lastName : (sortFieldMap[input.memSort!] || users.createdAt);

            const [
                [totalUsers],
                [attendanceToday],
                attendanceList,
                ministryStats,
                networkStats,
                totalMinistryStats,
                totalNetworkStats,
                totalGenderStats,
                totalClusterStats,
                allMembers
            ] = await Promise.all([
                db.select({ value: count() }).from(users),
                db.select({ value: count() }).from(attendance).where(eq(attendance.scanDate, filterDate)),
                db.select({
                    id: attendance.id,
                    scannedAt: attendance.scannedAt,
                    user: {
                        firstName: users.firstName,
                        lastName: users.lastName,
                        ministry: users.ministry,
                        network: users.network,
                        cluster: users.cluster,
                        gender: users.gender,
                    }
                })
                    .from(attendance)
                    .innerJoin(users, eq(attendance.userId, users.id))
                    .where(and(...filters))
                    .orderBy(input.atOrder === 'asc' ? asc(attendanceSortField) : desc(attendanceSortField)),
                db.select({ name: users.ministry, count: count() })
                    .from(attendance)
                    .innerJoin(users, eq(attendance.userId, users.id))
                    .where(and(...filters))
                    .groupBy(users.ministry),
                db.select({ name: users.network, count: count() })
                    .from(attendance)
                    .innerJoin(users, eq(attendance.userId, users.id))
                    .where(and(...filters))
                    .groupBy(users.network),
                db.select({ name: users.ministry, count: count() }).from(users).groupBy(users.ministry).orderBy(desc(count())),
                db.select({ name: users.network, count: count() }).from(users).groupBy(users.network).orderBy(desc(count())),
                db.select({ name: users.gender, count: count() }).from(users).groupBy(users.gender),
                db.select({ name: users.cluster, count: count() }).from(users).groupBy(users.cluster),
                db.select().from(users).orderBy(input.memOrder === 'asc' ? asc(memberSortField) : desc(memberSortField))
            ]);

            const pageSize = 15;
            const totalRecords = attendanceList.length;
            const totalPages = Math.ceil(totalRecords / pageSize);
            const paginatedList = attendanceList.slice((input.page - 1) * pageSize, input.page * pageSize);

            const totalMembersCount = allMembers.length;
            const totalMemberPages = Math.ceil(totalMembersCount / pageSize);
            const paginatedMembers = allMembers.slice((input.page - 1) * pageSize, input.page * pageSize);

            return {
                totalUsers: totalUsers.value,
                attendanceToday: attendanceToday.value,
                attendanceList,
                paginatedList,
                totalPages,
                ministryStats,
                networkStats,
                totalMinistryStats,
                totalNetworkStats,
                totalGenderStats,
                totalClusterStats,
                paginatedMembers,
                totalMemberPages,
                totalMembersCount,
                filterDate
            };
        }),

    getSuggestions: publicProcedure
        .input(z.object({ userId: z.string().optional() }))
        .query(async ({ input }) => {
            const { suggestions, users, suggestionLikes } = await import("@/db/schema");

            const allSuggestions = await db.select()
                .from(suggestions)
                .orderBy(desc(suggestions.createdAt));

            const enriched = await Promise.all(allSuggestions.map(async (s) => {
                let author = null;
                if (!s.isAnonymous) {
                    const [res] = await db.select({
                        firstName: users.firstName,
                        lastName: users.lastName,
                    }).from(users).where(eq(users.id, s.userId)).limit(1);
                    author = res;
                }

                let isLiked = false;
                if (input.userId) {
                    const [like] = await db.select().from(suggestionLikes)
                        .where(and(eq(suggestionLikes.suggestionId, s.id), eq(suggestionLikes.userId, input.userId)))
                        .limit(1);
                    isLiked = !!like;
                }

                return { ...s, author, isLikedByCurrentUser: isLiked };
            }));

            return enriched;
        }),

    verifyAdminPassword: publicProcedure
        .input(z.object({ password: z.string() }))
        .mutation(async ({ input }) => {
            const adminPass = process.env.ADMIN_PASSWORD;
            if (!adminPass) {
                return { success: false, error: "Admin password not configured in environment." };
            }
            if (input.password === adminPass) {
                return { success: true };
            }
            return { success: false, error: "Invalid administrator password." };
        }),

    getActiveDailyPin: publicProcedure
        .query(async () => {
            const today = new Date().toISOString().split('T')[0];
            const [existingPin] = await db.select()
                .from(dailyPins)
                .where(eq(dailyPins.date, today))
                .limit(1);
            return { success: true, pin: existingPin || null };
        }),

    verifyPinGeneratorPassword: publicProcedure
        .input(z.object({ password: z.string() }))
        .mutation(async ({ input }) => {
            const generatorPass = process.env.PIN_GENERATOR_PASSWORD || process.env.ADMIN_PASSWORD;
            if (!generatorPass) {
                return { success: false, error: "Security password not configured." };
            }
            if (input.password === generatorPass) {
                return { success: true };
            }
            return { success: false, error: "Invalid security password." };
        }),

    generateDailyPin: publicProcedure
        .input(z.object({ password: z.string() }))
        .mutation(async ({ input }) => {
            // Re-use logic
            const generatorPass = process.env.PIN_GENERATOR_PASSWORD || process.env.ADMIN_PASSWORD;
            if (input.password !== generatorPass) {
                return { success: false, error: "Invalid security password." };
            }

            const today = new Date().toISOString().split('T')[0];
            const [existing] = await db.select()
                .from(dailyPins)
                .where(eq(dailyPins.date, today))
                .limit(1);

            if (existing) {
                return { success: true, pin: existing, message: "Today's PIN is already active." };
            }

            const pin = Math.floor(100000 + Math.random() * 900000).toString();
            const [newPin] = await db.insert(dailyPins).values({
                pin,
                date: today,
            }).returning();

            revalidatePath("/pin-generator");
            return { success: true, pin: newPin };
        }),
});

export type AppRouter = typeof appRouter;
