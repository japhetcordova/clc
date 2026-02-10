"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { LessonRow } from "./lesson-row";
import { curriculum } from "../../curriculum-data";

interface LessonListProps {
    selectedLevel: string;
    watchedVideos: string[];
    selectedVideoUrl: string;
    onSelectLesson: (lesson: any) => void;
}

export function LessonList({ selectedLevel, watchedVideos, selectedVideoUrl, onSelectLesson }: LessonListProps) {
    const levelData = curriculum[selectedLevel as keyof typeof curriculum];

    if (!levelData) return null;

    return (
        <div className="flex flex-col min-h-[300px] lg:h-[600px]">
            <div className="pb-4 mb-2 px-2 flex items-center justify-between border-b border-white/5 sm:border-none">
                <h5 className="font-black uppercase tracking-[0.3em] text-[10px] text-muted-foreground flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Lessons
                </h5>
                <span className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                    {Array.isArray(levelData)
                        ? `${levelData.length} Lessons`
                        : `${Object.keys(levelData).length} Modules`
                    }
                </span>
            </div>
            <div className="flex-1 lg:overflow-y-auto lg:pr-2 lg:scrollbar-thin lg:scrollbar-thumb-white/5 overflow-visible">
                {Array.isArray(levelData) ? (
                    <div className="space-y-3">
                        {levelData.map((lesson: any) => (
                            <LessonRow
                                key={lesson.id}
                                lesson={lesson}
                                isWatched={watchedVideos.includes(lesson.url)}
                                isSelected={selectedVideoUrl === lesson.url}
                                onSelect={() => onSelectLesson(lesson)}
                            />
                        ))}
                    </div>
                ) : (
                    Object.entries(levelData as Record<string, any[]>).map(([moduleName, lessons]) => (
                        <ModuleSection
                            key={moduleName}
                            moduleName={moduleName}
                            lessons={lessons}
                            watchedVideos={watchedVideos}
                            selectedVideoUrl={selectedVideoUrl}
                            onSelectLesson={onSelectLesson}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

function ModuleSection({
    moduleName,
    lessons,
    watchedVideos,
    selectedVideoUrl,
    onSelectLesson
}: {
    moduleName: string;
    lessons: any[];
    watchedVideos: string[];
    selectedVideoUrl: string;
    onSelectLesson: (lesson: any) => void;
}) {
    const [isOpen, setIsOpen] = useState(false);

    // Auto-open if the selected video is in this module
    useEffect(() => {
        if (lessons.some(l => l.url === selectedVideoUrl)) {
            setIsOpen(true);
        }
    }, [selectedVideoUrl, lessons]);

    return (
        <div className="mb-4 border border-white/5 rounded-2xl overflow-hidden bg-card/20 hover:bg-card/40 transition-colors">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 bg-muted/20 hover:bg-muted/40 transition-all text-left group"
            >
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center transition-all bg-primary/10 group-hover:bg-primary/20",
                        isOpen ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                    )}>
                        <ChevronRight className={cn("w-4 h-4 transition-transform duration-300", isOpen && "rotate-90")} />
                    </div>
                    <div className="space-y-0.5">
                        <h5 className="text-[10px] font-black uppercase tracking-[0.25em] text-foreground/80 group-hover:text-primary transition-colors">
                            {moduleName}
                        </h5>
                        <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest">
                            {lessons.length} Lessons • {lessons.filter(l => watchedVideos.includes(l.url)).length} Completed
                        </p>
                    </div>
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <div className="p-2 space-y-2 border-t border-white/5 bg-black/20">
                            {lessons.map((lesson) => (
                                <LessonRow
                                    key={lesson.id}
                                    lesson={lesson}
                                    isWatched={watchedVideos.includes(lesson.url)}
                                    isSelected={selectedVideoUrl === lesson.url}
                                    onSelect={() => onSelectLesson(lesson)}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
