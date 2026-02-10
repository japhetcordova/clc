"use client";

import { Play, CheckCircle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface LessonRowProps {
    lesson: any;
    isSelected: boolean;
    onSelect: () => void;
    isWatched: boolean;
}

export function LessonRow({ lesson, isSelected, onSelect, isWatched }: LessonRowProps) {
    return (
        <button
            onClick={onSelect}
            disabled={!lesson.url}
            className={cn(
                "w-full flex items-center gap-4 py-4 px-2 transition-all text-left border-b border-white/5 active:bg-white/5 group relative",
                isSelected && "bg-primary/5 border-primary/20"
            )}
        >
            {isSelected && (
                <div className="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-full" />
            )}

            <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors",
                isSelected ? "text-primary bg-primary/20" : isWatched ? "text-emerald-500" : "text-muted-foreground/40 group-hover:text-primary/60"
            )}>
                {isWatched ? <CheckCircle className="w-5 h-5" /> : <Play className={cn("w-4 h-4 ml-0.5", isSelected ? "fill-primary" : "fill-current")} />}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                    <p className={cn("text-[8px] font-black uppercase tracking-[0.2em] shrink-0", isSelected ? "text-primary" : "text-muted-foreground/60")}>
                        {lesson.id < 10 ? `0${lesson.id}` : lesson.id}
                    </p>
                    <h6 className={cn(
                        "text-[13px] font-bold uppercase tracking-tight truncate leading-none",
                        isSelected ? "text-primary" : "text-foreground"
                    )}>
                        {lesson.title}
                    </h6>
                    {isWatched && (
                        <span className="text-[7px] font-black text-emerald-500/80 uppercase tracking-tighter">Done</span>
                    )}
                </div>
            </div>

            {lesson.url ? (
                <div className="flex items-center gap-2">
                    <span className={cn(
                        "text-[9px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity",
                        isSelected ? "text-primary" : "text-muted-foreground"
                    )}>
                        Play
                    </span>
                    <ChevronRight className={cn(
                        "w-4 h-4 transition-all",
                        isSelected ? "text-primary" : "text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1"
                    )} />
                </div>
            ) : (
                <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/20">Locked</span>
            )}
        </button>
    );
}
