"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Church as ChurchIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Scroll progress bar logic
    const [scrollProgress, setScrollProgress] = useState(0);
    useEffect(() => {
        const updateScrollProgress = () => {
            const h = document.documentElement,
                b = document.body,
                st = 'scrollTop',
                sh = 'scrollHeight';
            const percent = (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight) * 100;
            setScrollProgress(percent);
        };
        window.addEventListener("scroll", updateScrollProgress);
        return () => window.removeEventListener("scroll", updateScrollProgress);
    }, []);

    return (
        <>
            {/* SCROLL PROGRESS */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-primary z-[100] origin-left"
                style={{ scaleX: scrollProgress / 100 }}
            />

            <nav className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-6 transition-all duration-500 ${scrolled ? 'top-4' : 'top-6'}`}>
                <div className={`backdrop-blur-xl border border-white/10 rounded-2xl h-16 px-6 flex items-center justify-between shadow-2xl overflow-hidden ring-1 ring-white/5 transition-all duration-500 ${scrolled ? 'bg-card/80 scale-[0.98]' : 'bg-card/40'}`}>
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <ChurchIcon className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-black italic uppercase tracking-tighter text-lg">CLC</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        <Link href="/about" className={`hover:text-primary transition-colors ${pathname === '/about' ? 'text-primary' : ''}`}>About</Link>
                        <Link href="/services" className={`hover:text-primary transition-colors ${pathname === '/services' ? 'text-primary' : ''}`}>Services</Link>
                        <Link href="/locations" className={`hover:text-primary transition-colors ${pathname === '/locations' ? 'text-primary' : ''}`}>Locations</Link>
                        <Link href="/ministries" className={`hover:text-primary transition-colors ${pathname === '/ministries' ? 'text-primary' : ''}`}>Ministries</Link>
                        <Link href="/giving" className={`hover:text-primary transition-colors ${pathname === '/giving' ? 'text-primary' : ''}`}>Giving</Link>
                        <Link href="/events" className={`hover:text-primary transition-colors ${pathname === '/events' ? 'text-primary' : ''}`}>Events</Link>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href="/registration">
                            <Button size="sm" className="bg-primary hover:bg-primary/90 rounded-xl font-bold uppercase text-[10px] tracking-widest px-5 h-9">
                                Join Us
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>
        </>
    );
}
