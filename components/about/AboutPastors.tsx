"use client";

import { motion } from "framer-motion";
import { Users, Heart, Target, Quote } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface AboutPastorsProps {
    fadeIn: any;
}

export function AboutPastors({ fadeIn }: AboutPastorsProps) {
    return (
        <section className="py-24 md:py-40 px-4 md:px-8 relative overflow-hidden">
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px]" />
                {/* ACCENT TEXT */}
                <div className="absolute top-[20%] left-[-5%] text-[20vw] font-black text-primary/5 select-none uppercase tracking-tighter italic leading-none">
                    Heart
                </div>
            </div>

            <div className="max-w-[1920px] mx-auto grid lg:grid-cols-12 gap-12 md:gap-24 items-center">
                {/* LEFT SIDE: TEXT CONTENT */}
                <motion.div {...fadeIn} className="lg:col-span-7 space-y-10 relative z-10 lg:order-1">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                            <Users className="w-3 h-3 text-primary" />
                            <span className="text-[8px] font-black uppercase tracking-widest text-primary">Our Spiritual Parents</span>
                        </div>
                        <h2 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.9]">
                            Our <span className="text-primary transparent-text-stroke">Pastors</span>
                        </h2>
                        <div className="max-w-xl">
                            <p className="text-muted-foreground font-medium text-xl leading-relaxed">
                                Led by a shared vision and a deep love for God's people, <span className="text-foreground font-bold italic underline decoration-primary/30 decoration-4 underline-offset-4">Ptr Jeser </span> and <span className="text-foreground font-bold italic underline decoration-primary/30 decoration-4 underline-offset-4"> Arlene Molina</span> have dedicated their lives to building a community where everyone can experience the unconditional love of Jesus.
                            </p>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-8">
                        <div className="p-8 rounded-[2rem] bg-muted/30 border border-border backdrop-blur-sm space-y-4 hover:border-primary/30 transition-colors group">
                            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                <Heart className="w-6 h-6 text-white" />
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-black uppercase italic tracking-tight text-lg underline decoration-primary/30 underline-offset-4">A United Front</h4>
                                <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                                    Together, they serve as a testament to God's grace, leading Christian Life Center with humility and wisdom.
                                </p>
                            </div>
                        </div>

                        <div className="p-8 rounded-[2rem] bg-muted/30 border border-border backdrop-blur-sm space-y-4 hover:border-primary/30 transition-colors group">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                <Target className="w-6 h-6" />
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-black uppercase italic tracking-tight text-lg underline decoration-indigo-500/30 underline-offset-4">Relentless Passion</h4>
                                <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                                    Their heartbeat is for spiritual growth and community transformation across generations.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 pt-4">
                        <Link href="/ministries">
                            <Button variant="outline" className="h-12 px-8 rounded-xl font-black uppercase text-[10px] tracking-widest border-primary/20 text-primary hover:bg-primary/10">
                                Discover Our Ministries
                            </Button>
                        </Link>
                    </div>
                </motion.div>

                {/* RIGHT SIDE: IMAGE COMPOSITION */}
                <motion.div
                    {...fadeIn}
                    className="lg:col-span-5 relative lg:order-2"
                >
                    <div className="relative z-10">
                        <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-[0_48px_80px_-16px_rgba(0,0,0,0.6)] ring-1 ring-white/10 relative group">
                            <Image
                                src="/pastors.webp"
                                alt="Ptr Jeser and Ptra Arlene Molina"
                                fill
                                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                priority
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="absolute bottom-12 left-12 right-12 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                                <p className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-2">Lead Pastors</p>
                                <h3 className="text-white text-3xl font-black uppercase italic tracking-tighter">Ptr Jeser & Arlene</h3>
                            </div>
                        </div>

                        {/* ABSTRACT BLOBS */}
                        <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10 animate-pulse" />
                        <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] -z-10" />
                    </div>

                    {/* QUOTE OVERLAY */}
                    <div className="absolute -left-12 bottom-12 p-6 rounded-3xl bg-background/80 backdrop-blur-xl border border-white/10 shadow-3xl max-w-[240px] hidden xl:block z-20">
                        <Quote className="w-8 h-8 text-primary/30 mb-2" />
                        <p className="text-xs font-black uppercase italic tracking-tight leading-relaxed">
                            "Our mission is to build people who will build the kingdom."
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
