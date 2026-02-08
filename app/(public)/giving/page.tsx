import { Metadata } from "next";
import GivingContent from "./giving-content";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "Giving | Christian Life Center Tagum",
        description: "Support our mission through tithes, offerings, and donations. Your generosity helps Christian Life Center Tagum City impact lives and communities.",
        openGraph: {
            url: "/giving",
            images: ["/logo.webp"],
        },
        twitter: {
            card: "summary_large_image",
            images: ["/logo.webp"],
        }
    };
}

export default function GivingPage() {
    return <GivingContent />;
}
