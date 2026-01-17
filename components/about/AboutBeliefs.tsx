"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface AboutBeliefsProps {
    fadeIn: any;
}

export function AboutBeliefs({ fadeIn }: AboutBeliefsProps) {
    return (
        <section className="py-12 md:py-20 px-4 md:px-8 relative">
            <div className="max-w-[1920px] mx-auto space-y-16">
                <motion.div {...fadeIn} className="space-y-4 max-w-2xl">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase italic leading-none">
                        What We <span className="text-primary">Believe</span>
                    </h2>
                    <p className="text-muted-foreground font-medium text-lg">The foundation of our faith and the principles that guide our walk with God.</p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
                    {[
                        { title: "One God", desc: "We believe in the one eternal God, Creator and Lord of the universe, who eternally exists in three persons: Father, Son, and Holy Spirit." },
                        { title: "The Bible", desc: "We believe the Bible is God's inspired, authoritative, and infallible Word, the supreme standard for all conduct and doctrine." },
                        { title: "Salvation", desc: "We believe that salvation is a gift of God's grace, received through personal faith in the Lord Jesus Christ." },
                        { title: "The Church", desc: "We believe the Church is the body of Christ, calling for the gathering of believers for worship, prayer, and mission." }
                    ].map((belief, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="flex gap-6 group"
                        >
                            <div className="shrink-0 pt-1">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                    <Sparkles className="w-6 h-6" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black uppercase italic tracking-tighter">{belief.title}</h3>
                                <p className="text-muted-foreground font-medium leading-relaxed">{belief.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
            {/* SMOOTH TRANSITION TO QUOTE */}
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-linear-to-b from-transparent to-primary/5 z-0 pointer-events-none" />
        </section>
    );
}
