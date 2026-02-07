import { Tv, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import VideoSync from "./sync-button";

export default function AdminWatchPage() {
    return (
        <div className="min-h-screen bg-background p-4 md:p-8 space-y-8 max-w-4xl mx-auto pt-24">
            <header className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin">
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black uppercase italic tracking-tighter">Manage <span className="text-primary">Watch Page</span></h1>
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Video automation & Archives</p>
                    </div>
                </div>
                <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                    <Tv className="w-6 h-6" />
                </div>
            </header>

            <div className="grid gap-8">
                <VideoSync />

                <div className="bg-muted/30 border border-border/50 rounded-[2rem] p-8 space-y-4">
                    <h3 className="font-bold uppercase tracking-widest text-sm">How it works</h3>
                    <ul className="space-y-4">
                        {[
                            { title: "Facebook Live", desc: "When CLC Tagum starts a live stream, the public page will automatically switch to show the live player." },
                            { title: "Automatic Archives", desc: "Past services are automatically moved to the recent services section for playback." },
                            { title: "Real Data", desc: "No more manually updating links. The system pulls the latest video ID directly from your Facebook page." }
                        ].map((item, i) => (
                            <li key={i} className="flex gap-4">
                                <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold shrink-0">{i + 1}</div>
                                <div className="space-y-1">
                                    <p className="font-bold text-sm leading-none">{item.title}</p>
                                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
