import { Metadata } from "next";
import LocationsContent from "./locations-content";

export const metadata: Metadata = {
    title: "Our Locations",
    description: "Find a Christian Life Center near you. Explore our campuses and join us for worship in Tagum City and other locations.",
    openGraph: {
        url: "/locations",
    },
};

export default function LocationsPage() {
    return <LocationsContent />;
}
