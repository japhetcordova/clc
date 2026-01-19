"use client";

import { Lock } from "lucide-react";
import { SecurityGate } from "@/components/SecurityGate";
import { trpc } from "@/lib/trpc/client";

export default function AdminAuthGate({ children }: { children: React.ReactNode }) {
    const verifyMutation = trpc.verifyAdminPassword.useMutation();

    const handleVerify = async (password: string) => {
        return await verifyMutation.mutateAsync({ password });
    };

    return (
        <SecurityGate
            title="Security Gate"
            description="Entrance to Administrator Dashboard"
            icon={<Lock className="w-8 h-8 text-primary" />}
            accentColor="primary"
            onVerify={handleVerify}
            onAuthorized={() => { }}
            initialAuthorized={false}
            storageKey="clc_admin_auth"
            storageValue="true"
        >
            {children}
        </SecurityGate>
    );
}
