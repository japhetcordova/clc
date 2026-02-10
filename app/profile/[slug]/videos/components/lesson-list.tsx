"use client";

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
                    {Array.isArray(levelData) ? levelData.length : 0} Modules
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
                                        isSelected={selectedVideoUrl === lesson.url}
                                        onSelect={() => onSelectLesson(lesson)}
                                    />
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
