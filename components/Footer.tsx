"use client";

import React from "react";
import Link from "next/link";
import {
    Church,
    Facebook,
    Instagram,
    Youtube,
    Twitter,
    MapPin,
    Phone,
    Mail,
    ExternalLink,
    Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative bg-card border-t border-border overflow-hidden pt-20 pb-10">
            {/* Background Decorations */}
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                                <Church className="w-6 h-6 text-white" />
                            </div>
                            <span className="font-black italic uppercase tracking-tighter text-2xl">CLC</span>
                        </div>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                            Dedicated to fostering spiritual growth, community impact, and authentic worship in Tagum City since inception. Join our global family today.
                        </p>
                        <div className="flex items-center gap-4">
                            {[Facebook, Instagram, Youtube, Twitter].map((Icon, i) => (
                                <Link
                                    key={i}
                                    href="#"
                                    className="p-2.5 rounded-xl bg-muted/50 border border-border hover:bg-primary hover:text-white transition-all hover:-translate-y-1 shadow-sm"
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
                                { name: "About CLC", href: "/about" },
                                { name: "Our Services", href: "/services" },
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
                                <span className="text-sm font-medium text-muted-foreground">Briz District, Tagum City,<br />Davao del Norte, 8100</span>
                            </li>
                            <li className="flex gap-3">
                                <Phone className="w-5 h-5 text-primary shrink-0" />
                                <span className="text-sm font-medium text-muted-foreground">(084) 123-4567</span>
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
