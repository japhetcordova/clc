import { Metadata } from "next";
import MinistriesContent from "./ministries-content";

export const metadata: Metadata = {
    title: "Ministries",
    description: "Discover the various ministries at Christian Life Center Tagum City. Find your place to serve and grow in your spiritual journey.",
};

export default function MinistriesPage() {
    return <MinistriesContent />;
}
