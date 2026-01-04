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
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[150px]" />
                    <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[180px]" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 text-center space-y-6">
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
            <section className="py-24 px-6 relative bg-muted/20">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
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
                </div>
                {/* SMOOTH TRANSITION TO BELIEFS */}
                <div className="absolute bottom-0 left-0 right-0 h-48 bg-linear-to-b from-transparent to-background z-0 pointer-events-none" />
            </section>

            {/* CORE BELIEFS */}
            <section className="py-24 px-6 relative">
                <div className="max-w-7xl mx-auto space-y-16">
                    <motion.div {...fadeIn} className="text-center space-y-4 max-w-2xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase italic leading-none">
                            What We <span className="text-primary">Believe</span>
                        </h2>
                        <p className="text-muted-foreground font-medium">The foundation of our faith and the principles that guide our walk with God.</p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { title: "One God", desc: "We believe in the eternal, triune God—Father, Son, and Holy Spirit." },
                            { title: "The Bible", desc: "The inspired and authoritative Word of God is our ultimate guide." },
                            { title: "Salvation", desc: "Given by grace through faith in Jesus Christ alone." },
                            { title: "Community", desc: "Called to live in love and service to one another and the world." }
                        ].map((belief, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-8 rounded-[2rem] bg-card border border-border shadow-xl hover:shadow-2xl transition-all space-y-4 group"
                            >
                                <div className="p-3 bg-muted w-fit rounded-xl group-hover:bg-primary/10 transition-colors">
                                    <Sparkles className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-black uppercase italic tracking-tight">{belief.title}</h3>
                                <p className="text-xs text-muted-foreground font-medium leading-relaxed">{belief.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
                {/* SMOOTH TRANSITION TO QUOTE */}
                <div className="absolute bottom-0 left-0 right-0 h-48 bg-linear-to-b from-transparent to-primary/5 z-0 pointer-events-none" />
            </section>

            {/* QUOTE SECTION */}
            <section className="py-24 px-6 bg-primary/5 relative">
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
            <section className="py-24 px-6 text-center">
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
                        <Link href="/services">
                            <Button size="lg" variant="outline" className="h-14 px-10 rounded-2xl border-border bg-background font-black uppercase text-xs tracking-widest">
                                Our Services
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
