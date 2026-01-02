"use client";

import { QRCodeSVG } from "qrcode.react";
import { Sparkles, MapPin, Users, ShieldCheck } from "lucide-react";

interface DigitalIDCardProps {
    user: {
        firstName: string;
        lastName: string;
        network: string;
        ministry: string;
        qrCodeId: string;
    };
    qrValue: string;
}

export default function DigitalIDCard({ user, qrValue }: DigitalIDCardProps) {
    return (
        <div
            id="digital-id-card"
            className="w-[400px] h-[600px] bg-background text-foreground relative overflow-hidden font-sans p-8 flex flex-col items-center justify-between border border-border"
        >
            {/* Decorative background branding */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary rounded-full blur-[100px]" />
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-accent rounded-full blur-[100px]" />
            </div>

            {/* Header */}
            <div className="relative z-10 w-full flex flex-col items-center gap-2">
                <h1 className="text-2xl font-black tracking-tighter uppercase italic text-foreground/90">CLC Community</h1>
                <div className="h-1 w-12 bg-primary rounded-full" />
            </div>

            {/* Member Info */}
            <div className="relative z-10 text-center space-y-2">
                <h2 className="text-4xl font-black tracking-tight text-foreground">{user.firstName} {user.lastName}</h2>
                <p className="text-primary font-bold uppercase tracking-[0.2em] text-xs px-4 py-1.5 bg-primary/10 rounded-full inline-block">
                    {user.ministry}
                </p>
            </div>

            {/* Centerpiece: QR Code */}
            <div className="relative z-10 p-6 bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] ring-1 ring-border">
                <QRCodeSVG value={qrValue} size={200} level="H" includeMargin={false} />
            </div>

            {/* Network & Verification */}
            <div className="relative z-10 w-full grid grid-cols-2 gap-3 px-6">
                <div className="bg-muted p-3 rounded-2xl ring-1 ring-border flex flex-col items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Network</span>
                    <span className="font-bold text-xs text-foreground">{user.network}</span>
                </div>
                <div className="bg-muted p-3 rounded-2xl ring-1 ring-border flex flex-col items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Status</span>
                    <span className="font-bold text-xs text-emerald-500">Verified</span>
                </div>
            </div>

            {/* Footer Branding */}
            <div className="relative z-10 space-y-1 text-center">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Digital Access Key</p>
            </div>

            {/* Decorative line */}
            <div className="absolute bottom-0 left-0 w-full h-1.5 bg-linear-to-r from-primary via-accent to-primary" />
        </div>
    );
}
