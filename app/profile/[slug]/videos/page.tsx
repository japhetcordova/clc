import { notFound } from "next/navigation";
import VideosView from "./videos-view";
import { trpcServer } from "@/lib/trpc/server";
import { Metadata } from "next";
import { cookies } from "next/headers";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const { slug } = await params;
    const caller = await trpcServer();
    const data = await caller.getProfileData({ qrCodeId: slug });

    if (!data || !data.user) {
        return {
            title: "Profile Not Found",
        };
    }

    return {
        title: `Curriculum Videos | ${data.user.firstName} ${data.user.lastName}`,
        description: `Journey Curriculum materials and video lessons for ${data.user.firstName} ${data.user.lastName}.`,
        robots: {
            index: false,
        },
    };
}

export default async function VideosPage({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const caller = await trpcServer();

    try {
        const data = await caller.getProfileData({ qrCodeId: slug });

        if (!data || !data.user) {
            notFound();
        }

        const cookieStore = await cookies();
        const storedQrId = cookieStore.get("qrCodeId")?.value;
        const isAuthorized = storedQrId === slug;

        return <VideosView user={data.user} qrValue={slug} enrollments={data.enrollments} initialAuthorized={isAuthorized} />;
    } catch (error) {
        console.error("Failed to fetch profile data:", error);
        throw error;
    }
}
