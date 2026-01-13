import { getPreviousDevotionals } from "@/lib/votd-archive";
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
        <div className="min-h-screen pt-24 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                {/* BACK BUTTON */}
                <Link href="/word" className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-8 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Today
                </Link>

                {/* HEADER */}
                <div className="space-y-6 mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary">
                        <BookOpen className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Devotional Archive</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground uppercase italic leading-none">
                        Browse <span className="text-primary">Past Devotionals</span>
                    </h1>
                    <p className="text-lg text-muted-foreground font-medium max-w-2xl">
                        Explore previous daily verses and devotionals. Each day brings a new word of encouragement and spiritual insight.
                    </p>
                </div>

                {/* DEVOTIONALS GRID */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {devotionals.map((devotional) => (
                        <Link
                            key={devotional.dateKey}
                            href={`/word/${devotional.dateKey}`}
                        >
                            <Card className="group cursor-pointer p-8 rounded-[2rem] bg-card/50 border border-border/50 hover:border-primary/50 hover:bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                                            <Calendar className="w-5 h-5" />
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase text-primary tracking-widest">
                                            {devotional.dayOfWeek}
                                        </p>
                                        <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-none group-hover:text-primary transition-colors">
                                            {devotional.shortDate}
                                        </h3>
                                        <p className="text-xs text-muted-foreground font-medium">
                                            Daily Devotional
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* INFO CARD */}
                <Card className="mt-12 p-8 md:p-12 rounded-[2.5rem] bg-primary/5 border-primary/20">
                    <div className="text-center space-y-4">
                        <BookOpen className="w-12 h-12 mx-auto text-primary" />
                        <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter">
                            Looking for a Specific Date?
                        </h2>
                        <p className="text-muted-foreground font-medium max-w-xl mx-auto">
                            Devotionals are available for the past 30 days. Each devotional includes the daily verse, thoughtful reflections, and a prayer to guide your spiritual journey.
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
}
