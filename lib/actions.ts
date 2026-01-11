"use server";

import { db } from "@/db";
import { users, attendance, dailyPins, events } from "@/db/schema";
import type { NewChurchEvent } from "@/db/schema";
import { eq, and, desc, ilike } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { getTodayString, getManilaMidnight } from "./date-utils";

export async function registerUser(formData: {
    firstName: string;
    lastName: string;
    gender: string;
    network: string;
    cluster: string;
    contactNumber: string;
    email?: string;
    ministry: string;
}) {
    const firstName = formData.firstName.trim();
    const lastName = formData.lastName.trim();

    try {
        // Check for existing user (Name or Contact Number)
        const [existingUser] = await db.select().from(users).where(
            and(
                ilike(users.firstName, firstName),
                ilike(users.lastName, lastName)
            )
        ).limit(1);

        if (existingUser) {
            // Set cookie for existing user
            const cookieStore = await cookies();
            cookieStore.set("qrCodeId", existingUser.qrCodeId, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/",
                maxAge: 60 * 60 * 24 * 400, // 400 days
            });
            return { success: true, user: existingUser, alreadyExists: true };
        }

        // Generate a secure QR code ID
        const qrCodeId = randomBytes(8).toString('hex');

        const [newUser] = await db.insert(users).values({
            ...formData,
            firstName,
            lastName,
            qrCodeId,
        }).returning();

        // Set cookie for new user
        const cookieStore = await cookies();
        cookieStore.set("qrCodeId", newUser.qrCodeId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 400, // 400 days
        });

        return { success: true, user: newUser, alreadyExists: false };
    } catch (error) {
        return { success: false, error: "Failed to register user." };
    }
}

export async function updateUser(qrCodeId: string, formData: Partial<{
    firstName: string;
    lastName: string;
    gender: string;
    network: string;
    cluster: string;
    contactNumber: string;
    email?: string;
    ministry: string;
}>) {
    try {
        const [updatedUser] = await db.update(users)
            .set(formData)
            .where(eq(users.qrCodeId, qrCodeId))
            .returning();

        revalidatePath(`/profile/${qrCodeId}`);
        return { success: true, user: updatedUser };
    } catch (error) {
        return { success: false, error: "Failed to update profile." };
    }
}

export async function findUser(firstName: string, lastName: string) {
    const fName = firstName.trim();
    const lName = lastName.trim();

    try {
        const [user] = await db.select().from(users).where(
            and(
                ilike(users.firstName, fName),
                ilike(users.lastName, lName)
            )
        ).limit(1);

        if (user) {
            // Set cookie for found user
            const cookieStore = await cookies();
            cookieStore.set("qrCodeId", user.qrCodeId, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/",
                maxAge: 60 * 60 * 24 * 400, // 400 days
            });
            return { success: true, user };
        }
        return { success: false, error: "No profile found with this name." };
    } catch (error) {
        return { success: false, error: "Search failed." };
    }
}

export async function markAttendance(qrCodeId: string) {
    try {
        // Find user by QR code ID
        const [user] = await db.select().from(users).where(eq(users.qrCodeId, qrCodeId)).limit(1);

        if (!user) {
            return { success: false, error: "User not found." };
        }

        const today = getTodayString();

        // Check if already marked for today
        const [existing] = await db.select()
            .from(attendance)
            .where(and(eq(attendance.userId, user.id), eq(attendance.scanDate, today)))
            .limit(1);

        if (existing) {
            return { success: false, error: "Attendance already recorded for today.", user };
        }

        // Record attendance
        await db.insert(attendance).values({
            userId: user.id,
            scanDate: today,
        });

        revalidatePath("/admin");
        return { success: true, user };
    } catch (error) {
        return { success: false, error: "Failed to record attendance." };
    }
}

