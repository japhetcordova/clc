"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar,
    MapPin,
    Clock,
    ChevronRight,
    Search
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ChurchEvent } from "@/db/schema";

interface EventsGridProps {
    initialEvents: ChurchEvent[];
}

export default function EventsGrid({ initialEvents }: EventsGridProps) {
    const [activeTab, setActiveTab] = useState("all");

    const filteredEvents = activeTab === "all"
        ? initialEvents
        : initialEvents.filter(e => e.category === activeTab);

    return (
        <>
            {/* TABS */}
            <div className="flex flex-wrap justify-center gap-3 pt-8 mb-12">
                {["all", "special", "regular", "leadership"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${activeTab === tab
                                ? "bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/20"
                                : "bg-card border-border text-muted-foreground hover:border-rose-500/50"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <AnimatePresence mode="popLayout">
                    {filteredEvents.map((event) => (
                        <motion.div
                            layout
                            key={event.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.4 }}
                            className="group p-8 rounded-[3rem] bg-card border border-border flex flex-col justify-between space-y-8 hover:shadow-2xl hover:border-rose-500/20 transition-all relative overflow-hidden"
                        >
                            <div className="space-y-4 relative z-10">
                                <div className="flex justify-between items-start">
                                    <div className="px-3 py-1 bg-muted rounded-full text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                                        {event.tag}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black italic uppercase tracking-tight text-rose-500">{event.date}</p>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase">{event.time}</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-3xl font-black uppercase italic tracking-tighter group-hover:text-rose-500 transition-colors">
                                        {event.id.length < 5 ? (
                                            /* Handle mock vs real ID length if needed, but usually just display title */
                                            event.title
                                        ) : event.title}
                                    </h3>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <MapPin className="w-3 h-3" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">{event.location}</span>
                                    </div>
                                </div>

                                <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-md line-clamp-2">
                                    {event.description}
                                </p>
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-border relative z-10">
                                <Link href={`/events/${event.id}`}>
                                    <Button variant="ghost" className="p-0 h-auto font-black uppercase text-[10px] tracking-[0.2em] group/btn flex items-center gap-2 hover:bg-transparent text-foreground">
                                        Event Details
                                        <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                                <Button className="rounded-xl h-10 px-6 bg-rose-500 text-white font-black uppercase text-[10px] tracking-widest shadow-lg shadow-rose-500/20">
                                    Add to Calendar
                                </Button>
                            </div>

                            <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-rose-500/5 rounded-full blur-[60px] group-hover:bg-rose-500/10 transition-colors" />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {filteredEvents.length === 0 && (
                <div className="py-24 text-center space-y-4">
                    <Search className="w-12 h-12 text-muted-foreground/30 mx-auto" />
                    <p className="font-black uppercase tracking-widest text-muted-foreground">No events found in this category.</p>
                </div>
            )}
        </>
    );
}
