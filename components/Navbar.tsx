"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Church as ChurchIcon, Menu, X, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Logo from "./Logo";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const navLinks = [
        { name: "About", href: "/about" },
        { name: "Outreach", href: "/locations" },
        { name: "Ministries", href: "/ministries" },
        { name: "Giving", href: "/giving" },
        { name: "Events", href: "/events" },
        { name: "Verse of the Day", href: "/word" },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Prevent scrolling when mobile menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

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

            <nav className={cn(
                "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 border-b",
                scrolled
                    ? "bg-background/80 backdrop-blur-xl border-border shadow-lg"
                    : "bg-background/40 backdrop-blur-md border-border/40"
            )}>
                <div className="max-w-[1920px] mx-auto h-16 md:h-20 px-4 md:px-8 flex items-center justify-between">
                    <Link href="/" className="hover:opacity-80 transition-opacity">
                        <Logo />
                    </Link>

                    <div className="hidden md:flex items-center gap-8 lg:gap-10 text-[11px] lg:text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "hover:text-primary transition-colors relative py-1",
                                    pathname === link.href ? "text-primary" : ""
                                )}
                            >
                                {link.name}
                                {pathname === link.href && (
                                    <motion.div
                                        layoutId="activeNav"
                                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                                    />
                                )}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href="/registration" className="hidden sm:block">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-black uppercase text-[11px] tracking-widest px-6 h-10 md:h-12 shadow-xl shadow-primary/20 transition-all hover:shadow-primary/40 hover:-translate-y-0.5"
                            >
                                Join Us
                            </motion.button>
                        </Link>

                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden p-2 hover:bg-white/10 rounded-xl transition-colors relative z-[60]"
                        >
                            <div className="relative w-6 h-6">
                                <AnimatePresence mode="wait">
                                    {isOpen ? (
                                        <motion.div
                                            key="close"
                                            initial={{ opacity: 0, rotate: -90 }}
                                            animate={{ opacity: 1, rotate: 0 }}
                                            exit={{ opacity: 0, rotate: 90 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute inset-0 flex items-center justify-center"
                                        >
                                            <X className="w-6 h-6" />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="menu"
                                            initial={{ opacity: 0, rotate: 90 }}
                                            animate={{ opacity: 1, rotate: 0 }}
                                            exit={{ opacity: 0, rotate: -90 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute inset-0 flex items-center justify-center"
                                        >
                                            <Menu className="w-6 h-6" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </button>
                    </div>
                </div>
            </nav>

            {/* MOBILE MENU OVERLAY */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-[45] bg-background/95 backdrop-blur-2xl md:hidden pt-32 px-6 overflow-y-auto"
                    >
                        <div className="flex flex-col gap-4 pb-24">
                            {navLinks.map((link, i) => (
                                <motion.div
                                    key={link.href}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <Link
                                        href={link.href}
                                        className={cn(
                                            "flex items-center justify-between p-4 rounded-2xl border border-border/50 bg-card/50 transition-all active:scale-[0.98]",
                                            pathname === link.href ? "border-primary/30 bg-primary/5" : "hover:bg-muted"
                                        )}
                                    >
                                        <div className="flex flex-col gap-1">
                                            <span className={cn(
                                                "text-[10px] font-black uppercase tracking-[0.2em]",
                                                pathname === link.href ? "text-primary" : "text-muted-foreground"
                                            )}>
                                                {link.name === "Giving" ? "Partner with us" : "Explore"}
                                            </span>
                                            <span className={cn(
                                                "text-2xl font-black uppercase italic tracking-tighter",
                                                pathname === link.href ? "text-primary" : "text-foreground"
                                            )}>
                                                {link.name}
                                            </span>
                                        </div>
                                        <ChevronRight className={cn(
                                            "w-6 h-6 transition-colors",
                                            pathname === link.href ? "text-primary" : "text-muted-foreground"
                                        )} />
                                    </Link>
                                </motion.div>
                            ))}

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 }}
                                className="mt-4"
                            >
                                <Link href="/registration">
                                    <Button className="w-full h-16 rounded-2xl bg-primary text-white font-black uppercase italic tracking-tighter text-xl shadow-lg shadow-primary/25">
                                        Join Our Journey
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
