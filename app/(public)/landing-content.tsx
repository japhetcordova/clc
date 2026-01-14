"use client";

import { motion } from "framer-motion";
import {
    Heart,
    Users,
    MapPin,
    Calendar,
    ArrowRight,
    Sparkles,
    ShieldCheck,
    Info,
    Quote,
    BookOpen,
    ChevronLeft,
    ChevronRight,
    Clock,
    Building2,
    MonitorPlay,
    Globe
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EventCarousel } from "@/components/EventCarousel";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useEffect, useState } from "react";

import { AnimatePresence } from "framer-motion";

export default function LandingContent() {
    const [cookieConsent, setCookieConsent] = useState(true); // Default hidden until effect

    useEffect(() => {
        // Cookie logic
        const consent = localStorage.getItem("clc_cookie_consent");
        if (!consent) setCookieConsent(false);
    }, []);

    const acceptCookies = () => {
        localStorage.setItem("clc_cookie_consent", "true");
        setCookieConsent(true);
    };

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 }
    };

    const staggering = {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        viewport: { once: true },
        transition: { staggerChildren: 0.2 }
    };

    return (
        <div className="flex flex-col min-h-screen bg-background relative selection:bg-primary/20">
            {/* HERO SECTION */}
            <section className="relative min-h-screen flex flex-col overflow-hidden pt-20 md:pt-32 px-4 md:px-8">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/church_hero_worship_1767400361470.png"
                        alt="Church Worship"
                        fill
                        className="object-cover opacity-40 scale-110"
                        priority
                    />
                    <div className="absolute inset-0 bg-radial-[at_center_center] from-transparent via-background/40 to-background" />
                    <div className="absolute inset-0 bg-linear-to-b from-transparent via-background/60 to-background" />
                </div>

                <div className="relative z-10 flex-1 flex items-center justify-center w-full md:pt-4">
                    <div className="max-w-[1920px] mx-auto w-full mb-12">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="flex flex-col items-center text-center gap-8"
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-xl shadow-lg shadow-primary/5"
                            >
                                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">A Place to Belong</span>
                            </motion.div>

                            <div className="space-y-6">
                                <h1 className="text-7xl md:text-9xl lg:text-[10rem] font-black tracking-tighter text-foreground uppercase italic leading-[0.8] drop-shadow-2xl">
                                    Christian <br />
                                    Life <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-indigo-500 to-primary bg-[length:200%_auto] animate-gradient-x px-4">Center</span>
                                </h1>
                                <p className="max-w-2xl mx-auto text-lg md:text-3xl font-black text-muted-foreground/80 leading-relaxed uppercase italic tracking-[0.2em]">
                                    Love God. Love People. Make Disciples.
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center justify-center gap-8 pt-4">
                                <Link href="/registration">
                                    <Button size="lg" className="h-20 px-12 rounded-2xl bg-primary text-primary-foreground font-black text-xl shadow-2xl shadow-primary/30 hover:scale-105 hover:shadow-primary/40 transition-all group">
                                        Join Our Church
                                        <ArrowRight className="ml-3 w-8 h-8 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                                <Link href="/about" className="text-foreground font-black uppercase italic tracking-widest text-sm hover:text-primary transition-colors flex items-center gap-3 group">
                                    Learn More About Us
                                    <div className="w-12 h-px bg-foreground/20 group-hover:bg-primary/40 group-hover:w-16 transition-all" />
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>

                <div className="relative z-10 w-full mb-12">
                    <EventCarousel />
                </div>

                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-30 hidden md:block z-20"
                >
                    <div className="w-6 h-10 rounded-full border-2 border-muted-foreground flex justify-center p-1">
                        <div className="w-1 h-2 bg-muted-foreground rounded-full" />
                    </div>
                </motion.div>
            </section>

            {/* EXPERIENCE SECTION */}
            <section className="py-12 md:py-20 bg-card/10 relative overflow-hidden border-b border-border/50">
                <div className="absolute inset-0 bg-radial-[at_center_center] from-primary/5 via-transparent to-transparent opacity-50" />
                <div className="max-w-[1920px] mx-auto px-4 md:px-8 relative z-10 space-y-12 md:space-y-20">
                    <div className="text-center space-y-4 max-w-3xl mx-auto">
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground uppercase italic leading-none">
                            Find the right <br />
                            <span className="text-primary">experience</span> for you.
                        </h2>
                        <p className="text-lg md:text-xl text-muted-foreground font-medium leading-relaxed">
                            No matter where you are, online or in person, become a part of all God is doing.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-0 lg:divide-x lg:divide-border/50">
                        {[
                            {
                                icon: <Building2 className="w-10 h-10 text-primary" />,
                                title: "Physical Campus",
                                desc: "Worship with us in person at one of our physical campuses.",
                                link: "Find a location",
                                href: "/locations"
                            },
                            {
                                icon: <MonitorPlay className="w-10 h-10 text-primary" />,
                                title: "Live Streams",
                                desc: "eFam is our online community who stream church from wherever they are.",
                                link: "Find a time",
                                href: "/watch"
                            },
                            {
                                icon: <Users className="w-10 h-10 text-primary" />,
                                title: "Watch Party",
                                desc: "Watch Parties are groups of eFam that stream the worship experience together.",
                                link: "Find a watch party",
                                href: "/watch-parties"
                            },
                            {
                                icon: <Globe className="w-10 h-10 text-primary" />,
                                title: "Pop-Up",
                                desc: "A Pop-Up is where we bring church to different cities across the nation.",
                                link: "Find a pop-up",
                                href: "/popups"
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.8 }}
                                className="group lg:px-10 flex flex-col items-start gap-8"
                            >
                                <div className="p-5 bg-background shadow-2xl rounded-3xl ring-1 ring-border group-hover:scale-110 group-hover:ring-primary/50 transition-all duration-500">
                                    {item.icon}
                                </div>
                                <div className="space-y-4 flex-1">
                                    <h3 className="text-2xl font-black uppercase italic tracking-tighter group-hover:text-primary transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-muted-foreground font-medium leading-relaxed line-clamp-3">
                                        {item.desc}
                                    </p>
                                </div>
                                <Link href={item.href} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-foreground hover:text-primary transition-colors group/link">
                                    <span className="border-b-2 border-primary/20 group-hover/link:border-primary transition-all pb-1">{item.link}</span>
                                    <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform text-primary" />
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    <div className="flex justify-center pt-10">
                        <Link href="/locations">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-12 h-16 rounded-2xl bg-muted/50 border border-border backdrop-blur-xl text-foreground font-black uppercase italic tracking-widest text-sm hover:bg-muted transition-all shadow-2xl flex items-center gap-3"
                            >
                                View all locations
                                <ArrowRight className="w-5 h-5 text-primary" />
                            </motion.button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* GET INVOLVED SECTION */}
            <section className="py-12 md:py-20 px-4 md:px-8 relative bg-background/50">
                <div className="max-w-[1920px] mx-auto space-y-16">
                    <div className="text-center space-y-4">
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground uppercase italic leading-none">
                            How To <span className="text-primary">Get Involved</span>
                        </h2>
                        <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto italic">
                            See how God can use your gifts to make an eternal impact.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Volunteer",
                                desc: "Participate in the mission to advance the gospel by serving on a volunteer team.",
                                image: "/involvement/volunteer.png"
                            },
                            {
                                title: "Lead",
                                desc: "Lead an eGroup, host a Watch Party or become a student leader.",
                                image: "/involvement/lead.png"
                            },
                            {
                                title: "Jobs",
                                desc: "Explore job opportunities to use your gifts in a ministry setting.",
                                image: "/involvement/jobs.png"
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.8 }}
                                className="group relative bg-card/40 backdrop-blur-xl rounded-[2.5rem] overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-500 shadow-2xl"
                            >
                                <div className="aspect-[4/3] relative overflow-hidden">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/20 to-transparent" />
                                </div>
                                <div className="p-8 space-y-4">
                                    <h3 className="text-3xl font-black uppercase italic tracking-tighter group-hover:text-primary transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                                        {item.desc}
                                    </p>
                                    <Link href="/get-involved" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors pt-2 group/link">
                                        Learn more
                                        <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ABOUT SECTION */}
            <section id="about" className="py-12 md:py-20 px-4 md:px-8 relative">
                <div className="max-w-[1920px] mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        {...fadeIn}
                        className="space-y-6"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                            <Info className="w-4 h-4 text-indigo-500" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500">Who We Are</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground uppercase italic leading-none">
                            Devoted to God <br />
                            <span className="text-indigo-500">Connected to People</span>
                        </h2>
                        <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                            Christian Life Center (CLC) is a vibrant community focused on spiritual growth, authentic fellowship, and impactful ministry. We believe that everyone has a purpose and a place in God's family.
                        </p>
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-2">
                                <Users className="w-6 h-6 text-primary" />
                                <h3 className="font-bold uppercase text-xs tracking-widest">Global Family</h3>
                                <p className="text-[10px] text-muted-foreground font-medium">Part of the worldwide G12 family of churches.</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-2">
                                <Heart className="w-6 h-6 text-rose-500" />
                                <h3 className="font-bold uppercase text-xs tracking-widest">Our Heart</h3>
                                <p className="text-[10px] text-muted-foreground font-medium">Moved by compassion to serve our city.</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl ring-1 ring-border">
                            <Image
                                src="/church_hero_worship_1767400361470.png"
                                alt="Community"
                                fill
                                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                            />
                        </div>
                        <div className="absolute -bottom-10 -left-10 p-8 rounded-[2rem] bg-card shadow-2xl border border-border max-w-[240px] hidden md:block backdrop-blur-xl">
                            <h4 className="font-black text-xl italic uppercase tracking-tighter">Tagum City</h4>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">Our primary location and heart of operation.</p>
                        </div>
                    </motion.div>
                </div>
                {/* SMOOTH TRANSITION TO VISION */}
                <div className="absolute bottom-0 left-0 right-0 h-48 bg-linear-to-b from-transparent to-muted/20 z-0 pointer-events-none" />
            </section>



            {/* SERVICES SECTION */}
            <section id="services" className="py-12 md:py-20 px-4 md:px-8 relative">
                <div className="max-w-[1920px] mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
                        <motion.div {...fadeIn} className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                                <Calendar className="w-4 h-4 text-primary" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Gatherings</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase italic leading-none">
                                Regular <br />
                                <span className="text-primary">Services</span>
                            </h2>
                        </motion.div>
                        <p className="max-w-md text-muted-foreground font-medium pb-1 md:text-right">
                            Join us in our corporate worship and specialized gatherings throughout the week.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { time: "08:00 AM", day: "Sunday", title: "First Service", type: "Main Gathering" },
                            { time: "10:30 AM", day: "Sunday", title: "Second Service", type: "Main Gathering" },
                            { time: "05:00 PM", day: "Wednesday", title: "Mid-week Prayer", type: "Prayer & Worship" },
                            { time: "06:00 PM", day: "Friday", title: "Youth Alive", type: "Youth Ministry" },
                            { time: "08:00 AM", day: "Saturday", title: "Morning Prayer", type: "Corporate Prayer" },
                            { time: "02:00 PM", day: "Sunday", title: "Kids Church", type: "Children's Ministry" }
                        ].map((service, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                                className="p-6 rounded-3xl bg-muted/30 border border-border flex items-center justify-between group hover:bg-muted/50 transition-all"
                            >
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase text-primary tracking-widest">{service.day}</p>
                                    <h3 className="text-xl font-black uppercase italic tracking-tighter">{service.title}</h3>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">{service.type}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-black font-mono tracking-tighter group-hover:scale-110 transition-transform">{service.time}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>



            {/* COOKIE BANNER */}
            <AnimatePresence>
                {!cookieConsent && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-6 right-6 left-6 md:left-auto md:w-[400px] z-[60]"
                    >
                        <Card className="bg-card/90 backdrop-blur-2xl border-white/10 shadow-2xl p-6 rounded-[2rem]">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-primary/10 rounded-2xl">
                                    <ShieldCheck className="w-6 h-6 text-primary" />
                                </div>
                                <div className="space-y-3">
                                    <h4 className="font-black uppercase text-xs tracking-widest italic">Cookie Policy</h4>
                                    <p className="text-[10px] font-medium text-muted-foreground leading-relaxed">
                                        We use cookies to improve your experience and analyze our traffic. By continuing to visit this site you agree to our use of cookies.
                                    </p>
                                    <div className="flex gap-2">
                                        <Button size="sm" onClick={acceptCookies} className="bg-primary text-white rounded-xl uppercase text-[9px] font-black tracking-widest px-4">
                                            Accept All
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={acceptCookies} className="bg-transparent border-border rounded-xl uppercase text-[9px] font-black tracking-widest px-4">
                                            Necessary Only
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* FINAL CTA */}
            <section className="py-12 md:py-20 px-4 md:px-8 text-center border-t border-border mt-auto">
                <div className="max-w-2xl mx-auto space-y-8">
                    <motion.div {...fadeIn} className="space-y-4">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase italic drop-shadow-sm">Ready to <span className="text-primary underline decoration-primary/20 underline-offset-8">be a part</span> of CLC?</h2>
                        <p className="text-muted-foreground font-medium leading-relaxed">
                            Start your journey with us today. Create your church profile and connect with a local cell network.
                        </p>
                    </motion.div>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/registration" className="w-full sm:w-auto">
                            <Button size="lg" className="h-14 w-full px-12 rounded-2xl bg-primary font-black text-lg shadow-2xl shadow-primary/20 hover:scale-105 transition-all">
                                Get Started
                            </Button>
                        </Link>
                        <Link href="/#about" className="w-full sm:w-auto">
                            <Button size="lg" variant="ghost" className="h-14 w-full px-12 rounded-2xl font-black text-lg hover:bg-muted transition-all text-muted-foreground">
                                Learn More
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
