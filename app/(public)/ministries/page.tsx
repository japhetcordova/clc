"use client";

import { motion } from "framer-motion";
import {
    Heart,
    Music,
    Video,
    Users,
    Shield,
    Clapperboard,
    Baby,
    Mic2,
    Settings,
    DollarSign,
    Sparkles,
    PenTool,
    Speech,
    ArrowRight,
    Star
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MINISTRIES } from "@/lib/church-data";

export default function MinistriesPage() {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 }
    };

    // Mapping icons to ministry names for better visuals
    const ministryIcons: Record<string, React.ReactNode> = {
        "Worship Team": <Music className="w-8 h-8" />,
        "Media": <Video className="w-8 h-8" />,
        "Usher": <HandHeart className="w-8 h-8" />,
        "Marshal": <Shield className="w-8 h-8" />,
        "Production": <Clapperboard className="w-8 h-8" />,
        "Kid's Church": <Baby className="w-8 h-8" />,
        "Technical": <Settings className="w-8 h-8" />,
        "PA": <Mic2 className="w-8 h-8" />,
        "Finance": <DollarSign className="w-8 h-8" />,
        "Arete": <Sparkles className="w-8 h-8" />,
        "Hosting": <Speech className="w-8 h-8" />,
        "Writer": <PenTool className="w-8 h-8" />
    };

    const ministryColors: Record<string, string> = {
        "Worship Team": "text-primary bg-primary/10",
        "Media": "text-indigo-500 bg-indigo-500/10",
        "Usher": "text-rose-500 bg-rose-500/10",
        "Marshal": "text-amber-500 bg-amber-500/10",
        "Production": "text-emerald-500 bg-emerald-500/10",
        "Kid's Church": "text-sky-500 bg-sky-500/10",
        "Technical": "text-slate-500 bg-slate-500/10",
        "PA": "text-orange-500 bg-orange-500/10",
        "Finance": "text-green-600 bg-green-500/10",
        "Arete": "text-purple-500 bg-purple-500/10",
        "Hosting": "text-pink-500 bg-pink-500/10",
        "Writer": "text-cyan-500 bg-cyan-500/10"
    };

    function HandHeart(props: any) {
        return (
            <svg
                {...props}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M11 14h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16" />
                <path d="m5 20 1-2" />
                <path d="M17 16H9" />
                <path d="M16 11c1.5 0 3-1.5 3-3s-1.5-3-3-3-3 1.5-3 3 1.5 3 3 3Z" />
                <path d="M9 7c-1.5 0-3 1.5-3 3s1.5 3 3 3 3-1.5 3-3-1.5-3-3-3Z" />
            </svg>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
            {/* HEADER */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[150px]" />
                    <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px]" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 text-center space-y-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md mb-4"
                    >
                        <Star className="w-4 h-4 text-primary animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Serve Your Purpose</span>
                    </motion.div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">
                        Our <span className="text-primary underline decoration-primary/20 underline-offset-8">Ministries</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-muted-foreground font-medium text-lg leading-relaxed">
                        There is a place for your talents and heart at Christian Life Center. Discover where you can make an impact.
                    </p>
                </div>
                {/* BOTTOM GRADIENT FADE */}
                <div className="absolute bottom-0 left-0 right-0 h-40 bg-linear-to-t from-background to-transparent z-0" />
            </section>

            {/* MINISTRIES GRID */}
            <section className="py-24 px-6 relative">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {MINISTRIES.map((ministry, i) => (
                        <motion.div
                            key={ministry}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: (i % 3) * 0.1 }}
                            className="group p-8 rounded-[2.5rem] bg-card border border-border flex flex-col items-start space-y-6 hover:shadow-2xl hover:border-primary/20 transition-all overflow-hidden relative"
                        >
                            {/* Accent Background */}
                            <div className={`absolute top-0 right-0 w-32 h-32 blur-[80px] opacity-10 ${ministryColors[ministry]?.split(' ')[1]}`} />

                            <div className={`p-4 rounded-2xl group-hover:scale-110 transition-transform ${ministryColors[ministry] || "bg-muted text-muted-foreground"}`}>
                                {ministryIcons[ministry] || <Heart className="w-8 h-8" />}
                            </div>

                            <div className="space-y-3 relative z-10">
                                <h3 className="text-2xl font-black uppercase italic tracking-tighter">{ministry}</h3>
                                <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                                    Contributing through {ministry.toLowerCase()} to ensure a transformative worship experience for our church family.
                                </p>
                            </div>

                            <Link href={`/ministries/${ministry.toLowerCase().replace(/\s+/g, '-')}`} className="block relative z-10">
                                <Button variant="ghost" size="sm" className="p-0 hover:bg-transparent text-[10px] font-black uppercase tracking-widest text-primary gap-2 group/btn">
                                    Learn More About This Team
                                    <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </motion.div>
                    ))}
                </div>
                {/* SMOOTH TRANSITION TO JOIN TEAM */}
                <div className="absolute bottom-0 left-0 right-0 h-48 bg-linear-to-b from-transparent to-muted/20 z-0 pointer-events-none" />
            </section>

            {/* JOIN THE TEAM SECTION */}
            <section className="py-24 px-6 bg-muted/20 relative">
                <div className="max-w-5xl mx-auto text-center space-y-12">
                    <motion.div {...fadeIn} className="space-y-4">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase italic leading-none">
                            Ready to <span className="text-primary">Involve?</span>
                        </h2>
                        <p className="text-muted-foreground font-medium leading-relaxed max-w-2xl mx-auto">
                            Serving is one of the best ways to grow in your faith and build lasting friendships. We provide training and mentorship for every team.
                        </p>
                    </motion.div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <div className="p-8 rounded-[2.5rem] bg-card border border-border text-left space-y-4 max-w-sm w-full">
                            <h4 className="font-black text-lg uppercase italic">Join as a Volunteer</h4>
                            <p className="text-xs text-muted-foreground font-medium">Step into a role that matches your skills and passions.</p>
                            <Link href="/registration" className="block">
                                <Button className="w-full h-12 rounded-xl bg-primary font-black uppercase text-[10px] tracking-widest">
                                    Sign Up Now
                                </Button>
                            </Link>
                        </div>
                        <div className="p-8 rounded-[2.5rem] bg-card border border-border text-left space-y-4 max-w-sm w-full">
                            <h4 className="font-black text-lg uppercase italic">Not Sure Where?</h4>
                            <p className="text-xs text-muted-foreground font-medium">Take our spiritual gifts assessment to find your fit.</p>
                            <Button variant="outline" className="w-full h-12 rounded-xl border-border bg-background font-black uppercase text-[10px] tracking-widest">
                                Discover Your Gift
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
