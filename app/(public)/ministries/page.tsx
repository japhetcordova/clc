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
    ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
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
    const [activeCategory, setActiveCategory] = useState("All");

    const categories = ["All", "Creative", "Hospitality", "Technical", "Operations", "Family"];

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    // Filter ministries based on search and category
    const filteredMinistries = useMemo(() => {
        return DEFAULT_MINISTRIES.filter(min => {
            const matchesSearch = min.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                min.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = activeCategory === "All" || min.category === activeCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, activeCategory]);

    const activeMinistry = DEFAULT_MINISTRIES.find(m => m.id === activeMinistryId);

    const handleMinistrySelect = (id: string | null) => {
        setActiveMinistryId(id);
        if (id) {
            const element = document.getElementById(`ministry-card-${id}`);
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }
    };

    return (
        <div className="flex h-screen bg-background overflow-hidden pt-16 md:pt-20">
            {/* SIDEBAR - Hidden on mobile when a ministry is selected */}
            <aside className={cn(
                "w-full lg:w-[450px] border-r border-border bg-background flex flex-col z-20 transition-all duration-500",
                activeMinistryId && "hidden lg:flex"
            )}>
                {/* SEARCH & FILTERS HEADER */}
                <div className="p-6 space-y-6 border-b border-border relative overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="/bg/ministries.png"
                            alt="Ministries Background"
                            fill
                            className="object-cover opacity-10 scale-105"
                            priority
                        />
                        <div className="absolute inset-0 bg-linear-to-b from-background/80 via-background to-background" />
                    </div>
                    <div className="relative z-10 space-y-6">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Search ministries..."
                                className="pl-12 h-12 rounded-full bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary/50 transition-all font-medium"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-6 overflow-x-auto pb-2 custom-scrollbar-horizontal scrollbar-hide">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={cn(
                                        "whitespace-nowrap pb-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative shrink-0",
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
                </div>

                {/* MINISTRIES LIST */}
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-background/20">
                    <AnimatePresence mode="popLayout">
                        {filteredMinistries.map((min) => (
                            <motion.div
                                key={min.id}
                                id={`ministry-card-${min.id}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className={cn(
                                    "p-6 cursor-pointer border-b border-border/50 transition-all hover:bg-muted/30",
                                    activeMinistryId === min.id && "bg-primary/5 border-l-4 border-l-primary"
                                )}
                                onClick={() => handleMinistrySelect(min.id)}
                            >
                                <div className="flex justify-between gap-4">
                                    <div className="space-y-2 flex-1">
                                        <h3 className="text-lg font-black uppercase italic tracking-tighter leading-tight">
                                            {min.name}
                                        </h3>
                                        <p className="text-[11px] font-medium text-muted-foreground leading-relaxed line-clamp-2">
                                            {min.description}
                                        </p>
                                        <div className="flex items-center gap-2 pt-1">
                                            <span className="text-[9px] font-black text-primary uppercase tracking-widest opacity-80">
                                                {min.category}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-lg ring-1 ring-border group/img shrink-0">
                                        <Image
                                            src={min.thumbnail}
                                            alt={min.name}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover/img:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                                            <Star className="w-5 h-5 text-white" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </aside>

            {/* DETAIL VIEW - Hidden on mobile when no ministry is selected */}
            <main className={cn(
                "flex-1 relative bg-muted/5 overflow-y-auto custom-scrollbar transition-all duration-500",
                !activeMinistryId && "hidden lg:block"
            )}>
                <AnimatePresence mode="wait">
                    {activeMinistry ? (
                        <motion.div
                            key={activeMinistry.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4 }}
                            className="max-w-4xl mx-auto p-6 md:p-16"
                        >
                            {/* MOBILE BACK BUTTON */}
                            <button
                                onClick={() => setActiveMinistryId(null)}
                                className="lg:hidden flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-8 hover:text-primary transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Back to Ministries
                            </button>

                            <div className="space-y-12">
                                {/* HERO HEADER */}
                                <div className="space-y-8">
                                    <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl ring-1 ring-border">
                                        <Image
                                            src={activeMinistry.thumbnail}
                                            alt={activeMinistry.name}
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent flex items-end p-6 md:p-12">
                                            <div className="space-y-2">
                                                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-primary bg-primary/10 px-4 py-1.5 rounded-full backdrop-blur-md border border-primary/20">
                                                    {activeMinistry.category} Department
                                                </span>
                                                <h2 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter text-white leading-none">
                                                    {activeMinistry.name}
                                                </h2>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <p className="text-lg md:text-2xl text-muted-foreground font-medium leading-relaxed italic">
                                            "{activeMinistry.description}"
                                        </p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-12 pt-12 border-t border-border">
                                    {/* THE ROLE */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                                <Sparkles className="w-5 h-5" />
                                            </div>
                                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-foreground">The Purpose</h3>
                                        </div>
                                        <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                                            {activeMinistry.roleDescription}
                                        </p>
                                    </div>

                                    {/* RESPONSIBILITIES */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                                <CheckCircle2 className="w-5 h-5" />
                                            </div>
                                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-foreground">What You'll Do</h3>
                                        </div>
                                        <ul className="space-y-3">
                                            {activeMinistry.responsibilities.map((resp, idx) => (
                                                <motion.li
                                                    key={idx}
                                                    initial={{ opacity: 0, x: 10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.1 }}
                                                    className="flex items-center gap-3 p-4 rounded-2xl bg-muted/40 border border-border/50 group hover:border-primary/20 transition-all"
                                                >
                                                    <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                                                    <span className="text-sm font-medium text-foreground/80">{resp}</span>
                                                </motion.li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* CALL TO ACTION */}
                                <div className="pt-8 flex flex-col md:flex-row items-center gap-6">
                                    <Link href="/registration" className="w-full md:w-auto">
                                        <Button className="w-full md:w-auto h-16 px-10 rounded-2xl bg-primary text-white font-black uppercase text-sm tracking-widest shadow-xl shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all group">
                                            Apply for {activeMinistry.name}
                                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                        Join over 200+ volunteers serving weekly
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="h-full flex items-center justify-center">
                            <p className="text-muted-foreground font-black uppercase tracking-widest italic opacity-40">Select a ministry to explore</p>
                        </div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
