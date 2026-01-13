"use client";

import { motion } from "framer-motion";
import { MoveLeft, Home, Calendar, BookOpen, Compass } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="min-h-[85vh] flex items-center justify-center px-6 py-24 relative overflow-hidden">
            {/* Background Aura - Additional depth for 404 page */}
            <div className="absolute inset-0 z-[-1] pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-primary/5 rounded-full blur-[140px] animate-pulse" />
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-indigo-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[20%] left-[10%] w-[20%] h-[20%] bg-amber-500/5 rounded-full blur-[80px]" />
            </div>

            <div className="max-w-3xl w-full text-center space-y-12 relative z-10 pt-10">
                {/* 404 Visual with Layered Animations */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="relative inline-block"
                >
                    <h1 className="text-[14rem] md:text-[22rem] font-black leading-none tracking-tighter text-foreground/[0.03] italic uppercase select-none">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                            initial={{ y: 30, opacity: 0, rotate: -15 }}
                            animate={{ y: 0, opacity: 1, rotate: 0 }}
                            transition={{ delay: 0.2, duration: 0.6, type: "spring", stiffness: 100 }}
                            className="bg-card/40 backdrop-blur-3xl p-10 md:p-14 rounded-[4rem] border border-primary/20 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] relative group"
                        >
                            <div className="absolute -inset-2 bg-gradient-to-br from-primary/20 to-indigo-500/20 rounded-[4.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <Compass className="w-24 h-24 md:w-32 md:h-32 text-primary animate-[spin_15s_linear_infinite] relative z-10" />

                            {/* Floating particles relative to compass */}
                            <motion.div
                                animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-4 -right-4 w-4 h-4 bg-primary rounded-full blur-sm"
                            />
                            <motion.div
                                animate={{ y: [0, 10, 0], opacity: [0.3, 0.8, 0.3] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute -bottom-6 -left-6 w-6 h-6 bg-indigo-500 rounded-full blur-md"
                            />
                        </motion.div>
                    </div>
                </motion.div>

                {/* Text Content with Premium Typography */}
                <div className="space-y-6 max-w-2xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-tight text-balance">
                            Lost in the <span className="text-primary">Right Direction?</span>
                        </h2>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="text-lg md:text-2xl text-muted-foreground font-medium text-balance leading-relaxed"
                    >
                        That path seems to have ended. But at CLC, we believe every turn is an opportunity
                        to find something new. Let's redirect you.
                    </motion.p>
                </div>

                {/* Actions Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-6"
                >
                    <Link href="/">
                        <Button className="h-16 px-10 rounded-[2rem] bg-primary text-white font-black uppercase italic tracking-widest flex items-center gap-3 shadow-[0_20px_40px_-12px_rgba(var(--primary-rgb),0.3)] hover:shadow-[0_25px_50px_-12px_rgba(var(--primary-rgb),0.5)] hover:-translate-y-1.5 transition-all duration-300 text-base">
                            <Home className="w-5 h-5" />
                            Back Home
                        </Button>
                    </Link>

                    <div className="flex gap-4">
                        <Link href="/events">
                            <Button variant="outline" className="h-16 px-8 rounded-2xl font-black uppercase italic tracking-widest gap-3 border-border/50 hover:bg-muted/50 hover:border-primary/30 transition-all duration-300 text-sm">
                                <Calendar className="w-5 h-5 text-primary" />
                                Events
                            </Button>
                        </Link>
                        <Link href="/word">
                            <Button variant="outline" className="h-16 px-8 rounded-2xl font-black uppercase italic tracking-widest gap-3 border-border/50 hover:bg-muted/50 hover:border-primary/30 transition-all duration-300 text-sm">
                                <BookOpen className="w-5 h-5 text-primary" />
                                Word
                            </Button>
                        </Link>
                    </div>
                </motion.div>

                {/* Secondary navigation */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="pt-10"
                >
                    <Link
                        href="/about"
                        className="text-xs font-black uppercase tracking-[0.4em] text-muted-foreground hover:text-primary transition-all duration-400 flex items-center justify-center gap-3 group"
                    >
                        <motion.div
                            animate={{ x: [0, -5, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <MoveLeft className="w-4 h-4" />
                        </motion.div>
                        Discover our Story
                    </Link>
                </motion.div>
            </div>

            {/* Decorative Grid - Subtle texture */}
            <div className="absolute inset-0 z-[-2] opacity-[0.03] pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]">
                <div className="h-full w-full bg-[grid-white_40px] dark:bg-[grid-black_40px] bg-[size:40px_40px]" />
            </div>
        </div>
    );
}
