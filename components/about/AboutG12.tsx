"use client";

import { motion } from "framer-motion";
import { Target } from "lucide-react";

interface AboutG12Props {
    fadeIn: any;
}

export function AboutG12({ fadeIn }: AboutG12Props) {
    return (
        <section className="py-12 md:py-20 px-4 md:px-8 bg-muted/20 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] -z-10" />

            <div className="max-w-[1920px] mx-auto space-y-16">
                <motion.div {...fadeIn} className="text-center space-y-4 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mx-auto">
                        <Target className="w-4 h-4 text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">Our Strategy</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none">
                        The Ladder of <span className="text-primary transparent-text-stroke">Success</span>
                    </h2>
                    <p className="text-lg text-muted-foreground font-medium">
                        We implement the G12 Vision through four key stages, empowering every believer to become a leader.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-4 gap-8 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-border/50 -z-10" />

                    {[
                        { step: "01", title: "Win", desc: "Evangelism & Cell Groups" },
                        { step: "02", title: "Consolidate", desc: "Care & Integration" },
                        { step: "03", title: "Disciple", desc: "Life Class & Training" },
                        { step: "04", title: "Send", desc: "Leading & Multiplying" }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15 }}
                            className="relative bg-background md:bg-transparent p-6 md:p-0 rounded-3xl border md:border-none border-border"
                        >
                            <div className="w-24 h-24 rounded-full bg-background border-4 border-muted flex items-center justify-center mb-6 mx-auto relative z-10 shadow-xl group hover:scale-110 transition-transform duration-500 hover:border-primary">
                                <span className="text-3xl font-black text-muted-foreground/30">{item.step}</span>
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="text-2xl font-black uppercase italic tracking-tighter">{item.title}</h3>
                                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wide">{item.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
            {/* SMOOTH TRANSITION */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-b from-transparent to-background z-0 pointer-events-none" />
        </section>
    );
}
