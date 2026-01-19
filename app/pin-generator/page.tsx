export const dynamic = "force-dynamic";
import PinGeneratorAuthGate from "./auth-gate";
import PinGeneratorClient from "./generator-client";
import { trpcServer } from "@/lib/trpc/server";

export const metadata = {
    title: "Daily PIN Generator | Christian Life Center",
    description: "Secure generation of daily access codes for scanners.",
};

export default async function PinGeneratorPage() {
    const caller = await trpcServer();
    const result = await caller.getActiveDailyPin();
    const initialPin = result.success && result.pin ? result.pin : null;

    return (
        <PinGeneratorAuthGate>
            <PinGeneratorClient initialPin={initialPin as any} />
        </PinGeneratorAuthGate>
    );
}
