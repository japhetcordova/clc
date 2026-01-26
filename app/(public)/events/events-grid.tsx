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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                <AnimatePresence mode="popLayout">
                    {filteredEvents.map((event) => (
                        <motion.div
                            layout
                            key={event.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            whileHover={{ y: -8, transition: { duration: 0.2 } }}
                            transition={{ duration: 0.4 }}
                            className="group p-6 sm:p-8 rounded-[2rem] sm:rounded-[3rem] bg-card border border-border flex flex-col justify-between space-y-6 sm:space-y-8 shadow-lg hover:shadow-2xl hover:shadow-rose-500/10 hover:border-rose-500/20 transition-all relative overflow-hidden"
                        >
                            <div className="space-y-4 relative z-10">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="px-3 py-1 bg-muted rounded-full text-[9px] font-black uppercase tracking-widest text-muted-foreground group-hover:bg-rose-500/10 group-hover:text-rose-500 transition-colors shrink-0">
                                        {event.tag}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[12px] sm:text-sm font-black uppercase tracking-tight text-rose-500 line-clamp-1">
                                            {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                        </p>
                                        <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase">{event.time}</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tighter group-hover:text-rose-500 transition-colors leading-[0.9]">
                                        {event.title}
                                    </h3>
                                    <div className="flex items-center gap-2 text-muted-foreground overflow-hidden">
                                        <MapPin className="w-3 h-3 group-hover:text-rose-500 transition-colors shrink-0" />
                                        {event.googleMapsLink ? (
                                            <a
                                                href={event.googleMapsLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest hover:text-rose-500 hover:underline z-20 relative truncate"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {event.location}
                                            </a>
                                        ) : (
                                            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest truncate">{event.location}</span>
                                        )}
                                    </div>
                                </div>

                                <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed max-w-md line-clamp-2">
                                    {event.description}
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 sm:pt-6 border-t border-border relative z-10 group-hover:border-rose-500/20 transition-colors">
                                <Link href={`/events/${event.id}`} className="w-full sm:w-auto">
                                    <Button variant="ghost" className="w-full sm:w-auto p-0 h-auto font-black uppercase text-[10px] tracking-[0.2em] group/btn flex items-center justify-center sm:justify-start gap-2 hover:bg-transparent text-foreground">
                                        Event Details
                                        <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-full sm:w-auto rounded-xl h-10 px-6 bg-rose-500 text-white font-black uppercase text-[10px] tracking-widest shadow-lg shadow-rose-500/20 hover:bg-rose-600 transition-colors"
                                >
                                    Add to Calendar
                                </motion.button>
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