export async function verifyAdminPassword(password: string) {
    const adminPass = process.env.ADMIN_PASSWORD;
    if (!adminPass) {
        return { success: false, error: "Admin password not configured in environment." };
    }
    if (password === adminPass) {
        return { success: true };
    }
    return { success: false, error: "Invalid administrator password." };
}

export async function verifyPinGeneratorPassword(password: string) {
    const generatorPass = process.env.PIN_GENERATOR_PASSWORD || process.env.ADMIN_PASSWORD;
    if (!generatorPass) {
        return { success: false, error: "Security password not configured." };
    }
    if (password === generatorPass) {
        return { success: true };
    }
    return { success: false, error: "Invalid security password." };
}

export async function getActiveDailyPin() {
    try {
        const today = getTodayString();
        const [existingPin] = await db.select()
            .from(dailyPins)
            .where(eq(dailyPins.date, today))
            .limit(1);

        return { success: true, pin: existingPin || null };
    } catch (error) {
        return { success: false, error: "Failed to retrieve today's security status." };
    }
}

export async function generateDailyPin(password: string) {
    const auth = await verifyPinGeneratorPassword(password);
    if (!auth.success) return auth;

    try {
        const today = getTodayString();

        // Re-check if already exists to avoid race conditions
        const [existing] = await db.select()
            .from(dailyPins)
            .where(eq(dailyPins.date, today))
            .limit(1);

        if (existing) {
            return { success: true, pin: existing, message: "Today's PIN is already active." };
        }

        // Generate a random 6-digit PIN
        const pin = Math.floor(100000 + Math.random() * 900000).toString();

        const [newPin] = await db.insert(dailyPins).values({
            pin,
            date: today,
        }).returning();

        revalidatePath("/pin-generator");
        return { success: true, pin: newPin };
    } catch (error) {
        return { success: false, error: "Failed to generate security PIN." };
    }
}

export async function validateScannerPin(pin: string) {
    try {
        const today = getTodayString();

        const [activePin] = await db.select()
            .from(dailyPins)
            .where(eq(dailyPins.date, today))
            .limit(1);

        if (!activePin) {
            return { success: false, error: "No active PIN for today. Please contact an administrator." };
        }

        if (activePin.pin === pin) {
            const expiryDate = getManilaMidnight();

            const cookieStore = await cookies();
            cookieStore.set("clc_scanner_session", "authorized", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/",
                expires: expiryDate,
            });

            return { success: true };
        }

        return { success: false, error: "Invalid security PIN entered." };
    } catch (error) {
        return { success: false, error: "Security check failed." };
    }
}

export async function isScannerAuthorized() {
    const cookieStore = await cookies();
    return cookieStore.get("clc_scanner_session")?.value === "authorized";
}

export async function clearScannerSession() {
    const cookieStore = await cookies();
    cookieStore.delete("clc_scanner_session");
    return { success: true };
}

// EVENT ACTIONS
export async function createEvent(data: NewChurchEvent) {
    try {
        const [newEvent] = await db.insert(events).values(data).returning();
        revalidatePath("/admin/events");
        revalidatePath("/events");
        return { success: true, event: newEvent };
    } catch (error) {
        return { success: false, error: "Failed to create event." };
    }
}

export async function updateEvent(id: string, data: Partial<NewChurchEvent>) {
    try {
        const [updatedEvent] = await db.update(events)
            .set(data)
            .where(eq(events.id, id))
            .returning();
        revalidatePath("/admin/events");
        revalidatePath(`/events/${id}`);
        revalidatePath("/events");
        return { success: true, event: updatedEvent };
    } catch (error) {
        return { success: false, error: "Failed to update event." };
    }
}

export async function deleteEvent(id: string) {
    try {
        await db.delete(events).where(eq(events.id, id));
        revalidatePath("/admin/events");
        revalidatePath("/events");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete event." };
    }
}

// ============================================
// SUGGESTION ACTIONS
// ============================================

