import React from "react";
import { cn } from "@/lib/utils";

interface ConcernNoteProps {
    className?: string;
    variant?: "default" | "primary";
}

export default function ConcernNote({ className, variant = "default" }: ConcernNoteProps) {
    const styles = {
        default: "text-muted-foreground pt-4 border-t border-border",
        primary: "text-primary/60 pt-2 border-t border-primary/10"
    };

    return (
        <div className={cn(styles[variant], className)}>
            <p className="text-[10px] font-bold text-center uppercase tracking-widest italic">
                If you have concern approach cell leader or ministry head.
            </p>
        </div>
    );
}
