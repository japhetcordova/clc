"use client";

import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import {
    Heart,
    Music,
    Video,
    Shield,
    Clapperboard,
    Baby,
    Mic2,
    Settings,
    DollarSign,
    Sparkles,
    PenTool,
    Speech,
    ArrowRight,
    Star,
    Search,
    ChevronRight,
    CheckCircle2,
    HandHeart,
    Wrench,
    X,
} from "lucide-react";
import Link from "next/link";
import { useState, useMemo, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DEFAULT_MINISTRIES } from "@/config/ministries";
import { Drawer, DrawerContent, DrawerTrigger, DrawerClose } from "@/components/ui/drawer";
import useMediaQuery from "@/hooks/use-media-query";

export default function MinistriesPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeMinistryId, setActiveMinistryId] = useState<string | null>(DEFAULT_MINISTRIES[0].id);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const isDesktop = useMediaQuery("(min-width: 1024px)");

    // Mapping icons to ministry names
    const ministryIcons: Record<string, React.ReactNode> = {
        "Worship Team": <Music />,
        "Media": <Video />,
        "Usher": <HandHeart />,
        "Marshal": <Shield />,
        "Production": <Clapperboard />,
        "Kid's Church": <Baby />,
        "Technical": <Settings />,
        "PA": <Mic2 />,
        "Finance": <DollarSign />,
        "Arete": <Sparkles />,
        "Hosting": <Speech />,
        "Writer": <PenTool />,
        "General Services": <Wrench />
    };

    const ministryColors: Record<string, string> = {
        "Worship Team": "text-primary bg-primary/10 border-primary/20",
        "Media": "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
        "Usher": "text-rose-500 bg-rose-500/10 border-rose-500/20",
        "Marshal": "text-amber-500 bg-amber-500/10 border-amber-500/20",
        "Production": "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
        "Kid's Church": "text-sky-500 bg-sky-500/10 border-sky-500/20",
        "Technical": "text-slate-500 bg-slate-500/10 border-slate-500/20",
        "PA": "text-orange-500 bg-orange-500/10 border-orange-500/20",
        "Finance": "text-green-600 bg-green-500/10 border-green-500/20",
        "Arete": "text-purple-500 bg-purple-500/10 border-purple-500/20",
        "Hosting": "text-pink-500 bg-pink-500/10 border-pink-500/20",
        "Writer": "text-cyan-500 bg-cyan-500/10 border-cyan-500/20",
        "General Services": "text-gray-500 bg-gray-500/10 border-gray-500/20"
    };

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    // Filter ministries based on search
    const filteredMinistries = useMemo(() => {
        return DEFAULT_MINISTRIES.filter(min =>
            min.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            min.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            min.roleDescription.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    const activeMinistry = DEFAULT_MINISTRIES.find(m => m.id === activeMinistryId);

    const handleMinistryClick = (id: string) => {
        setActiveMinistryId(id);
        if (!isDesktop) {
            setIsDrawerOpen(true);
        }
    };

    const MinistryDetails = ({ ministry }: { ministry: typeof DEFAULT_MINISTRIES[0] }) => (
        <div className="bg-card/50 backdrop-blur-xl border border-border lg:rounded-[2.5rem] rounded-t-[2.5rem] overflow-hidden shadow-2xl h-full lg:h-auto flex flex-col">
            <div className="relative h-48 sm:h-64 lg:h-48 bg-muted/30 overflow-hidden flex items-center justify-center shrink-0">
                <div className={`absolute inset-0 opacity-20 ${ministryColors[ministry.name]?.split(' ')[1] || "bg-primary/10"}`} />
                <div className="absolute inset-0 bg-linear-to-b from-transparent to-card/50" />
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className={cn("p-8 sm:p-10 rounded-full bg-background border-4 shadow-2xl relative z-10", ministryColors[ministry.name])}
                >
                    <div className="[&>svg]:w-10 [&>svg]:h-10 sm:[&>svg]:w-14 sm:[&>svg]:h-14 lg:[&>svg]:w-12 lg:[&>svg]:h-12">
                        {ministryIcons[ministry.name] || <Heart />}
                    </div>
                </motion.div>
                {!isDesktop && (
                    <DrawerClose className="absolute top-6 right-6 p-2 bg-background/50 backdrop-blur-md rounded-full hover:bg-background transition-all z-20 active:scale-90 border border-border">
                        <X className="w-5 h-5 text-muted-foreground" />
                    </DrawerClose>
                )}
            </div>

            <div className="p-6 sm:p-10 lg:p-12 space-y-8 overflow-y-auto flex-1 custom-scrollbar">
                <div className="text-center space-y-3">
                    <h2 className="text-3xl sm:text-5xl font-black uppercase italic tracking-tighter text-foreground leading-none">
                        {ministry.name}
                    </h2>
                    <p className="text-sm sm:text-lg text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
                        {ministry.description}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-border/50">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                <Star className="w-3.5 h-3.5" />
                            </div>
                            <h3 className="text-[11px] font-black uppercase tracking-widest text-primary">The Role</h3>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {ministry.roleDescription}
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                            </div>
                            <h3 className="text-[11px] font-black uppercase tracking-widest text-emerald-600">Responsibilities</h3>
                        </div>
                        <ul className="space-y-3">
                            {ministry.responsibilities.map((resp, idx) => (
                                <li key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-muted/40 border border-border/50 group hover:border-primary/20 transition-all">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0 group-hover:scale-125 transition-transform" />
                                    <span className="text-xs text-muted-foreground font-medium leading-relaxed">{resp}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="pt-6 flex justify-center pb-8 lg:pb-0">
                    <Link href="/registration" className="w-full sm:w-auto">
                        <Button className="w-full sm:w-auto h-14 px-8 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 text-sm font-black uppercase tracking-widest transition-all shadow-xl active:scale-[0.98] group">
                            Join the {ministry.name}
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col min-h-screen bg-background relative selection:bg-primary/20">
            {/* HEADER SECTION */}
            <section className="relative pt-40 pb-12 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div {...fadeIn} className="text-center space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md mb-2">
                            <Star className="w-3.5 h-3.5 text-primary animate-pulse" />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Explore Your Purpose</span>
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.9] mb-2">
                            Discover <span className="text-primary underline decoration-primary/20 underline-offset-8">Ministries</span>
                        </h1>
                        <p className="max-w-xl mx-auto text-muted-foreground font-medium text-base md:text-xl leading-relaxed px-4">
                            Find the perfect team to use your God-given talents.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* MAIN CONTENT AREA */}
            <section className="pb-32 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 uppercase">

                    {/* DESKTOP VIEW: MASTER-DETAIL */}
                    {isDesktop ? (
                        <div className="grid lg:grid-cols-12 gap-12">
                            {/* LEFT LIST */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="lg:col-span-4 space-y-6"
                            >
                                <div className="sticky top-28 space-y-6">
                                    <div className="relative group">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search ministries..."
                                            className="pl-12 pr-12 h-14 rounded-2xl bg-card border-border focus:ring-primary/20"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                    <div className="h-[calc(100vh-420px)] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                                        {filteredMinistries.map((ministry) => (
                                            <Card
                                                key={ministry.id}
                                                className={cn(
                                                    "cursor-pointer transition-all active:scale-95",
                                                    activeMinistryId === ministry.id ? "ring-2 ring-primary bg-primary/5" : "bg-card/50"
                                                )}
                                                onClick={() => setActiveMinistryId(ministry.id)}
                                            >
                                                <CardContent className="p-4 flex items-center gap-4">
                                                    <div className={cn("p-4 rounded-2xl shadow-sm", ministryColors[ministry.name])}>
                                                        <div className="[&>svg]:w-6 [&>svg]:h-6">
                                                            {ministryIcons[ministry.name]}
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-black italic truncate">{ministry.name}</h3>
                                                        <p className="text-[10px] text-muted-foreground truncate opacity-70 font-bold">{ministry.description}</p>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>

                            {/* RIGHT DETAIL */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="lg:col-span-8 flex flex-col justify-start sticky top-28 h-fit"
                            >
                                <AnimatePresence mode="wait">
                                    {activeMinistry && (
                                        <motion.div
                                            key={activeMinistry.id}
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 1.02 }}
                                        >
                                            <MinistryDetails ministry={activeMinistry} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </div>
                    ) : (
                        /* MOBILE VIEW: APP-LIKE CARD SLIDER */
                        <div className="space-y-10">
                            {/* SEARCH BAR (STICKY BELOW NAV) */}
                            <div className="sticky top-[80px] z-40 -mx-4 px-4 py-4 bg-background/80 backdrop-blur-xl border-b border-border/50">
                                <div className="relative group">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search ministries..."
                                        className="pl-12 h-14 rounded-2xl bg-card border-border shadow-md text-sm"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* HORIZONTAL CAROUSEL */}
                            <div className="relative -mx-4 overflow-hidden pt-4 pb-8">
                                <motion.div
                                    className="flex px-4 gap-4 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-10"
                                    style={{ touchAction: "pan-x" }}
                                >
                                    {filteredMinistries.length > 0 ? (
                                        filteredMinistries.map((ministry) => (
                                            <motion.div
                                                key={ministry.id}
                                                className="snap-center shrink-0 w-[85vw] max-w-[340px]"
                                            >
                                                <Card
                                                    className="h-[460px] relative overflow-hidden bg-card border-border shadow-2xl flex flex-col rounded-[3rem] active:scale-[0.98] transition-transform"
                                                    onClick={() => handleMinistryClick(ministry.id)}
                                                >
                                                    {/* CARD BACKGROUND DECOR */}
                                                    <div className={cn("absolute top-0 right-0 w-32 h-32 rounded-bl-[5rem] opacity-20", ministryColors[ministry.name]?.split(' ')[1])} />

                                                    <CardContent className="p-8 flex flex-col h-full">
                                                        <div className={cn("w-20 h-20 rounded-3xl flex items-center justify-center mb-8 shadow-xl", ministryColors[ministry.name])}>
                                                            <div className="[&>svg]:w-10 [&>svg]:h-10">
                                                                {ministryIcons[ministry.name]}
                                                            </div>
                                                        </div>

                                                        <div className="space-y-4 mb-auto">
                                                            <h3 className="text-4xl font-black leading-none italic tracking-tighter">
                                                                {ministry.name}
                                                            </h3>
                                                            <p className="text-sm text-muted-foreground font-bold leading-relaxed opacity-80 line-clamp-4">
                                                                {ministry.description}
                                                            </p>
                                                        </div>

                                                        <div className="pt-8 flex flex-col gap-3">
                                                            <div className="flex items-center gap-2 text-[10px] font-black text-primary opacity-60">
                                                                <Star className="w-3 h-3" />
                                                                Swipe for more
                                                            </div>
                                                            <Button className="h-14 rounded-2xl bg-primary text-white font-black uppercase text-xs tracking-widest group">
                                                                Learn More
                                                                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                            </Button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <div className="w-full text-center py-20 px-10">
                                            <p className="text-muted-foreground font-black italic">No matches found</p>
                                        </div>
                                    )}
                                </motion.div>

                                {/* SLIDER INDICATOR */}
                                <div className="flex justify-center gap-1.5 mt-2">
                                    {filteredMinistries.slice(0, 5).map((_, i) => (
                                        <div key={i} className={cn("h-1 rounded-full transition-all", i === 0 ? "w-8 bg-primary" : "w-2 bg-muted")} />
                                    ))}
                                </div>
                            </div>

                            {/* JOIN BANNER MOBILE */}
                            <div className="px-4">
                                <div className="p-8 rounded-[3rem] bg-slate-900 border border-white/5 relative overflow-hidden shadow-2xl">
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                                    <div className="relative z-10 space-y-4">
                                        <h4 className="text-3xl font-black text-white italic tracking-tighter leading-none">Ready to serve?</h4>
                                        <p className="text-sm text-slate-400 font-bold">Join over 200+ volunteers making a difference every week.</p>
                                        <Link href="/registration" className="block pt-4">
                                            <Button className="w-full h-16 rounded-2xl bg-primary text-white font-black uppercase text-lg italic shadow-lg shadow-primary/20">
                                                Register Now
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* DRAWER FOR MOBILE DETAILS */}
                {!isDesktop && (
                    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                        <DrawerContent className="h-[96vh] p-0 rounded-t-[3rem] border-none bg-background">
                            <div className="mx-auto mt-5 h-1.5 w-[80px] rounded-full bg-muted/80 shrink-0" />
                            <div className="h-full mt-2 overflow-hidden uppercase">
                                {activeMinistry && <MinistryDetails ministry={activeMinistry} />}
                            </div>
                        </DrawerContent>
                    </Drawer>
                )}
            </section>
        </div>
    );
}
