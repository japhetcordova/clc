"use client";

import { motion } from "framer-motion";
import {
    Coins,
    HandHeart,
    ShieldCheck,
    History,
    ArrowRight,
    QrCode,
    CreditCard,
    DollarSign,
    Heart,
    Star,
    CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function GivingPage() {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 }
    };

    return (
        <div className="flex flex-col min-h-screen bg-background">
            {/* HEADER */}
            <section className="relative pt-32 pb-20 overflow-hidden bg-linear-to-b from-indigo-500/10 via-transparent to-transparent">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[150px] opacity-20" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 text-center space-y-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md mb-4"
                    >
                        <Heart className="w-4 h-4 text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Generosity as Worship</span>
                    </motion.div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">
                        Our <span className="text-primary underline decoration-primary/20 underline-offset-8">Generosity</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-muted-foreground font-medium text-lg leading-relaxed">
                        Giving is an act of worship and a commitment to the work of the Kingdom. Your generosity fuels our mission to impact Tagum City and beyond.
                    </p>
                </div>
            </section>

            {/* GIVING OPTIONS */}
            <section className="py-24 px-6 relative">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
                    <motion.div {...fadeIn} className="space-y-12">
                        <div className="space-y-4 text-center lg:text-left">
                            <h2 className="text-4xl font-black uppercase italic tracking-tight italic">Why We <span className="text-primary">Give</span></h2>
                            <p className="text-muted-foreground font-medium leading-relaxed italic">
                                "Honor the Lord with your wealth and with the firstfruits of all your produce; then your barns will be filled with plenty..." — Proverbs 3:9-10
                            </p>
                        </div>

                        <div className="space-y-6">
                            {[
                                {
                                    title: "G-Cash",
                                    desc: "Fast and easy mobile transfers.",
                                    details: "0912-345-6789",
                                    icon: <CreditCard className="w-6 h-6 text-primary" />
                                },
                                {
                                    title: "Bank Transfer",
                                    desc: "BDO Savings Account",
                                    details: "CLC Tagum - 1234 5678 9012",
                                    icon: <DollarSign className="w-6 h-6 text-indigo-500" />
                                },
                                {
                                    title: "On-Site Giving",
                                    desc: "Give during our weekend services.",
                                    details: "Envelopes available at the lobby.",
                                    icon: <HandHeart className="w-6 h-6 text-rose-500" />
                                }
                            ].map((option, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-6 rounded-[2rem] bg-card border border-border flex items-center gap-6 group hover:border-primary/20 transition-all"
                                >
                                    <div className="p-4 bg-muted rounded-2xl group-hover:scale-110 transition-transform">
                                        {option.icon}
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-black uppercase italic tracking-tight">{option.title}</h3>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase">{option.desc}</p>
                                        <p className="text-sm font-black text-primary tracking-widest">{option.details}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="bg-primary p-12 rounded-[4rem] text-white space-y-8 shadow-2xl relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[100px] -mr-32 -mt-32 group-hover:scale-150 transition-transform duration-1000" />

                        <div className="text-center space-y-4">
                            <Star className="w-12 h-12 text-white/50 mx-auto fill-white/20" />
                            <h3 className="text-3xl font-black uppercase italic tracking-tighter">Impact of Your Giving</h3>
                            <p className="text-sm font-medium opacity-80 leading-relaxed">
                                Every contribution—no matter the size—goes directly towards ministry expenses, community outreach projects, and global mission work.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {[
                                "Local Community Support",
                                "Global Missions & Evangelism",
                                "Student Scholarships",
                                "Church Operations & Maintenance",
                                "Crisis & Relief Funds"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-white/50" />
                                    <span className="text-sm font-black uppercase tracking-widest italic">{item}</span>
                                </div>
                            ))}
                        </div>

                        <div className="pt-8 border-t border-white/10 text-center">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Verified & Secure Giving</p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* FAQ ON GIVING */}
            <section className="py-24 px-6 bg-muted/20">
                <div className="max-w-3xl mx-auto space-y-12 text-center">
                    <h2 className="text-3xl font-black uppercase italic tracking-tight italic">Giving <span className="text-primary">Questions</span></h2>
                    <div className="space-y-6 text-left">
                        {[
                            { q: "Can I get a donation receipt?", a: "Yes! If you give online or via check, we can provide annual contribution statements. For cash gifts, please use our provided envelopes so we can track your giving." },
                            { q: "Is online giving secure?", a: "Absolutely. We use industry-standard encryption for all digital transactions to ensure your information remains private and secure." },
                            { q: "What is 'Firstfruits'?", a: "Firstfruits giving is an ancient biblical principle of giving the very first of our income as an act of trust and gratitude to God." }
                        ].map((faq, i) => (
                            <div key={i} className="p-8 rounded-[2rem] bg-card border border-border space-y-3 shadow-sm">
                                <h4 className="font-black text-lg uppercase italic tracking-tight italic">{faq.q}</h4>
                                <p className="text-sm text-muted-foreground font-medium leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FINAL THOUGHT */}
            <section className="py-24 px-6 text-center">
                <div className="max-w-2xl mx-auto space-y-8">
                    <div className="w-16 h-1 w-16 bg-primary mx-auto rounded-full" />
                    <p className="text-xl font-black italic uppercase tracking-tighter leading-tight">
                        "For where your treasure is, there your heart will be also."
                    </p>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">— Matthew 6:21</p>
                    <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button size="lg" className="h-14 px-12 rounded-2xl bg-primary font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-primary/20">
                            Give Online Now
                        </Button>
                        <Link href="/#about">
                            <Button size="lg" variant="ghost" className="h-14 px-12 rounded-2xl text-muted-foreground/60 font-black uppercase text-[10px] tracking-[0.2em]">
                                Explore Mission
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
