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
    // ... data fetching ...
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

    // Filter logic...
    const archivedVideos = recentVideos.filter(v => {
        if (v.isLive) return false;
        const title = v.manualTitle || v.title || "";
        if (!title || title.toLowerCase().includes("untitled")) return false;
        if (!v.thumbnail || v.thumbnail === "/bg/word.webp" || !v.thumbnail.startsWith("http")) return false;
        return true;
    });

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
    const fallbackEmbedUrl = activeVideo?.videoUrl
        ? `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(activeVideo.videoUrl)}&show_text=0&width=1280&playsinline=1`
        : "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fclctagum%2Flive&show_text=0&width=1280&playsinline=1";


    return (
        <div className="min-h-[100dvh] pt-16 md:pt-20 pb-24 md:pb-10 px-3 sm:px-4 md:px-8 bg-background overflow-x-hidden">
            {/* Standard Mobile Header for consistency */}

            <div className="max-w-7xl mx-auto">
                {/* HERO / HEADER - Compact */}
                <section className="relative pt-4 md:pt-10 pb-6 md:pb-12 overflow-hidden mb-2 md:mb-6 -mx-3 sm:-mx-4 md:-mx-8 px-4 sm:px-6 md:px-8 border-b border-border/50">
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="/bg/events.webp"
                            alt="Watch Background"
                            fill
                            className="object-cover opacity-15 scale-105 transition-transform duration-1000 group-hover:scale-100"
                            priority
                        />
                        <div className="absolute inset-0 bg-linear-to-b from-background via-background/80 to-background" />
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-3 max-w-2xl">
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter text-foreground uppercase italic leading-none">
                                    Worship <span className="text-primary italic">Anywhere</span>
                                </h1>
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 shrink-0">
                                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                                    <span className="text-[9px] font-black uppercase tracking-wider">Live</span>
                                </div>
                            </div>
                            <p className="text-muted-foreground text-[11px] sm:text-xs md:text-sm font-medium leading-relaxed max-w-lg opacity-80 line-clamp-1 md:line-clamp-none">
                                Encounter God's presence through our live worship services and messages.
                            </p>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <Link href="https://www.facebook.com/clctagum/live" target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none">
                                <Button className="w-full h-10 px-5 rounded-xl bg-[#1877F2] hover:bg-[#1877F2]/90 text-white font-black uppercase tracking-widest text-[9px] gap-2 shadow-lg shadow-[#1877F2]/10 transition-all active:scale-95">
                                    <Facebook className="w-3.5 h-3.5" />
                                    {/* Shorter text for mobile */}
                                    <span className="sm:inline">Facebook Live</span>
                                </Button>
                            </Link>
                            <Link href="https://www.youtube.com/@clctagum" target="_blank" rel="noopener noreferrer" className="hidden xs:block">
                                <Button variant="ghost" className="h-10 px-3 rounded-xl border border-white/10 text-muted-foreground font-black uppercase tracking-widest text-[9px] gap-2 hover:bg-red-500/10 hover:text-red-500 transition-all">
                                    <Youtube className="w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                <div className="grid lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
                    {/* MAIN PLAYER AREA */}
                    <div className="lg:col-span-8 space-y-4 sm:space-y-6 lg:space-y-8">
                        <div className="flex flex-col gap-6 sm:gap-10">
                            {/* Header Section - Compact Meta Row */}
                            <div className="flex flex-col gap-2 px-2 sm:px-1">
                                <div className="flex items-center gap-3">
                                    <div className="px-2 py-0.5 bg-primary/10 border border-primary/20 rounded-md">
                                        <div className="flex items-center gap-1.5">
                                            {liveVideo && <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />}
                                            <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-primary">
                                                {liveVideo ? "Live Now" : "Latest"}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 italic">Now Playing</span>
                                </div>

                                <h2 className="text-xl sm:text-3xl font-black uppercase tracking-tighter leading-[0.9] pr-8">
                                    {activeVideo ? (
                                        <EditableVideoTitle
                                            videoId={activeVideo.id}
                                            initialTitle={activeVideo.manualTitle || activeVideo.title || "Worship Service"}
                                            className="text-foreground"
                                        />
                                    ) : (
                                        "Worship Service"
                                    )}
                                </h2>
                            </div>

                            {/* PLAYER CONTAINER - Action-Overlay Grid */}
                            <div className="relative aspect-video w-full rounded-2xl sm:rounded-[2rem] overflow-hidden bg-black shadow-2xl ring-1 ring-white/5 group isolate">
                                {activeVideo?.embedHtml ? (
                                    <div
                                        className="absolute inset-0 w-full h-full [&_iframe]:!w-full [&_iframe]:!h-full [&_iframe]:!border-0"
                                        dangerouslySetInnerHTML={{
                                            __html: activeVideo.embedHtml
                                                .replace(/width="\d+"/g, 'width="100%"')
                                                .replace(/height="\d+"/g, 'height="100%"')
                                                .replace(/style="[^"]*"/g, '')
                                                .replace('<iframe', '<iframe style="width:100% !important; height:100% !important; border:none !important;" playsinline')
                                        }}
                                    />
                                ) : (
                                    <iframe src={fallbackEmbedUrl} className="absolute inset-0 w-full h-full border-none" allowFullScreen allow="autoplay; playsinline" />
                                )}

                                {/* Overlay Actions - Top Right Share */}
                                <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-all active:scale-90">
                                        <Share2 className="w-4 h-4" />
                                    </Button>
                                </div>

                                {/* Overlay Actions - Bottom Left Watch on FB */}
                                <div className="absolute bottom-4 left-4 z-20">
                                    <Link href={activeVideo?.videoUrl || "https://www.facebook.com/clctagum/live"} target="_blank">
                                        <Button className="h-10 px-4 rounded-xl bg-[#1877F2]/80 backdrop-blur-md border border-white/10 text-white font-black uppercase tracking-widest text-[9px] gap-2 opacity-0 group-hover:opacity-100 transition-all hover:bg-[#1877F2]">
                                            <Facebook className="w-3.5 h-3.5" />
                                            <span>Watch with Chat</span>
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            {/* COMPACT INTERACTION ROW */}
                            <div className="flex items-center gap-2 px-2">
                                <div className="flex-1 flex items-center gap-1.5">
                                    <Button variant="ghost" className="h-9 px-3 rounded-xl gap-2 font-black uppercase text-[9px] tracking-widest text-muted-foreground bg-card/40 border border-white/5 hover:bg-primary/5 hover:text-primary transition-all">
                                        <Heart className="w-3.5 h-3.5" />
                                        <span className="hidden sm:inline">Partner</span>
                                    </Button>
                                    <Button variant="ghost" className="h-9 px-3 rounded-xl gap-2 font-black uppercase text-[9px] tracking-widest text-muted-foreground bg-card/40 border border-white/5 hover:bg-primary/5 hover:text-primary transition-all">
                                        <MessageCircle className="w-3.5 h-3.5" />
                                        <span className="hidden sm:inline">Connect</span>
                                    </Button>
                                </div>
                                <div className="hidden sm:flex items-center gap-1 text-muted-foreground/30 italic uppercase font-black text-[8px] tracking-[0.2em]">
                                    CLC Digital Experience
                                </div>
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

                            <div className="grid grid-cols-2 xs:grid-cols-2 gap-2 sm:gap-4 md:gap-6">
                                {archives.map((video) => (
                                    <Link key={video.id} href={video.link} target="_blank" className="group">
                                        <Card className="bg-card/40 backdrop-blur-3xl border-white/5 rounded-xl sm:rounded-2xl overflow-hidden hover:border-primary/40 transition-all hover:shadow-2xl hover:shadow-primary/5 active:scale-95 p-0 gap-0">
                                            <CardContent className="p-0">
                                                <div className="relative aspect-video">
                                                    <Image
                                                        src={video.image}
                                                        alt={video.title}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                        unoptimized={video.image.startsWith("http")}
                                                    />
                                                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />

                                                    {/* Top Left Date Badge */}
                                                    <div className="absolute top-2 left-2 z-10 px-1.5 py-0.5 bg-black/60 backdrop-blur-md rounded border border-white/10 text-[7px] sm:text-[9px] font-black uppercase text-white tracking-wider">
                                                        {video.date}
                                                    </div>

                                                    {/* Middle Play Icon */}
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/90 rounded-full flex items-center justify-center text-white">
                                                            <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
                                                        </div>
                                                    </div>

                                                    {/* Bottom Overlay Title */}
                                                    <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 bg-linear-to-t from-black/80 to-transparent">
                                                        <h3 className="font-bold text-[10px] sm:text-xs md:text-sm leading-tight text-white line-clamp-2">
                                                            {video.title}
                                                        </h3>
                                                    </div>
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
                        <Card className="bg-primary/5 border-primary/20 rounded-xl sm:rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-xl p-0 gap-0">
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
                        <Card className="bg-card/50 border-border/50 rounded-xl sm:rounded-2xl md:rounded-[2.5rem] overflow-hidden p-0 gap-0">
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
