import { Metadata } from "next";
import RegistrationContent from "../registration/registration-content";

export const metadata: Metadata = {
    title: "Premium Registration",
    description: "Join Christian Life Center Tagum City as a Premium Member. Connect with our church family with exclusive features.",
    openGraph: {
        url: "/premium-registration",
    },
};

export default function PremiumRegistrationPage() {
    return <RegistrationContent isPremium={true} />;
}
