import { Metadata } from "next";
import GivingContent from "./giving-content";

export const metadata: Metadata = {
    title: "Giving",
    description: "Support our mission through tithes, offerings, and donations. Your generosity helps Christian Life Center Tagum City impact lives and communities.",
};

export default function GivingPage() {
    return <GivingContent />;
}
