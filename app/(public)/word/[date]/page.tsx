import { notFound } from "next/navigation";
import { getVOTDByDate } from "@/lib/votd-archive";
import {
    BookOpen,
    Calendar,
    ArrowLeft,
    Quote,
    Heart,
    ChevronRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import VOTDClient from "../votd-client";

export const revalidate = 86400; // Revalidate every 24 hours

export default async function DevotionalPage({ params }: { params: { date: string } }) {
    const { date } = params;
    const data = await getVOTDByDate(date);

    if (!data || !data.text) {
        notFound();
    }

    return (
        <div className="min-h-screen pt-24 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                {/* BACK BUTTON */}
                <Link href="/word" className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-8 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Today
                </Link>

                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary">
                            <BookOpen className="w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Devotional Archive</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground uppercase italic leading-none">
                            Daily <span className="text-primary">Devotional</span>
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary" />
                                <p className="font-bold uppercase tracking-widest text-xs italic">{data.fullDate}</p>
                            </div>
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
                                            "{data.text}"
                                        </p>
                                        <footer className="flex items-center gap-6">
                                            <div className="h-px w-16 bg-primary" />
                                            <div className="space-y-1">
                                                <cite className="text-xl md:text-2xl font-black uppercase tracking-widest text-primary not-italic">
                                                    {data.reference}
                                                </cite>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">{data.version}</p>
                                            </div>
                                        </footer>
                                    </blockquote>

                                    <VOTDClient
                                        verseText={data.text || ""}
                                        reference={data.reference || ""}
                                        audioUrl={undefined}
                                    />
                                </CardContent>
                            </Card>
                        </div>

                        {/* DEVOTIONAL CONTENT */}
                        {(data.thoughts || data.prayer) && (
                            <div className="grid md:grid-cols-2 gap-12">
                                {data.thoughts && (
                                    <section className="space-y-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-8 bg-primary rounded-full" />
                                            <h2 className="text-3xl font-black uppercase italic tracking-tighter">Thoughts on <span className="text-primary">Today's Verse</span></h2>
                                        </div>
                                        <div className="space-y-4 text-muted-foreground leading-relaxed font-medium">
                                            {data.thoughts.split('\n').filter((p: string) => p.trim()).map((para: string, i: number) => (
                                                <p key={i}>{para}</p>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {data.prayer && (
                                    <section className="space-y-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-8 bg-rose-500 rounded-full" />
                                            <h2 className="text-3xl font-black uppercase italic tracking-tighter">My <span className="text-rose-500">Prayer</span></h2>
                                        </div>
                                        <div className="p-8 bg-rose-500/5 border border-rose-500/10 rounded-[2rem] space-y-4 text-muted-foreground leading-relaxed font-medium italic relative overflow-hidden">
                                            <div className="absolute -top-4 -right-4 text-rose-500/10">
                                                <Heart className="w-24 h-24" />
                                            </div>
                                            {data.prayer.split('\n').filter((p: string) => p.trim()).map((para: string, i: number) => (
                                                <p key={i} className="relative z-10">{para}</p>
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </div>
                        )}
                    </div>

                    {/* SIDEBAR */}
                    <div className="space-y-8">
                        <Card className="bg-card/50 border-border/50 rounded-[2.5rem] overflow-hidden shadow-xl p-8">
                            <h3 className="text-xl font-black uppercase italic tracking-tighter mb-6">Navigate</h3>
                            <div className="space-y-4">
                                <Link href="/word">
                                    <Button variant="outline" className="w-full justify-start gap-3 h-12 rounded-2xl hover:text-primary transition-all">
                                        <Calendar className="w-4 h-4 text-primary" />
                                        <span className="font-bold uppercase tracking-widest text-[10px]">Today's Devotional</span>
                                    </Button>
                                </Link>
                                <Link href="/word/archive">
                                    <Button variant="outline" className="w-full justify-start gap-3 h-12 rounded-2xl hover:text-primary transition-all">
                                        <BookOpen className="w-4 h-4 text-primary" />
                                        <span className="font-bold uppercase tracking-widest text-[10px]">Browse Archive</span>
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
