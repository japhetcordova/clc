export const dynamic = "force-dynamic";
import { getActiveDailyPin } from "@/lib/actions";

import PinGeneratorAuthGate from "./auth-gate";
import PinGeneratorClient from "./generator-client";

export const metadata = {
    title: "Daily PIN Generator | Christian Life Center",
    description: "Secure generation of daily access codes for scanners.",
};

export default async function PinGeneratorPage() {
    const result = await getActiveDailyPin();
    const initialPin = result.success && result.pin ? result.pin : null;

    return (
        <PinGeneratorAuthGate>
            <PinGeneratorClient initialPin={initialPin} />
        </PinGeneratorAuthGate>
    );
}
