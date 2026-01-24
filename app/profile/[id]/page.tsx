import { notFound } from "next/navigation";
import ProfileView from "./profile-view";
import { trpcServer } from "@/lib/trpc/server";
import { Metadata } from "next";
import { cookies } from "next/headers";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const { id } = await params;
    const caller = await trpcServer();
    const data = await caller.getProfileData({ qrCodeId: id });

    if (!data || !data.user) {
        return {
            title: "Profile Not Found",
        };
    }

    return {
        title: `${data.user.firstName} ${data.user.lastName} | Digital ID`,
        description: `Official digital member identification for ${data.user.firstName} ${data.user.lastName} at Christian Life Center Tagum City.`,
        robots: {
            index: false, // Don't index individual profiles for privacy
        },
    };
}

export default async function ProfilePage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const caller = await trpcServer();

    try {
        const data = await caller.getProfileData({ qrCodeId: id });

        if (!data || !data.user) {
            notFound();
        }

        const cookieStore = await cookies();
        const storedQrId = cookieStore.get("qrCodeId")?.value;
        const isAuthorized = storedQrId === id;

        return <ProfileView user={data.user} qrValue={id} attendance={data.attendance} initialAuthorized={isAuthorized} />;
    } catch (error) {
        console.error("Failed to fetch profile data:", error);
        throw error;
    }
}
