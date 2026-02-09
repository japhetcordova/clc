import { router, publicProcedure } from "./trpc";
import { z } from "zod";
import { db } from "@/db";
import { users, attendance, events, mobileHighlights, announcements, cellGroupInterests, classEnrollments, videos } from "@/db/schema";
import { eq, and, desc, sql, count, asc, ilike, inArray, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getLiveVideo, getRecentVideos, syncFacebookVideos } from "@/lib/video-service";
import fs from "fs";
import path from "path";

export const appRouter = router({
    getClassVideos: publicProcedure
        .query(async () => {
            const classesDir = path.join(process.cwd(), "public", "classes");

            if (!fs.existsSync(classesDir)) return {};

            const folders = fs.readdirSync(classesDir);
            const data: Record<string, { module: string | null, file: string }[]> = {};

            for (const folder of folders) {
                const folderPath = path.join(classesDir, folder);
                if (fs.statSync(folderPath).isDirectory()) {
                    const videos: { module: string | null, file: string }[] = [];
                    const entries = fs.readdirSync(folderPath, { withFileTypes: true });

                    for (const entry of entries) {
                        if (entry.isDirectory()) {
                            const moduleName = entry.name;
                            const modulePath = path.join(folderPath, moduleName);
                            const moduleFiles = fs.readdirSync(modulePath)
                                .filter(f => f.endsWith(".mp4"))
                                .map(f => ({ module: moduleName, file: f }));
                            videos.push(...moduleFiles);
                        } else if (entry.name.endsWith(".mp4")) {
                            videos.push({ module: null, file: entry.name });
                        }
                    }

                    // Sort: module ASC (null first), then filename numeric
                    videos.sort((a, b) => {
                        if (a.module !== b.module) {
                            if (!a.module) return -1;
                            if (!b.module) return 1;
                            return a.module.localeCompare(b.module, undefined, { numeric: true });
                        }
                        return a.file.localeCompare(b.file, undefined, { numeric: true });
                    });

                    data[folder] = videos;
                }
            }

            return data;
        }),

    getAnnouncements: publicProcedure
        .query(async () => {
            return db.select().from(announcements).orderBy(desc(announcements.date));
        }),

    createAnnouncement: publicProcedure
        .input(z.object({
            title: z.string(),
            content: z.string(),
            type: z.string(),
            date: z.string(),
        }))
        .mutation(async ({ input }) => {
            const [newAnnouncement] = await db.insert(announcements).values(input).returning();
            revalidatePath("/events");
            revalidatePath("/admin/announcements");
            return { success: true, announcement: newAnnouncement };
        }),

    updateAnnouncement: publicProcedure
        .input(z.object({
            id: z.string(),
            data: z.any(),
        }))
        .mutation(async ({ input }) => {
            const [updated] = await db.update(announcements)
                .set(input.data)
                .where(eq(announcements.id, input.id))
                .returning();
            revalidatePath("/events");
            revalidatePath("/admin/announcements");
            return { success: true, announcement: updated };
        }),

    deleteAnnouncement: publicProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ input }) => {
            await db.delete(announcements).where(eq(announcements.id, input.id));
            revalidatePath("/events");
            revalidatePath("/admin/announcements");
            return { success: true };
        }),

    getMobileHighlights: publicProcedure
        .query(async () => {
            return db.select().from(mobileHighlights).orderBy(desc(mobileHighlights.createdAt));
        }),

    getActiveMobileHighlight: publicProcedure
        .query(async () => {
            const [highlight] = await db.select()
                .from(mobileHighlights)
                .where(eq(mobileHighlights.isActive, true))
                .limit(1);
            return highlight || null;
        }),

    createMobileHighlight: publicProcedure
        .input(z.object({
            titlePrefix: z.string(),
            highlightedWord: z.string(),
            titleSuffix: z.string(),
            speaker: z.string(),
            series: z.string(),
            imageUrl: z.string(),
            isActive: z.boolean().default(false),
        }))
        .mutation(async ({ input }) => {
            if (input.isActive) {
                await db.update(mobileHighlights).set({ isActive: false });
            }
            const [newHighlight] = await db.insert(mobileHighlights).values(input).returning();
            revalidatePath("/mobile");
            revalidatePath("/admin/mobile-highlights");
            return { success: true, highlight: newHighlight };
        }),

    updateMobileHighlight: publicProcedure
        .input(z.object({
            id: z.string(),
            data: z.any(),
        }))
        .mutation(async ({ input }) => {
            if (input.data.isActive) {
                await db.update(mobileHighlights).set({ isActive: false });
            }
            const [updated] = await db.update(mobileHighlights)
                .set(input.data)
                .where(eq(mobileHighlights.id, input.id))
                .returning();
            revalidatePath("/mobile");
            revalidatePath("/admin/mobile-highlights");
            return { success: true, highlight: updated };
        }),

    deleteMobileHighlight: publicProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ input }) => {
            await db.delete(mobileHighlights).where(eq(mobileHighlights.id, input.id));
            revalidatePath("/mobile");
            revalidatePath("/admin/mobile-highlights");
            return { success: true };
        }),

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
            const [user] = await db.select({
                id: users.id,
                firstName: users.firstName,
                lastName: users.lastName,
                ministry: users.ministry,
            }).from(users).where(eq(users.qrCodeId, qrCodeId)).limit(1);

            if (!user) throw new Error("User not found");

            // Handle Slots based on time (Sunday specialized)
            const now = new Date();
            // Get local date in YYYY-MM-DD format
            const today = now.toLocaleDateString("en-CA");
            const dayOfWeek = now.getDay(); // 0 = Sunday
            const hour = now.getHours();
            const minute = now.getMinutes();
            const timeVal = hour * 100 + minute;

            let slot = "general";
            let displaySlot = "Daily Attendance";

            if (dayOfWeek === 0) { // Sunday
                if (timeVal < 1230) {
                    slot = "morning_service";
                    displaySlot = "Morning Service";
                } else if (timeVal < 1400) {
                    slot = "makeup_class";
                    displaySlot = "Makeup Class";
                } else if (timeVal < 1600) {
                    slot = "regular_class";
                    displaySlot = "Regular Class";
                } else {
                    slot = "afternoon_service";
                    displaySlot = "Afternoon Service";
                }
            }

            const [inserted] = await db.insert(attendance)
                .values({
                    userId: user.id,
                    scanDate: today,
                    slot,
                })
                .onConflictDoNothing({
                    target: [attendance.userId, attendance.scanDate, attendance.slot]
                })
                .returning();

            if (!inserted) {
                return {
                    success: false,
                    message: `Already marked for ${displaySlot} today`,
                    user
                };
            }

            revalidatePath("/admin");
            return { success: true, user, slot: displaySlot };
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
            schedules: z.array(z.object({
                date: z.string(),
                time: z.string(),
                location: z.string(),
            })).optional(),
            category: z.string(),
            tag: z.string(),
            image: z.string().optional(),
            maxCapacity: z.string().optional(),
            registrationLink: z.string().optional(),
            contactPerson: z.string().optional(),
            googleMapsLink: z.string().optional(),
        }))
        .mutation(async ({ input }) => {
            const [newEvent] = await db.insert(events).values({
                ...input,
                schedules: input.schedules || [],
            }).returning();
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
            revalidatePath("/events");
            return { success: true, event: updatedEvent };
        }),

    deleteEvent: publicProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ input }) => {
            await db.delete(events).where(eq(events.id, input.id));
            revalidatePath("/admin/events");
            return { success: true };
        }),

    markEventInterested: publicProcedure
        .input(z.object({ eventId: z.string() }))
        .mutation(async ({ input }) => {
            const [updatedEvent] = await db.update(events)
                .set({ interestedCount: sql`${events.interestedCount} + 1` })
                .where(eq(events.id, input.eventId))
                .returning();
            revalidatePath(`/events/${input.eventId}`);
            revalidatePath("/admin/events");
            return { success: true, interestedCount: updatedEvent.interestedCount };
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
            search: z.string().optional(),
        }))
        .query(async ({ input }) => {
            const filterDate = input.date || new Date().toISOString().split('T')[0];

            const sharedFilters = [];
            if (input.ministry && input.ministry !== "all") sharedFilters.push(eq(users.ministry, input.ministry));
            if (input.network && input.network !== "all") sharedFilters.push(eq(users.network, input.network));
            if (input.gender && input.gender !== "all") sharedFilters.push(eq(users.gender, input.gender));
            if (input.cluster && input.cluster !== "all") sharedFilters.push(eq(users.cluster, input.cluster));

            const filters = [eq(attendance.scanDate, filterDate), ...sharedFilters];

            const memberFilters = [...sharedFilters];
            if (input.search) {
                const searchCondition = or(
                    ilike(users.firstName, `%${input.search}%`),
                    ilike(users.lastName, `%${input.search}%`),
                    ilike(sql`concat(${users.firstName}, ' ', ${users.lastName})`, `%${input.search}%`),
                    ilike(users.contactNumber, `%${input.search}%`),
                    ilike(users.qrCodeId, `%${input.search}%`)
                );
                if (searchCondition) {
                    memberFilters.push(searchCondition);
                }
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

            const last3DatesResult = await db.select({ date: attendance.scanDate })
                .from(attendance)
                .groupBy(attendance.scanDate)
                .orderBy(desc(attendance.scanDate))
                .limit(12);
            const last3Dates = last3DatesResult.map(d => d.date);

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
                allMembers,
                trendMinistryStats,
                trendNetworkStats
            ] = await Promise.all([
                db.select({ value: count() }).from(users),
                db.select({ value: count() }).from(attendance).where(eq(attendance.scanDate, filterDate)),
                db.select({
                    id: attendance.id,
                    scannedAt: attendance.scannedAt,
                    slot: attendance.slot,
                    user: {
                        firstName: users.firstName,
                        lastName: users.lastName,
                        ministry: users.ministry,
                        network: users.network,
                        cluster: users.cluster,
                        gender: users.gender,
                        isPremium: users.isPremium,
                    }
                })
                    .from(attendance)
                    .innerJoin(users, eq(attendance.userId, users.id))
                    .where(and(...filters))
                    .orderBy(input.atOrder === 'asc' ? asc(attendanceSortField) : desc(attendanceSortField)),
                db.select({ name: users.ministry, count: sql<number>`count(distinct ${users.id})` })
                    .from(attendance)
                    .innerJoin(users, eq(attendance.userId, users.id))
                    .where(and(...filters))
                    .groupBy(users.ministry),
                db.select({ name: users.network, count: sql<number>`count(distinct ${users.id})` })
                    .from(attendance)
                    .innerJoin(users, eq(attendance.userId, users.id))
                    .where(and(...filters))
                    .groupBy(users.network),
                db.select({ name: users.ministry, count: count() }).from(users).groupBy(users.ministry).orderBy(desc(count())),
                db.select({ name: users.network, count: count() }).from(users).groupBy(users.network).orderBy(desc(count())),
                db.select({ name: users.gender, count: count() }).from(users).groupBy(users.gender),
                db.select({ name: users.cluster, count: count() }).from(users).groupBy(users.cluster),
                db.select()
                    .from(users)
                    .where(and(...memberFilters))
                    .orderBy(input.memOrder === 'asc' ? asc(memberSortField) : desc(memberSortField)),
                // Trend Stats (sum of last 3 dates)
                db.select({ name: users.ministry, count: sql<number>`count(distinct ${users.id})` })
                    .from(attendance)
                    .innerJoin(users, eq(attendance.userId, users.id))
                    .where(last3Dates.length > 0 ? inArray(attendance.scanDate, last3Dates) : sql`1=0`)
                    .groupBy(users.ministry),
                db.select({ name: users.network, count: sql<number>`count(distinct ${users.id})` })
                    .from(attendance)
                    .innerJoin(users, eq(attendance.userId, users.id))
                    .where(last3Dates.length > 0 ? inArray(attendance.scanDate, last3Dates) : sql`1=0`)
                    .groupBy(users.network),
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
                ministryStats: ministryStats.map(s => ({ ...s, count: Number(s.count) })),
                networkStats: networkStats.map(s => ({ ...s, count: Number(s.count) })),
                totalMinistryStats,
                totalNetworkStats,
                totalGenderStats,
                totalClusterStats,
                paginatedMembers,
                totalMemberPages,
                totalMembersCount,
                filterDate,
                trendMinistryStats: trendMinistryStats.map(stat => ({ ...stat, count: Number(stat.count) })),
                trendNetworkStats: trendNetworkStats.map(stat => ({ ...stat, count: Number(stat.count) })),
                classEnrollmentStats: await db.select({
                    level: classEnrollments.classLevel,
                    count: count(),
                    status: classEnrollments.status
                }).from(classEnrollments).groupBy(classEnrollments.classLevel, classEnrollments.status)
            };
        }),

    getMemberSuggestions: publicProcedure
        .input(z.object({
            query: z.string()
        }))
        .query(async ({ input }) => {
            if (!input.query || input.query.length < 2) return [];

            const suggestions = await db.select({
                id: users.id,
                firstName: users.firstName,
                lastName: users.lastName,
                qrCodeId: users.qrCodeId,
                ministry: users.ministry,
                network: users.network
            })
                .from(users)
                .where(
                    or(
                        ilike(users.firstName, `%${input.query}%`),
                        ilike(users.lastName, `%${input.query}%`),
                        ilike(users.ministry, `%${input.query}%`),
                        ilike(users.qrCodeId, `%${input.query}%`)
                    )
                )
                .limit(5);

            return suggestions;
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

    updateVideoTitle: publicProcedure
        .input(z.object({
            id: z.string(),
            manualTitle: z.string(),
        }))
        .mutation(async ({ input }) => {
            await db.update(videos)
                .set({ manualTitle: input.manualTitle })
                .where(eq(videos.id, input.id));
            revalidatePath("/watch");
            return { success: true };
        }),



    getUserByQrId: publicProcedure
        .input(z.object({ qrCodeId: z.string() }))
        .query(async ({ input }) => {
            const [user] = await db.select().from(users).where(eq(users.qrCodeId, input.qrCodeId)).limit(1);
            return user || null;
        }),

    getProfileData: publicProcedure
        .input(z.object({ qrCodeId: z.string() }))
        .query(async ({ input }) => {
            const [user] = await db.select().from(users).where(eq(users.qrCodeId, input.qrCodeId)).limit(1);
            if (!user) return null;

            const userAttendance = await db.select()
                .from(attendance)
                .where(eq(attendance.userId, user.id))
                .orderBy(desc(attendance.scannedAt))
                .limit(10);

            return { user, attendance: userAttendance };
        }),

    findUser: publicProcedure
        .input(z.object({ firstName: z.string(), lastName: z.string() }))
        .mutation(async ({ input }) => {
            const [user] = await db.select().from(users).where(
                and(
                    ilike(users.firstName, input.firstName.trim()),
                    ilike(users.lastName, input.lastName.trim())
                )
            ).limit(1);

            if (!user) return { success: false, error: "Profile not found." };

            // Set cookie if found
            const cookieStore = await cookies();
            cookieStore.set("qrCodeId", user.qrCodeId, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/",
                maxAge: 60 * 60 * 24 * 400,
            });

            return { success: true, user };
        }),

    registerUser: publicProcedure
        .input(z.object({
            firstName: z.string(),
            lastName: z.string(),
            gender: z.string(),
            network: z.string(),
            cluster: z.string(),
            contactNumber: z.string(),
            email: z.string().optional(),
            ministry: z.string(),
            isPremium: z.boolean().optional().default(false)
        }))
        .mutation(async ({ input }) => {
            const { firstName, lastName, contactNumber, isPremium } = input;

            // Check for existing user
            const [existingUser] = await db.select().from(users).where(
                and(
                    ilike(users.firstName, firstName.trim()),
                    ilike(users.lastName, lastName.trim())
                )
            ).limit(1);

            if (existingUser) {
                // Update existing user to premium if not already
                if (isPremium && !existingUser.isPremium) {
                    await db.update(users).set({ isPremium: true }).where(eq(users.id, existingUser.id));
                    existingUser.isPremium = true;
                }

                const cookieStore = await cookies();
                cookieStore.set("qrCodeId", existingUser.qrCodeId, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    path: "/",
                    maxAge: 60 * 60 * 24 * 400,
                });
                return { success: true, user: existingUser, alreadyExists: true };
            }

            const qrCodeId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

            const [newUser] = await db.insert(users).values({
                ...input,
                qrCodeId,
            }).returning();

            const cookieStore = await cookies();
            cookieStore.set("qrCodeId", qrCodeId, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/",
                maxAge: 60 * 60 * 24 * 400,
            });

            return { success: true, user: newUser };
        }),

    getPublicEvents: publicProcedure
        .query(async () => {
            return await db.select().from(events).orderBy(desc(events.date)).limit(50);
        }),

    getEventById: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input }) => {
            const [event] = await db.select().from(events).where(eq(events.id, input.id)).limit(1);
            return event || null;
        }),

    updateUser: publicProcedure
        .input(z.object({
            qrCodeId: z.string(),
            data: z.object({
                firstName: z.string(),
                lastName: z.string(),
                gender: z.string(),
                network: z.string(),
                cluster: z.string(),
                contactNumber: z.string(),
                email: z.string().optional(),
                ministry: z.string()
            })
        }))
        .mutation(async ({ input }) => {
            const { qrCodeId, data } = input;
            await db.update(users).set(data).where(eq(users.qrCodeId, qrCodeId));
            revalidatePath(`/profile/${qrCodeId}`);
            return { success: true };
        }),

    createSuggestion: publicProcedure
        .input(z.object({
            userId: z.string(),
            content: z.string(),
            isAnonymous: z.boolean().default(false)
        }))
        .mutation(async ({ input }) => {
            const { suggestions } = await import("@/db/schema");
            const [newSuggestion] = await db.insert(suggestions).values({
                ...input,
                likeCount: 0,
            }).returning();

            revalidatePath("/suggestions");
            return { success: true, suggestion: newSuggestion };
        }),

    toggleSuggestionLike: publicProcedure
        .input(z.object({
            suggestionId: z.string(),
            userId: z.string()
        }))
        .mutation(async ({ input }) => {
            const { suggestionLikes, suggestions } = await import("@/db/schema");
            const { suggestionId, userId } = input;

            const [existingLike] = await db.select()
                .from(suggestionLikes)
                .where(and(eq(suggestionLikes.suggestionId, suggestionId), eq(suggestionLikes.userId, userId)))
                .limit(1);

            if (existingLike) {
                await db.delete(suggestionLikes)
                    .where(and(eq(suggestionLikes.suggestionId, suggestionId), eq(suggestionLikes.userId, userId)));

                const [updated] = await db.update(suggestions)
                    .set({ likeCount: sql`${suggestions.likeCount} - 1` })
                    .where(eq(suggestions.id, suggestionId))
                    .returning();

                return { success: true, liked: false, likeCount: updated.likeCount };
            } else {
                await db.insert(suggestionLikes).values({ suggestionId, userId });

                const [updated] = await db.update(suggestions)
                    .set({ likeCount: sql`${suggestions.likeCount} + 1` })
                    .where(eq(suggestions.id, suggestionId))
                    .returning();

                return { success: true, liked: true, likeCount: updated.likeCount };
            }
        }),

    isScannerAuthorized: publicProcedure
        .query(async () => {
            const cookieStore = await cookies();
            return cookieStore.get("clc_scanner_session")?.value === "authorized";
        }),

    getMe: publicProcedure
        .query(async () => {
            const cookieStore = await cookies();
            const qrCodeId = cookieStore.get("qrCodeId")?.value;
            if (!qrCodeId) return null;
            const [user] = await db.select().from(users).where(eq(users.qrCodeId, qrCodeId)).limit(1);
            return user || null;
        }),

    validateScannerPin: publicProcedure
        .input(z.object({ password: z.string() }))
        .mutation(async ({ input }) => {
            const scannerPin = process.env.SCANNER_PIN;

            if (!scannerPin) {
                return { success: false, error: "Scanner PIN not configured." };
            }

            if (input.password === scannerPin) {
                const cookieStore = await cookies();
                cookieStore.set("clc_scanner_session", "authorized", {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    path: "/",
                    maxAge: 60 * 60 * 24 * 365, // 1 year (permanent session)
                });
                return { success: true };
            }

            return { success: false, error: "Invalid security PIN." };
        }),

    clearScannerSession: publicProcedure
        .mutation(async () => {
            const cookieStore = await cookies();
            cookieStore.delete("clc_scanner_session");
            return { success: true };
        }),

    verifyProfilePin: publicProcedure
        .input(z.object({ qrCodeId: z.string(), pin: z.string() }))
        .mutation(async ({ input }) => {
            const [user] = await db.select().from(users).where(eq(users.qrCodeId, input.qrCodeId)).limit(1);
            if (!user) return { success: false, error: "Profile not found." };

            // For now, use the full contact number as the PIN
            if (user.contactNumber === input.pin) {
                const cookieStore = await cookies();
                cookieStore.set("qrCodeId", user.qrCodeId, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    path: "/",
                    maxAge: 60 * 60 * 24 * 400,
                });
                return { success: true };
            }
            return { success: false, error: "Invalid contact number." };
        }),

    logout: publicProcedure
        .mutation(async () => {
            const cookieStore = await cookies();
            cookieStore.delete("qrCodeId");
            return { success: true };
        }),

    getWeeklyTrends: publicProcedure
        .query(async () => {
            // Fetch attendance grouping by actual scan dates
            const result = await db
                .select({
                    date: attendance.scanDate,
                    count: count(),
                })
                .from(attendance)
                .groupBy(attendance.scanDate)
                .orderBy(desc(attendance.scanDate))
                .limit(12); // Get last 12 recorded dates

            // Format data for the chart, reversing to show chronological order
            const formattedData = result.reverse().map(record => {
                // Ensure date string is parsed correctly despite timezone offsets
                // Create date from YYYY-MM-DD string component only
                const [year, month, day] = record.date.split('-').map(Number);
                const dateObj = new Date(year, month - 1, day);

                const dateLabel = dateObj.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                });

                return {
                    week: dateLabel,
                    count: record.count,
                    fullDate: record.date,
                };
            });

            return formattedData;
        }),

    getTrendMemberDetails: publicProcedure
        .input(z.object({
            type: z.enum(["network", "ministry"]),
            value: z.string(),
        }))
        .query(async ({ input }) => {
            // Get last 12 recorded dates to define the trend period
            const last12DatesResult = await db.select({ date: attendance.scanDate })
                .from(attendance)
                .groupBy(attendance.scanDate)
                .orderBy(desc(attendance.scanDate))
                .limit(12);

            if (last12DatesResult.length === 0) return [];

            const last12Dates = last12DatesResult.map(d => d.date);

            const attendees = await db.select({
                id: users.id,
                firstName: users.firstName,
                lastName: users.lastName,
                contactNumber: users.contactNumber,
                network: users.network,
                ministry: users.ministry,
                qrCodeId: users.qrCodeId,
            })
                .from(attendance)
                .innerJoin(users, eq(attendance.userId, users.id))
                .where(
                    and(
                        inArray(attendance.scanDate, last12Dates),
                        eq(input.type === "network" ? users.network : users.ministry, input.value)
                    )
                )
                .groupBy(users.id, users.firstName, users.lastName, users.contactNumber, users.network, users.ministry, users.qrCodeId)
                .orderBy(users.lastName);

            return attendees;
        }),

    submitCellGroupInterest: publicProcedure
        .input(z.object({
            firstName: z.string(),
            lastName: z.string(),
            birthdate: z.string(),
            email: z.string().optional(),
            phoneNumber: z.string(),
            gender: z.string(),
            address: z.string(),
            preferredService: z.string(),
        }))
        .mutation(async ({ input }) => {
            const [newInterest] = await db.insert(cellGroupInterests).values(input).returning();
            return { success: true, interest: newInterest };
        }),

    getCellGroupInterests: publicProcedure
        .query(async () => {
            return await db.select().from(cellGroupInterests).orderBy(desc(cellGroupInterests.createdAt));
        }),

    enrollStudentByQr: publicProcedure
        .input(z.object({
            qrCodeId: z.string(),
            classLevel: z.string()
        }))
        .mutation(async ({ input }) => {
            const { qrCodeId, classLevel } = input;

            const [user] = await db.select().from(users).where(eq(users.qrCodeId, qrCodeId)).limit(1);
            if (!user) throw new Error("User not found");

            const [existing] = await db.select().from(classEnrollments)
                .where(and(eq(classEnrollments.userId, user.id), eq(classEnrollments.classLevel, classLevel)))
                .limit(1);

            if (existing) {
                return { success: true, alreadyEnrolled: true };
            }

            await db.insert(classEnrollments).values({
                userId: user.id,
                classLevel,
                status: 'active'
            });

            revalidatePath("/classes");
            revalidatePath(`/profile/${qrCodeId}`);

            return { success: true };
        }),

    getClassEnrollments: publicProcedure
        .query(async () => {
            return await db.select({
                id: classEnrollments.id,
                classLevel: classEnrollments.classLevel,
                status: classEnrollments.status,
                enrolledAt: classEnrollments.enrolledAt,
                user: {
                    id: users.id,
                    firstName: users.firstName,
                    lastName: users.lastName,
                    qrCodeId: users.qrCodeId,
                    network: users.network,
                }
            })
                .from(classEnrollments)
                .innerJoin(users, eq(classEnrollments.userId, users.id))
                .orderBy(desc(classEnrollments.enrolledAt));
        }),

    updateClassEnrollmentStatus: publicProcedure
        .input(z.object({
            id: z.string(),
            status: z.enum(["active", "completed", "dropped"])
        }))
        .mutation(async ({ input }) => {
            await db.update(classEnrollments)
                .set({ status: input.status })
                .where(eq(classEnrollments.id, input.id));

            revalidatePath("/admin");
            revalidatePath("/classes");
            return { success: true };
        }),

    getVideos: publicProcedure
        .query(async () => {
            const live = await getLiveVideo();
            const archive = await getRecentVideos();
            return { live, archive };
        }),

    syncVideos: publicProcedure
        .input(z.object({ accessToken: z.string().optional() }))
        .mutation(async ({ input }) => {
            const result = await syncFacebookVideos(input.accessToken);
            revalidatePath("/watch");
            return result;
        }),
});

export type AppRouter = typeof appRouter;
