"use client";

import { motion } from "framer-motion";
import {
    Calendar,
    MapPin,
    Clock,
    ChevronLeft,
    Share2,
    Bell,
    Map as MapIcon,
    Info,
    ArrowRight
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useParams } from "next/navigation";

// For now, using static data until we fetch from DB in a real scenario
const MOCK_EVENTS = [
    {
        id: "1",
        title: "Super Sunday: Vision Day",
        date: "Jan 12, 2026",
        time: "08:00 AM & 10:30 AM",
        location: "Tagum HQ Main Sanctuary",
        category: "special",
        desc: "A special service where we unveil the roadmap and theme for the entire year. Don't miss this prophetic moment! We will be discussing our kingdom goals, cluster expansions, and community outreach programs for the first quarter. Join us as we align our hearts with God's vision for 2026.",
        tag: "High Priority",
        image: "/church_hero_worship_1767400361470.png"
    },
    {
        id: "2",
        title: "Mid-week Breakthrough",
        date: "Every Wednesday",
        time: "05:00 PM",
        location: "Tagum HQ",
        category: "regular",
        desc: "Corporate prayer and worship to refuel your spiritual fire mid-week. This is a time of intense intercession, testimony sharing, and deep intimate worship. Whether you're feeling weary or just want more of God's presence, this gathering is for you.",
        tag: "Weekly",
        image: "/church_architecture_exterior_1767400425687.png"
    }
];

export default function EventDetailPage() {
    const params = useParams();
    const event = MOCK_EVENTS.find(e => e.id === params.id) || MOCK_EVENTS[0];

    return (
        <div className="flex flex-col min-h-screen bg-background">
            {/* HERO HERO SECTION */}
            <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
                <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent" />

                <div className="absolute bottom-12 left-0 right-0 z-10">
                    <div className="max-w-7xl mx-auto px-6 space-y-4">
                        <Link href="/events">
                            <Button variant="ghost" className="p-0 h-auto gap-2 text-white/80 hover:text-white hover:bg-transparent mb-4 text-[10px] font-black uppercase tracking-widest">
                                <ChevronLeft className="w-4 h-4" /> Back to Events
                            </Button>
                        </Link>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-md">
                                <span className="text-[9px] font-black uppercase tracking-widest text-primary">{event.tag}</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none text-white drop-shadow-2xl">
                                {event.title}
                            </h1>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* DETAILS SECTION */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-black uppercase italic tracking-tight">About this <span className="text-primary">Event</span></h2>
                            <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                                {event.desc}
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-8">
                            <div className="p-8 rounded-[2rem] bg-card border border-border space-y-4">
                                <Clock className="w-8 h-8 text-primary" />
                                <div className="space-y-1">
                                    <h4 className="font-black text-lg uppercase italic">When</h4>
                                    <p className="text-sm font-bold text-muted-foreground uppercase">{event.date}</p>
                                    <p className="text-sm font-black text-primary uppercase tracking-widest">{event.time}</p>
                                </div>
                            </div>
                            <div className="p-8 rounded-[2rem] bg-card border border-border space-y-4">
                                <MapPin className="w-8 h-8 text-rose-500" />
                                <div className="space-y-1">
                                    <h4 className="font-black text-lg uppercase italic">Where</h4>
                                    <p className="text-sm font-bold text-muted-foreground uppercase">{event.location}</p>
                                    <Link href="/#location" className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-1 group">
                                        View on Map <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / CTA */}
                    <div className="space-y-8">
                        <div className="p-8 rounded-[3rem] bg-primary text-white shadow-2xl space-y-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-[60px] -mr-16 -mt-16" />

                            <h3 className="text-2xl font-black uppercase italic tracking-tighter relative z-10">Will you be there?</h3>
                            <p className="text-sm font-medium opacity-80 relative z-10">Let us know if you're coming so we can prepare a seat for you.</p>

                            <div className="space-y-3 relative z-10">
                                <Button className="w-full h-14 rounded-2xl bg-white text-primary font-black uppercase text-xs tracking-[0.2em] shadow-xl">
                                    I'm Interested
                                </Button>
                                <Button variant="ghost" className="w-full h-14 rounded-2xl border-white/20 bg-white/5 font-black uppercase text-xs tracking-[0.2em] text-white hover:bg-white/10">
                                    <Share2 className="w-4 h-4 mr-2" /> Share Event
                                </Button>
                            </div>
                        </div>

                        <div className="p-8 rounded-[2.5rem] bg-card border border-border space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Bell className="w-4 h-4 text-primary animate-bounce-slow" />
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Reminders</h4>
                            </div>
                            <ul className="space-y-3">
                                <li className="text-xs font-medium text-muted-foreground flex gap-2">
                                    <Info className="w-4 h-4 text-primary shrink-0" />
                                    <span>Arrive 15 minutes before the start time.</span>
                                </li>
                                <li className="text-xs font-medium text-muted-foreground flex gap-2">
                                    <Info className="w-4 h-4 text-primary shrink-0" />
                                    <span>Parking is available at the main gate.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
