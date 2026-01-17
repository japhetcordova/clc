"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from 'embla-carousel-react';

const upcomingEvents = [
    {
        title: "Youth Revival Night",
        date: "Jan 24, 2026",
        time: "6:00 PM",
        location: "Main Sanctuary",
        image: "/events/youth-night.webp",
        tag: "Youth"
    },
    {
        title: "Night of Worship",
        date: "Feb 08, 2026",
        time: "7:00 PM",
        location: "Tagum City Pavilion",
        image: "/events/worship-concert.webp",
        tag: "Concert"
    },
    {
        title: "Grand Family Day",
        date: "Mar 15, 2026",
        time: "8:00 AM",
        location: "Rotary Park",
        image: "/events/family-day.webp",
        tag: "Community"
    },
    {
        title: "Leadership Summit",
        date: "Apr 12, 2026",
        time: "9:00 AM",
        location: "CLC Conference Hall",
        image: "/events/youth-night.webp",
        tag: "Training"
    }
];

export function EventCarousel() {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start', skipSnaps: false });

    useEffect(() => {
        if (emblaApi) {
            const interval = setInterval(() => {
                emblaApi.scrollNext();
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [emblaApi]);

    return (
        <div className="relative z-10 w-full pointer-events-auto pb-8">
            <div className="flex items-center justify-between max-w-7xl mx-auto px-6 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-1px bg-primary/40" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">Upcoming Events</span>
                </div>
                <div className="flex gap-2">
                    <Link href="/events" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline underline-offset-4">
                        View Calendar
                    </Link>
                </div>
            </div>

            <div className="embla overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
                <div className="embla__container flex">
                    {upcomingEvents.map((event, i) => (
                        <div key={i} className="embla__slide flex-[0_0_85%] md:flex-[0_0_40%] lg:flex-[0_0_30%] min-w-0 pl-6 first:pl-6 last:pr-6">
                            <div className="group relative aspect-video md:aspect-[2/1] rounded-3xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-500 hover:border-primary/50">
                                <Image
                                    src={event.image}
                                    alt={event.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />



                                <div className="absolute bottom-6 left-6 right-6 space-y-2">
                                    <h3 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter text-white leading-none group-hover:text-primary transition-colors">
                                        {event.title}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-4 text-white/70">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5 text-primary" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">{event.date}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5 text-primary" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">{event.time}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="w-3.5 h-3.5 text-primary" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider truncate max-w-[120px]">{event.location}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
