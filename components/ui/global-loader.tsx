"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function GlobalLoader() {
    return (
        <div className="w-full h-full min-h-[50vh] flex flex-col items-center justify-center py-12">
            <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-6"
            >
                <div className="relative w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-primary via-primary/50 to-transparent animate-spin duration-[3000ms]">
                    <div className="absolute inset-1 rounded-full bg-background flex items-center justify-center overflow-hidden">
                        <Image src="/logo.webp" alt="Logo" width={80} height={80} className="w-full h-full object-cover" priority />
                    </div>
                </div>
                <div className="space-y-1 text-center">
                    <h3 className="text-lg font-black uppercase tracking-widest text-primary animate-pulse">Loading</h3>
                    <p className="text-[10px] font-medium text-muted-foreground tracking-[0.2em] uppercase">Please wait...</p>
                </div>
            </motion.div>
        </div>
    );
}
