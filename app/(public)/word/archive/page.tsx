import { getPreviousDevotionals } from "@/lib/votd-archive";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "Word Archive | Christian Life Center",
        description: "Browse previous Verse of the Day devotionals from Christian Life Center Tagum City.",
        openGraph: {
            url: "/word/archive",
            images: ["/logo.webp"],
        },
        twitter: {
            card: "summary_large_image",
            images: ["/logo.webp"],
        }
    };
}

import {
    BookOpen,
    Calendar,
    ArrowLeft,
    ChevronRight
} from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export const revalidate = 3600; // Revalidate every hour

export default async function ArchivePage() {
    const devotionals = await getPreviousDevotionals(30); // Last 30 days

    return (
        <div className="min-h-screen pt-20 pb-10 px-4 md:px-8">
            <div className="max-w-[1920px] mx-auto">
                {/* BACK BUTTON */}
                <Link href="/word" className="inline-flex md:pt-4 items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-8 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Today
                </Link>

                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary">
                            <BookOpen className="w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Devotional Archive</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground uppercase italic leading-none">
                            Browse <span className="text-primary">Past Verse of the Day</span>
                        </h1>
                    </div>
                    <p className="text-sm text-muted-foreground font-medium max-w-md text-right hidden md:block">
                        Explore previous daily Verse of the Day. Each day brings a new word of encouragement.
                    </p>
                </div>

                {/* DEVOTIONALS GRID - Fully Responsive */}
                {/* MOBILE VIEW: Ultra Compact List */}
                <div className="md:hidden space-y-1">
                    {devotionals.map((devotional) => (
                        <Link
                            key={devotional.dateKey}
                            href={`/word/${devotional.dateKey}`}
                            className="flex items-center justify-between p-4 bg-card/30 border-b border-border/40 hover:bg-muted/50 transition-colors active:scale-[0.99]"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-primary/10 rounded-lg text-primary shrink-0">
                                    <span className="text-xs font-black w-6 text-center block leading-none">
                                        {devotional.shortDate.split(' ')[1].replace(',', '')}
                                    </span>
                                </div>
                                <div className="space-y-0.5">
                                    <h3 className="text-sm font-black uppercase italic tracking-tight leading-none text-foreground">
                                        {devotional.dayOfWeek}
                                    </h3>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                                        {devotional.shortDate}
                                    </p>
                                </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                        </Link>
                    ))}
                </div>

                {/* DESKTOP VIEW: Grid Cards */}
                <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                    {devotionals.map((devotional) => (
                        <Link
                            key={devotional.dateKey}
                            href={`/word/${devotional.dateKey}`}
                        >
                            <Card className="group cursor-pointer h-full p-6 rounded-[2rem] bg-card/50 border border-border/50 hover:border-primary/50 hover:bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
                                <div className="space-y-4 h-full flex flex-col justify-between">
                                    <div className="flex items-center justify-between">
                                        <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                                            <Calendar className="w-4 h-4" />
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase text-primary tracking-widest">
                                            {devotional.dayOfWeek}
                                        </p>
                                        <h3 className="text-xl font-black uppercase italic tracking-tighter leading-none group-hover:text-primary transition-colors">
                                            {devotional.shortDate}
                                        </h3>
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                                            Verse of the Day
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* INFO CARD */}
                <Card className="mt-8 p-8 rounded-[2rem] bg-primary/5 border-primary/20">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-background rounded-2xl hidden md:block">
                                <BookOpen className="w-8 h-8 text-primary" />
                            </div>
                            <div className="space-y-1">
                                <h2 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter">
                                    Looking for a Specific Date?
                                </h2>
                                <p className="text-sm text-muted-foreground font-medium max-w-xl">
                                    Verse of the Day are available for the past 30 days. Each Verse of the Day includes the daily verse, thoughtful reflections, and a prayer.
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
