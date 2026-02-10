"use client";

import { motion } from "framer-motion";
import { Play, Book, CheckCircle, ChevronRight, ExternalLink, Home, ArrowLeft, Lock, Wrench, User as UserIcon, Clock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import React, { useState, useEffect, useRef } from "react";
import { SecurityGate } from "@/components/SecurityGate";
import { trpc } from "@/lib/trpc/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { curriculum, classLevelToCurriculumKey, getEmbedUrl, getLessonCount, getYoutubeId, getCloudflareId } from "../curriculum-data";

interface VideosViewProps {
    user: any;
    qrValue: string;
    enrollments?: { classLevel: string; status: string }[];
    initialAuthorized: boolean;
}

export default function VideosView({ user, qrValue, enrollments = [], initialAuthorized }: VideosViewProps) {
    const [isDeveloperMode, setIsDeveloperMode] = useState(false);
    const [isLocalhost, setIsLocalhost] = useState(false);

    useEffect(() => {
        setIsLocalhost(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    }, []);

    const enrolledClassKeys = isDeveloperMode
        ? Object.keys(curriculum)
        : enrollments
            .filter(e => e.status === 'active' || e.status === 'completed')
            .map(e => classLevelToCurriculumKey[e.classLevel])
            .filter(Boolean);

    const getFirstLesson = (level: string) => {
        const levelData = curriculum[level as keyof typeof curriculum];
        if (!levelData) return null;
        return Array.isArray(levelData) ? levelData[0] : (Object.values(levelData)[0] as any[])[0];
    };

    const initialLevel = enrolledClassKeys[0] || "LIFE CLASS";
    const initialLesson = getFirstLesson(initialLevel);

    const [selectedLevel, setSelectedLevel] = useState(initialLevel);
    const [selectedVideo, setSelectedVideo] = useState({
        title: initialLesson?.description || initialLesson?.title || "Learning from our mistakes",
        url: initialLesson?.url || ""
    });
    const [isPlaying, setIsPlaying] = useState(false);
    const [watchedVideos, setWatchedVideos] = useState<string[]>([]);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem(`watched_videos_${qrValue}`);
        if (stored) setWatchedVideos(JSON.parse(stored));

        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [qrValue]);

    const toggleWatched = (url: string) => {
        const newWatched = watchedVideos.includes(url)
            ? watchedVideos.filter(u => u !== url)
            : [...watchedVideos, url];
        setWatchedVideos(newWatched);
        localStorage.setItem(`watched_videos_${qrValue}`, JSON.stringify(newWatched));
    };

    const verifyMutation = trpc.verifyProfilePin.useMutation();

    return (
        <SecurityGate
            title="Identity Access"
            description="Enter your registered contact number to unlock your Digital ID."
            icon={<Lock className="w-8 h-8 text-primary" />}
            accentColor="primary"
            initialAuthorized={initialAuthorized}
            storageKey={`profile_auth_${qrValue}`}
            onVerify={async (pin) => {
                const result = await verifyMutation.mutateAsync({ qrCodeId: qrValue, pin });
                return result;
            }}
            onAuthorized={() => {
                toast.success("Access Granted");
            }}
            footerNote="Contact admin if you forgot your registered details."
        >
            {/* 1. App Root - Bulletproof Viewport Units */}
            <div className="flex flex-col min-h-[100svh] min-h-[100lvh] min-h-[100dvh] bg-muted/20 relative overflow-x-hidden">
                {/* Dynamic Background Blobs - Isolated from transforms */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-rose-500/5 rounded-full blur-[100px]" />
                </div>

                {/* 2. Sticky Header - Outside Main Scroll if possible, but here we keep it sticky relative to body */}
                <header className={cn(
                    "sticky top-0 z-50 transition-all duration-300 px-4 sm:px-8",
                    scrolled ? "bg-card/90 backdrop-blur-2xl border-b border-white/5 py-3 shadow-lg" : "py-6"
                )}>
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link href={`/profile/${qrValue}`}>
                                <Button variant="ghost" size="icon" className="rounded-2xl hover:bg-primary/10 transition-colors h-10 w-10 border border-white/5">
                                    <ArrowLeft className="w-5 h-5 text-primary" />
                                </Button>
                            </Link>
                            <div className="min-w-0">
                                <h1 className={cn(
                                    "font-black uppercase tracking-tighter flex items-center gap-2 italic transition-all duration-300 truncate",
                                    scrolled ? "text-sm sm:text-lg" : "text-xl sm:text-2xl"
                                )}>
                                    Materials
                                </h1>

                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {isLocalhost && (
                                <button
                                    onClick={() => {
                                        setIsDeveloperMode(!isDeveloperMode);
                                        toast.info(isDeveloperMode ? "Developer Mode Disabled" : "Developer Mode Enabled");
                                    }}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-1.5 border rounded-2xl transition-all",
                                        isDeveloperMode ? "bg-rose-500/10 border-rose-500/20" : "bg-emerald-500/10 border-emerald-500/20"
                                    )}
                                >
                                    <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", isDeveloperMode ? "bg-rose-500" : "bg-emerald-500")} />
                                    <span className="text-[8px] font-black uppercase tracking-widest text-foreground hidden sm:inline">{isDeveloperMode ? "Developer" : "Authorized Access"}</span>
                                </button>
                            )}
                        </div>
                    </div>
                </header>

                {/* 3. Main Content - The actual scrolling container */}
                <main className="flex-1 relative z-10 px-2 sm:px-4 md:px-8 pb-[calc(100px+env(safe-area-inset-bottom))] sm:pb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-7xl mx-auto"
                    >

                        <Card className="border-none shadow-2xl bg-card/50 backdrop-blur-xl ring-1 ring-border p-4 sm:p-8">
                            {enrolledClassKeys.length === 0 ? (
                                <div className="text-center py-24 space-y-6">
                                    <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto ring-8 ring-primary/5">
                                        <Book className="w-10 h-10 text-muted-foreground/50" />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="font-black text-2xl uppercase italic tracking-tighter">No Active Enrollments</h2>
                                        <p className="text-muted-foreground text-xs uppercase tracking-widest max-w-xs mx-auto">You are not currently enrolled in any class levels to access materials.</p>
                                    </div>
                                    <Link href="/classes">
                                        <Button className="rounded-2xl h-12 px-8 font-black uppercase text-[11px] tracking-widest gap-3 shadow-xl">
                                            Browse Classes
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    {/* Level Selector - Pill Tabs */}
                                    <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
                                        {Object.keys(curriculum)
                                            .filter(level => enrolledClassKeys.includes(level))
                                            .map((level) => {
                                                const count = getLessonCount(level);
                                                return (
                                                    <Button
                                                        key={level}
                                                        variant="ghost"
                                                        onClick={() => {
                                                            setSelectedLevel(level);
                                                            const firstLesson = getFirstLesson(level);
                                                            if (firstLesson) {
                                                                setSelectedVideo({ title: firstLesson.description, url: firstLesson.url });
                                                                setIsPlaying(false);
                                                            }
                                                        }}
                                                        className={cn(
                                                            "rounded-full h-10 px-5 font-black uppercase text-[10px] tracking-[0.2em] shrink-0 transition-all flex items-center gap-2 border border-transparent",
                                                            selectedLevel === level
                                                                ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20 scale-105"
                                                                : "bg-muted/50 text-muted-foreground hover:bg-muted/80"
                                                        )}
                                                    >
                                                        {level}
                                                        <span className={cn(
                                                            "text-[9px] px-1.5 py-0.5 rounded-full font-black",
                                                            selectedLevel === level ? "bg-white/20 text-white" : "bg-muted-foreground/20 text-muted-foreground"
                                                        )}>
                                                            {count}
                                                        </span>
                                                    </Button>
                                                );
                                            })}
                                    </div>

                                    <div className="flex flex-col gap-8">
                                        {/* Video Player Section */}
                                        <div className="space-y-6">
                                            {/* Header Info - Above Video for Focus */}
                                            <div className="space-y-2 px-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[9px] font-black bg-primary/10 text-primary px-3 py-1 rounded-full uppercase tracking-widest">{selectedLevel}</span>
                                                    <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em]">Now Playing</span>
                                                </div>
                                                <h4 className="font-black text-2xl sm:text-4xl uppercase tracking-tighter leading-tight">{selectedVideo.title}</h4>
                                            </div>

                                            <div className="relative w-full h-0 pb-[56.25%] rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden bg-black shadow-2xl ring-1 ring-white/10 group">
                                                {!selectedVideo.url ? (
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground bg-muted/10">
                                                        <Play className="w-10 h-10 mb-3 opacity-20" />
                                                        <p className="font-black uppercase text-[9px] tracking-[0.3em]">Production Module</p>
                                                    </div>
                                                ) : (selectedVideo.url.includes('youtube.com') || selectedVideo.url.includes('youtu.be')) ? (
                                                    !isPlaying ? (
                                                        <div
                                                            className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer group/overlay"
                                                            onClick={() => setIsPlaying(true)}
                                                        >
                                                            {getYoutubeId(selectedVideo.url) ? (
                                                                <div className="absolute inset-0 bg-muted animate-pulse">
                                                                    <img
                                                                        src={`https://img.youtube.com/vi/${getYoutubeId(selectedVideo.url)}/maxresdefault.jpg`}
                                                                        alt={selectedVideo.title}
                                                                        className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 opacity-0 onLoad-show"
                                                                        onLoad={(e) => (e.currentTarget.classList.add('opacity-100'), e.currentTarget.parentElement?.classList.remove('animate-pulse'))}
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <div className="absolute inset-0 bg-zinc-900" />
                                                            )}
                                                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-0" />
                                                            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent z-0" />
                                                            <div className="w-16 h-16 rounded-full bg-red-600/90 backdrop-blur-md flex items-center justify-center border border-red-400/30 group-hover/overlay:scale-110 transition-all duration-300 relative z-10 shadow-2xl">
                                                                <Play className="w-6 h-6 text-white fill-white ml-1" />
                                                            </div>
                                                            <div className="absolute bottom-6 left-6 right-6 z-10 text-left">
                                                                <p className="text-[8px] font-black uppercase tracking-[0.4em] text-red-500 mb-2 flex items-center gap-2">
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                                                    YouTube Resource
                                                                </p>
                                                                <h5 className="text-xl font-black text-white uppercase italic leading-tight line-clamp-2">{selectedVideo.title}</h5>
                                                                <p className="text-[8px] font-bold text-white/50 uppercase tracking-widest mt-2 flex items-center gap-2">
                                                                    <Clock className="w-3 h-3" />
                                                                    Tap to Play Lesson
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <iframe
                                                            src={getEmbedUrl(selectedVideo.url) + "?autoplay=1&modestbranding=1&rel=0"}
                                                            className="absolute inset-0 w-full h-full border-none"
                                                            allow="autoplay; encrypted-media"
                                                            allowFullScreen
                                                        />
                                                    )
                                                ) : selectedVideo.url.includes('cloudflarestream.com') || selectedVideo.url.includes('videodelivery.net') ? (
                                                    !isPlaying ? (
                                                        <div
                                                            className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer group/overlay"
                                                            onClick={() => setIsPlaying(true)}
                                                        >
                                                            {getCloudflareId(selectedVideo.url) ? (
                                                                <div className="absolute inset-0 bg-muted animate-pulse">
                                                                    <img
                                                                        src={`https://iframe.videodelivery.net/${getCloudflareId(selectedVideo.url)}/thumbnails/thumbnail.jpg?time=0s&height=600`}
                                                                        alt={selectedVideo.title}
                                                                        className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 opacity-0 onLoad-show"
                                                                        onLoad={(e) => (e.currentTarget.classList.add('opacity-100'), e.currentTarget.parentElement?.classList.remove('animate-pulse'))}
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <div className="absolute inset-0 bg-zinc-900" />
                                                            )}
                                                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-0" />
                                                            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent z-0" />
                                                            <div className="w-16 h-16 rounded-full bg-primary/90 backdrop-blur-md flex items-center justify-center border border-primary/30 group-hover/overlay:scale-110 transition-all duration-300 relative z-10 shadow-2xl shadow-primary/20">
                                                                <Play className="w-6 h-6 text-white fill-white ml-1" />
                                                            </div>
                                                            <div className="absolute bottom-6 left-6 right-6 z-10 text-left">
                                                                <p className="text-[8px] font-black uppercase tracking-[0.4em] text-primary mb-2 flex items-center gap-2">
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                                                    Premium Stream
                                                                </p>
                                                                <h5 className="text-xl font-black text-white uppercase italic leading-tight line-clamp-2">{selectedVideo.title}</h5>
                                                                <p className="text-[8px] font-bold text-white/50 uppercase tracking-widest mt-2 flex items-center gap-2">
                                                                    <Clock className="w-3 h-3" />
                                                                    Tap to Play Lesson
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <iframe
                                                            src={getEmbedUrl(selectedVideo.url) + "?autoplay=true"}
                                                            className="absolute inset-0 w-full h-full border-none"
                                                            allow="autoplay; encrypted-media"
                                                            allowFullScreen
                                                        />
                                                    )
                                                ) : (selectedVideo.url.endsWith('.mp4') || selectedVideo.url.includes('.mp4?')) ? (
                                                    !isPlaying ? (
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
                                                                <p className="text-[8px] font-bold text-white/50 uppercase tracking-widest mt-2 flex items-center gap-2">
                                                                    <Clock className="w-3 h-3" />
                                                                    Tap to Play MP4 Lesson
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <video
                                                            src={selectedVideo.url}
                                                            className="absolute inset-0 w-full h-full object-contain bg-black"
                                                            controls
                                                            autoPlay
                                                            playsInline
                                                        />
                                                    )
                                                ) : (
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
                                                        <div className="relative z-10 text-center space-y-6 p-12">
                                                            <div className="w-16 h-16 mx-auto rounded-3xl bg-linear-to-br from-blue-500 via-emerald-500 to-amber-500 flex items-center justify-center shadow-2xl ring-1 ring-white/20">
                                                                <Play className="w-8 h-8 text-white fill-white ml-1" />
                                                            </div>
                                                            <div className="space-y-3">
                                                                <p className="text-[8px] font-black uppercase tracking-[0.3em] text-blue-400">Drive Private Source</p>
                                                                <h5 className="text-xl font-black text-white uppercase italic leading-tight max-w-sm line-clamp-2">{selectedVideo.title}</h5>
                                                                <p className="text-[8px] font-bold text-white/50 uppercase tracking-widest mt-2">Open with Google Drive App</p>
                                                            </div>
                                                            <Link
                                                                href={selectedVideo.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                <Button className="rounded-full px-10 h-12 font-black uppercase text-[10px] tracking-widest gap-3 bg-white text-black hover:bg-zinc-200 shadow-2xl hover:scale-105 active:scale-95 transition-all">
                                                                    View Source
                                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-3 pt-2">
                                                <button
                                                    onClick={() => toggleWatched(selectedVideo.url)}
                                                    className={cn(
                                                        "flex-1 flex items-center justify-center gap-2 px-6 h-12 rounded-2xl border transition-all text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95",
                                                        watchedVideos.includes(selectedVideo.url)
                                                            ? "bg-emerald-500 text-white border-emerald-400 shadow-emerald-500/10"
                                                            : "bg-primary text-primary-foreground border-primary/20 shadow-primary/20"
                                                    )}
                                                >
                                                    {watchedVideos.includes(selectedVideo.url) ? (
                                                        <>
                                                            <Check className="w-4 h-4" />
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
                                                    <Link href={selectedVideo.url} target="_blank" rel="noopener noreferrer">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="rounded-2xl h-12 w-12 border-2 bg-card/50 hover:bg-card border-white/5 shadow-xl transition-all active:scale-90"
                                                        >
                                                            <ExternalLink className="w-5 h-5 text-muted-foreground" />
                                                        </Button>
                                                    </Link>
                                                )}
                                            </div>
                                        </div>

                                        {/* Lessons Side-by-Side on Desktop */}
                                        <div className="grid lg:grid-cols-[1fr_380px] gap-8 xl:gap-12">
                                            <div className="hidden lg:block" />

                                            <div className="bg-muted/30 rounded-[2rem] border border-white/5 p-4 sm:p-6 flex flex-col h-[500px] lg:h-[600px] shadow-inner">
                                                <div className="pb-4 mb-4 border-b border-border/50">
                                                    <h5 className="font-black uppercase tracking-widest text-[11px] text-muted-foreground flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-primary" />
                                                        Lesson Modules
                                                    </h5>
                                                </div>
                                                <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/20">
                                                    {Array.isArray(curriculum[selectedLevel as keyof typeof curriculum]) ? (
                                                        <div className="space-y-3">
                                                            {(curriculum[selectedLevel as keyof typeof curriculum] as any[]).map((lesson) => (
                                                                <LessonRow
                                                                    key={lesson.id}
                                                                    lesson={lesson}
                                                                    isWatched={watchedVideos.includes(lesson.url)}
                                                                    isSelected={selectedVideo.url === lesson.url}
                                                                    onSelect={() => {
                                                                        setSelectedVideo({ title: lesson.description || lesson.title, url: lesson.url });
                                                                        setIsPlaying(true);
                                                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                                                    }}
                                                                />
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        Object.entries(curriculum[selectedLevel as keyof typeof curriculum] as Record<string, any[]>).map(([moduleName, lessons]) => (
                                                            <div key={moduleName} className="space-y-4 mb-8">
                                                                <div className="sticky top-0 z-10 bg-muted/90 backdrop-blur-md py-2 px-2 rounded-xl mb-4 border border-border/50">
                                                                    <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">{moduleName}</h5>
                                                                </div>
                                                                <div className="space-y-3">
                                                                    {lessons.map((lesson) => (
                                                                        <LessonRow
                                                                            key={lesson.id}
                                                                            lesson={lesson}
                                                                            isWatched={watchedVideos.includes(lesson.url)}
                                                                            isSelected={selectedVideo.url === lesson.url}
                                                                            onSelect={() => {
                                                                                setSelectedVideo({ title: lesson.description || lesson.title, url: lesson.url });
                                                                                setIsPlaying(true);
                                                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                                                            }}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Archive Link - More Subtle */}
                                        <div className="pt-12 text-center">
                                            <Link
                                                href="https://drive.google.com/drive/folders/13d1rw_OHwwiPMq6hJkc01Ee-RL0OoEUr"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors hover:scale-105 active:scale-95"
                                            >
                                                <ExternalLink className="w-3.5 h-3.5" />
                                                Explore Complete Cloud Archive
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Card>
                    </motion.div>
                </main>
            </div>
        </SecurityGate>
    );
}

function LessonRow({ lesson, isSelected, onSelect, isWatched }: { lesson: any, isSelected: boolean, onSelect: () => void, isWatched: boolean }) {
    return (
        <button
            onClick={onSelect}
            disabled={!lesson.url}
            className={cn(
                "w-full flex items-center gap-3 p-3 rounded-2xl border transition-all text-left group",
                isSelected
                    ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]"
                    : lesson.url
                        ? "bg-card/50 hover:bg-card border-white/5 active:scale-98"
                        : "bg-muted/10 border-dashed border-border/30 opacity-50 cursor-not-allowed"
            )}
        >
            <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                isSelected ? "bg-white/20" : isWatched ? "bg-emerald-500/10 text-emerald-500" : "bg-primary/10 text-primary"
            )}>
                {isWatched ? <CheckCircle className="w-5 h-5" /> : <Play className={cn("w-4 h-4 ml-0.5", isSelected ? "fill-white" : "fill-primary")} />}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                    <p className={cn("text-[8px] font-black uppercase tracking-widest", isSelected ? "text-white/70" : "text-muted-foreground")}>Lesson {lesson.id}</p>
                    {isWatched && <span className="text-[7px] font-black bg-emerald-500/20 text-emerald-500 px-1.5 py-0.5 rounded-full uppercase tracking-tighter">Watched</span>}
                </div>
                <h6 className="text-[13px] font-black uppercase tracking-tight truncate leading-none">{lesson.title}</h6>
                {lesson.url ? (
                    <p className={cn("text-[9px] font-medium uppercase truncate mt-1.5 opacity-60", isSelected ? "text-white" : "text-muted-foreground")}>{lesson.description}</p>
                ) : (
                    <p className="text-[9px] font-black uppercase tracking-widest text-primary/40 mt-1.5">Coming Soon</p>
                )}
            </div>
            {lesson.url && (
                <ChevronRight className={cn("w-4 h-4 transition-all", isSelected ? "text-white opacity-80" : "text-primary opacity-30 group-hover:opacity-100 group-hover:translate-x-1")} />
            )}
        </button>
    );
}
