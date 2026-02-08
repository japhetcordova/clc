import { trpcServer } from "@/lib/trpc/server";
import { ArrowLeft, Calendar, Megaphone } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "News Archive | Christian Life Center",
        description: "Browse past church announcements and updates from Christian Life Center Tagum City.",
        openGraph: {
            url: "/events/archive",
            images: ["/logo.webp"],
        },
        twitter: {
            card: "summary_large_image",
            images: ["/logo.webp"],
        }
    };
}


export const revalidate = 1800; // 30 minutes

export default async function NewsArchivePage() {
    const caller = await trpcServer();
    const announcements = await caller.getAnnouncements();

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-[1920px] mx-auto px-4 md:px-8 py-24 sm:py-32 space-y-12">
                <Link href="/events" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-rose-500 transition-colors group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Events
                </Link>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20">
                            <Megaphone className="w-4 h-4 text-rose-500" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500">News Archive</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">
                            Church <span className="text-rose-500">Updates</span>
                        </h1>
                        <p className="text-muted-foreground font-medium text-base sm:text-lg max-w-2xl">
                            Browse all announcements, news, and community updates from Christian Life Center.
                        </p>
                    </div>
                </div>

                {announcements.length === 0 ? (
                    <div className="py-24 text-center">
                        <Megaphone className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                        <p className="text-muted-foreground font-black uppercase tracking-widest">No announcements yet.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {announcements.map((announcement) => (
                            <Link key={announcement.id} href={`/events/announcement/${announcement.id}`}>
                                <Card className="p-8 h-full rounded-[2rem] border-border/50 hover:border-rose-500/30 hover:-translate-y-1 hover:shadow-2xl hover:shadow-rose-500/10 transition-all duration-300 cursor-pointer group space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-rose-500/60">{announcement.type}</span>
                                        <span className="text-[10px] font-bold text-muted-foreground">
                                            {new Date(announcement.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-black uppercase italic tracking-tight leading-none group-hover:text-rose-500 transition-colors">
                                        {announcement.title}
                                    </h3>
                                    <p className="text-xs text-muted-foreground line-clamp-3 font-medium leading-relaxed">
                                        {announcement.content}
                                    </p>
                                    <div className="flex items-center gap-2 text-rose-500 font-black text-[10px] uppercase tracking-widest opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 delay-75 pt-2">
                                        Read More →
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
