"use client";

import { motion } from "framer-motion";
import {
    Heart,
    Target,
    History,
    Users,
    Award,
    Sparkles,
    ArrowRight,
    ChevronRight,
    Quote
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default function AboutPage() {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 }
    };

    return (
        <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
            {/* SUB-PAGE HEADER */}
            <section className="relative pt-24 pb-12 md:pt-32 md:pb-20 overflow-hidden">
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[150px]" />
                    <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[180px]" />
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

            {/* OUR STORY SECTION */}
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
                        <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl ring-1 ring-border">
                            <Image
                                src="/church_hero_worship_1767400361470.png"
                                alt="Church History"
                                fill
                                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                            />
                        </div>
                        <div className="absolute -bottom-6 -right-6 p-8 rounded-[2rem] bg-primary text-white shadow-2xl max-w-[200px] hidden md:block">
                            <History className="w-8 h-8 mb-3" />
                            <h4 className="font-black text-xl italic uppercase tracking-tighter">Established</h4>
                            <p className="text-[10px] font-bold opacity-80 uppercase mt-1">Founding years of faith and service.</p>
                        </div>
                    </motion.div>
                </div>
                {/* SMOOTH TRANSITION TO LEADERSHIP */}
                <div className="absolute bottom-0 left-0 right-0 h-48 bg-linear-to-b from-transparent to-background z-0 pointer-events-none" />
            </section>

            {/* OUR PASTORS / LEADERSHIP */}
            <section className="py-12 md:py-20 px-4 md:px-8 relative overflow-hidden">
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />
                </div>

                <div className="max-w-[1920px] mx-auto grid lg:grid-cols-2 gap-8 md:gap-16 items-center flex-row-reverse">
                    <motion.div {...fadeIn} className="space-y-8 lg:order-2">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                                <Users className="w-3 h-3 text-primary" />
                                <span className="text-[8px] font-black uppercase tracking-widest text-primary">Our Heartbeat</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tight leading-none">
                                Our <span className="text-primary">Pastors</span>
                            </h2>
                            <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                                Led by a shared vision and a deep love for God's people, <span className="text-foreground font-bold italic">Ptr Jeser Molina</span> and <span className="text-foreground font-bold italic">Ptra Alene Molina</span> (husband and wife) have dedicated their lives to building a community where everyone can experience the unconditional love of Jesus.
                            </p>
                            <p className="text-muted-foreground font-medium leading-relaxed">
                                Together, they serve as a testament to God's grace, leading Christian Life Center with humility, wisdom, and a relentless passion for spiritual growth and community transformation.
                            </p>
                        </div>

                        <div className="p-6 rounded-3xl bg-muted/30 border border-border backdrop-blur-sm">
                            <div className="flex gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center shrink-0">
                                    <Heart className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-black uppercase italic tracking-tight underline decoration-primary/30 underline-offset-4">Husband & Wife</h4>
                                    <p className="text-xs text-muted-foreground font-medium mt-1 uppercase tracking-wider">A united front in faith and ministry.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        {...fadeIn}
                        className="relative lg:order-1"
                    >
                        <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl ring-1 ring-border relative group">
                            <Image
                                src="/pastors.png"
                                alt="Ptr Jeser and Ptra Arlene Molina"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                priority
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="absolute bottom-8 left-8 right-8 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                                <p className="text-white/80 text-[10px] font-bold uppercase tracking-[0.3em]">Lead Pastors</p>
                                <h3 className="text-white text-2xl font-black uppercase italic tracking-tighter">Ptr Jeser & Ptra Alene</h3>
                            </div>
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl animate-pulse" />
                        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
                    </motion.div>
                </div>
            </section>

            {/* G12 LADDER OF SUCCESS */}
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

            {/* CORE BELIEFS */}
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

            {/* QUOTE SECTION */}
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

            {/* CALL TO ACTION */}
            <section className="py-12 md:py-20 px-4 md:px-8 text-center">
                <div className="max-w-2xl mx-auto space-y-8">
                    <h2 className="text-4xl font-black uppercase italic tracking-tight">Join Our Journey</h2>
                    <p className="text-muted-foreground font-medium leading-relaxed">
                        There's a place for you in our story. Connect with us and discover your purpose in God's family.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link href="/registration">
                            <Button size="lg" className="h-14 px-10 rounded-2xl bg-primary font-black uppercase text-xs tracking-widest">
                                Get Started
                            </Button>
                        </Link>
                        <Link href="/locations">
                            <Button size="lg" variant="outline" className="h-14 px-10 rounded-2xl border-border bg-background font-black uppercase text-xs tracking-widest">
                                Our Locations
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
