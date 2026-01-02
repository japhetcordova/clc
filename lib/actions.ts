"use server";

import { db } from "@/db";
import { users, attendance } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { randomBytes } from "node:crypto";

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
    try {
        // Check for existing user (Name or Contact Number)
        const [existingUser] = await db.select().from(users).where(
            and(
                eq(users.firstName, formData.firstName),
                eq(users.lastName, formData.lastName)
            )
        ).limit(1);

        if (existingUser) {
            return { success: true, user: existingUser, alreadyExists: true };
        }

        // Generate a secure QR code ID
        const qrCodeId = randomBytes(8).toString('hex');

        const [newUser] = await db.insert(users).values({
            ...formData,
            qrCodeId,
        }).returning();

        return { success: true, user: newUser, alreadyExists: false };
    } catch (error) {
        console.error("Registration error:", error);
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
        console.error("Update error:", error);
        return { success: false, error: "Failed to update profile." };
    }
}

export async function findUser(firstName: string, lastName: string) {
    try {
        const [user] = await db.select().from(users).where(
            and(
                eq(users.firstName, firstName),
                eq(users.lastName, lastName)
            )
        ).limit(1);

        if (user) {
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

        const today = new Date().toISOString().split("T")[0];

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
        console.error("Attendance error:", error);
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
