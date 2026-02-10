"use client";

import Link from "next/link";
import { Play, ExternalLink, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getEmbedUrl, getYoutubeId, getCloudflareId } from "../../curriculum-data";

interface VideoPlayerSectionProps {
    selectedLevel: string;
    selectedVideo: { title: string; url: string };
    isPlaying: boolean;
    setIsPlaying: (val: boolean) => void;
    watchedVideos: string[];
    toggleWatched: (url: string) => void;
}

export function VideoPlayerSection({
    selectedLevel,
    selectedVideo,
    isPlaying,
    setIsPlaying,
    watchedVideos,
    toggleWatched
}: VideoPlayerSectionProps) {
    const isWatched = watchedVideos.includes(selectedVideo.url);

    const renderPlayer = () => {
        if (!selectedVideo.url) return null;

        const isYoutube = selectedVideo.url.includes('youtube.com') || selectedVideo.url.includes('youtu.be');
        const isCloudflare = selectedVideo.url.includes('cloudflarestream.com') || selectedVideo.url.includes('videodelivery.net');
        const isMp4 = selectedVideo.url.endsWith('.mp4') || selectedVideo.url.includes('.mp4?');

        if (isYoutube) {
            if (!isPlaying) {
                const youtubeId = getYoutubeId(selectedVideo.url);
                return (
                    <div
                        className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer group/overlay"
                        onClick={() => setIsPlaying(true)}
                    >
                        {youtubeId ? (
                            <img
                                src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
                                alt={selectedVideo.title}
                                className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                            />
                        ) : (
                            <div className="absolute inset-0 bg-zinc-900" />
                        )}
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-0" />
                        <div className="w-16 h-16 rounded-full bg-red-600/90 backdrop-blur-md flex items-center justify-center border border-red-400/30 group-hover/overlay:scale-110 transition-all duration-300 relative z-10 shadow-2xl">
                            <Play className="w-6 h-6 text-white fill-white ml-1" />
                        </div>
                        <div className="absolute bottom-6 left-6 right-6 z-10 text-left">
                            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-red-500 mb-2 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                YouTube Resource
                            </p>
                            <h5 className="text-xl font-black text-white uppercase italic leading-tight line-clamp-2">{selectedVideo.title}</h5>
                        </div>
                    </div>
                );
            }
            return (
                <iframe
                    src={getEmbedUrl(selectedVideo.url) + "?autoplay=1&modestbranding=1&rel=0"}
                    className="absolute inset-0 w-full h-full border-none"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                />
            );
        }

        if (isCloudflare) {
            if (!isPlaying) {
                const cfId = getCloudflareId(selectedVideo.url);
                return (
                    <div
                        className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer group/overlay"
                        onClick={() => setIsPlaying(true)}
                    >
                        {cfId ? (
                            <img
                                src={`https://iframe.videodelivery.net/${cfId}/thumbnails/thumbnail.jpg?height=600`}
                                alt={selectedVideo.title}
                                className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                            />
                        ) : (
                            <div className="absolute inset-0 bg-zinc-900" />
                        )}
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-0" />
                        <div className="w-16 h-16 rounded-full bg-primary/90 backdrop-blur-md flex items-center justify-center border border-primary/30 group-hover/overlay:scale-110 transition-all duration-300 relative z-10 shadow-2xl">
                            <Play className="w-6 h-6 text-white fill-white ml-1" />
                        </div>
                        <div className="absolute bottom-6 left-6 right-6 z-10 text-left">
                            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-primary mb-2 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                Premium Stream
                            </p>
                            <h5 className="text-xl font-black text-white uppercase italic leading-tight line-clamp-2">{selectedVideo.title}</h5>
                        </div>
                    </div>
                );
            }
            return (
                <iframe
                    src={getEmbedUrl(selectedVideo.url) + "?autoplay=true"}
                    className="absolute inset-0 w-full h-full border-none"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                />
            );
        }

        if (isMp4) {
            if (!isPlaying) {
                return (
                    <div
                        className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer group/overlay"
                        onClick={() => setIsPlaying(true)}
                    >
                        <div className="absolute inset-0 bg-zinc-900">
                            <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-transparent to-rose-500/10" />
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.15),transparent_70%)]" />
                        </div>
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-0" />
                        <div className="w-16 h-16 rounded-full bg-primary/90 backdrop-blur-md flex items-center justify-center border border-primary/30 group-hover/overlay:scale-110 transition-all duration-300 relative z-10 shadow-2xl">
                            <Play className="w-6 h-6 text-white fill-white ml-1" />
                        </div>
                        <div className="absolute bottom-6 left-6 right-6 z-10 text-left">
                            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-primary mb-2 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                High-Speed Native Stream
                            </p>
                            <h5 className="text-xl font-black text-white uppercase italic leading-tight line-clamp-2">{selectedVideo.title}</h5>
                        </div>
                    </div>
                );
            }
            return (
                <video
                    src={selectedVideo.url}
                    className="absolute inset-0 w-full h-full object-contain bg-black"
                    controls
                    autoPlay
                    playsInline
                />
            );
        }

        // Fallback for Google Drive or others
        return (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950">
                <div className="text-center space-y-6 p-12">
                    <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                        <Play className="w-8 h-8 text-primary/40 fill-primary/10 ml-1" />
                    </div>
                    <div className="space-y-2">
                        <p className="text-[8px] font-black uppercase tracking-[0.3em] text-primary/60">Cloud Source</p>
                        <h5 className="text-xl font-black text-white uppercase italic leading-tight max-w-sm">{selectedVideo.title}</h5>
                    </div>
                    <Link href={selectedVideo.url} target="_blank" rel="noopener noreferrer">
                        <Button className="rounded-full px-8 h-12 font-black uppercase text-[10px] tracking-widest gap-3 bg-primary text-primary-foreground shadow-2xl hover:scale-105 active:scale-95 transition-all">
                            View Source
                            <ExternalLink className="w-3.5 h-3.5" />
                        </Button>
                    </Link>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6 sm:space-y-10">
            <div className="flex flex-col gap-4 sm:gap-6 px-1">
                <div className="flex items-center gap-3">
                    <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
                        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-primary">{selectedLevel}</span>
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40 italic">Now Playing</span>
                </div>

                <h2 className="text-xl sm:text-4xl font-black uppercase tracking-tighter leading-tight">
                    {selectedVideo.title}
                </h2>
            </div>

            <div className="relative aspect-video w-full max-h-[60dvh] sm:max-h-none rounded-2xl sm:rounded-[3rem] overflow-hidden bg-black shadow-2xl ring-1 ring-white/10 group isolate">
                {selectedVideo.url ? (
                    <div className="absolute inset-0 w-full h-full">
                        {renderPlayer()}
                    </div>
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted/5">
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                                <Play className="w-8 h-8 text-primary/40" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Select a lesson to begin</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch gap-4 px-1">
                <button
                    onClick={() => toggleWatched(selectedVideo.url)}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-3 h-14 sm:h-16 rounded-full border transition-all text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl active:scale-95",
                        isWatched
                            ? "bg-emerald-500 text-white border-emerald-400 shadow-emerald-500/30"
                            : "bg-primary text-primary-foreground border-primary/20 shadow-primary/40 hover:scale-[1.01]"
                    )}
                >
                    {isWatched ? (
                        <>
                            <CheckCircle className="w-5 h-5" />
                            Completed
                        </>
                    ) : (
                        <>
                            <div className="w-2.5 h-2.5 rounded-full border-2 border-current" />
                            Mark as Done
                        </>
                    )}
                </button>
                {selectedVideo.url && (
                    <div className="flex justify-center sm:contents">
                        <Link href={selectedVideo.url} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                            <Button
                                className="rounded-full h-14 sm:h-16 w-full sm:w-16 border-white/5 bg-card/50 hover:bg-card shadow-xl transition-all active:scale-90 flex items-center justify-center gap-2 sm:gap-0"
                            >
                                <ExternalLink className="w-5 h-5 text-muted-foreground" />
                                <span className="sm:hidden text-[10px] font-black uppercase tracking-widest text-muted-foreground">Open Link</span>
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
