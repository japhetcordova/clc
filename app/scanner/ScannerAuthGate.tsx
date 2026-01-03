"use client";

import { ShieldAlert } from "lucide-react";
import { validateScannerPin, clearScannerSession } from "@/lib/actions";
import { SecurityGate } from "@/components/SecurityGate";

export default function ScannerAuthGate({
    children,
    isAuthorized
}: {
    children: React.ReactNode;
    isAuthorized: boolean
}) {
    return (
        <SecurityGate
            title="Scanner Lock"
            description="Daily Security PIN Required"
            icon={<ShieldAlert className="w-8 h-8 text-primary" />}
            accentColor="primary"
            isOTP={true}
            onVerify={validateScannerPin}
            onAuthorized={() => { }}
            onMidnight={clearScannerSession}
            initialAuthorized={isAuthorized}
            footerNote="PINs are valid for 24 hours only."
        >
            {children}
        </SecurityGate>
    );
}
