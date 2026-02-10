"use client";

import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import React, { useState, useEffect, useRef } from "react";
import { SecurityGate } from "@/components/SecurityGate";
import { trpc } from "@/lib/trpc/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { curriculum, classLevelToCurriculumKey, getLessonCount } from "../curriculum-data";
import { Header } from "./components/header";
import { LevelSelector } from "./components/level-selector";
import { VideoPlayerSection } from "./components/video-player-section";
import { LessonList } from "./components/lesson-list";
import { EmptyState } from "./components/empty-state";
import { ArchiveLink } from "./components/archive-link";

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

                {/* 2. Sticky Header */}
                <Header
                    qrValue={qrValue}
                    scrolled={scrolled}
                    isLocalhost={isLocalhost}
                    isDeveloperMode={isDeveloperMode}
                    setIsDeveloperMode={setIsDeveloperMode}
                />

                {/* 3. Main Content */}
                <main className="flex-1 relative z-10 px-0 sm:px-6 lg:px-8 pb-32 overflow-x-hidden">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-7xl mx-auto"
                    >
                        <div className="py-2 sm:py-6 space-y-6 sm:space-y-12">
                            {enrolledClassKeys.length === 0 ? (
                                <div className="px-4"><EmptyState /></div>
                            ) : (
                                <div className="flex flex-col space-y-8 sm:space-y-12">
                                    <div className="space-y-6 sm:space-y-8 px-4 sm:px-0">
                                        <LevelSelector
                                            levels={Object.keys(curriculum).filter(level => enrolledClassKeys.includes(level))}
                                            selectedLevel={selectedLevel}
                                            onSelectLevel={(level) => {
                                                setSelectedLevel(level);
                                                const firstLesson = getFirstLesson(level);
                                                if (firstLesson) {
                                                    setSelectedVideo({ title: firstLesson.description || firstLesson.title, url: firstLesson.url });
                                                    setIsPlaying(false);
                                                }
                                            }}
                                        />
                                        <div className="h-px bg-white/5" />
                                    </div>

                                    <div className="flex flex-col lg:grid lg:grid-cols-[1fr_400px] gap-8 lg:gap-12 xl:gap-20 items-start">
                                        <div className="space-y-8 sm:space-y-12 w-full">
                                            <div className="px-0 sm:px-0">
                                                <VideoPlayerSection
                                                    selectedLevel={selectedLevel}
                                                    selectedVideo={selectedVideo}
                                                    isPlaying={isPlaying}
                                                    setIsPlaying={setIsPlaying}
                                                    watchedVideos={watchedVideos}
                                                    toggleWatched={toggleWatched}
                                                />
                                            </div>

                                            <div className="hidden lg:block pt-10 border-t border-white/5">
                                                <ArchiveLink />
                                            </div>
                                        </div>

                                        <div className="space-y-10 px-4 sm:px-0 w-full">
                                            <LessonList
                                                selectedLevel={selectedLevel}
                                                watchedVideos={watchedVideos}
                                                selectedVideoUrl={selectedVideo.url}
                                                onSelectLesson={(lesson) => {
                                                    setSelectedVideo({ title: lesson.description || lesson.title, url: lesson.url });
                                                    setIsPlaying(true);
                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                }}
                                            />

                                            <div className="lg:hidden pt-10 border-t border-white/5">
                                                <ArchiveLink />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </main>
            </div>
        </SecurityGate>
    );
}
