import { Metadata } from "next";
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

export async function generateMetadata(): Promise<Metadata> {
    const data = await getVOTD();

    const verseText = data?.text ? `"${data.text}"` : "Verse of the Day";
    const reference = data?.reference ? ` - ${data.reference}` : "";
    const thoughts = data?.thoughts
        ? data.thoughts.split('\n')[0].replace(/\*/g, '').substring(0, 160) + "..."
        : "Receive daily spiritual nourishment with our Verse of the Day.";

    const pageTitle = `${verseText}${reference}`;

    return {
        title: pageTitle,
        description: thoughts,
        openGraph: {
            title: pageTitle,
            description: thoughts,
            url: "/word",
            type: "article",
            images: ["/logo.webp"],
        }
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
        <div className="min-h-screen pt-0 pb-10 px-6 md:px-8">
            <div className="max-w-7xl mx-auto">
                {/* HEADER - Compact Optimized */}
                <section className="relative pt-20 md:pt-12 pb-8 md:pb-12 overflow-hidden mb-4 md:mb-8 -mx-6 md:-mx-8 px-6 md:px-8 border-b border-border/50">
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="/bg/word.webp"
                            alt="Word Background"
                            fill
                            className="object-cover opacity-15 scale-100"
                            priority
                        />
                        <div className="absolute inset-0 bg-linear-to-b from-background/40 via-background/80 to-background" />
                    </div>

                    <div className="relative z-10 space-y-3">
                        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-primary">Daily Bread</span>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-foreground uppercase italic leading-[0.85]">
                            Verse of<br />the <span className="text-primary">Day</span>
                        </h1>
                        <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-primary" />
                                <p className="font-black uppercase tracking-widest text-[10px] italic opacity-70">{data?.fullDate}</p>
                            </div>
                            <Link href="/word/archive" className="text-[9px] font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-1 group">
                                Archive
                                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </section>

                <div className="grid lg:grid-cols-12 gap-6">
                    {/* MAIN CONTENT */}
                    <div className="lg:col-span-9 space-y-6">
                        {/* VERSE CARD */}
                        <div className="relative">
                            <div className="absolute -inset-4 bg-primary/20 blur-3xl opacity-10 -z-10 animate-pulse" />
                            <Card id="verse-card-content" className="bg-background/40 backdrop-blur-3xl border-primary/20 shadow-2xl rounded-2xl sm:rounded-[2.5rem] overflow-hidden group p-0 gap-0">
                                <CardContent className="p-6 md:p-12 space-y-6 md:space-y-8">
                                    <div className="absolute top-10 right-10 text-primary/10 group-hover:text-primary/20 transition-colors hidden md:block">
                                        <Quote className="w-24 h-24 rotate-180" />
                                    </div>

                                    <blockquote className="space-y-6 md:space-y-8 relative z-10">
                                        <p className="text-xl md:text-3xl font-bold italic tracking-tight leading-[1.3] text-foreground">
                                            "{data?.text ? data.text.charAt(0).toUpperCase() + data.text.slice(1) : ''}"
                                        </p>
                                        <footer className="flex items-center gap-4">
                                            <div className="h-px w-10 bg-primary" />
                                            <div className="space-y-1">
                                                <cite className="text-base md:text-xl font-black uppercase tracking-widest text-primary not-italic">
                                                    {data?.reference}
                                                </cite>
                                                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">{data?.version}</p>
                                            </div>
                                        </footer>
                                    </blockquote>
                                </CardContent>
                            </Card>
                        </div>

                        {/* AUDIO PLAYER SECTION */}
                        <section className="bg-muted/30 border border-border/50 rounded-2xl sm:rounded-[2rem] p-5 md:p-8">
                            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                                <div className="p-3 bg-primary/10 rounded-xl text-primary animate-pulse hidden sm:block">
                                    <Music className="w-5 h-5" />
                                </div>
                                <div className="flex-1 space-y-2 w-full">
                                    <h3 className="font-black uppercase italic tracking-tighter text-base text-center md:text-left">Listen to Verse</h3>
                                    <VOTDClient
                                        verseText={data?.text || ""}
                                        reference={data?.reference || ""}
                                        audioUrl={data?.audioUrl}
                                    />
                                    <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest text-center md:text-left opacity-40">Audio provided by CLCTAGUM</p>
                                </div>
                            </div>
                        </section>

                        {/* DEVOTIONAL CONTENT */}
                        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                            <section className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-5 bg-primary rounded-full" />
                                    <h2 className="text-xl font-black uppercase italic tracking-tighter">Daily <span className="text-primary">Thoughts</span></h2>
                                </div>
                                <div className="space-y-2 text-muted-foreground text-sm leading-relaxed font-medium">
                                    {data?.thoughts.split('\n').filter((p: string) => p.trim()).map((para: string, i: number) => {
                                        const isReference = para.trim().startsWith('*');
                                        const content = para.replace(/\*/g, '').trim();
                                        if (!content) return null;

                                        return (
                                            <p key={i} className={isReference ? "text-[10px] font-black text-primary/70 italic mt-2" : ""}>
                                                {content}
                                            </p>
                                        );
                                    })}
                                </div>
                            </section>

                            <section className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-5 bg-rose-500 rounded-full" />
                                    <h2 className="text-xl font-black uppercase italic tracking-tighter">Daily <span className="text-rose-500">Prayer</span></h2>
                                </div>
                                <div className="p-5 bg-rose-500/5 border border-rose-500/10 rounded-2xl space-y-2 text-muted-foreground text-sm leading-relaxed font-medium italic relative overflow-hidden">
                                    <div className="absolute -top-4 -right-4 text-rose-500/10">
                                        <Heart className="w-16 h-16" />
                                    </div>
                                    {data?.prayer.split('\n').filter((p: string) => p.trim()).map((para: string, i: number) => {
                                        const isReference = para.trim().startsWith('*');
                                        const content = para.replace(/\*/g, '').trim();
                                        if (!content) return null;

                                        return (
                                            <p key={i} className={`relative z-10 ${isReference ? "text-[10px] font-black text-rose-500/70 opacity-90 mt-2 not-italic" : ""}`}>
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

                        {/* PREVIOUS DEVOTIONALS */}
                        <section className="space-y-3">
                            <h3 className="text-sm font-black uppercase italic tracking-tighter border-b border-border/50 pb-2">History</h3>
                            <div className="space-y-2">
                                {previousDevotionals.slice(0, 3).map((devotional) => (
                                    <Link
                                        key={devotional.dateKey}
                                        href={`/word/${devotional.dateKey}`}
                                        className="group cursor-pointer p-3 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/50 hover:bg-muted/50 transition-all flex items-center justify-between"
                                    >
                                        <div className="space-y-0.5">
                                            <p className="text-[8px] font-black uppercase text-primary tracking-widest">{devotional.shortDate}</p>
                                            <h4 className="font-bold uppercase italic tracking-tight text-[10px]">
                                                {devotional.dayOfWeek}
                                            </h4>
                                        </div>
                                        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                                    </Link>
                                ))}
                                <Link href="/word/archive">
                                    <Button variant="ghost" className="w-full gap-1.5 font-black uppercase text-[8px] tracking-widest text-primary hover:bg-primary/5 hover:text-primary rounded-lg h-8">
                                        View Archive
                                        <ArrowRight className="w-3 h-3" />
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
