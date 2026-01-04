"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    MapPin,
    Search,
    Compass,
    Activity,
    Users,
    ChevronRight,
    Navigation,
    ExternalLink,
    Filter,
    X
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import { DEFAULT_LOCATIONS } from "@/config/locations";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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

export default function LocationsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeLocationId, setActiveLocationId] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [activeCategory, setActiveCategory] = useState("All");

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    // Filter locations based on search and category
    const filteredLocations = useMemo(() => {
        return DEFAULT_LOCATIONS.filter(loc => {
            const matchesSearch = loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                loc.district.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = activeCategory === "All" || loc.type === activeCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, activeCategory]);

    // Update active location when map marker is clicked
    const handleLocationSelect = (id: string | null) => {
        setActiveLocationId(id);
        if (id) {
            // Scroll the selected card into view in the list
            const element = document.getElementById(`location-card-${id}`);
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }
    };

    // Effect to handle "refreshing" animation when searching
    useEffect(() => {
        if (searchQuery) {
            setIsRefreshing(true);
            const timer = setTimeout(() => setIsRefreshing(false), 800);
            return () => clearTimeout(timer);
        }
    }, [searchQuery]);

    const handleGetDirections = (loc: typeof DEFAULT_LOCATIONS[0]) => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`;
        window.open(url, "_blank");
    };

    return (
        <div className="flex flex-col min-h-screen bg-background relative selection:bg-primary/20">
            {/* HEADER SECTION */}
            <section className="relative pt-32 pb-12 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div {...fadeIn} className="text-center space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md mb-4">
                            <Compass className="w-4 h-4 text-primary animate-spin-slow" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Live Presence</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">
                            Our <span className="text-primary underline decoration-primary/20 underline-offset-8">Locations</span>
                        </h1>
                        <p className="max-w-2xl mx-auto text-muted-foreground font-medium text-lg leading-relaxed">
                            Find a CLC community near you. Our real-time map shows active hubs and gathering points across the region.
                        </p>
                    </motion.div>
                </div>
                {/* BOTTOM GRADIENT FADE */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent z-0" />
            </section>

            {/* MAIN CONTENT */}
            <section className="pb-24 px-6">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10">

                    {/* LEFT PANEL: SEARCH & LIST */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="lg:col-span-4 space-y-6"
                    >
                        <div className="sticky top-28 space-y-6">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input
                                    placeholder="Search by district or hub name..."
                                    className="pl-12 pr-12 h-14 rounded-2xl bg-card/50 backdrop-blur-xl border-border focus:ring-primary/20 focus:border-primary/50 transition-all font-medium"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <AnimatePresence>
                                    {searchQuery && (
                                        <motion.button
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            onClick={() => setSearchQuery("")}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-muted rounded-xl transition-all"
                                        >
                                            <span className="text-[10px] font-black uppercase text-muted-foreground">Clear</span>
                                        </motion.button>
                                    )}
                                    {isRefreshing && !searchQuery && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute right-4 top-1/2 -translate-y-1/2"
                                        >
                                            <Activity className="w-4 h-4 text-primary animate-pulse" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {["All", "Headquarters", "Community Center", "Outreach Center", "Small Group Hub"].map((category) => (
                                    <Badge
                                        key={category}
                                        variant={activeCategory === category ? "default" : "outline"}
                                        className={cn(
                                            "cursor-pointer px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                                            activeCategory === category ? "bg-primary border-primary shadow-lg shadow-primary/25" : "hover:bg-muted"
                                        )}
                                        onClick={() => setActiveCategory(category)}
                                    >
                                        {category}
                                    </Badge>
                                ))}
                            </div>

                            <div className="h-[calc(100vh-450px)] min-h-[400px] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                                <AnimatePresence mode="popLayout">
                                    {filteredLocations.length > 0 ? (
                                        filteredLocations.map((loc) => (
                                            <motion.div
                                                key={loc.id}
                                                id={`location-card-${loc.id}`}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                layout
                                            >
                                                <Card
                                                    className={cn(
                                                        "group cursor-pointer border-border hover:border-primary/30 transition-all overflow-hidden",
                                                        activeLocationId === loc.id ? "ring-2 ring-primary border-primary/50 bg-primary/5" : "bg-card/50"
                                                    )}
                                                    onClick={() => setActiveLocationId(loc.id)}
                                                >
                                                    <CardContent className="p-6">
                                                        <div className="flex justify-between items-start gap-4">
                                                            <div className="space-y-2">
                                                                <div className="flex flex-wrap gap-2">
                                                                    <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest bg-background/50">
                                                                        {loc.type}
                                                                    </Badge>
                                                                    {loc.status === "Active" && (
                                                                        <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest text-emerald-500 border-emerald-500/20 bg-emerald-500/5">
                                                                            Live Gathering
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                                <h3 className="text-xl font-black uppercase italic tracking-tighter group-hover:text-primary transition-colors">{loc.name}</h3>
                                                                <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                                                                    <MapPin className="w-3 h-3 text-primary opacity-60" />
                                                                    {loc.district} District
                                                                </p>
                                                            </div>
                                                            <div className="p-2 bg-muted rounded-xl group-hover:bg-primary/10 transition-colors">
                                                                <ChevronRight className={cn("w-5 h-5 transition-transform", activeLocationId === loc.id ? "rotate-90 text-primary" : "text-muted-foreground")} />
                                                            </div>
                                                        </div>

                                                        {activeLocationId === loc.id && (
                                                            <motion.div
                                                                initial={{ opacity: 0, height: 0 }}
                                                                animate={{ opacity: 1, height: "auto" }}
                                                                className="pt-6 mt-6 border-t border-border/50 space-y-4 shadow-[0_-20px_40px_-20px_rgba(0,0,0,0.1)_inset]"
                                                            >
                                                                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                                                    <div className="flex items-center gap-2 text-muted-foreground">
                                                                        <Users className="w-3 h-3" />
                                                                        <span>Est. Attendance: {loc.attendees}</span>
                                                                    </div>
                                                                    <div className="text-primary">{loc.status} Now</div>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <Button
                                                                        className="flex-1 rounded-xl h-10 text-[10px] font-black uppercase tracking-widest bg-primary"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleGetDirections(loc);
                                                                        }}
                                                                    >
                                                                        <Navigation className="w-3 h-3 mr-2" /> Directions
                                                                    </Button>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="icon"
                                                                        className="rounded-xl h-10 w-10 border-border bg-background"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            window.open(`https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}`, "_blank");
                                                                        }}
                                                                    >
                                                                        <ExternalLink className="w-3 h-3" />
                                                                    </Button>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-center py-12 space-y-4"
                                        >
                                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                                                <Search className="w-8 h-8 text-muted-foreground opacity-20" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="font-black uppercase text-xs tracking-widest">No results found</p>
                                                <p className="text-[10px] text-muted-foreground font-medium">Try adjusting your filters or search terms.</p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                className="text-[10px] font-black uppercase tracking-widest text-primary"
                                                onClick={() => {
                                                    setSearchQuery("");
                                                    setActiveCategory("All");
                                                }}
                                            >
                                                Reset All Filters
                                            </Button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>

                    {/* RIGHT PANEL: INTERACTIVE MAP */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="lg:col-span-8 h-[700px] lg:h-[calc(100vh-180px)] sticky top-28"
                    >
                        <Map
                            locations={filteredLocations}
                            activeLocationId={activeLocationId}
                            onLocationSelect={handleLocationSelect}
                        />
                    </motion.div>

                </div>
            </section>

        </div>
    );
}
