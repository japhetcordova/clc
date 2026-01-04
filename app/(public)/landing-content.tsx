"use client";

import { motion } from "framer-motion";
import {
    Heart,
    Users,
    MapPin,
    Calendar,
    HandHeart,
    ArrowRight,
    Sparkles,
    ShieldCheck,
    Compass,
    Church as ChurchIcon,
    Coins,
    CheckCircle2,
    Info,
    ExternalLink
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/church_hero_worship_1767400361470.png"
                        alt="Church Worship"
                        fill
                        className="object-cover opacity-60 scale-105"
                        priority
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-background/40 via-background/60 to-background" />
                </div>

                <div className="relative z-10 max-w-5xl px-6 text-center space-y-8 mt-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="space-y-4"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md mb-4">
                            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">A Place to Belong</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-foreground uppercase italic leading-[0.9]">
                            Christian Life <br />
                            <span className="text-primary drop-shadow-[0_0_15px_rgba(var(--primary),0.3)]">Center</span>
                        </h1>
                        <p className="max-w-2xl mx-auto text-lg md:text-xl font-medium text-muted-foreground/80 leading-relaxed md:px-12">
                            A community of faith devoted to loving God, loving people, and making a difference in the world.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="flex flex-wrap items-center justify-center gap-4"
                    >
                        <Link href="/registration">
                            <Button size="lg" className="h-14 px-8 rounded-2xl bg-primary text-primary-foreground font-black text-lg shadow-2xl shadow-primary/20 hover:scale-105 transition-all">
                                Join Our Church
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                        <Link href="/scanner">
                            <Button size="lg" variant="outline" className="h-14 px-8 rounded-2xl border-border bg-background/50 backdrop-blur-md font-black text-lg shadow-xl hover:bg-muted/50 transition-all">
                                Scanner Portal
                            </Button>
                        </Link>
                    </motion.div>
                </div>

                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-50"
                >
                    <div className="w-6 h-10 rounded-full border-2 border-muted-foreground flex justify-center p-1">
                        <div className="w-1 h-2 bg-muted-foreground rounded-full" />
                    </div>
                </motion.div>
            </section>

            {/* ABOUT SECTION */}
            <section id="about" className="py-24 px-6 relative">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
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
                                <p className="text-[10px] text-muted-foreground font-medium">Over 2 clusters and dozens of cell networks.</p>
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

            {/* VISION & GOALS SECTION */}
            <section id="vision" className="py-24 px-6 bg-muted/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -mr-64 -mt-64" />
                <div className="max-w-7xl mx-auto text-center space-y-16">
                    <motion.div {...fadeIn} className="space-y-4 max-w-2xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground uppercase italic leading-none">
                            Vision <span className="text-primary">&</span> Mission
                        </h2>
                        <p className="text-muted-foreground font-medium">Our compass for everything we do as a church body.</p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Compass className="w-10 h-10 text-primary" />,
                                title: "Our Mission",
                                desc: "To present the person of Jesus Christ to our generation, leading them into a growing relationship with Him."
                            },
                            {
                                icon: <Sparkles className="w-10 h-10 text-accent" />,
                                title: "Our Vision",
                                desc: "To see a transformed community walking in the fullness of life provided by the Gospel of Jesus."
                            },
                            {
                                icon: <ShieldCheck className="w-10 h-10 text-emerald-500" />,
                                title: "Our Values",
                                desc: "Integrity, Worship, Service, and Honor guide every action we take as a family."
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.6 }}
                                className="p-8 rounded-[2.5rem] bg-card border border-border shadow-xl hover:shadow-2xl transition-all space-y-4 group"
                            >
                                <div className="p-4 bg-muted w-fit rounded-2xl group-hover:scale-110 group-hover:bg-primary/10 transition-all">
                                    {item.icon}
                                </div>
                                <h3 className="text-2xl font-black uppercase italic tracking-tight">{item.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed font-medium">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
                {/* SMOOTH TRANSITION TO SERVICES */}
                <div className="absolute bottom-0 left-0 right-0 h-48 bg-linear-to-b from-transparent to-background z-0 pointer-events-none" />
            </section>

            {/* SERVICES SECTION */}
            <section id="services" className="py-24 px-6 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
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

            {/* GIVING SECTION */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="rounded-[4rem] bg-linear-to-br from-primary via-indigo-600 to-indigo-800 p-12 md:p-20 text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-[100px] -mr-32 -mt-32" />
                        <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
                            <div className="space-y-8">
                                <motion.div {...fadeIn} className="space-y-4">
                                    <h2 className="text-5xl md:text-6xl font-black tracking-tighter uppercase italic leading-none">
                                        Generosity <br />
                                        <span className="text-white/70">Changes Lives</span>
                                    </h2>
                                    <p className="text-lg font-medium text-white/80 leading-relaxed max-w-md">
                                        Your tithes and offerings help us continue reaching the community and sharing the Gospel.
                                    </p>
                                </motion.div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md">
                                        <div className="p-2 bg-white/20 rounded-lg">
                                            <Coins className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold uppercase text-xs tracking-widest">GCash Giving</h4>
                                            <p className="text-sm font-black tracking-widest mt-0.5">0912-345-6789</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md">
                                        <div className="p-2 bg-white/20 rounded-lg">
                                            <ChurchIcon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold uppercase text-xs tracking-widest">Bank Transfer</h4>
                                            <p className="text-sm font-black tracking-widest mt-0.5">BDO: 1234 5678 9012</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="bg-white/5 backdrop-blur-3xl rounded-[3rem] p-8 border border-white/10 space-y-8"
                            >
                                <div className="text-center space-y-2">
                                    <h3 className="text-2xl font-black uppercase tracking-tight italic">Tithes & Offering</h3>
                                    <p className="text-xs font-bold text-white/60 uppercase tracking-widest font-mono italic">"Bring the whole tithe into the storehouse..."</p>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        "Safe & Secure transactions",
                                        "Automated receipt generation",
                                        "Supports local & global missions",
                                        "Invest in church infrastructure"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                                            <span className="text-sm font-bold text-white/90">{item}</span>
                                        </div>
                                    ))}
                                </div>
                                <Button className="w-full h-14 rounded-2xl bg-white text-indigo-700 font-black text-lg hover:bg-slate-100 transition-all shadow-xl">
                                    Give Online Now
                                </Button>
                            </motion.div>
                        </div>
                    </div>
                </div>
                {/* SMOOTH TRANSITION TO LOCATION */}
                <div className="absolute bottom-0 left-0 right-0 h-48 bg-linear-to-b from-transparent to-muted/10 z-0 pointer-events-none" />
            </section>

            {/* LOCATION SECTION */}
            <section id="location" className="py-24 px-6 relative bg-muted/10">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8"
                    >
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
                                <MapPin className="w-4 h-4 text-accent" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Visit Us</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase italic leading-none">
                                Worship <br />
                                <span className="text-accent">With Us</span>
                            </h2>
                            <p className="text-lg text-muted-foreground font-medium max-w-md">
                                Find us at the heart of Tagum City. Our doors are always open for those seeking a home.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex gap-4 items-start">
                                <div className="bg-card p-3 rounded-2xl ring-1 ring-border shadow-md">
                                    <MapPin className="w-6 h-6 text-accent" />
                                </div>
                                <div>
                                    <h4 className="font-black text-lg uppercase tracking-tight italic">Address</h4>
                                    <p className="text-sm text-muted-foreground font-medium">Briz District, Tagum City, Davao del Norte</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="bg-card p-3 rounded-2xl ring-1 ring-border shadow-md">
                                    <ShieldCheck className="w-6 h-6 text-accent" />
                                </div>
                                <div>
                                    <h4 className="font-black text-lg uppercase tracking-tight italic">Contact</h4>
                                    <p className="text-sm text-muted-foreground font-medium">info@clctagum.org | (084) 123-4567</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="aspect-video relative rounded-[2.5rem] overflow-hidden bg-card shadow-2xl ring-1 ring-border group cursor-pointer"
                    >
                        <Image
                            src="/church_location_map_ui_1767400688710.png"
                            alt="Map Location"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-1000 grayscale-[0.5] group-hover:grayscale-0"
                        />
                        <div className="absolute inset-0 bg-linear-to-tr from-primary/20 to-transparent opacity-60 group-hover:opacity-0 transition-opacity" />
                        <div className="absolute top-6 right-6 p-3 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                            <ExternalLink className="w-4 h-4 text-white" />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="px-6 py-2.5 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/40 opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                                Open in Google Maps
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* FAQ SECTION */}
            <section className="py-24 px-6 relative">
                <div className="max-w-3xl mx-auto space-y-16">
                    <motion.div {...fadeIn} className="text-center space-y-4">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase italic leading-none">
                            Common <span className="text-primary">Questions</span>
                        </h2>
                        <p className="text-muted-foreground font-medium italic">Everything you need to know about joining our church family.</p>
                    </motion.div>

                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {[
                            {
                                q: "Where exactly are you located?",
                                a: "We are located in Briz District, Tagum City. You can find us right in the heart of the district, easily accessible from the main highway."
                            },
                            {
                                q: "What should I wear to a service?",
                                a: "Come as you are! While some prefer business casual, many of our members wear jeans and a t-shirt. We care more about you than what you wear."
                            },
                            {
                                q: "Is there anything for my kids?",
                                a: "Absolutely! We have a dedicated Kids Church every Sunday at 2:00 PM and concurrent with our main services. Your children will have a blast learning about God in a safe, fun environment."
                            },
                            {
                                q: "How do I join a cell network?",
                                a: "You can approach our 'Connect Desk' after any service or sign up through our digital registration portal. We'll match you with a network that fits your location and demographic."
                            },
                            {
                                q: "Do I need to be a member to attend?",
                                a: "No! Everyone is welcome to attend our services. Membership is a step you can take later if you feel CLC is the home God has for you."
                            }
                        ].map((item, i) => (
                            <AccordionItem key={i} value={`item-${i}`} className="bg-card/50 px-6 rounded-2xl border border-border shadow-sm hover:border-primary/20 transition-all overflow-hidden group">
                                <AccordionTrigger className="text-sm md:text-base font-black uppercase tracking-tight italic hover:no-underline py-6">
                                    {item.q}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground font-medium pb-6 leading-relaxed">
                                    {item.a}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
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
            <section className="py-24 px-6 text-center border-t border-border mt-auto">
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
