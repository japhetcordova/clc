"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
    Image as ImageIcon,
    Calendar as CalendarIcon,
    ChevronDown,
    Share2,
    Download,
    Facebook,
    Twitter,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { MONTHLY_HIGHLIGHTS, type Highlight } from "@/config/highlights";

export default function HighlightsPage() {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState<Highlight | null>(null);

    const filteredHighlights = MONTHLY_HIGHLIGHTS.filter((h: Highlight) => {
        const targetMonth = selectedDate?.toLocaleString('default', { month: 'short', year: 'numeric' });
        return targetMonth === h.month;
    });

    const currentMonthLabel = selectedDate?.toLocaleString('default', { month: 'long', year: 'numeric' });

    return (
        <div className="pt-24 pb-20 px-4 md:px-8 max-w-7x1 mx-auto min-h-screen">
            {/* HEADER */}
            <div className="mb-16 text-center">
                <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-4">
                    Monthly Highlights
                </h1>
                <p className="text-muted-foreground uppercase tracking-widest text-xs font-medium">
                    Relive the moments that defined our journey
                </p>
            </div>

            <div className="space-y-12">
                {/* ACTIONS & INFO BAR */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-border/50">
                    <div className="flex items-center gap-6">
                        <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                            <ImageIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold uppercase tracking-tighter leading-none">
                                {currentMonthLabel?.split(' ')[0]}
                                <span className="text-primary ml-2">{currentMonthLabel?.split(' ')[1]}</span>
                            </h2>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mt-1 font-bold">
                                {filteredHighlights.length} Moments Captured
                            </p>
                        </div>
                    </div>

                    <Dialog open={isSelectorOpen} onOpenChange={setIsSelectorOpen}>
                        <DialogTrigger asChild>
                            <Button
                                className="h-14 px-8 rounded-2xl bg-card border border-border hover:border-primary/50 text-foreground text-[11px] font-black uppercase tracking-widest transition-all group shadow-xl"
                            >
                                <CalendarIcon className="mr-3 w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                                Choose Month
                                <ChevronDown className="ml-3 w-4 h-4 opacity-50" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[450px] rounded-[2.5rem] p-8 border-primary/10 glass-premium">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                                    <div className="p-2 bg-primary/20 rounded-lg text-primary">
                                        <CalendarIcon className="w-5 h-5" />
                                    </div>
                                    Select Timeline
                                </DialogTitle>
                            </DialogHeader>
                            <div className="grid grid-cols-3 gap-3 py-8">
                                {Array.from({ length: 12 }).map((_, i) => {
                                    const date = new Date(2026, i, 1);
                                    const monthName = date.toLocaleString('default', { month: 'short' });
                                    const isSelected = selectedDate?.getMonth() === i;

                                    return (
                                        <button
                                            key={i}
                                            onClick={() => {
                                                setSelectedDate(date);
                                                setIsSelectorOpen(false);
                                            }}
                                            className={cn(
                                                "py-5 rounded-2xl border text-[11px] font-black uppercase tracking-widest transition-all relative group overflow-hidden",
                                                isSelected
                                                    ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20"
                                                    : "bg-background/50 border-border text-foreground/70 hover:text-foreground hover:border-primary/30 hover:bg-muted"
                                            )}
                                        >
                                            <span className="relative z-10">{monthName}</span>
                                            {isSelected && (
                                                <motion.div
                                                    layoutId="activeMonth"
                                                    className="absolute inset-0 bg-primary/20 z-0"
                                                />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="pt-4 border-t border-border/50 text-center">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">
                                    Archive Year: 2026
                                </p>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* FULL WIDTH GALLERY */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
                    <AnimatePresence mode="popLayout">
                        {filteredHighlights.length > 0 ? (
                            filteredHighlights.map((item: Highlight, idx: number) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="group relative h-[30rem] sm:h-96 md:h-80 rounded-xs overflow-hidden shadow-2xl bg-muted cursor-zoom-in"
                                    onClick={() => setSelectedPhoto(item)}
                                >
                                    <Image
                                        src={item.image}
                                        alt="Monthly Highlight"
                                        fill
                                        className="object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-1"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </motion.div>
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="col-span-full h-96 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-[3rem] glass-premium shadow-2xl"
                            >
                                <div className="p-6 bg-muted/50 rounded-full mb-6">
                                    <ImageIcon className="w-16 h-16 opacity-10" />
                                </div>
                                <h3 className="text-xl font-black uppercase tracking-tighter mb-2 text-foreground">No Memories Found</h3>
                                <p className="uppercase tracking-[0.2em] text-[10px] font-black opacity-80 text-foreground">We are still capturing moments for this period</p>
                                <Button
                                    variant="outline"
                                    className="mt-8 rounded-full px-8 text-primary uppercase tracking-widest text-xs font-black border-primary/20 hover:bg-primary/5 shadow-xl"
                                    onClick={() => {
                                        setSelectedDate(new Date(2026, 1, 1));
                                    }}
                                >
                                    View Latest: Feb 2026
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* LIGHTBOX DIALOG */}
            <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && setSelectedPhoto(null)}>
                <DialogContent className="max-w-[95vw] md:max-w-[80vw] h-[90vh] p-0 border-none bg-black/95 overflow-hidden rounded-[2rem]">
                    <DialogTitle className="sr-only">Photo Lightbox</DialogTitle>
                    <DialogDescription className="sr-only">Full size view of monthly highlight</DialogDescription>
                    {selectedPhoto && (
                        <div className="relative w-full h-full flex flex-col">
                            <div className="flex-1 relative">
                                <Image
                                    src={selectedPhoto.image}
                                    alt="Full Size Highlight"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>

                            {/* OVERLAY ACTION BAR */}
                            <div className="absolute top-0 inset-x-0 p-6 flex justify-between items-start pointer-events-none">
                                <div className="pointer-events-auto">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setSelectedPhoto(null)}
                                        className="h-12 w-12 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/10 hover:bg-white/20 transition-all shadow-2xl"
                                    >
                                        <X className="w-6 h-6" />
                                    </Button>
                                </div>

                                <div className="flex flex-col gap-3 pointer-events-auto">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(selectedPhoto.image)}`, '_blank')}
                                        className="h-11 w-11 rounded-full bg-blue-600 text-white hover:bg-blue-700 shadow-xl transition-all"
                                    >
                                        <Facebook className="w-5 h-5" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(selectedPhoto.image)}`, '_blank')}
                                        className="h-11 w-11 rounded-full bg-slate-900 text-white hover:bg-slate-800 shadow-xl transition-all"
                                    >
                                        <Twitter className="w-5 h-5" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={async () => {
                                            const res = await fetch(selectedPhoto.image);
                                            const blob = await res.blob();
                                            const url = window.URL.createObjectURL(blob);
                                            const a = document.createElement('a');
                                            a.href = url;
                                            a.download = `clc-highlight-${selectedPhoto.id}.jpg`;
                                            a.click();
                                        }}
                                        className="h-11 w-11 rounded-full bg-primary text-white hover:bg-primary/90 shadow-xl transition-all"
                                    >
                                        <Download className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>

                            <div className="p-8 bg-linear-to-t from-black via-black/80 to-transparent">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/20 rounded-lg text-primary">
                                        <ImageIcon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Official Highlight</p>
                                        <p className="text-white/60 text-xs font-medium uppercase tracking-widest">{selectedPhoto.month}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
