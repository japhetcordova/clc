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
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    const data = await getVOTD();

    const verseText = data?.text ? `"${data.text}"` : "Verse of the Day";
    const reference = data?.reference ? ` - ${data.reference}` : "";
    const thoughts = data?.thoughts
        ? data.thoughts.split('\n')[0].replace(/\*/g, '').substring(0, 160) + "..."
        : "Receive daily spiritual nourishment with our Verse of the Day.";

    return {
        title: `${verseText}${reference}`,
        description: thoughts,
        openGraph: {
            images: [
                {
                    url: "/bg/word.webp",
                    width: 1200,
                    height: 630,
                    alt: "Bible - Verse of the Day",
                }
            ],
        },
    };
}


export const revalidate = 3600; // Revalidate every hour

export default async function VOTDPage() {
    // Fetch data on the server
    const [data, previousDevotionals] = await Promise.all([
        getVOTD(),
        getPreviousDevotionals(7)
    ]);

    return (
        <div className="min-h-screen pt-20 pb-10 px-4 md:px-8">
            <div className="max-w-[1920px] mx-auto">
                {/* HEADER */}
                <section className="relative pt-8 pb-12 overflow-hidden mb-8 -mx-4 md:-mx-8 px-4 md:px-8 border-b border-border/50">
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="/bg/word.webp"
                            alt="Word Background"
                            fill
                            className="object-cover opacity-20 scale-105"
                            priority
                        />
                        <div className="absolute inset-0 bg-linear-to-b from-background via-background/80 to-background" />
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-2">
                            <div className="inline-flex items-center md:mt-4 gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary">
                                <BookOpen className="w-4 h-4" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Daily Bread</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground uppercase italic leading-none">
                                Verse of the <span className="text-primary">Day</span>
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-primary" />
                                    <p className="font-bold uppercase tracking-widest text-xs italic">{data?.fullDate}</p>
                                </div>
                                <Link href="/word/archive" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-1 group">
                                    Previous Verse of the Day
                                    <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="grid lg:grid-cols-12 gap-6">
                    {/* MAIN CONTENT */}
                    <div className="lg:col-span-9 space-y-6">
                        {/* VERSE CARD */}
                        <div className="relative">
                            <div className="absolute -inset-4 bg-primary/20 blur-3xl opacity-20 -z-10 animate-pulse" />
                            <Card id="verse-card-content" className="bg-background/40 backdrop-blur-3xl border-primary/20 shadow-2xl rounded-[2.5rem] overflow-hidden group">
                                <CardContent className="p-8 md:p-12 space-y-8">
                                    <div className="absolute top-10 right-10 text-primary/10 group-hover:text-primary/20 transition-colors hidden md:block">
                                        <Quote className="w-24 h-24 rotate-180" />
                                    </div>

                                    <blockquote className="space-y-8 relative z-10">
                                        <p className="text-xl md:text-3xl font-medium italic tracking-tight leading-[1.3] text-foreground">
                                            "{data?.text ? data.text.charAt(0).toUpperCase() + data.text.slice(1) : ''}"
                                        </p>
                                        <footer className="flex items-center gap-6">
                                            <div className="h-px w-16 bg-primary" />
                                            <div className="space-y-1">
                                                <cite className="text-lg md:text-xl font-bold uppercase tracking-widest text-primary not-italic">
                                                    {data?.reference}
                                                </cite>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">{data?.version}</p>
                                            </div>
                                        </footer>
                                    </blockquote>
                                </CardContent>
                            </Card>
                        </div>

                        {/* AUDIO PLAYER SECTION */}
                        <section className="bg-muted/30 border border-border/50 rounded-[2rem] p-6 md:p-8">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <div className="p-4 bg-primary/10 rounded-2xl text-primary animate-pulse">
                                    <Music className="w-6 h-6" />
                                </div>
                                <div className="flex-1 space-y-2 w-full">
                                    <h3 className="font-black uppercase italic tracking-tighter text-lg text-center md:text-left">Listen to Verse of the Day</h3>
                                    <VOTDClient
                                        verseText={data?.text || ""}
                                        reference={data?.reference || ""}
                                        audioUrl={data?.audioUrl}
                                    />
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center md:text-left">Audio is provided by CLCLTAGUM. Click play to listen.</p>
                                </div>
                            </div>
                        </section>

                        {/* DEVOTIONAL CONTENT */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <section className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-6 bg-primary rounded-full" />
                                    <h2 className="text-2xl font-black uppercase italic tracking-tighter">Thoughts on <span className="text-primary">Today's Verse</span></h2>
                                </div>
                                <div className="space-y-3 text-muted-foreground leading-relaxed font-medium">
                                    {data?.thoughts.split('\n').filter((p: string) => p.trim()).map((para: string, i: number) => {
                                        const isReference = para.trim().startsWith('*');
                                        const content = para.replace(/\*/g, '').trim();
                                        if (!content) return null;

                                        return (
                                            <p key={i} className={isReference ? "text-xs font-semibold text-primary/70 italic mt-3" : ""}>
                                                {content}
                                            </p>
                                        );
                                    })}
                                </div>
                            </section>

                            <section className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-6 bg-rose-500 rounded-full" />
                                    <h2 className="text-2xl font-black uppercase italic tracking-tighter">My <span className="text-rose-500">Prayer</span></h2>
                                </div>
                                <div className="p-6 bg-rose-500/5 border border-rose-500/10 rounded-[2rem] space-y-3 text-muted-foreground leading-relaxed font-medium italic relative overflow-hidden">
                                    <div className="absolute -top-4 -right-4 text-rose-500/10">
                                        <Heart className="w-20 h-20" />
                                    </div>
                                    {data?.prayer.split('\n').filter((p: string) => p.trim()).map((para: string, i: number) => {
                                        const isReference = para.trim().startsWith('*');
                                        const content = para.replace(/\*/g, '').trim();
                                        if (!content) return null;

                                        return (
                                            <p key={i} className={`relative z-10 ${isReference ? "text-xs font-semibold text-rose-500/70 opacity-90 mt-3 not-italic" : ""}`}>
                                                {content}
                                            </p>
                                        );
                                    })}
                                </div>
                            </section>
                        </div>
                    </div>

                    {/* SIDEBAR */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* SUBSCRIBE CARD */}
                        <section>
                            <Card className="bg-card/50 border-border/50 rounded-[2rem] overflow-hidden shadow-xl">
                                <CardContent className="p-6 space-y-6">
                                    <h3 className="text-xl font-black uppercase italic tracking-tighter border-b border-border/50 pb-3">Subscribe</h3>
                                    <div className="space-y-3">
                                        {[
                                            { icon: Mail, label: "Subscribe by Email", color: "text-blue-500", href: "mailto:hello@clctagum.org" },
                                            { icon: Facebook, label: "Facebook", color: "text-blue-600", href: "https://www.facebook.com/clctagum" },
                                            { icon: Instagram, label: "Instagram", color: "text-rose-500", href: "https://www.instagram.com/clctagum" },
                                            { icon: Youtube, label: "YouTube", color: "text-red-500", href: "https://www.youtube.com/@clctagum" },
                                        ].map((item, i) => (
                                            <Link key={i} href={item.href} target={item.href.startsWith('http') ? "_blank" : undefined} rel={item.href.startsWith('http') ? "noopener noreferrer" : undefined}>
                                                <Button
                                                    variant="ghost"
                                                    className="w-full justify-start gap-3 h-10 rounded-xl hover:bg-muted hover:text-foreground transition-all group px-3"
                                                >
                                                    <item.icon className={`w-4 h-4 ${item.color} group-hover:scale-110 transition-transform shrink-0`} />
                                                    <span className="font-bold uppercase tracking-widest text-[10px] truncate">{item.label}</span>
                                                </Button>
                                            </Link>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </section>

                        {/* PREVIOUS DEVOTIONALS */}
                        <section className="space-y-4">
                            <h3 className="text-xl font-black uppercase italic tracking-tighter border-b border-border/50 pb-3">Previous Verse of the Day</h3>
                            <div className="space-y-3">
                                {previousDevotionals.slice(0, 4).map((devotional) => (
                                    <Link
                                        key={devotional.dateKey}
                                        href={`/word/${devotional.dateKey}`}
                                        className="group cursor-pointer p-4 rounded-2xl bg-muted/30 border border-border/50 hover:border-primary/50 hover:bg-muted/50 transition-all flex items-center justify-between"
                                    >
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase text-primary tracking-widest">{devotional.shortDate}</p>
                                            <h4 className="font-bold uppercase italic tracking-tight text-xs">
                                                {devotional.dayOfWeek}'s verse of the day
                                            </h4>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                    </Link>
                                ))}
                                <Link href="/word/archive">
                                    <Button variant="ghost" className="w-full gap-2 font-black uppercase text-[10px] tracking-widest text-primary hover:bg-primary/5 hover:text-primary rounded-xl h-10">
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
