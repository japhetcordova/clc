import { trpcServer } from "@/lib/trpc/server";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const caller = await trpcServer();
    const announcements = await caller.getAnnouncements();
    const announcement = announcements.find(a => a.id === id);

    if (!announcement) return { title: "Announcement Not Found" };

    return {
        title: `${announcement.title} | CLC News`,
        description: announcement.content.substring(0, 160),
        openGraph: {
            images: ["/logo.webp"],
        },
        twitter: {
            card: "summary_large_image",
            images: ["/logo.webp"],
        }
    };
}

import { ArrowLeft, Calendar, Megaphone, Share2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import Image from "next/image";

export default async function AnnouncementPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const caller = await trpcServer();
    const announcements = await caller.getAnnouncements();
    const announcement = announcements.find(a => a.id === id);

    if (!announcement) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto px-4 py-24 sm:py-32 space-y-12">
                <Link href="/events" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-rose-500 transition-colors group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to News & Events
                </Link>

                <article className="space-y-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-widest">
                                {announcement.type}
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-widest">
                                    {new Date(announcement.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </span>
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none">
                            {announcement.title}
                        </h1>
                    </div>

                    <div className="relative aspect-video rounded-[2rem] overflow-hidden border border-border shadow-2xl">
                        <Image
                            src="/bg/events.webp"
                            alt="News Background"
                            fill
                            className="object-cover opacity-50"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Megaphone className="w-24 h-24 text-rose-500/20 rotate-[-15deg]" />
                        </div>
                    </div>

                    <div className="prose prose-rose prose-invert max-w-none">
                        <div className="text-lg text-muted-foreground leading-relaxed font-medium whitespace-pre-wrap">
                            {announcement.content}
                        </div>
                    </div>
                </article>

                <div className="pt-12 border-t border-border flex items-center justify-between">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        Posted by Christian Life Center Media
                    </p>
                    <Button variant="ghost" size="icon" className="rounded-xl hover:text-rose-500">
                        <Share2 className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
