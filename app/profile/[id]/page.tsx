import { notFound } from "next/navigation";
import ProfileView from "./profile-view";
import { trpcServer } from "@/lib/trpc/server";

export default async function ProfilePage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const caller = await trpcServer();

    try {
        const data = await caller.getProfileData({ qrCodeId: id });

        if (!data || !data.user) {
            notFound();
        }

        return <ProfileView user={data.user} qrValue={id} attendance={data.attendance} />;
    } catch (error) {
        console.error("Failed to fetch profile data:", error);
        throw error;
    }
}
