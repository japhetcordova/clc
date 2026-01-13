import { motion } from "framer-motion";
import {
    BookOpen,
    Calendar,
    Share2,
    Play,
    Pause,
    Volume2,
    Download,
    Mail,
    Facebook,
    Instagram,
    Youtube,
    Rss,
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Quote,
    Music,
    Globe,
    MessageCircle,
    Copy,
    Heart,
    X
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { getVOTD } from "@/lib/votd";
import { getPreviousDevotionals } from "@/lib/votd-archive";
import VOTDClient from "./votd-client";


export const revalidate = 3600; // Revalidate every hour

export default async function VOTDPage() {
    // Fetch data on the server
    const [data, previousDevotionals] = await Promise.all([
        getVOTD(),
        getPreviousDevotionals(7)
    ]);

    return (
        <div className="min-h-screen pt-24 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary">
                            <BookOpen className="w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Daily Inspiration</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground uppercase italic leading-none">
                            Verse of the <span className="text-primary">Day</span>
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary" />
                                <p className="font-bold uppercase tracking-widest text-xs italic">{data?.fullDate}</p>
                            </div>
                            <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-1 group">
                                Previous Devotionals
                                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* MAIN CONTENT */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* VERSE CARD */}
                        <div className="relative">
                            <div className="absolute -inset-4 bg-primary/20 blur-3xl opacity-20 -z-10 animate-pulse" />
                            <Card className="bg-background/40 backdrop-blur-3xl border-primary/20 shadow-2xl rounded-[3rem] overflow-hidden group">
                                <CardContent className="p-8 md:p-16 space-y-10">
                                    <div className="absolute top-10 right-10 text-primary/10 group-hover:text-primary/20 transition-colors hidden md:block">
                                        <Quote className="w-24 h-24 rotate-180" />
                                    </div>

                                    <blockquote className="space-y-10 relative z-10">
                                        <p className="text-3xl md:text-5xl font-black italic uppercase tracking-tight leading-[1] text-foreground">
                                            "{data?.text}"
                                        </p>
                                        <footer className="flex items-center gap-6">
                                            <div className="h-px w-16 bg-primary" />
                                            <div className="space-y-1">
                                                <cite className="text-xl md:text-2xl font-black uppercase tracking-widest text-primary not-italic">
                                                    {data?.reference}
                                                </cite>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">{data?.version}</p>
                                            </div>
                                        </footer>
                                    </blockquote>

                                    <VOTDClient
                                        verseText={data?.text || ""}
                                        reference={data?.reference || ""}
                                        audioUrl={data?.audioUrl}
                                    />
                                </CardContent>
                            </Card>
                        </div>

                        {/* AUDIO PLAYER SECTION */}
                        <section className="bg-muted/30 border border-border/50 rounded-[2.5rem] p-8 md:p-10">
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                <div className="p-6 bg-primary/10 rounded-3xl text-primary animate-pulse">
                                    <Music className="w-8 h-8" />
                                </div>
                                <div className="flex-1 space-y-4 w-full">
                                    <h3 className="font-black uppercase italic tracking-tighter text-xl text-center md:text-left">Listen to Verse of the Day</h3>
                                    <VOTDClient
                                        verseText={data?.text || ""}
                                        reference={data?.reference || ""}
                                        audioUrl={data?.audioUrl}
                                    />
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center md:text-left">Audio is provided by BibleGateway. Click play to listen.</p>
                                </div>
                            </div>
                        </section>

                        {/* DEVOTIONAL CONTENT */}
                        <div className="grid md:grid-cols-2 gap-12">
                            <section className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-8 bg-primary rounded-full" />
                                    <h2 className="text-3xl font-black uppercase italic tracking-tighter">Thoughts on <span className="text-primary">Today's Verse</span></h2>
                                </div>
                                <div className="space-y-4 text-muted-foreground leading-relaxed font-medium">
                                    {data?.thoughts.split('\n').filter((p: string) => p.trim()).map((para: string, i: number) => (
                                        <p key={i}>{para}</p>
                                    ))}
                                </div>
                            </section>

                            <section className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-8 bg-rose-500 rounded-full" />
                                    <h2 className="text-3xl font-black uppercase italic tracking-tighter">My <span className="text-rose-500">Prayer</span></h2>
                                </div>
                                <div className="p-8 bg-rose-500/5 border border-rose-500/10 rounded-[2rem] space-y-4 text-muted-foreground leading-relaxed font-medium italic relative overflow-hidden">
                                    <div className="absolute -top-4 -right-4 text-rose-500/10">
                                        <Heart className="w-24 h-24" />
                                    </div>
                                    {data?.prayer.split('\n').filter((p: string) => p.trim()).map((para: string, i: number) => (
                                        <p key={i} className="relative z-10">{para}</p>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>

                    {/* SIDEBAR */}
                    <div className="space-y-12">
                        {/* SUBSCRIBE CARD */}
                        <section>
                            <Card className="bg-card/50 border-border/50 rounded-[2.5rem] overflow-hidden shadow-xl">
                                <CardContent className="p-8 md:p-10 space-y-8">
                                    <h3 className="text-2xl font-black uppercase italic tracking-tighter border-b border-border/50 pb-4">Subscribe</h3>
                                    <div className="space-y-4">
                                        {[
                                            { icon: Mail, label: "Subscribe by Email", color: "text-blue-500", href: "mailto:hello@clctagum.org" },
                                            { icon: Facebook, label: "Facebook", color: "text-blue-600", href: "https://www.facebook.com/clctagum" },
                                            { icon: Instagram, label: "Instagram", color: "text-rose-500", href: "https://www.instagram.com/clctagum" },
                                            { icon: Youtube, label: "YouTube", color: "text-red-500", href: "https://www.youtube.com/@clctagum" },
                                        ].map((item, i) => (
                                            <Link key={i} href={item.href} target={item.href.startsWith('http') ? "_blank" : undefined} rel={item.href.startsWith('http') ? "noopener noreferrer" : undefined}>
                                                <Button
                                                    variant="ghost"
                                                    className="w-full justify-start gap-4 h-12 rounded-2xl hover:bg-muted hover:text-foreground transition-all group px-4"
                                                >
                                                    <item.icon className={`w-5 h-5 ${item.color} group-hover:scale-110 transition-transform shrink-0`} />
                                                    <span className="font-bold uppercase tracking-widest text-[10px] truncate">{item.label}</span>
                                                </Button>
                                            </Link>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </section>

                        {/* PREVIOUS DEVOTIONALS */}
                        <section className="space-y-6">
                            <h3 className="text-2xl font-black uppercase italic tracking-tighter border-b border-border/50 pb-4">Previous Devotionals</h3>
                            <div className="space-y-4">
                                {previousDevotionals.slice(0, 3).map((devotional) => (
                                    <Link
                                        key={devotional.dateKey}
                                        href={`/word/${devotional.dateKey}`}
                                        className="group cursor-pointer p-6 rounded-3xl bg-muted/30 border border-border/50 hover:border-primary/50 hover:bg-muted/50 transition-all flex items-center justify-between"
                                    >
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase text-primary tracking-widest">{devotional.shortDate}</p>
                                            <h4 className="font-bold uppercase italic tracking-tight text-sm">
                                                {devotional.dayOfWeek}'s Devotional
                                            </h4>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                    </Link>
                                ))}
                                <Link href="/word/archive">
                                    <Button variant="ghost" className="w-full gap-2 font-black uppercase text-[10px] tracking-widest text-primary hover:bg-primary/5 rounded-2xl h-12">
                                        Browse by Date
                                        <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </Link>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
