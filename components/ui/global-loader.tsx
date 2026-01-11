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
                <div className="relative">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="absolute -inset-4 rounded-full border-t-2 border-primary/50"
                    />
                    <motion.div
                        animate={{ rotate: -180 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute -inset-2 rounded-full border-b-2 border-primary/20"
                    />
                    <div className="relative h-20 w-20 rounded-full bg-background flex items-center justify-center shadow-2xl ring-4 ring-background z-10 overflow-hidden">
                        <Image src="/logo.png" alt="Logo" width={80} height={80} className="w-full h-full object-cover" priority />
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
