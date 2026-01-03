"use client";

import { Key } from "lucide-react";
import { verifyPinGeneratorPassword } from "@/lib/actions";
import { SecurityGate } from "@/components/SecurityGate";

export default function PinGeneratorAuthGate({ children }: { children: React.ReactNode }) {
    return (
        <SecurityGate
            title="PIN Master"
            description="Restricted Security Control Area"
            icon={<Key className="w-8 h-8 text-amber-600" />}
            accentColor="amber"
            onVerify={verifyPinGeneratorPassword}
            onAuthorized={() => { }}
            initialAuthorized={false}
            storageKey="clc_pin_gen_auth"
            storageValue="authorized"
        >
            {children}
        </SecurityGate>
    );
}
