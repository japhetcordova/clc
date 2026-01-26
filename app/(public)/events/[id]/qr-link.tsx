"use client";

import { QRCodeSVG } from "qrcode.react";

interface QRLinkProps {
    url: string;
    size?: number;
}

export default function QRLink({ url, size = 80 }: QRLinkProps) {
    if (!url) return null;

    return (
        <div className="bg-white p-2 rounded-xl shadow-sm border border-border/50 hover:scale-105 transition-transform duration-300 w-fit group relative">
            <QRCodeSVG
                value={url}
                size={size}
                level="M"
                includeMargin={false}
                imageSettings={{
                    src: "/logo2.webp",
                    x: undefined,
                    y: undefined,
                    height: size * 0.2,
                    width: size * 0.2,
                    excavate: true,
                }}
            />
            {/* Tooltip */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                Scan for Location
            </div>
        </div>
    );
}
