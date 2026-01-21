"use client";

import React from "react";
import Link from "next/link";
import {
    Facebook,
    Instagram,
    Youtube,
    MapPin,
    Phone,
    Mail,
    ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Logo from "./Logo";

// Custom TikTok Icon
const TikTokIcon = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M12.635 0h2.95c.216 1.07.81 2.425 1.85 3.768C18.483 5.083 19.835 6 21.64 6v3c-2.63 0-4.605-1.22-6-2.744V17.5a7.5 7.5 0 1 1-7.5-7.5v3a4.5 4.5 0 1 0 4.5 4.5V0Z" />
    </svg>
);

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { Icon: Facebook, href: "https://www.facebook.com/clctagum", color: "hover:bg-blue-600" },
        { Icon: Instagram, href: "https://www.instagram.com/clctagum", color: "hover:bg-pink-600" },
        { Icon: Youtube, href: "https://www.youtube.com/@clctagum", color: "hover:bg-red-600" },
        { Icon: TikTokIcon, href: "https://www.tiktok.com/@clctagum", color: "hover:bg-zinc-800" },
    ];

    return (
        <footer className="relative bg-card border-t border-border overflow-hidden pt-12 md:pt-20 pb-10">
            {/* Background Decorations */}
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-[1920px] mx-auto px-4 md:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-16">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link href="/" className="hover:opacity-80 transition-opacity">
                            <Logo />
                        </Link>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                            Dedicated to fostering spiritual growth, community impact, and authentic worship in Tagum City since inception. Join our global family today.
                        </p>
                        <div className="flex items-center gap-3">
                            {socialLinks.map(({ Icon, href, color }, i) => (
                                <Link
                                    key={i}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`p-2.5 rounded-xl bg-muted/50 border border-border text-muted-foreground hover:text-white transition-all hover:-translate-y-1 shadow-sm ${color}`}
                                >
                                    <Icon className="w-4 h-4" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h4 className="font-black uppercase text-xs tracking-[0.2em] text-foreground">Navigation</h4>
                        <ul className="space-y-4">
                            {[
                                { name: "About Christian Life Center Tagum ", href: "/about" },
                                { name: "Our Locations", href: "/locations" },
                                { name: "Ministries", href: "/ministries" },
                                { name: "Giving", href: "/giving" },
                                { name: "News & Events", href: "/events" }
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary/30 group-hover:bg-primary transition-colors" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Connect Section */}
                    <div className="space-y-6">
                        <h4 className="font-black uppercase text-xs tracking-[0.2em] text-foreground">Get Connected</h4>
                        <ul className="space-y-4">
                            <li className="flex gap-3">
                                <MapPin className="w-5 h-5 text-primary shrink-0" />
                                <span className="text-sm font-medium text-muted-foreground">Cor. Sobrecary and Pioneer Streets,<br />Tagum City, Philippines, 8100</span>
                            </li>
                            <li className="flex gap-3">
                                <Phone className="w-5 h-5 text-primary shrink-0" />
                                <span className="text-sm font-medium text-muted-foreground">0916 461 3649</span>
                            </li>
                            <li className="flex gap-3">
                                <Mail className="w-5 h-5 text-primary shrink-0" />
                                <span className="text-sm font-medium text-muted-foreground">hello@clctagum.org</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter/App */}
                    <div className="space-y-6">
                        <h4 className="font-black uppercase text-xs tracking-[0.2em] text-foreground">Stay Informed</h4>
                        <p className="text-xs font-medium text-muted-foreground italic">Join our community newsletter for weekly updates and inspiration.</p>
                        <div className="space-y-3">
                            <Link href="/registration">
                                <Button className="w-full h-12 rounded-xl font-bold bg-primary uppercase text-[10px] tracking-widest shadow-xl shadow-primary/20">
                                    Register Now
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="pt-10 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-center md:text-left">
                        © {currentYear} Christian Life Center Tagum. All rights reserved.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
                        <Link href="#" className="hover:text-primary transition-colors">Cookie Settings</Link>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">
                        Crafted by
                        <a href="https://japhetcordova.com" target="_blank" className="text-foreground hover:text-primary transition-colors flex items-center gap-1">
                            CoreDova <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
