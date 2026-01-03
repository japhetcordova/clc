"use client";

import { Lock } from "lucide-react";
import { verifyAdminPassword } from "@/lib/actions";
import { SecurityGate } from "@/components/SecurityGate";

export default function AdminAuthGate({ children }: { children: React.ReactNode }) {
    return (
        <SecurityGate
            title="Security Gate"
            description="Entrance to Administrator Dashboard"
            icon={<Lock className="w-8 h-8 text-primary" />}
            accentColor="primary"
            onVerify={verifyAdminPassword}
            onAuthorized={() => { }}
            initialAuthorized={false}
            storageKey="clc_admin_auth"
            storageValue="true"
        >
            {children}
        </SecurityGate>
    );
}
