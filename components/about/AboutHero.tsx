"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import Image from "next/image";

interface AboutHeroProps {
    fadeIn: any;
}

export function AboutHero({ fadeIn }: AboutHeroProps) {
    return (
        <section className="relative pt-24 pb-12 md:pt-32 md:pb-20 overflow-hidden">
            <div className="absolute inset-0 z-0">
                <Image
                    src="/bg/about.webp"
                    alt="About Background"
                    fill
                    className="object-cover opacity-20 scale-105"
                    priority
                />
                <div className="absolute inset-0 bg-linear-to-b from-background via-background/80 to-background" />
            </div>

            <div className="relative z-10 max-w-[1920px] mx-auto px-4 md:px-8 text-center space-y-6 md:pt-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md mb-4"
                >
                    <Heart className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Our Story & Heart</span>
                </motion.div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">
                    About <span className="text-primary underline decoration-primary/20 underline-offset-8">Christian</span> Life Center
                </h1>
                <p className="max-w-2xl mx-auto text-muted-foreground font-medium text-lg leading-relaxed">
                    A vibrant community of believers dedicated to transforming lives through the power of God's word and authentic fellowship.
                </p>
            </div>
            {/* SMOOTH TRANSITION TO STORY */}
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-linear-to-b from-transparent to-muted/20 z-0 pointer-events-none" />
        </section>
    );
}
