"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    MapPin,
    Search,
    Compass,
    Activity,
    ChevronRight,
    Navigation,
    ExternalLink,
    Filter,
    X,
    Phone,
    Clock,
    Building2,
    Users,
    Menu
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import { DEFAULT_LOCATIONS } from "@/config/locations";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";

// Lazy load the Map component to improve initial page load performance
const Map = dynamic(() => import("@/components/locations/map"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-muted/50 rounded-[2.5rem] flex items-center justify-center border border-border">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Initializing Live Map...</p>
            </div>
        </div>
    )
});

export default function LocationsContent() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeLocationId, setActiveLocationId] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState("All");

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const [view, setView] = useState<"list" | "map">("list");

    // Filter locations based on search and region (Luzon / Visayas / Mindanao)
    const filteredLocations = useMemo(() => {
        return DEFAULT_LOCATIONS.filter(loc => {
            const matchesSearch = loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                loc.district.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = activeCategory === "All" || loc.region === activeCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, activeCategory]);

    const handleLocationSelect = (id: string | null) => {
        setActiveLocationId(id);
        if (id) {
            // On mobile, switch to map view when a location is selected
            setView("map");
            const element = document.getElementById(`location-card-${id}`);
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }
    };

    return (
        <div className="flex h-screen bg-background overflow-hidden pt-16 md:pt-20 relative">
            {/* SIDEBAR */}
            <aside className={cn(
                "w-full md:w-[450px] border-r border-border bg-background flex flex-col z-20 transition-all duration-500",
                view === "map" && "hidden md:flex"
            )}>
                {/* SEARCH & FILTERS HEADER */}
                <div className="p-6 space-y-6 border-b border-border bg-background/50 backdrop-blur-xl">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Search locations..."
                            className="pl-12 h-12 rounded-full bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary/50 transition-all font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-6 border-b border-border overflow-x-auto no-scrollbar pb-px">
                        {["All", "Luzon", "Visayas", "Mindanao", "International"].map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={cn(
                                    "pb-4 text-[10px] font-black uppercase tracking-[0.15em] transition-all relative whitespace-nowrap shrink-0",
                                    activeCategory === category ? "text-primary" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {category}
                                {activeCategory === category && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* LOCATIONS LIST */}
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-background/20">
                    <AnimatePresence mode="popLayout">
                        {filteredLocations.map((loc) => (
                            <motion.div
                                key={loc.id}
                                id={`location-card-${loc.id}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className={cn(
                                    "p-6 cursor-pointer border-b border-border/50 transition-all hover:bg-muted/30",
                                    activeLocationId === loc.id && "bg-primary/5 border-l-4 border-l-primary"
                                )}
                                onClick={() => handleLocationSelect(loc.id)}
                            >
                                <div className="flex justify-between gap-4">
                                    <div className="space-y-2 flex-1">
                                        <h3 className="text-lg font-black uppercase italic tracking-tighter leading-tight">
                                            {loc.name}, {loc.region}
                                        </h3>
                                        <p className="text-[11px] font-medium text-muted-foreground leading-relaxed line-clamp-2">
                                            {loc.address}
                                        </p>
                                        <div className="flex flex-wrap gap-1.5 pt-1">
                                            {loc.serviceTimes.map((time, idx) => (
                                                <span key={idx} className="text-[9px] font-bold text-foreground bg-primary/5 px-2 py-0.5 rounded-md">
                                                    {time}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-lg ring-1 ring-border group/img shrink-0">
                                        <Image
                                            src={loc.thumbnail}
                                            alt={loc.name}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover/img:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                                            <MapPin className="w-5 h-5 text-white" />
                                        </div>
                                    </div>
                                </div>

                                {activeLocationId === loc.id && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        className="pt-6"
                                    >
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                className="h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex-1"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    window.open(loc.googleMapsLink || `https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`, "_blank");
                                                }}
                                            >
                                                Get Directions
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="h-9 w-9 rounded-xl p-0"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    window.open(`tel:${loc.phone}`, "_self");
                                                }}
                                            >
                                                <Phone className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </aside>

            {/* MAP VIEW */}
            <main className={cn(
                "flex-1 relative bg-muted/20 transition-all duration-500",
                view === "list" && "hidden md:block"
            )}>
                <Map
                    locations={filteredLocations}
                    activeLocationId={activeLocationId}
                    onLocationSelect={handleLocationSelect}
                    view={view}
                />
            </main>

            {/* MOBILE VIEW TOGGLE FAB */}
            <div className="fixed bottom-[100px] right-6 md:hidden z-50">
                <Button
                    onClick={() => setView(view === "list" ? "map" : "list")}
                    className="h-12 px-6 rounded-full bg-foreground text-background shadow-2xl flex items-center gap-3 border border-border/50 backdrop-blur-xl group active:scale-95 transition-all"
                >
                    {view === "list" ? (
                        <>
                            <MapPin className="w-4 h-4 text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Show Map</span>
                        </>
                    ) : (
                        <>
                            <Menu className="w-4 h-4 text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Show List</span>
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
