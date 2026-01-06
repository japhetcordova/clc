"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Church as ChurchIcon, Menu, X, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const navLinks = [
        { name: "About", href: "/about" },
        { name: "Services", href: "/services" },
        { name: "Locations", href: "/locations" },
        { name: "Ministries", href: "/ministries" },
        { name: "Giving", href: "/giving" },
        { name: "Events", href: "/events" },
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

            <nav className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-6 transition-all duration-500 ${scrolled ? 'top-4' : 'top-6'}`}>
                <div className={`backdrop-blur-xl border border-white/10 rounded-2xl h-16 px-6 flex items-center justify-between shadow-2xl overflow-hidden ring-1 ring-white/5 transition-all duration-500 ${scrolled ? 'bg-card/80 scale-[0.98]' : 'bg-card/40'}`}>
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <ChurchIcon className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-black italic uppercase tracking-tighter text-lg">CLC</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
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
                                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold uppercase text-[10px] tracking-widest px-5 h-9 shadow-lg shadow-primary/20"
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
                        className="fixed inset-0 z-[45] bg-background/95 backdrop-blur-2xl md:hidden pt-32 px-6"
                    >
                        <div className="flex flex-col gap-4">
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
                                        Join Our Community
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>

                        {/* DECORATIVE ELEMENTS */}
                        <div className="absolute bottom-12 left-6 right-6 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">
                            <span>Christian Life Center</span>
                            <span>© 2026</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
