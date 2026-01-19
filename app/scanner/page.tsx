import ScannerAuthGate from "./ScannerAuthGate";
import ScannerClient from "./ScannerClient";
import { trpcServer } from "@/lib/trpc/server";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Scanner Access | Christian Life Center",
    description: "Secure attendance scanning system.",
};

export default async function ScannerPage() {
    const caller = await trpcServer();
    const isAuthorized = await caller.isScannerAuthorized();

    return (
        <ScannerAuthGate isAuthorized={isAuthorized}>
            <ScannerClient />
        </ScannerAuthGate>
    );
}
