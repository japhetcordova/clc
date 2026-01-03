"use client";

import { motion } from "framer-motion";
import {
    Calendar,
    Clock,
    MapPin,
    Music,
    Baby,
    Users,
    Sparkles,
    ArrowRight,
    Search,
    AlertCircle,
    HandHeart
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default function ServicesPage() {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 }
    };

    const mainServices = [
        {
            time: "08:00 AM",
            day: "Every Sunday",
            title: "Early Morning Worship",
            desc: "A vibrant start to your week with powerful worship and a deep dive into the Word.",
            icon: <Clock className="w-6 h-6 text-primary" />,
            tag: "First Service"
        },
        {
            time: "10:30 AM",
            day: "Every Sunday",
            title: "Celebration Service",
            desc: "Our high-energy gathering featuring contemporary worship and practical biblical teaching.",
            icon: <Sparkles className="w-6 h-6 text-accent" />,
            tag: "Second Service"
        },
        {
            time: "05:00 PM",
            day: "Wednesdays",
            title: "Mid-week Breakthrough",
            desc: "A dedicated time for corporate prayer, testimony, and spiritual refreshment.",
            icon: <Music className="w-6 h-6 text-rose-500" />,
            tag: "Prayer & Worship"
        }
    ];

    const specializedServices = [
        {
            title: "Kids Church",
            time: "Sync with Main Services",
            desc: "Specialized environment where children (2-12) learn biblical truths through play, song, and story.",
            icon: <Baby className="w-5 h-5" />,
            color: "text-amber-500 bg-amber-500/10"
        },
        {
            title: "Youth Alive",
            time: "Fridays | 06:00 PM",
            desc: "A high-octane gathering for teenagers and students to connect, grow, and lead.",
            icon: <Users className="w-5 h-5" />,
            color: "text-indigo-500 bg-indigo-500/10"
        },
        {
            title: "Morning Prayer",
            time: "Saturdays | 08:00 AM",
            desc: "Join our core intercessors as we lift up our church, city, and nation in prayer.",
            icon: <HandHeart className="w-5 h-5" />,
            color: "text-emerald-500 bg-emerald-500/10"
        }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-background">
            {/* HEADER */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-10">
                    <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-primary rounded-full blur-[150px]" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 text-center space-y-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 backdrop-blur-md mb-4"
                    >
                        <Calendar className="w-4 h-4 text-accent" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Join Our Gatherings</span>
                    </motion.div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">
                        Worship <span className="text-accent underline decoration-accent/20 underline-offset-8">Experiences</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-muted-foreground font-medium text-lg leading-relaxed">
                        Discover the various ways you can connect with God and our community through our corporate services.
                    </p>
                </div>
            </section>

            {/* MAIN SERVICES GRID */}
            <section className="py-24 px-6 relative">
                <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
                    {mainServices.map((service, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="group p-8 rounded-[2.5rem] bg-card border border-border flex flex-col items-center text-center space-y-6 hover:shadow-2xl transition-all"
                        >
                            <div className="p-4 bg-muted rounded-2xl group-hover:scale-110 transition-transform">
                                {service.icon}
                            </div>
                            <div className="space-y-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary italic">{service.tag}</span>
                                <h3 className="text-2xl font-black uppercase italic tracking-tighter">{service.title}</h3>
                                <p className="text-sm font-black text-foreground drop-shadow-sm">{service.day} | {service.time}</p>
                            </div>
                            <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                                {service.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* SPECIALIZED SERVICES */}
            <section className="py-24 px-6 bg-muted/20">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
                        <motion.div {...fadeIn} className="space-y-4">
                            <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase italic leading-none">
                                Specialized <br />
                                <span className="text-primary">Gatherings</span>
                            </h2>
                            <p className="max-w-md text-muted-foreground font-medium italic">Communities designed for your specific stage of life or interest.</p>
                        </motion.div>
                    </div>

                    <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
                        {specializedServices.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                                className="p-8 rounded-3xl bg-card border border-border flex flex-col gap-4 hover:border-primary/20 transition-all opacity-90 hover:opacity-100"
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.color}`}>
                                    {item.icon}
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xl font-black uppercase italic tracking-tight">{item.title}</h3>
                                    <p className="text-xs font-black tracking-widest text-primary">{item.time}</p>
                                </div>
                                <p className="text-xs text-muted-foreground font-medium leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* WHAT TO EXPECT SECTION */}
            <section className="py-24 px-6 relative overflow-hidden">
                <div className="max-w-7xl mx-auto space-y-16">
                    <motion.div {...fadeIn} className="text-center space-y-4 max-w-2xl mx-auto">
                        <h2 className="text-4xl font-black uppercase italic tracking-tight">What to <span className="text-primary">Expect</span></h2>
                        <p className="text-muted-foreground font-medium italic">Thinking of visiting for the first time? Here's a quick guide.</p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            {[
                                { title: "Atmosphere", desc: "A welcoming, casual environment where you can be yourself." },
                                { title: "Worship", desc: "Contemporary music led by our talented worship team." },
                                { title: "Message", desc: "Practical, relevant teaching based on the Bible." },
                                { title: "Community", desc: "People who care and want to walk honestly beside you." }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex gap-4 items-start"
                                >
                                    <div className="mt-1 p-1 bg-primary/10 rounded-full">
                                        <ArrowRight className="w-4 h-4 text-primary" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-black text-lg uppercase tracking-tight italic">{item.title}</h4>
                                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        <div className="relative aspect-video rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-border group">
                            <Image
                                src="/church_hero_worship_1767400361470.png"
                                alt="Church Interior"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-1000"
                            />
                            <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] opacity-40" />
                            <div className="absolute inset-0 flex items-center justify-center p-8">
                                <AlertCircle className="w-12 h-12 text-white animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* LOCATION FOOTER */}
            <section className="py-24 px-6 bg-primary text-white">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
                    <div className="space-y-4 text-center md:text-left">
                        <h2 className="text-4xl font-black uppercase italic tracking-tighter">Ready to Visit?</h2>
                        <p className="font-medium opacity-80 max-w-md">Find us at Briz District, Tagum City. We suggest arriving 15 minutes early to grab a seat!</p>
                    </div>
                    <div className="flex gap-4">
                        <Link href="/#location">
                            <Button size="lg" className="h-14 px-10 rounded-2xl bg-white text-primary font-black uppercase text-xs tracking-widest hover:bg-slate-100 transition-all">
                                Get Directions
                            </Button>
                        </Link>
                        <Link href="/registration">
                            <Button size="lg" variant="outline" className="h-14 px-10 rounded-2xl border-white/20 bg-white/10 font-black uppercase text-xs tracking-widest backdrop-blur-md">
                                I'm New Here
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
