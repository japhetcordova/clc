import LandingContent from "../landing-content"
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export const metadata: Metadata = {
    title: "Christian Life Center Tagum City | CLC Tagum",
    description: "Welcome to Christian Life Center Tagum City (CLC Tagum). Join us for worship, community, and spiritual growth. Love God. Love People. Make Disciples.",
    keywords: ["christian life center", "christian life centr", "christian life center tagum city", "clc tagum", "tagum city church"],
    openGraph: {
        url: "/landing",
    }
};

export default async function Landing() {
    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || "";
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

    if (isMobile) {
        redirect("/mobile");
    }

    return (
        <LandingContent />
    )
}
