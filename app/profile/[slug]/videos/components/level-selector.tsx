"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getLessonCount } from "../../curriculum-data";

interface LevelSelectorProps {
    levels: string[];
    selectedLevel: string;
    onSelectLevel: (level: string) => void;
}

export function LevelSelector({ levels, selectedLevel, onSelectLevel }: LevelSelectorProps) {
    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
            {levels.map((level) => {
                const count = getLessonCount(level);
                return (
                    <Button
                        key={level}
                        variant="ghost"
                        onClick={() => onSelectLevel(level)}
                        className={cn(
                            "rounded-full h-12 px-6 font-black uppercase text-[11px] tracking-[0.2em] shrink-0 transition-all flex items-center gap-3 border border-white/5",
                            selectedLevel === level
                                ? "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] scale-105 border-primary/20"
                                : "bg-card/50 text-muted-foreground hover:bg-card border-white/5"
                        )}
                    >
                        {level}
                        <span className={cn(
                            "text-[10px] w-6 h-6 rounded-full flex items-center justify-center font-black",
                            selectedLevel === level ? "bg-white/20 text-white" : "bg-muted/80 text-muted-foreground"
                        )}>
                            {count}
                        </span>
                    </Button>
                );
            })}
        </div>
    );
}
