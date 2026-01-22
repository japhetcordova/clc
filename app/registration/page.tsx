import { Metadata } from "next";
import RegistrationContent from "./registration-content";

export const metadata: Metadata = {
    title: "Registration",
    description: "Join Christian Life Center Tagum City. Create your digital profile and connect with our church family. A place to belong and grow.",
    openGraph: {
        url: "/registration",
    },
};

export default function RegistrationPage() {
    return <RegistrationContent />;
}
