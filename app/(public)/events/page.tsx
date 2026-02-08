import {
    Bell,
    ArrowUpRight,
    Megaphone
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import EventsGrid from "@/app/(public)/events/events-grid";
import { trpcServer } from "@/lib/trpc/server";
import { Metadata } from "next";
import { getPrayerAndFastingDay } from "@/lib/date-utils";
import NewsletterForm from "./newsletter-form";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "News & Events | Christian Life Center Tagum",
        description: "Stay updated with the latest news and upcoming events at Christian Life Center Tagum City. Join our gatherings and be part of what God is doing.",
        openGraph: {
            url: "/events",
            images: ["/logo.webp"],
        },
        twitter: {
            card: "summary_large_image",
            images: ["/logo.webp"],
        }
    };
}

export const revalidate = 1800; // Revalidate every 30 minutes

export default async function EventsPage() {
    const caller = await trpcServer();
    const allEvents = await caller.getPublicEvents();
    const latestAnnouncements = await caller.getAnnouncements();
    const currentFastingDay = getPrayerAndFastingDay();

    return (
        <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
            {/* HEADER */}
            <section className="relative pt-24 pb-12 md:pt-32 md:pb-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/bg/events.webp"
                        alt="Events Background"
                        fill
                        className="object-cover opacity-20 scale-105"
                        priority
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-background via-background/80 to-background" />
                </div>

                <div className="relative z-10 max-w-[1920px] mx-auto px-4 md:px-8 space-y-6 sm:space-y-8 md:pt-4">
                    <div className="text-center space-y-4 sm:space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 backdrop-blur-md mb-2 sm:mb-4">
                            <Bell className="w-4 h-4 text-rose-500 animate-bounce" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500">Stay Updated</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">
                            News <span className="text-rose-500 underline decoration-rose-500/20 underline-offset-8">&</span> Events
                        </h1>
                        <p className="max-w-2xl mx-auto text-muted-foreground font-medium text-base sm:text-lg leading-relaxed">
                            Be part of what God is doing. Explore our upcoming gatherings, announcements, and special events.
                        </p>
                    </div>

                    {/* SPECIAL: PRAYER AND FASTING SECTION */}
                    <Link href="/prayer-and-fasting" className="block">
                        <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[3rem] bg-gradient-to-br from-rose-500 via-rose-600 to-rose-700 p-6 sm:p-8 md:p-12 shadow-2xl shadow-rose-500/20 hover:shadow-rose-500/40 transition-all duration-500 hover:scale-[1.01] cursor-pointer group border-2 border-rose-400/30">
                            {/* Animated Background Pattern */}
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8),transparent_50%)] animate-pulse" />
                            </div>

                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-6">
                                <div className="flex-1 space-y-4 text-center md:text-left">
                                    <div className="flex flex-col sm:flex-row items-center gap-3 justify-center md:justify-start">
                                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Special Event</span>
                                        </div>
                                        {currentFastingDay && (
                                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/90 backdrop-blur-md border border-amber-300 shadow-lg shadow-black/10">
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-950">Day {currentFastingDay} of 21</span>
                                            </div>
                                        )}
                                    </div>
                                    <h2 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-white leading-[0.9] sm:leading-none">
                                        21 Days of<br className="hidden sm:block" />Prayer & Fasting
                                    </h2>
                                    <p className="text-white/90 font-medium text-base sm:text-lg max-w-2xl">
                                        Join us for a powerful season of seeking God's presence and breakthrough. January 10 - 31, 2026
                                    </p>
                                    <div className="flex items-center gap-4 justify-center md:justify-start pt-2">
                                        <div className="text-center min-w-[60px]">
                                            <div className="text-2xl sm:text-3xl font-black text-white">21</div>
                                            <div className="text-[10px] font-bold uppercase tracking-widest text-white/70">Days</div>
                                        </div>
                                        <div className="h-10 sm:h-12 w-px bg-white/30" />
                                        <div className="text-center min-w-[80px]">
                                            <div className="text-2xl sm:text-3xl font-black text-white whitespace-nowrap">Jan 10-31</div>
                                            <div className="text-[10px] font-bold uppercase tracking-widest text-white/70">2026</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center gap-4 sm:gap-6 w-full md:w-auto">
                                    <div className="hidden sm:flex w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/10 backdrop-blur-md border-4 border-white/30 items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                                        <svg className="w-12 h-12 md:w-16 md:h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    </div>
                                    <Button className="w-full sm:w-auto bg-white text-rose-600 hover:bg-rose-50 font-black uppercase text-xs tracking-widest px-8 h-12 sm:h-14 rounded-2xl shadow-lg group-hover:shadow-xl transition-all">
                                        Learn More →
                                    </Button>
                                </div>
                            </div>

                            {/* Decorative Elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                        </div>
                    </Link>

                    <EventsGrid initialEvents={allEvents as any} />
                </div>
                {/* SMOOTH TRANSITION TO ANNOUNCEMENTS */}
                <div className="absolute bottom-0 left-0 right-0 h-48 bg-linear-to-b from-transparent to-muted/20 z-0 pointer-events-none" />
            </section>

            {/* ANNOUNCEMENT BOARD */}
            <section className="py-12 md:py-20 px-4 md:px-8 bg-muted/20 relative">
                <div className="max-w-[1920px] mx-auto space-y-16 relative z-10">
                    <div className="flex flex-col sm:flex-row items-end justify-between gap-8">
                        <div className="space-y-4">
                            <h2 className="text-4xl font-black uppercase italic tracking-tight">Recent <span className="text-rose-500">Updates</span></h2>
                            <p className="text-muted-foreground font-medium italic">Latest announcements and church news.</p>
                        </div>
                        <Link href="/events/archive">
                            <Button variant="outline" className="rounded-2xl h-12 px-8 border-border font-black uppercase text-[10px] tracking-widest bg-background">
                                View News Archive
                            </Button>
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {latestAnnouncements.slice(0, 3).map((post, i) => (
                            <Link key={post.id} href={`/events/announcement/${post.id}`}>
                                <div className="p-8 h-full rounded-[2rem] bg-card border border-border space-y-4 hover:border-rose-500/30 hover:-translate-y-1 hover:shadow-2xl hover:shadow-rose-500/10 transition-all duration-300 cursor-pointer group">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-rose-500/60">{post.type}</span>
                                        <span className="text-[10px] font-bold text-muted-foreground">
                                            {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <h4 className="text-xl font-black uppercase italic tracking-tight leading-none group-hover:text-rose-500 transition-colors">{post.title}</h4>
                                    <p className="text-xs text-muted-foreground line-clamp-2 font-medium">
                                        {post.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                                    </p>
                                    <div className="flex items-center gap-2 text-rose-500 font-black text-[10px] uppercase tracking-widest opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 delay-75 pt-2">
                                        Read Article <ArrowUpRight className="w-3 h-3" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                        {latestAnnouncements.length === 0 && (
                            <div className="md:col-span-3 py-20 text-center">
                                <p className="text-muted-foreground font-black uppercase tracking-widest">No recent updates at the moment.</p>
                            </div>
                        )}
                    </div>
                </div>
                {/* SMOOTH TRANSITION TO NEWSLETTER */}
                <div className="absolute bottom-0 left-0 right-0 h-48 bg-linear-to-b from-transparent to-rose-500 z-0 pointer-events-none" />
            </section>



            {/* NEWSLETTER CTA */}
            <section className="py-12 md:py-20 px-4 md:px-8 bg-rose-500 text-white relative">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <Megaphone className="w-12 h-12 mx-auto rotate-[-15deg] opacity-50" />
                    <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">Never Miss a Moment</h2>
                    <p className="font-medium opacity-80 max-w-xl mx-auto">
                        Subscribe to our digital bulletin and receive weekly updates, event invitations, and spiritual encouragement directly to your inbox.
                    </p>
                    <NewsletterForm />
                </div>
            </section>
        </div>
    );
}
