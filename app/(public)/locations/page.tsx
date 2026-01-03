"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MapPin,
    Navigation,
    Search,
    Clock,
    ChevronRight,
    LocateFixed,
    Activity,
    Compass,
    Info,
    ExternalLink
} from "lucide-react";
import Map from "@/components/locations/map";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { DEFAULT_LOCATIONS, Location } from "@/config/locations";

export default function LocationsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeLocationId, setActiveLocationId] = useState<string | null>(null);
    const [locations, setLocations] = useState<Location[]>(DEFAULT_LOCATIONS);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Simulate real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            setIsRefreshing(true);
            setTimeout(() => {
                setLocations(prev => prev.map(loc => ({
                    ...loc,
                    attendees: loc.attendees + Math.floor(Math.random() * 5) - 2,
                    lastUpdated: "Just now"
                })));
                setIsRefreshing(false);
            }, 1000);
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    const filteredLocations = locations.filter(loc =>
        loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const handleGetDirections = (loc: Location) => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`;
        window.open(url, "_blank");
    };

    return (
        <div className="flex flex-col min-h-screen bg-background relative selection:bg-primary/20">
            {/* DYNAMIC BACKGROUND AURA (Matching Landing) */}
            <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[50%] bg-indigo-500/10 rounded-full blur-[100px]" />
            </div>

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
                                    className="pl-12 h-14 rounded-2xl bg-card/50 backdrop-blur-xl border-border focus:ring-primary/20 focus:border-primary/50 transition-all font-medium"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <AnimatePresence>
                                    {isRefreshing && (
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

                            <div className="space-y-4">
                                <div className="flex items-center justify-between px-2">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Nearby Communities</h3>
                                    <span className="text-[10px] font-bold text-primary/60">{filteredLocations.length} results</span>
                                </div>

                                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                    {filteredLocations.map((loc) => (
                                        <Card
                                            key={loc.id}
                                            onClick={() => setActiveLocationId(loc.id)}
                                            className={`p-6 rounded-[2rem] border-border transition-all cursor-pointer group hover:shadow-xl hover:-translate-y-1 ${activeLocationId === loc.id ? 'bg-primary/5 ring-2 ring-primary/20' : 'bg-card/50 hover:bg-card'}`}
                                        >
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-start">
                                                    <div className="p-3 bg-primary/10 rounded-2xl group-hover:scale-110 transition-transform">
                                                        <MapPin className="w-5 h-5 text-primary" />
                                                    </div>
                                                    <Badge variant="outline" className="rounded-full bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[9px] font-black uppercase tracking-widest">
                                                        {loc.status}
                                                    </Badge>
                                                </div>

                                                <div>
                                                    <h4 className="text-xl font-black uppercase italic tracking-tight leading-none group-hover:text-primary transition-colors">{loc.name}</h4>
                                                    <p className="text-xs text-muted-foreground font-medium mt-1 uppercase tracking-tight">{loc.address}</p>
                                                </div>

                                                <div className="pt-2 flex items-center justify-between border-t border-border/50">
                                                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                                                        <div className="flex items-center gap-1.5">
                                                            <Clock className="w-3 h-3" />
                                                            {loc.lastUpdated}
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <Activity className="w-3 h-3" />
                                                            {loc.attendees} Gathered
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <AnimatePresence>
                                                            {activeLocationId === loc.id && (
                                                                <motion.button
                                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                                    animate={{ opacity: 1, scale: 1 }}
                                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleGetDirections(loc);
                                                                    }}
                                                                    className="p-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                                                                    title="Get Directions"
                                                                >
                                                                    <Navigation className="w-3 h-3" />
                                                                </motion.button>
                                                            )}
                                                        </AnimatePresence>
                                                        <ChevronRight className={`w-4 h-4 transition-all ${activeLocationId === loc.id ? 'translate-x-1 text-primary' : 'text-muted-foreground/30 group-hover:translate-x-1'}`} />
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}

                                    {filteredLocations.length === 0 && (
                                        <div className="py-20 text-center space-y-4 bg-muted/20 rounded-[2rem] border border-dashed border-border">
                                            <Info className="w-10 h-10 text-muted-foreground/30 mx-auto" />
                                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">No locations found matching your search</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* RIGHT PANEL: INTERACTIVE MAP */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="lg:col-span-8 h-[700px] sticky top-28"
                    >
                        <div className="w-full h-full relative">
                            <Map
                                locations={locations as any}
                                activeLocationId={activeLocationId || undefined}
                            />

                            {/* OVERLAY TOOLS */}
                            <div className="absolute top-6 left-6 space-y-2 z-10 pointer-events-none">
                                <div className="pointer-events-auto p-2 bg-card/90 backdrop-blur-xl border border-border rounded-xl shadow-2xl flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Live Updates Active</span>
                                </div>
                            </div>

                            <div className="absolute bottom-10 right-10 flex flex-col gap-3 z-10">
                                <Button
                                    size="icon"
                                    className="w-12 h-12 rounded-2xl bg-primary text-white shadow-2xl hover:scale-110 transition-all"
                                    onClick={() => setActiveLocationId(null)}
                                >
                                    <LocateFixed className="w-5 h-5" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="secondary"
                                    className="w-12 h-12 rounded-2xl bg-card text-muted-foreground shadow-2xl hover:scale-110 transition-all border border-border"
                                >
                                    <Navigation className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* INFO SECTION */}
            <section className="py-24 px-6 bg-muted/20 relative overflow-hidden">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="space-y-6"
                    >
                        <h2 className="text-4xl font-black uppercase italic tracking-tight">Expanding <span className="text-primary font-black italic">Everywhere</span></h2>
                        <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                            Our goal is to bring the Gospel to every corner of the city. If there's no CLC hub in your area, consider joining our digital community or start a cell network.
                        </p>
                        <div className="flex gap-4">
                            <Button className="rounded-2xl h-14 px-8 bg-primary font-black uppercase text-sm tracking-widest shadow-xl shadow-primary/20">
                                Propose a Hub
                            </Button>
                            <Button variant="outline" className="rounded-2xl h-14 px-8 border-border bg-background font-black uppercase text-sm tracking-widest">
                                Learn More
                            </Button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="grid grid-cols-2 gap-4"
                    >
                        <div className="p-8 rounded-[2.5rem] bg-card border border-border space-y-2 text-center">
                            <span className="text-4xl font-black italic text-primary">12+</span>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Active Hubs</p>
                        </div>
                        <div className="p-8 rounded-[2.5rem] bg-card border border-border space-y-2 text-center">
                            <span className="text-4xl font-black italic text-indigo-500">2.5k+</span>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Weekly Visitors</p>
                        </div>
                        <div className="p-8 rounded-[2.5rem] bg-card border border-border space-y-2 text-center">
                            <span className="text-4xl font-black italic text-emerald-500">24/7</span>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Prayer Support</p>
                        </div>
                        <div className="p-8 rounded-[2.5rem] bg-card border border-border space-y-2 text-center">
                            <span className="text-4xl font-black italic text-amber-500">100%</span>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Community Driven</p>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
