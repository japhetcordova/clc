"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, Home, ArrowRight, Wallet } from "lucide-react";

export default function BuildingPage() {
    return (
        <div className="pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
            {/* HERO SECTION */}
            <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl mb-12 border border-primary/20 bg-black">
                <video
                    src="https://pub-71cfc9e8b30e46868845fef5a9b3555f.r2.dev/CLC%20Tagum%20Church%20Lot%20Aerial%20Shot.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-auto block"
                />
                <div className="absolute inset-0 bg-indigo-950/40 mix-blend-multiply" />
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black flex flex-col justify-end p-8 md:p-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <span className="bg-primary/90 backdrop-blur-md text-primary-foreground px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-4 inline-block">
                            Our Vision
                        </span>
                        <h1 className="text-4xl md:text-7xl font-bold uppercase tracking-tighter text-white mb-4">
                            Build a <br /> Church Project
                        </h1>
                        <p className="text-lg md:text-xl text-white/80 max-w-2xl font-light">
                            We are constructing more than just walls; we are building a sanctuary for generations to come. Join us in this historic journey.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* CONTENT GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter mb-6">
                        Why We Build
                    </h2>
                    <div className="space-y-6 text-muted-foreground text-lg leading-relaxed font-light">
                        <p>
                            Our new church building is designed to be a hub for spiritual growth, community outreach, and worship in Tagum City.
                        </p>
                        <ul className="space-y-4">
                            <li className="flex gap-4 items-start">
                                <div className="mt-1 bg-primary/20 p-2 rounded-lg">
                                    <Home className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <span className="text-foreground font-semibold block uppercase text-sm tracking-wider">Expanded Capacity</span>
                                    Space for our growing family to gather and worship comfortably.
                                </div>
                            </li>
                            <li className="flex gap-4 items-start">
                                <div className="mt-1 bg-primary/20 p-2 rounded-lg">
                                    <Heart className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <span className="text-foreground font-semibold block uppercase text-sm tracking-wider">Community Center</span>
                                    Enhanced facilities for ministries, youth programs, and social impact.
                                </div>
                            </li>
                        </ul>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="glass-premium p-8 md:p-12 rounded-[2rem] border-primary/20 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Wallet className="w-32 h-32" />
                    </div>

                    <h3 className="text-2xl font-bold uppercase tracking-tighter mb-6 relative z-10">
                        Pledge Your Support
                    </h3>
                    <p className="text-muted-foreground mb-8 relative z-10">
                        Every gift, no matter the size, brings us closer to completing His House. Thank you for your generosity.
                    </p>

                    <div className="space-y-4">
                        <Link href="/giving" className="block w-full">
                            <Button className="w-full h-16 rounded-2xl bg-primary text-primary-foreground font-bold uppercase tracking-widest text-lg shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all group">
                                Support the Building
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <p className="text-center text-xs text-muted-foreground uppercase tracking-widest">
                            Direct Bank Transfers & Online Giving Available
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* MINIMAL FOOTER / CTA */}
            <div className="text-center bg-card/50 border border-border/50 rounded-3xl p-12 md:p-20">
                <h4 className="text-2xl md:text-3xl font-bold uppercase tracking-tighter mb-4">
                    "Unless the Lord builds the house, those who build it labor in vain."
                </h4>
                <p className="text-muted-foreground uppercase tracking-[0.3em] text-sm">
                    Psalm 127:1
                </p>
            </div>
        </div>
    );
}
