"use client";

import { ShieldAlert } from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import { SecurityGate } from "@/components/SecurityGate";

export default function ScannerAuthGate({
    children,
    isAuthorized
}: {
    children: React.ReactNode;
    isAuthorized: boolean
}) {
    const validateMutation = trpc.validateScannerPin.useMutation();

    return (
        <SecurityGate
            title="Scanner Lock"
            description="Security PIN Required"
            icon={<ShieldAlert className="w-8 h-8 text-primary" />}
            accentColor="primary"
            isOTP={true}
            onVerify={async (pass) => {
                const res = await validateMutation.mutateAsync({ password: pass });
                return res as any;
            }}
            onAuthorized={() => { }}
            initialAuthorized={isAuthorized}
            footerNote="Enter the scanner PIN to access."
        >
            {children}
        </SecurityGate>
    );
}

