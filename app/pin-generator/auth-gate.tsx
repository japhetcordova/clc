"use client";

import { ShieldAlert } from "lucide-react";
import { SecurityGate } from "@/components/SecurityGate";
import { trpc } from "@/lib/trpc/client";

export default function PinGeneratorAuthGate({ children }: { children: React.ReactNode }) {
    const verifyMutation = trpc.verifyPinGeneratorPassword.useMutation();

    const handleVerify = async (password: string) => {
        return await verifyMutation.mutateAsync({ password });
    };

    return (
        <SecurityGate
            title="Security Check"
            description="Restricted Access: Daily PIN Generation"
            icon={<ShieldAlert className="w-8 h-8 text-amber-600" />}
            accentColor="amber"
            onVerify={handleVerify}
            onAuthorized={() => { }}
            initialAuthorized={false}
            storageKey="clc_pin_gen_auth"
            storageValue="true"
        >
            {children}
        </SecurityGate>
    );
}
