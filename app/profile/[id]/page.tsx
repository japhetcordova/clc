import { db } from "@/db";
import { users, attendance } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import ProfileView from "./profile-view";

export default async function ProfilePage({ params }: { params: { id: string } }) {
    const { id } = await params;

    const [user] = await db.select().from(users).where(eq(users.qrCodeId, id)).limit(1);

    if (!user) {
        notFound();
    }

    const userAttendance = await db.select()
        .from(attendance)
        .where(eq(attendance.userId, user.id))
        .orderBy(desc(attendance.scannedAt))
        .limit(10);

    return <ProfileView user={user} qrValue={id} attendance={userAttendance} />;
}
