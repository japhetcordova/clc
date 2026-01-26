"use client";

import { useEffect, useState } from "react";
import { Facebook, Instagram, Youtube } from "lucide-react";

interface EventShareProps {
    eventTitle: string;
}

export function EventShare({ eventTitle }: EventShareProps) {
    const [shareUrl, setShareUrl] = useState("");

    useEffect(() => {
        setShareUrl(window.location.href);
    }, []);

    if (!shareUrl) return null;

    return (
        <div className="flex flex-wrap items-center gap-4 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">Share Event</span>
            <div className="flex items-center gap-2">
                <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-foreground/60 hover:text-[#1877F2] hover:bg-[#1877F2]/10 hover:border-[#1877F2]/20 transition-all hover:-translate-y-1"
                    title="Share on Facebook"
                >
                    <Facebook className="w-4 h-4" />
                </a>
                <a
                    href="https://www.instagram.com/clctagum"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-foreground/60 hover:text-[#E4405F] hover:bg-[#E4405F]/10 hover:border-[#E4405F]/20 transition-all hover:-translate-y-1"
                    title="Visit Instagram"
                >
                    <Instagram className="w-4 h-4" />
                </a>
                <a
                    href="https://www.youtube.com/@clctagum"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-foreground/60 hover:text-[#FF0000] hover:bg-[#FF0000]/10 hover:border-[#FF0000]/20 transition-all hover:-translate-y-1"
                    title="Visit YouTube"
                >
                    <Youtube className="w-4 h-4" />
                </a>
                <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`Check out this event: ${eventTitle}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-foreground/60 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all hover:-translate-y-1"
                    title="Share on X (Twitter)"
                >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.294 19.486h2.039L6.448 3.243H4.26L17.607 20.64z" />
                    </svg>
                </a>
            </div>
        </div>
    );
}
