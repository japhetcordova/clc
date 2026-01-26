
import {
    Calendar,
    MapPin,
    Clock,
    ChevronLeft,
    Share2,
    Bell,
    Map as MapIcon,
    Info,
    ArrowRight,
    Users,
    UserCircle,
    Link as LinkIcon
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { trpcServer } from "@/lib/trpc/server";
import { notFound } from "next/navigation";
import EventCTA from "./event-cta";
import QRLink from "./qr-link";

export const revalidate = 1800; // Revalidate every 30 mins

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const caller = await trpcServer();
    const event = await caller.getEventById({ id });

    if (!event) {
        notFound();
    }

    return (
        <div className="flex flex-col min-h-screen bg-background">
            {/* HERO SECTION - Blurred Background */}
            <section className="relative min-h-[60vh] flex items-center overflow-hidden py-16 pb-8">
                {/* Blurred Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src={event.image || "/bg/events.webp"}
                        alt={event.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* Blur and transparency overlay */}
                    <div className="absolute inset-0 backdrop-blur-2xl bg-background/60" />
                    <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/30 to-background" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-2 w-full">
                    <Link href="/events" className="inline-block my-4">
                        <Button variant="ghost" className="p-0 h-auto gap-2 text-foreground/80 hover:text-foreground hover:bg-transparent text-[10px] font-black uppercase tracking-widest">
                            <ChevronLeft className="w-4 h-4" /> Back to Events
                        </Button>
                    </Link>

                    {/* Main Content - Image Left, Title Right */}
                    <div className="space-y-8">
                        {/* Flexbox Layout: Image 60% | Content 40% */}
                        <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-8">
                            {/* Left: Image Card (60% width) */}
                            <div className="relative w-full lg:w-[15%] flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 backdrop-blur-sm bg-white/5 animate-in fade-in slide-in-from-left-8 duration-700">
                                <Image
                                    src={event.image || "/bg/events.webp"}
                                    alt={event.title}
                                    width={800}
                                    height={600}
                                    className="w-full h-auto object-contain"
                                    priority
                                />
                            </div>

                            {/* Right: Title + Info + QR (40% width) */}
                            <div className="flex-1 flex flex-col lg:flex-row lg:items-center justify-between gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <div className="space-y-4">
                                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter uppercase italic leading-[0.85] text-foreground drop-shadow-2xl">
                                        {event.title}
                                    </h1>

                                    {/* Quick Info Pills */}
                                    <div className="flex flex-wrap gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 backdrop-blur-md border border-border shadow-lg">
                                            <Calendar className="w-4 h-4 text-primary" />
                                            <span className="text-sm font-bold">{event.date}</span>
                                        </div>
                                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 backdrop-blur-md border border-border shadow-lg">
                                            <Clock className="w-4 h-4 text-primary" />
                                            <span className="text-sm font-bold">{event.time}</span>
                                        </div>
                                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 backdrop-blur-md border border-border shadow-lg">
                                            <MapPin className="w-4 h-4 text-rose-500" />
                                            <span className="text-sm font-bold">{event.location}</span>
                                        </div>
                                    </div>
                                </div>

                                {event.googleMapsLink && (
                                    <div className="hidden lg:block animate-in fade-in zoom-in duration-1000 delay-300">
                                        <div className="p-4 rounded-[2rem] bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl">
                                            <QRLink url={event.googleMapsLink} size={160} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>


                    </div>
                </div>
            </section>

            {/* DETAILS SECTION */}
            <section className="py-8 lg:py-12 px-6">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-black uppercase italic tracking-tight">About this <span className="text-primary">Event</span></h2>
                            <p className="text-lg text-muted-foreground font-medium leading-relaxed whitespace-pre-line">
                                {event.description}
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-1 gap-8">
                            <div className="p-8 rounded-[2rem] bg-card border border-border space-y-6 hover:border-primary/20 transition-colors">
                                {/* Primary Schedule */}
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <Clock className="w-8 h-8 text-primary flex-shrink-0" />
                                        <div className="space-y-1">
                                            <h4 className="font-black text-lg uppercase italic">When</h4>
                                            <p className="text-sm font-bold text-muted-foreground uppercase">{event.date}</p>
                                            <p className="text-sm font-black text-primary uppercase tracking-widest">{event.time}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 pl-12 border-l border-border/50">
                                        <MapPin className="w-6 h-6 text-rose-500 flex-shrink-0" />
                                        <div className="space-y-1">
                                            <h4 className="font-bold text-sm uppercase">Where</h4>
                                            <p className="text-sm font-medium text-muted-foreground uppercase">{event.location}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Schedules */}
                                {((event.schedules as any[]) || []).length > 0 && (
                                    <>
                                        <div className="border-t border-border pt-6" />
                                        <div className="space-y-6">
                                            <h4 className="font-black text-xs uppercase tracking-[0.2em] text-muted-foreground">Additional Schedules</h4>
                                            {((event.schedules as any[])).map((s, idx) => (
                                                <div key={idx} className="space-y-4 p-4 rounded-2xl bg-muted/30 border border-border/50">
                                                    <div className="flex items-start gap-4">
                                                        <Calendar className="w-5 h-5 text-primary flex-shrink-0" />
                                                        <div className="space-y-0.5">
                                                            <p className="text-[10px] font-black uppercase text-muted-foreground">{s.date}</p>
                                                            <p className="text-xs font-black uppercase text-primary tracking-widest">{s.time}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-4">
                                                        <MapPin className="w-5 h-5 text-rose-500 flex-shrink-0" />
                                                        <div className="space-y-0.5">
                                                            <p className="text-[10px] font-bold uppercase text-muted-foreground">{s.location}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {/* Google Maps Link if available */}
                                {event.googleMapsLink && (
                                    <div className="border-t border-border pt-6">
                                        <a
                                            href={event.googleMapsLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-1 group w-fit mt-1"
                                        >
                                            View Main Location on Map <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Extra Details Grid if available */}
                        {(event.maxCapacity || event.contactPerson) && (
                            <div className="grid sm:grid-cols-2 gap-8">
                                {event.maxCapacity && (
                                    <div className="p-8 rounded-[2rem] bg-card border border-border space-y-4 hover:border-primary/20 transition-colors">
                                        <Users className="w-8 h-8 text-blue-500" />
                                        <div className="space-y-1">
                                            <h4 className="font-black text-lg uppercase italic">Capacity</h4>
                                            <p className="text-sm font-bold text-muted-foreground uppercase">{event.maxCapacity}</p>
                                        </div>
                                    </div>
                                )}
                                {event.contactPerson && (
                                    <div className="p-8 rounded-[2rem] bg-card border border-border space-y-4 hover:border-primary/20 transition-colors">
                                        <UserCircle className="w-8 h-8 text-green-500" />
                                        <div className="space-y-1">
                                            <h4 className="font-black text-lg uppercase italic">Contact</h4>
                                            <p className="text-sm font-bold text-muted-foreground uppercase">{event.contactPerson}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sidebar / CTA */}
                    <div className="space-y-8">
                        <EventCTA
                            eventId={event.id}
                            eventTitle={event.title}
                            registrationLink={event.registrationLink}
                            initialInterestedCount={event.interestedCount || 0}
                            eventDate={event.date}
                            eventTime={event.time}
                            location={event.location}
                            description={event.description}
                        />

                        <div className="p-8 rounded-[2.5rem] bg-card border border-border space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Bell className="w-4 h-4 text-primary animate-bounce-slow" />
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Reminders</h4>
                            </div>
                            <ul className="space-y-3">
                                <li className="text-xs font-medium text-muted-foreground flex gap-2">
                                    <Info className="w-4 h-4 text-primary shrink-0" />
                                    <span>Arrive 15 minutes before the start time.</span>
                                </li>
                                <li className="text-xs font-medium text-muted-foreground flex gap-2">
                                    <Info className="w-4 h-4 text-primary shrink-0" />
                                    <span>Parking is available at the main gate.</span>
                                </li>
                                {event.category === 'special' && (
                                    <li className="text-xs font-medium text-muted-foreground flex gap-2">
                                        <Info className="w-4 h-4 text-primary shrink-0" />
                                        <span>Don't forget to invite your friends and family!</span>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
