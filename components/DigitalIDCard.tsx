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
    backgroundVariant?: number; // 0: Default, 1: 1.png, 2: 2.png, 3: 3.png
    isDark?: boolean;
}

export default function DigitalIDCard({ user, qrValue, backgroundVariant = 0, isDark = true }: DigitalIDCardProps) {
    const bgImages = ["", "/1.png", "/2.png", "/3.png"];
    const currentBg = bgImages[backgroundVariant];
    const textColor = isDark ? "text-white" : "text-slate-900";
    const subTextColor = isDark ? "text-white/40" : "text-slate-500";
    const accentColor = isDark ? "text-indigo-400" : "text-indigo-600";
    const badgeBg = isDark ? "bg-white/5" : "bg-slate-100";
    const badgeBorder = isDark ? "border-white/10" : "border-slate-200";

    return (
        <div
            id="digital-id-card"
            className={`w-[400px] h-[600px] ${isDark ? 'bg-[#020617]' : 'bg-white'} ${textColor} relative overflow-hidden font-sans flex flex-col items-center p-6`}
            style={{
                backgroundColor: isDark ? '#020617' : '#ffffff',
                backgroundImage: backgroundVariant > 0 ? `url(${currentBg})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            {/* Background Effects */}
            {backgroundVariant === 0 && (
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px]" />
                    <div className="absolute top-0 left-0 w-full h-full opacity-15" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)`, backgroundSize: '24px 24px' }} />
                </div>
            )}

            {backgroundVariant > 0 && (
                <div className={`absolute inset-0 pointer-events-none ${isDark ? 'bg-black/40' : 'bg-white/10'} backdrop-blur-[1px]`} />
            )}

            {/* Top Branding */}
            <div className="relative z-10 text-center w-full">
                <p className={`text-[10px] font-black uppercase tracking-[0.25em] ${accentColor} mb-2`}>Christian Life Center</p>
                <p className={`text-[10px] font-black uppercase tracking-[0.25em] ${accentColor} mb-2`}>Tagum City</p>
                <div className={`h-[1px] w-8 ${isDark ? 'bg-indigo-500/30' : 'bg-indigo-600/20'} mx-auto`} />
            </div>

            {/* Main Centered Section */}
            <div className="flex-1 flex flex-col items-center justify-center w-full space-y-12 relative z-10">
                {/* QR Focus */}
                <div className="relative">
                    <div className="absolute -inset-8 border border-white/5 rounded-[4rem] blur-sm" />
                    <div className={`absolute -inset-[1px] ${isDark ? 'bg-linear-to-b from-white/20 to-transparent' : 'bg-linear-to-b from-black/10 to-transparent'} rounded-[2.5rem] opacity-50`} />

                    <div className="relative p-6 bg-white rounded-[2.5rem] shadow-[0_0_80px_rgba(79,70,229,0.15)]">
                        <QRCodeSVG
                            value={qrValue}
                            size={180}
                            level="H"
                            includeMargin={true}
                            fgColor="#020617"
                        />
                    </div>
                </div>

                {/* Identification */}
                <div className="text-center space-y-4 w-full">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-black tracking-tighter leading-tight px-4">
                            {user.firstName} {user.lastName}
                        </h2>
                        <p className={`text-[9px] font-bold uppercase tracking-[0.3em] ${subTextColor}`}>Volunteer Access</p>
                    </div>

                    <div className="pt-4 flex justify-center">
                        <div className={`inline-flex items-center gap-2.5 px-5 py-2.5 ${badgeBg} rounded-full border ${badgeBorder} shadow-sm`}>
                            <ShieldCheck className={`w-3.5 h-3.5 ${accentColor}`} />
                            <span className="text-[9px] font-black uppercase tracking-widest">Official Digital ID</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subtle Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3%3Cfilter id='noiseFilter'%3%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3%3C/filter%3%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3%3C/svg%3")` }} />
        </div>
    );
}
