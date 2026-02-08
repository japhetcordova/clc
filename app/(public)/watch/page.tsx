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
    ArrowUpRight,
    Share2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

import { getLiveVideo, getRecentVideos, syncFacebookVideos } from "@/lib/video-service";
import { format } from "date-fns";
import { EditableVideoTitle } from "@/components/EditableVideoTitle";

export async function generateMetadata(): Promise<Metadata> {
    const [live, recent] = await Promise.all([
        getLiveVideo(),
        getRecentVideos()
    ]);

    const latest = live || recent[0];
    const image = latest?.thumbnail || "/logo.webp";
    const displayTitle = latest?.manualTitle || latest?.title || "Worship Service";

    return {
        title: "Watch Live | Christian Life Center Tagum",
        description: `Join our worship services live from Tagum City. Currently: ${displayTitle}`,
        openGraph: {
            title: "Watch Live | Christian Life Center Tagum",
            description: "Join our worship services live from Tagum City.",
            images: [image],
        }
    };
}


export default async function WatchPage() {
    // Optional: Auto-sync if token is provided in env
    const fbToken = process.env.FB_ACCESS_TOKEN;
    if (fbToken) {
        try {
            await syncFacebookVideos(fbToken);
        } catch (error) {
            console.error("Delayed sync error:", error);
        }
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

    // Filter out live videos, untitled videos, and videos without proper thumbnails
    const archivedVideos = recentVideos.filter(v => {
        // Exclude live videos (shown in main player)
        if (v.isLive) return false;

        // Exclude videos with no title or "Untitled" in the title
        const title = v.manualTitle || v.title || "";
        if (!title || title.toLowerCase().includes("untitled")) return false;

        // Exclude videos without real thumbnails (must have a valid URL, not just fallback)
        if (!v.thumbnail || v.thumbnail === "/bg/word.webp" || !v.thumbnail.startsWith("http")) return false;

        return true;
    });

    // Fallback if no archived videos in DB
    const archives = archivedVideos.length > 0 ? archivedVideos.map(v => ({
        id: v.id,
        title: v.manualTitle || v.title || "Worship Service",
        date: format(v.publishedAt, "MMM d, yyyy"),
        image: v.thumbnail || "/bg/word.webp",
        duration: "Service",
        link: v.videoUrl
    })) : [
        {
            id: "fallback-1",
            title: "Divine Direction: Finding God's Will",
            date: "Feb 1, 2026",
            image: "/bg/word.webp",
            duration: "1:24:30",
            link: "https://www.facebook.com/clctagum/videos"
        },
        {
            id: "fallback-2",
            title: "The Power of Persistent Prayer",
            date: "Jan 25, 2026",
            image: "/bg/ministries.webp",
            duration: "1:15:20",
            link: "https://www.facebook.com/clctagum/videos"
        }
    ];

    const activeVideo = liveVideo || (recentVideos.length > 0 ? recentVideos[0] : null);

    // Fallback URL if no official embed_html is available
    const fallbackEmbedUrl = activeVideo?.videoUrl
        ? `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(activeVideo.videoUrl)}&show_text=0&width=1280`
        : "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fclctagum%2Flive&show_text=0&width=1280";


    return (
        <div className="min-h-screen pt-16 md:pt-20 pb-6 md:pb-10 px-3 sm:px-4 md:px-8 bg-background">
            <div className="max-w-[1920px] mx-auto">
                {/* HERO / HEADER */}
                <section className="relative pt-8 md:pt-12 pb-10 md:pb-16 overflow-hidden mb-6 md:mb-8 -mx-3 sm:-mx-4 md:-mx-8 px-3 sm:px-4 md:px-8 border-b border-border/50">
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
                            <h1 className="text-3xl sm:text-4xl md:text-7xl font-black tracking-tighter text-foreground uppercase italic leading-none">
                                Worship <span className="text-primary italic">Anywhere</span>
                            </h1>
                            <p className="text-muted-foreground text-xs sm:text-sm md:text-lg font-medium max-w-xl leading-relaxed">
                                Experience the presence of God through our live worship services and messages. Distance is not a barrier to encountering His grace.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 w-full sm:w-auto">
                            <Link href="https://www.facebook.com/clctagum/live" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                                <Button className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 rounded-xl sm:rounded-2xl bg-[#1877F2] hover:bg-[#1877F2]/90 text-white font-bold uppercase tracking-widest text-[10px] sm:text-xs gap-2 sm:gap-3 shadow-xl shadow-[#1877F2]/20">
                                    <Facebook className="w-4 sm:w-5 h-4 sm:h-5" />
                                    Watch on Facebook
                                </Button>
                            </Link>
                            <Link href="https://www.youtube.com/@clctagum" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                                <Button variant="outline" className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 rounded-xl sm:rounded-2xl border-border/50 font-bold uppercase tracking-widest text-[10px] sm:text-xs gap-2 sm:gap-3 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-500 transition-all">
                                    <Youtube className="w-4 sm:w-5 h-4 sm:h-5 text-red-500" />
                                    YouTube Channel
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                <div className="grid lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
                    {/* MAIN PLAYER AREA */}
                    <div className="lg:col-span-8 space-y-4 sm:space-y-6 lg:space-y-8">
                        <div className="space-y-3 sm:space-y-4">
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="w-1.5 sm:w-2 h-6 sm:h-8 bg-rose-500 rounded-full" />
                                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase italic tracking-tighter">Live <span className="text-rose-500">Stream</span></h2>
                                </div>
                                <div className="flex items-center gap-2 sm:gap-4 text-[9px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground bg-muted/30 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full">
                                    <Users className="w-3 sm:w-4 h-3 sm:h-4 text-primary" />
                                    <span className="hidden xs:inline">{liveVideo ? "Live Now" : "Latest Message"}</span>
                                    <span className="xs:hidden">{liveVideo ? "Live" : "Latest"}</span>
                                </div>
                            </div>

                            {/* FB LIVE EMBED - Using official embed_html when available */}
                            <div className="relative aspect-video rounded-xl sm:rounded-2xl md:rounded-[2.5rem] overflow-hidden bg-muted/30 border border-border/50 group shadow-xl sm:shadow-2xl">
                                {activeVideo?.embedHtml ? (
                                    // Use official Facebook embed_html (recommended by Facebook)
                                    <div
                                        className="absolute inset-0 w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0"
                                        dangerouslySetInnerHTML={{ __html: activeVideo.embedHtml }}
                                    />
                                ) : (
                                    // Fallback to manual embed URL
                                    <iframe
                                        src={fallbackEmbedUrl}
                                        className="absolute inset-0 w-full h-full"
                                        style={{ border: 'none' }}
                                        allowFullScreen={true}
                                        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                                    />
                                )}

                                {/* Overlay on hover */}
                                <div className="absolute inset-0 pointer-events-none bg-linear-to-t from-black/40 to-transparent flex items-end p-4 sm:p-6 md:p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="space-y-1 sm:space-y-2">
                                        <div className="text-white font-black italic uppercase tracking-tighter text-base sm:text-xl md:text-2xl">
                                            {activeVideo ? (
                                                <EditableVideoTitle
                                                    videoId={activeVideo.id}
                                                    initialTitle={activeVideo.manualTitle || activeVideo.title || "Worship Service"}
                                                    className="text-white"
                                                />
                                            ) : "Worship Service"}
                                        </div>
                                        <p className="text-white/80 font-bold uppercase tracking-widest text-[10px] sm:text-xs">Christian Life Center Tagum City</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-3 sm:gap-4 p-4 sm:p-6 bg-card/50 border border-border/50 rounded-xl sm:rounded-2xl md:rounded-[2rem]">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 w-full sm:w-auto">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Currently {liveVideo ? "Playing" : "Offline / Latest"}</span>
                                        <div className="font-black uppercase italic tracking-tighter text-base sm:text-lg md:text-xl line-clamp-2">
                                            {activeVideo ? (
                                                <EditableVideoTitle
                                                    videoId={activeVideo.id}
                                                    initialTitle={activeVideo.manualTitle || activeVideo.title || "Worship Service"}
                                                    className="text-foreground"
                                                />
                                            ) : "Worship Service"}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                                        <Button
                                            asChild
                                            variant="outline"
                                            className="w-full sm:w-auto h-10 sm:h-12 px-4 sm:px-6 rounded-lg sm:rounded-xl border-primary/20 bg-primary/5 font-black uppercase text-[9px] sm:text-[10px] tracking-widest gap-2 hover:bg-primary hover:text-white transition-all shadow-lg"
                                        >
                                            <a
                                                href={activeVideo?.videoUrl || "https://www.facebook.com/clctagum/live"}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Watch on Facebook <Share2 className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                                <div className="h-10 w-px bg-border hidden lg:block" />
                                <div className="hidden lg:flex flex-col">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Platform</span>
                                    <span className="font-bold text-xs uppercase tracking-widest flex items-center gap-2 text-primary">
                                        <Facebook className="w-3 h-3 fill-primary" />
                                        {liveVideo ? "Facebook Live" : "Facebook Playback"}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-1 sm:gap-2">
                                <Link href="https://www.facebook.com/clctagum/live" target="_blank">
                                    <Button variant="ghost" className="h-9 sm:h-10 px-2 sm:px-3 rounded-lg sm:rounded-xl gap-1 sm:gap-2 font-black uppercase text-[9px] sm:text-[10px] tracking-widest text-muted-foreground hover:text-primary">
                                        <MessageCircle className="w-3 sm:w-4 h-3 sm:h-4" />
                                        <span className="hidden xs:inline">Join Chat</span>
                                        <span className="xs:hidden">Chat</span>
                                    </Button>
                                </Link>
                                <Button variant="ghost" className="h-9 sm:h-10 px-2 sm:px-3 rounded-lg sm:rounded-xl gap-1 sm:gap-2 font-black uppercase text-[9px] sm:text-[10px] tracking-widest text-muted-foreground hover:text-primary">
                                    <Heart className="w-3 sm:w-4 h-3 sm:h-4 text-rose-500" />
                                    <span className="hidden xs:inline">Support</span>
                                    <span className="xs:hidden">Give</span>
                                </Button>
                                <Button variant="ghost" className="h-9 sm:h-10 px-2 sm:px-3 rounded-lg sm:rounded-xl gap-1 sm:gap-2 font-black uppercase text-[9px] sm:text-[10px] tracking-widest text-muted-foreground hover:text-primary border border-transparent hover:border-border">
                                    <ArrowUpRight className="w-3 sm:w-4 h-3 sm:h-4" />
                                    Share
                                </Button>
                            </div>
                        </div>

                        {/* ARCHIVE GRID moved back into main column */}
                        <div className="space-y-4 sm:space-y-6 pt-2 sm:pt-4">
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="w-1.5 sm:w-2 h-6 sm:h-8 bg-primary rounded-full" />
                                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase italic tracking-tighter">Recent <span className="text-primary">Services</span></h2>
                                </div>
                                <Link href="https://www.facebook.com/clctagum/videos" target="_blank" className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-1 group shrink-0">
                                    <span className="hidden xs:inline">View Full Archive</span>
                                    <span className="xs:hidden">All</span>
                                    <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                                {archives.map((video) => (
                                    <Link key={video.id} href={video.link} target="_blank" className="group">
                                        <Card className="bg-card/40 backdrop-blur-3xl border-border/50 rounded-xl sm:rounded-2xl md:rounded-[2rem] overflow-hidden hover:border-primary/50 transition-all hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1">
                                            <CardContent className="p-0">
                                                <div className="relative aspect-video">
                                                    <Image
                                                        src={video.image}
                                                        alt={video.title}
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                        unoptimized={video.image.startsWith("http")}
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                                                    <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 bg-black/70 backdrop-blur-md px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[8px] sm:text-[10px] font-bold text-white tracking-widest">
                                                        {video.duration}
                                                    </div>
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <div className="w-10 sm:w-12 h-10 sm:h-12 bg-primary rounded-full flex items-center justify-center text-white shadow-xl">
                                                            <Play className="w-5 sm:w-6 h-5 sm:h-6 fill-white ml-0.5 sm:ml-1" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="p-3 sm:p-4 md:p-6 space-y-1 sm:space-y-2">
                                                    <p className="text-[8px] sm:text-[10px] font-black uppercase text-primary tracking-widest">{video.date}</p>
                                                    <h3 className="font-bold text-sm sm:text-base md:text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">{video.title}</h3>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* SIDEBAR Correctly nested in grid */}
                    <div className="lg:col-span-4 space-y-4 sm:space-y-6 lg:space-y-8">
                        {/* SCHEDULE CARD */}
                        <Card className="bg-primary/5 border-primary/20 rounded-xl sm:rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-xl">
                            <CardContent className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 md:space-y-8">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <Calendar className="w-4 sm:w-5 h-4 sm:h-5 text-primary" />
                                        <h3 className="text-lg sm:text-xl md:text-2xl font-black uppercase italic tracking-tighter">Live <span className="text-primary">Schedule</span></h3>
                                    </div>
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
                                        Mark your calendars and set your reminders. Join our community in real-time.
                                    </p>
                                </div>

                                <div className="space-y-3 sm:space-y-4 md:space-y-6">
                                    {liveSchedule.map((item, i) => (
                                        <div key={i} className="flex items-start gap-3 sm:gap-4 group">
                                            <div className="p-2 sm:p-3 bg-background rounded-xl sm:rounded-2xl border border-primary/20 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                                <Clock className="w-3 sm:w-4 h-3 sm:h-4" />
                                            </div>
                                            <div className="space-y-0.5 sm:space-y-1">
                                                <p className="text-[9px] sm:text-[10px] font-black uppercase text-primary tracking-[0.15em] sm:tracking-[0.2em]">{item.day}</p>
                                                <p className="font-bold text-xs sm:text-sm">{item.label}</p>
                                                <p className="text-[10px] sm:text-xs font-medium text-muted-foreground italic">{item.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Button className="w-full h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-primary font-bold uppercase tracking-widest text-[10px] sm:text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform">
                                    Set Reminders
                                </Button>
                            </CardContent>
                        </Card>

                        {/* GIVING CTAS */}
                        <Card className="bg-card/50 border-border/50 rounded-xl sm:rounded-2xl md:rounded-[2.5rem] overflow-hidden">
                            <CardContent className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
                                <div className="w-10 sm:w-12 h-10 sm:h-12 bg-rose-500/10 rounded-xl sm:rounded-2xl flex items-center justify-center text-rose-500 mb-1 sm:mb-2">
                                    <Heart className="w-5 sm:w-6 h-5 sm:h-6 fill-rose-500" />
                                </div>
                                <div className="space-y-1 sm:space-y-2">
                                    <h3 className="text-lg sm:text-xl md:text-2xl font-black uppercase italic tracking-tighter">Partner with <span className="text-rose-500">Us</span></h3>
                                    <p className="text-[10px] sm:text-xs font-medium text-muted-foreground leading-relaxed">
                                        Your generosity allows us to continue reaching thousands with the message of hope through these broadcasts.
                                    </p>
                                </div>
                                <Link href="/giving" className="block">
                                    <Button variant="outline" className="w-full h-12 sm:h-14 rounded-xl sm:rounded-2xl border-border/50 font-bold uppercase tracking-widest text-[10px] sm:text-xs hover:border-rose-500 hover:text-rose-500 transition-all flex items-center justify-between px-4 sm:px-6 group">
                                        Give Online
                                        <ArrowUpRight className="w-3 sm:w-4 h-3 sm:h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        {/* CONNECT SECTION */}
                        <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 rounded-xl sm:rounded-2xl md:rounded-[2.5rem] bg-muted/30 border border-border/50 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-primary/5 rounded-full blur-3xl" />
                            <div className="space-y-1 sm:space-y-2">
                                <h4 className="text-base sm:text-lg font-black uppercase italic tracking-tighter">New here?</h4>
                                <p className="text-[10px] sm:text-xs font-medium text-muted-foreground">We'd love to connect with you and send you a gift.</p>
                            </div>
                            <Link href="/about" className="block">
                                <Button variant="link" className="p-0 h-auto font-black uppercase text-[9px] sm:text-[10px] tracking-widest text-primary hover:text-primary/80 group">
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
