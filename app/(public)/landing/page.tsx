import LandingContent from "../landing-content"
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Christian Life Center Tagum City | CLC Tagum",
    description: "Welcome to Christian Life Center Tagum City (CLC Tagum). Join us for worship, community, and spiritual growth. Love God. Love People. Make Disciples.",
    keywords: ["christian life center", "christian life centr", "christian life center tagum city", "clc tagum", "tagum city church"],
    openGraph: {
        url: "/landing",
    }
};

export default function Landing() {
    return (
        <LandingContent />
    )
}
