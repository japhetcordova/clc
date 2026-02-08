import { Metadata } from "next";
import LocationsContent from "./locations-content";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "Our Locations | Christian Life Center Tagum",
        description: "Find a Christian Life Center near you. Explore our campuses and join us for worship in Tagum City and other locations.",
        openGraph: {
            url: "/locations",
            images: ["/logo.webp"],
        },
        twitter: {
            card: "summary_large_image",
            images: ["/logo.webp"],
        }
    };
}

export default function LocationsPage() {
    return <LocationsContent />;
}
