"use client";

import { motion } from "framer-motion";
import { Users, Award, History } from "lucide-react";
import Image from "next/image";

interface AboutStoryProps {
    fadeIn: any;
}

export function AboutStory({ fadeIn }: AboutStoryProps) {
    return (
        <section className="py-12 md:py-20 px-4 md:px-8 relative bg-muted/20">
            <div className="max-w-[1920px] mx-auto grid lg:grid-cols-2 gap-8 md:gap-16 items-center">
                <motion.div {...fadeIn} className="space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-4xl font-black uppercase italic tracking-tight">How It <span className="text-primary">All Started</span></h2>
                        <p className="text-muted-foreground font-medium leading-relaxed">
                            Christian Life Center began with a small group of faithful individuals who shared a vision for a church that would be a beacon of hope in Tagum City. What started as a living room gathering has grown into a global family spanning multiple clusters and networks.
                        </p>
                        <p className="text-muted-foreground font-medium leading-relaxed">
                            Our journey is marked by God's faithfulness, countless transformed lives, and a relentless passion to serve our generation with the Gospel.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Users className="w-6 h-6 text-primary" />
                            <h3 className="font-black uppercase text-xs tracking-widest">Growing Family</h3>
                            <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">From 10 members to a global community.</p>
                        </div>
                        <div className="space-y-2">
                            <Award className="w-6 h-6 text-amber-500" />
                            <h3 className="font-black uppercase text-xs tracking-widest">Faithful Service</h3>
                            <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">Decades of commitment to our local community.</p>
                        </div>
                    </div>
                </motion.div>
                <motion.div {...fadeIn} className="relative">
                    <div className="grid grid-cols-2 gap-4 md:gap-6">
                        <div className="aspect-square rounded-3xl md:rounded-[3rem] overflow-hidden shadow-2xl ring-1 ring-border relative">
                            <Image
                                src="/about/about1.webp"
                                alt="Church History 1"
                                fill
                                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                            />
                        </div>
                        <div className="aspect-square rounded-3xl md:rounded-[3rem] overflow-hidden shadow-2xl ring-1 ring-border relative md:translate-y-12">
                            <Image
                                src="/about/about2.webp"
                                alt="Church History 2"
                                fill
                                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                            />
                        </div>
                        <div className="aspect-square rounded-3xl md:rounded-[3rem] overflow-hidden shadow-2xl ring-1 ring-border relative md:-translate-y-12">
                            <Image
                                src="/about/about3.webp"
                                alt="Church History 3"
                                fill
                                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                            />
                        </div>
                        <div className="aspect-square rounded-3xl md:rounded-[3rem] overflow-hidden shadow-2xl ring-1 ring-border relative">
                            <Image
                                src="/about/about4.webp"
                                alt="Church History 4"
                                fill
                                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                            />
                        </div>
                    </div>
                    <div className="absolute -bottom-6 -right-6 p-8 rounded-[2rem] bg-primary text-white shadow-2xl max-w-[200px] hidden xl:block z-10">
                        <History className="w-8 h-8 mb-3" />
                        <h4 className="font-black text-xl italic uppercase tracking-tighter">Established</h4>
                        <p className="text-[10px] font-bold opacity-80 uppercase mt-1">Founding years of faith and service.</p>
                    </div>
                </motion.div>
            </div>
            {/* SMOOTH TRANSITION TO LEADERSHIP */}
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-linear-to-b from-transparent to-background z-0 pointer-events-none" />
        </section>
    );
}
