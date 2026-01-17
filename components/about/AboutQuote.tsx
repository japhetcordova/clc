"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

interface AboutQuoteProps {
    fadeIn: any;
}

export function AboutQuote({ fadeIn }: AboutQuoteProps) {
    return (
        <section className="py-12 md:py-20 px-4 md:px-8 bg-primary/5 relative">
            <div className="max-w-4xl mx-auto text-center space-y-8">
                <Quote className="w-12 h-12 text-primary mx-auto opacity-30" />
                <motion.p
                    {...fadeIn}
                    className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter leading-tight"
                >
                    "Our vision is not just to build a church, but to build people who will build the Kingdom of God."
                </motion.p>
                <div className="space-y-1">
                    <p className="font-black text-primary uppercase text-xs tracking-widest">Leadership Team</p>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase">Christian Life Center</p>
                </div>
            </div>
            {/* SMOOTH TRANSITION TO CTA */}
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-linear-to-b from-transparent to-background z-0 pointer-events-none" />
        </section>
    );
}