export async function createSuggestion(data: {
    content: string;
    isAnonymous: boolean;
    userId: string;
}) {
    try {
        const { suggestions } = await import("@/db/schema");

        if (!data.content.trim()) {
            return { success: false, error: "Suggestion cannot be empty." };
        }

        const [newSuggestion] = await db.insert(suggestions).values({
            content: data.content.trim(),
            isAnonymous: data.isAnonymous,
            userId: data.userId,
        }).returning();

        revalidatePath("/suggestions");
        return { success: true, suggestion: newSuggestion };
    } catch (error) {
        console.error("Error creating suggestion:", error);
        return { success: false, error: "Failed to create suggestion." };
    }
}

export async function toggleSuggestionLike(suggestionId: string, userId: string) {
    try {
        const { suggestions, suggestionLikes } = await import("@/db/schema");

        // Check if user already liked this suggestion
        const [existingLike] = await db.select()
            .from(suggestionLikes)
            .where(
                and(
                    eq(suggestionLikes.suggestionId, suggestionId),
                    eq(suggestionLikes.userId, userId)
                )
            )
            .limit(1);

        if (existingLike) {
            // Unlike: Remove the like
            await db.delete(suggestionLikes)
                .where(eq(suggestionLikes.id, existingLike.id));

            // Get new count and update
            const likes = await db.select()
                .from(suggestionLikes)
                .where(eq(suggestionLikes.suggestionId, suggestionId));

            await db.update(suggestions)
                .set({ likeCount: likes.length })
                .where(eq(suggestions.id, suggestionId));

            revalidatePath("/suggestions");
            return { success: true, liked: false };
        } else {
            // Like: Add the like
            await db.insert(suggestionLikes).values({
                suggestionId,
                userId,
            });

            // Get new count and update
            const likes = await db.select()
                .from(suggestionLikes)
                .where(eq(suggestionLikes.suggestionId, suggestionId));

            await db.update(suggestions)
                .set({ likeCount: likes.length })
                .where(eq(suggestions.id, suggestionId));

            revalidatePath("/suggestions");
            return { success: true, liked: true };
        }
    } catch (error) {
        console.error("Error toggling suggestion like:", error);
        return { success: false, error: "Failed to toggle like." };
    }
}

export async function getSuggestions(currentUserId?: string) {
    try {
        const { suggestions, suggestionLikes } = await import("@/db/schema");

        const allSuggestions = await db.select({
            id: suggestions.id,
            content: suggestions.content,
            isAnonymous: suggestions.isAnonymous,
            userId: suggestions.userId,
            likeCount: suggestions.likeCount,
            createdAt: suggestions.createdAt,
        })
            .from(suggestions)
            .orderBy(desc(suggestions.createdAt));

        // Fetch user data for non-anonymous suggestions
        const enrichedSuggestions = await Promise.all(
            allSuggestions.map(async (suggestion) => {
                let author = null;

                if (!suggestion.isAnonymous) {
                    const [user] = await db.select({
                        firstName: users.firstName,
                        lastName: users.lastName,
                    })
                        .from(users)
                        .where(eq(users.id, suggestion.userId))
                        .limit(1);

                    author = user || null;
                }

                // Check if current user has liked this suggestion
                let isLikedByCurrentUser = false;
                if (currentUserId) {
                    const [like] = await db.select()
                        .from(suggestionLikes)
                        .where(
                            and(
                                eq(suggestionLikes.suggestionId, suggestion.id),
                                eq(suggestionLikes.userId, currentUserId)
                            )
                        )
                        .limit(1);

                    isLikedByCurrentUser = !!like;
                }

                return {
                    ...suggestion,
                    author,
                    isLikedByCurrentUser,
                };
            })
        );

        return { success: true, suggestions: enrichedSuggestions };
    } catch (error) {
        console.error("Error fetching suggestions:", error);
        return { success: false, error: "Failed to fetch suggestions.", suggestions: [] };
    }
}
