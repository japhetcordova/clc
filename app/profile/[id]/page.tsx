import { db } from "@/db";
import { users, attendance } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import ProfileView from "./profile-view";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function getProfileData(id: string) {
    let lastError;

    for (let i = 0; i < MAX_RETRIES; i++) {
        try {
            const [user] = await db.select().from(users).where(eq(users.qrCodeId, id)).limit(1);

            if (!user) return null;

            const userAttendance = await db.select()
                .from(attendance)
                .where(eq(attendance.userId, user.id))
                .orderBy(desc(attendance.scannedAt))
                .limit(10);

            return { user, attendance: userAttendance };
        } catch (error) {
            console.error(`Attempt ${i + 1} failed:`, error);
            lastError = error;
            if (i < MAX_RETRIES - 1) {
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (i + 1))); // Exponential-ish backoff
            }
        }
    }
    throw lastError;
}

export default async function ProfilePage({ params }: { params: { id: string } }) {
    const { id } = await params;

    try {
        const data = await getProfileData(id);

        if (!data || !data.user) {
            notFound();
        }

        return <ProfileView user={data.user} qrValue={id} attendance={data.attendance} />;
    } catch (error) {
        // If all retries fail, show the error or a custom error page
        throw error;
    }
}
