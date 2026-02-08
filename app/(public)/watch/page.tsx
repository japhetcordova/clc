import {
    Tv,
    Calendar,
    Clock,
    Play,
    Facebook,
    Youtube,
    ExternalLink,
    ChevronRight,
    Search,
    Video,
    Volume2,
    Users,
    Heart,
    MessageCircle,
    ArrowUpRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

import { getLiveVideo, getRecentVideos, syncFacebookVideos } from "@/lib/video-service";
import { format } from "date-fns";

export const metadata: Metadata = {
    title: "Watch Live | Christian Life Center Tagum",
    description: "Join our worship services live from Tagum City. Experience authentic worship and life-changing messages wherever you are.",
    openGraph: {
        title: "Watch Live | Christian Life Center Tagum",
        description: "Join our worship services live from Tagum City.",
        images: ["/bg/events.webp"],
    }
};

export default async function WatchPage() {
    // Optional: Auto-sync if token is provided in env
    const fbToken = process.env.FB_ACCESS_TOKEN;
    if (fbToken) {
        // We can do a fire-and-forget sync or wait for it
        // For performance, we'll only sync if data is stale (e.g. once an hour)
        // For simplicity now, let's just fetch
        await syncFacebookVideos(fbToken);
    }

    const [liveVideo, recentVideos] = await Promise.all([
        getLiveVideo(),
        getRecentVideos()
    ]);


    const liveSchedule = [
        { day: "Sunday Services", time: "8:00 AM & 5:00 PM", label: "Worship Service" },
        { day: "Tuesday Night", time: "6:00 PM", label: "Online Cell Group" },
        { day: "Wednesday Night", time: "5:00 PM", label: "Regeneration Campus (Coming Soon)" },
        { day: "Friday Night", time: "6:00 PM", label: "Regeneration Upnext" },
    ];

    // Fallback if no recent videos in DB
    const archives = recentVideos.length > 0 ? recentVideos.map(v => ({
        title: v.title || "Worship Service",
        date: format(v.publishedAt, "MMM d, yyyy"),
        speaker: "Ptr. Japhet Cordova",
        image: v.thumbnail || "/bg/word.webp",
        duration: "Service",
        link: v.videoUrl
    })) : [
        {
            title: "Divine Direction: Finding God's Will",
            date: "Feb 1, 2026",
            speaker: "Ptr. Japhet Cordova",
            image: "/bg/word.webp",
            duration: "1:24:30",
            link: "https://www.facebook.com/clctagum/videos"
        },
        {
            title: "The Power of Persistent Prayer",
            date: "Jan 25, 2026",
            speaker: "Ptr. Japhet Cordova",
            image: "/bg/ministries.webp",
            duration: "1:15:20",
            link: "https://www.facebook.com/clctagum/videos"
        }
    ];

    const activeVideo = liveVideo || (recentVideos.length > 0 ? recentVideos[0] : null);

    const liveEmbedUrl = activeVideo
        ? `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(activeVideo.videoUrl)}&show_text=0&width=1280`
        : "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fclctagum%2Flive&show_text=0&width=1280";



    return (
        <div className="min-h-screen pt-20 pb-10 px-4 md:px-8 bg-background">
            <div className="max-w-[1920px] mx-auto">
                {/* HERO / HEADER */}
                <section className="relative pt-12 pb-16 overflow-hidden mb-8 -mx-4 md:-mx-8 px-4 md:px-8 border-b border-border/50">
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="/bg/events.webp"
                            alt="Watch Background"
                            fill
                            className="object-cover opacity-20 scale-105"
                            priority
                        />
                        <div className="absolute inset-0 bg-linear-to-b from-background via-background/80 to-background" />
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="space-y-4 max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500">
                                <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Live Experience</span>
                            </div>
                            <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-foreground uppercase italic leading-none">
                                Worship <span className="text-primary italic">Anywhere</span>
                            </h1>
                            <p className="text-muted-foreground text-sm md:text-lg font-medium max-w-xl leading-relaxed">
                                Experience the presence of God through our live worship services and messages. Distance is not a barrier to encountering His grace.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <Link href="https://www.facebook.com/clctagum/live" target="_blank" rel="noopener noreferrer">
                                <Button className="h-14 px-8 rounded-2xl bg-[#1877F2] hover:bg-[#1877F2]/90 text-white font-bold uppercase tracking-widest text-xs gap-3 shadow-xl shadow-[#1877F2]/20">
                                    <Facebook className="w-5 h-5" />
                                    Watch on Facebook
                                </Button>
                            </Link>
                            <Link href="https://www.youtube.com/@clctagum" target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" className="h-14 px-8 rounded-2xl border-border/50 font-bold uppercase tracking-widest text-xs gap-3 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-500 transition-all">
                                    <Youtube className="w-5 h-5 text-red-500" />
                                    YouTube Channel
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* MAIN PLAYER AREA */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-8 bg-rose-500 rounded-full" />
                                    <h2 className="text-3xl font-black uppercase italic tracking-tighter">Live <span className="text-rose-500">Stream</span></h2>
                                </div>
                                <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-muted-foreground bg-muted/30 px-4 py-2 rounded-full">
                                    <Users className="w-4 h-4 text-primary" />
                                    <span>{liveVideo ? "Live Now" : "Latest Message"}</span>
                                </div>
                            </div>

                            {/* FB LIVE EMBED PLACEHOLDER / IFRAME */}
                            <div className="relative aspect-video rounded-[2.5rem] overflow-hidden bg-muted/30 border border-border/50 group shadow-2xl">
                                <iframe
                                    src={liveEmbedUrl}
                                    className="absolute inset-0 w-full h-full"
                                    style={{ border: 'none' }}
                                    allowFullScreen={true}
                                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                                />

                                {/* Overlay if not live or if we want custom UI on top */}
                                <div className="absolute inset-0 pointer-events-none bg-linear-to-t from-black/40 to-transparent flex items-end p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="space-y-2">
                                        <p className="text-white font-black italic uppercase tracking-tighter text-2xl">{activeVideo?.title || "Worship Service"}</p>
                                        <p className="text-white/80 font-bold uppercase tracking-widest text-xs">Christian Life Center Tagum City</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-card/50 border border-border/50 rounded-[2rem]">
                                <div className="flex items-center gap-6">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Currently {liveVideo ? "Playing" : "Offline / Latest"}</span>
                                        <span className="font-black uppercase italic tracking-tighter text-xl">{activeVideo?.title || "Worship Service"}</span>
                                    </div>
                                    <div className="h-10 w-px bg-border hidden sm:block" />
                                    <div className="hidden sm:flex flex-col">
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Platform</span>
                                        <span className="font-bold text-xs uppercase tracking-widest flex items-center gap-2 text-primary">
                                            <Facebook className="w-3 h-3 fill-primary" />
                                            {liveVideo ? "Facebook Live" : "Facebook Playback"}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Link href="https://www.facebook.com/clctagum/live" target="_blank">
                                        <Button variant="ghost" className="rounded-xl gap-2 font-black uppercase text-[10px] tracking-widest text-muted-foreground hover:text-primary">
                                            <MessageCircle className="w-4 h-4" />
                                            Join Chat
                                        </Button>
                                    </Link>
                                    <Button variant="ghost" className="rounded-xl gap-2 font-black uppercase text-[10px] tracking-widest text-muted-foreground hover:text-primary">
                                        <Heart className="w-4 h-4 text-rose-500" />
                                        Support
                                    </Button>
                                    <Button variant="ghost" className="rounded-xl gap-2 font-black uppercase text-[10px] tracking-widest text-muted-foreground hover:text-primary border border-transparent hover:border-border">
                                        <ArrowUpRight className="w-4 h-4" />
                                        Share
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* ARCHIVE GRID */}
                        <div className="space-y-6 pt-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-8 bg-primary rounded-full" />
                                    <h2 className="text-3xl font-black uppercase italic tracking-tighter">Recent <span className="text-primary">Services</span></h2>
                                </div>
                                <Link href="https://www.facebook.com/clctagum/videos" target="_blank" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-1 group">
                                    View Full Archive
                                    <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-6">
                                {archives.map((video, i) => (
                                    <Link key={i} href={video.link} target="_blank" className="group">
                                        <Card className="bg-card/40 backdrop-blur-3xl border-border/50 rounded-[2rem] overflow-hidden hover:border-primary/50 transition-all hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1">
                                            <CardContent className="p-0">
                                                <div className="relative aspect-video">
                                                    <Image
                                                        src={video.image}
                                                        alt={video.title}
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                                                    <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-white tracking-widest">
                                                        {video.duration}
                                                    </div>
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white shadow-xl">
                                                            <Play className="w-6 h-6 fill-white ml-1" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="p-6 space-y-2">
                                                    <p className="text-[10px] font-black uppercase text-primary tracking-widest">{video.date}</p>
                                                    <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{video.title}</h3>
                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Speaker: {video.speaker}</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* SIDEBAR */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* SCHEDULE CARD */}
                        <Card className="bg-primary/5 border-primary/20 rounded-[2.5rem] overflow-hidden shadow-xl">
                            <CardContent className="p-8 space-y-8">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-primary" />
                                        <h3 className="text-2xl font-black uppercase italic tracking-tighter">Live <span className="text-primary">Schedule</span></h3>
                                    </div>
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
                                        Mark your calendars and set your reminders. Join our community in real-time.
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    {liveSchedule.map((item, i) => (
                                        <div key={i} className="flex items-start gap-4 group">
                                            <div className="p-3 bg-background rounded-2xl border border-primary/20 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                                <Clock className="w-4 h-4" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black uppercase text-primary tracking-[0.2em]">{item.day}</p>
                                                <p className="font-bold text-sm">{item.label}</p>
                                                <p className="text-xs font-medium text-muted-foreground italic">{item.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Button className="w-full h-14 rounded-2xl bg-primary font-bold uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform">
                                    Set Reminders
                                </Button>
                            </CardContent>
                        </Card>

                        {/* GIVING CTAS */}
                        <Card className="bg-card/50 border-border/50 rounded-[2.5rem] overflow-hidden">
                            <CardContent className="p-8 space-y-6">
                                <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500 mb-2">
                                    <Heart className="w-6 h-6 fill-rose-500" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black uppercase italic tracking-tighter">Partner with <span className="text-rose-500">Us</span></h3>
                                    <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                                        Your generosity allows us to continue reaching thousands with the message of hope through these broadcasts.
                                    </p>
                                </div>
                                <Link href="/giving" className="block">
                                    <Button variant="outline" className="w-full h-14 rounded-2xl border-border/50 font-bold uppercase tracking-widest text-xs hover:border-rose-500 hover:text-rose-500 transition-all flex items-center justify-between px-6 group">
                                        Give Online
                                        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        {/* CONNECT SECTION */}
                        <div className="p-8 space-y-6 rounded-[2.5rem] bg-muted/30 border border-border/50 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
                            <div className="space-y-2">
                                <h4 className="text-lg font-black uppercase italic tracking-tighter">New here?</h4>
                                <p className="text-xs font-medium text-muted-foreground">We'd love to connect with you and send you a gift.</p>
                            </div>
                            <Link href="/about" className="block">
                                <Button variant="link" className="p-0 h-auto font-black uppercase text-[10px] tracking-widest text-primary hover:text-primary/80 group">
                                    I'm New Here
                                    <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
