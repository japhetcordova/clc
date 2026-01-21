import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, MapPin, Calendar, Heart, BookOpen, Share2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function PrayerAndFastingPage() {
    // Calculate current day of the fast
    const startDate = new Date('2026-01-10');
    const today = new Date();
    const diffTime = today.getTime() - startDate.getTime();
    const dayNumber = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

    let dayDisplay = "21 Days";
    let labelDisplay = "Duration";

    if (dayNumber > 0 && dayNumber <= 21) {
        dayDisplay = `Day ${dayNumber}`;
        labelDisplay = "Current Day";
    } else if (dayNumber > 21) {
        dayDisplay = "Completed";
        labelDisplay = "Status";
    } else {
        dayDisplay = "Starts Soon";
        labelDisplay = "Status";
    }

    return (
        <div className="flex flex-col min-h-screen bg-background relative selection:bg-rose-500/30">
            {/* HERO SECTION */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-24 pb-12">

                <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full text-center space-y-12">
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 backdrop-blur-md">
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-rose-500">Jan 10 - Jan 31, 2026</span>
                        </div>

                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase italic leading-none">
                            21 Days of <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-rose-600 to-rose-400">Prayer &</span> Fasting
                        </h1>

                        <p className="max-w-2xl mx-auto text-muted-foreground font-medium text-xl leading-relaxed">
                            A designated season to consecrate ourselves, seek God's face, and declare His lordship over the year ahead.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-b border-rose-500/10 py-8">
                        {[
                            { label: labelDisplay, value: dayDisplay, icon: Clock },
                            { label: "Daily Prayer", value: "6:00 PM", icon: Heart },
                            { label: "Location", value: "Tagum Hub", icon: MapPin },
                            { label: "Theme", value: "Overflow", icon: BookOpen },
                        ].map((stat, i) => (
                            <div key={i} className="text-center space-y-2 p-4 rounded-2xl hover:bg-rose-500/5 transition-colors group">
                                <stat.icon className="w-6 h-6 mx-auto text-rose-500 mb-2 opacity-50 group-hover:opacity-100 transition-opacity" />
                                <div className="text-2xl font-black uppercase italic tracking-tight">{stat.value}</div>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CONTENT SECTION */}
            <section className="py-20 px-4 md:px-8 bg-muted/30">
                <div className="max-w-4xl mx-auto space-y-16">
                    <div className="space-y-8">
                        <h2 className="text-4xl font-black uppercase italic tracking-tight text-center">Why We <span className="text-rose-500">Fast</span></h2>
                        <div className="prose prose-lg dark:prose-invert mx-auto text-muted-foreground leading-relaxed text-center sm:text-left">
                            <p>
                                Biblical fasting is refraining from food for a spiritual purpose. It is a discipline that disconnects us from the world to connect us more deeply with God. When we fast, we are not trying to twist God's arm or earn His favor; rather, we are positioning our hearts to receive what He has already poured out.
                            </p>
                            <p>
                                During these 21 days, we are believing for breakthroughs in families, healing in bodies, and revival in our community. We invite you to join us as we hunger for God more than food.
                            </p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="p-8 rounded-[2.5rem] bg-background border border-border shadow-lg space-y-6">
                            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-black uppercase italic tracking-tight">Schedule</h3>
                            <ul className="space-y-4">
                                {[
                                    { time: "12:00 PM", event: "Midday Prayer Pause" },
                                    { time: "Tue 6:00 PM", event: "Weekly Meet at Tagum Hub" },
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
                                        <span className="font-black text-rose-500 text-sm whitespace-nowrap">{item.time}</span>
                                        <span className="font-medium text-sm">{item.event}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="p-8 rounded-[2.5rem] bg-rose-500 text-white shadow-xl shadow-rose-500/20 space-y-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md relative z-10">
                                <Share2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-black uppercase italic tracking-tight relative z-10">Share the Journey</h3>
                            <p className="font-medium opacity-90 relative z-10">
                                Encouragement is contagious. Share your revelations, prayer requests, and testimonies using our official hashtag.
                            </p>
                            <div className="pt-4 relative z-10">
                                <div className="inline-block px-6 py-3 rounded-xl bg-white/10 border border-white/20 font-black tracking-widest uppercase text-sm backdrop-blur-md">
                                    #CLCPrayer2026
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center pt-8">
                        <Link href="/events">
                            <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-rose-500 font-black uppercase text-xs tracking-widest">
                                <ArrowLeft className="w-4 h-4" /> Back to All Events
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
