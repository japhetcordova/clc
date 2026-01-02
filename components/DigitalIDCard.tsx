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
            className="w-[400px] h-[600px] bg-white text-slate-950 relative overflow-hidden font-sans p-8 flex flex-col items-center justify-between border border-slate-200"
        >
            {/* Decorative background branding */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-600 rounded-full blur-[100px]" />
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-600 rounded-full blur-[100px]" />
            </div>

            {/* Header */}
            <div className="relative z-10 w-full flex flex-col items-center gap-2">
                <h1 className="text-2xl font-black tracking-tighter uppercase italic text-slate-900/90">CLC Community</h1>
                <div className="h-1 w-12 bg-indigo-600 rounded-full" />
            </div>

            {/* Member Info */}
            <div className="relative z-10 text-center space-y-2">
                <h2 className="text-4xl font-black tracking-tight text-slate-900">{user.firstName} {user.lastName}</h2>
                <p className="text-indigo-700 font-bold uppercase tracking-[0.2em] text-[10px] px-5 py-2 bg-indigo-50 rounded-full inline-block border border-indigo-100">
                    {user.ministry}
                </p>
            </div>

            {/* Centerpiece: QR Code */}
            <div className="relative z-10 p-6 bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] ring-1 ring-slate-100">
                <QRCodeSVG value={qrValue} size={200} level="H" includeMargin={false} />
            </div>

            {/* Network & Verification */}
            <div className="relative z-10 w-full grid grid-cols-2 gap-3 px-6">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center gap-1.5 shadow-sm">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Network</span>
                    <span className="font-bold text-xs text-slate-900">{user.network}</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center gap-1.5 shadow-sm">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Status</span>
                    <span className="font-bold text-xs text-emerald-600">Verified</span>
                </div>
            </div>

            {/* Footer Branding */}
            <div className="relative z-10 space-y-1 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Digital Access Key</p>
            </div>

            {/* Decorative line */}
            <div className="absolute bottom-0 left-0 w-full h-2 bg-linear-to-r from-indigo-600 via-purple-600 to-indigo-600" />
        </div>
    );
}
