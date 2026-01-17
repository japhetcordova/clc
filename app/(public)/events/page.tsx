import { db } from "@/db";
import { events } from "@/db/schema";
import { desc } from "drizzle-orm";
import {
    Bell,
    ArrowUpRight,
    Megaphone
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import EventsGrid from "./events-grid";

export const revalidate = 1800; // Revalidate every 30 minutes

export default async function EventsPage() {
    // Fetch events from DB with limit for performance
    const allEvents = await db.select().from(events).orderBy(desc(events.date)).limit(50);

    // Fallback Mock Events if DB is empty to prevent empty screen on first load
    const MOCK_EVENTS = [
        {
            id: "1",
            title: "Super Sunday: Vision Day",
            date: "Jan 12, 2026",
            time: "08:00 AM & 10:30 AM",
            location: "Tagum HQ Main Sanctuary",
            category: "special",
            description: "A special service where we unveil the roadmap and theme for the entire year. Don't miss this prophetic moment!",
            tag: "High Priority",
            createdAt: new Date()
        },
        {
            id: "2",
            title: "Mid-week Breakthrough",
            date: "Every Wednesday",
            time: "05:00 PM",
            location: "Tagum HQ",
            category: "regular",
            description: "Corporate prayer and worship to refuel your spiritual fire mid-week.",
            tag: "Weekly",
            createdAt: new Date()
        }
    ];

    const displayEvents = allEvents.length > 0 ? allEvents : MOCK_EVENTS;

    return (
        <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
            {/* HEADER */}
            <section className="relative pt-24 pb-12 md:pt-32 md:pb-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/bg/events.webp"
                        alt="Events Background"
                        fill
                        className="object-cover opacity-20 scale-105"
                        priority
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-background via-background/80 to-background" />
                </div>

                <div className="relative z-10 max-w-[1920px] mx-auto px-4 md:px-8 space-y-8 md:pt-4">
                    <div className="text-center space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 backdrop-blur-md mb-4">
                            <Bell className="w-4 h-4 text-rose-500 animate-bounce" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500">Stay Updated</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">
                            News <span className="text-rose-500 underline decoration-rose-500/20 underline-offset-8">&</span> Events
                        </h1>
                        <p className="max-w-2xl mx-auto text-muted-foreground font-medium text-lg leading-relaxed">
                            Be part of what God is doing. Explore our upcoming gatherings, announcements, and special events.
                        </p>
                    </div>

                    <EventsGrid initialEvents={displayEvents as any} />
                </div>
                {/* SMOOTH TRANSITION TO ANNOUNCEMENTS */}
                <div className="absolute bottom-0 left-0 right-0 h-48 bg-linear-to-b from-transparent to-muted/20 z-0 pointer-events-none" />
            </section>

            {/* ANNOUNCEMENT BOARD */}
            <section className="py-12 md:py-20 px-4 md:px-8 bg-muted/20 relative">
                <div className="max-w-[1920px] mx-auto space-y-16 relative z-10">
                    <div className="flex items-end justify-between gap-8">
                        <div className="space-y-4">
                            <h2 className="text-4xl font-black uppercase italic tracking-tight">Recent <span className="text-rose-500">Updates</span></h2>
                            <p className="text-muted-foreground font-medium italic">Latest announcements and church news.</p>
                        </div>
                        <Button variant="outline" className="rounded-2xl h-12 px-8 border-border font-black uppercase text-[10px] tracking-widest bg-background">
                            View All Archive
                        </Button>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: "Cluster Reorganization", date: "Jan 01, 2026", type: "Admin" },
                            { title: "Missions Fund Goal Reached", date: "Dec 28, 2025", type: "News" },
                            { title: "New Cell Network Opening", date: "Dec 20, 2025", type: "Community" }
                        ].map((post, i) => (
                            <div key={i} className="p-8 rounded-[2rem] bg-card border border-border space-y-4 hover:border-rose-500/30 hover:-translate-y-1 hover:shadow-2xl hover:shadow-rose-500/10 transition-all duration-300 cursor-pointer group">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-rose-500/60">{post.type}</span>
                                    <span className="text-[10px] font-bold text-muted-foreground">{post.date}</span>
                                </div>
                                <h4 className="text-xl font-black uppercase italic tracking-tight leading-none group-hover:text-rose-500 transition-colors">{post.title}</h4>
                                <div className="flex items-center gap-2 text-rose-500 font-black text-[10px] uppercase tracking-widest opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 delay-75">
                                    Read Article <ArrowUpRight className="w-3 h-3" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* SMOOTH TRANSITION TO NEWSLETTER */}
                <div className="absolute bottom-0 left-0 right-0 h-48 bg-linear-to-b from-transparent to-rose-500 z-0 pointer-events-none" />
            </section>

            {/* NEWSLETTER CTA */}
            <section className="py-12 md:py-20 px-4 md:px-8 bg-rose-500 text-white relative">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <Megaphone className="w-12 h-12 mx-auto rotate-[-15deg] opacity-50" />
                    <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">Never Miss a Moment</h2>
                    <p className="font-medium opacity-80 max-w-xl mx-auto">
                        Subscribe to our digital bulletin and receive weekly updates, event invitations, and spiritual encouragement directly to your inbox.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <input
                            type="email"
                            placeholder="your@email.com"
                            className="h-14 px-8 rounded-2xl bg-white/10 border border-white/20 placeholder:text-white/40 focus:outline-none focus:ring-2 ring-white/50 w-full sm:w-96 font-medium"
                        />
                        <Button className="h-14 px-10 rounded-2xl bg-white text-rose-600 font-black uppercase text-[10px] tracking-widest hover:bg-slate-100 transition-all shrink-0">
                            Notify Me
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
