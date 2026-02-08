import { Metadata } from "next";
import MinistriesContent from "./ministries-content";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "Ministries | Christian Life Center Tagum",
        description: "Discover the various ministries at Christian Life Center Tagum City. Find your place to serve and grow in your spiritual journey.",
        openGraph: {
            url: "/ministries",
            images: ["/logo.webp"],
        },
        twitter: {
            card: "summary_large_image",
            images: ["/logo.webp"],
        }
    };
}

export default function MinistriesPage() {
    return <MinistriesContent />;
}
