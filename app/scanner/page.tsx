import { isScannerAuthorized } from "@/lib/actions";
import ScannerAuthGate from "./ScannerAuthGate";
import ScannerClient from "./ScannerClient";

export const metadata = {
    title: "Scanner Access | Christian Life Center",
    description: "Secure attendance scanning system.",
};

export default async function ScannerPage() {
    const isAuthorized = await isScannerAuthorized();

    return (
        <ScannerAuthGate isAuthorized={isAuthorized}>
            <ScannerClient />
        </ScannerAuthGate>
    );
}
