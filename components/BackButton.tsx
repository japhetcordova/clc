"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackButtonProps {
    href: string;
    label?: string;
    className?: string;
    variant?: "default" | "outline" | "ghost" | "floating" | "minimal";
    icon?: React.ElementType;
}

export default function BackButton({
    href,
    label = "Go Back",
    className,
    variant = "minimal",
    icon: Icon = ArrowLeft
}: BackButtonProps) {

    // Floating variant for absolute positioning (good for mobile headers)
    if (variant === "floating") {
        return (
            <Link href={href} className={cn("fixed top-4 left-4 z-40", className)}>
                <Button
                    variant="secondary"
                    className="rounded-full h-12 pl-4 pr-6 shadow-xl shadow-black/10 border border-white/20 bg-background/80 backdrop-blur-md gap-3 font-bold text-muted-foreground hover:text-foreground hover:scale-105 transition-all group"
                >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm uppercase tracking-wider">{label}</span>
                </Button>
            </Link>
        )
    }

    // A large, friendly block button (good for lists)
    if (variant === "default") {
        return (
            <Link href={href} className="w-full">
                <Button
                    variant="outline"
                    className={cn(
                        "w-full h-14 rounded-2xl border-2 border-muted hover:border-primary/20 bg-card hover:bg-muted/30 text-muted-foreground hover:text-foreground transition-all group justify-start px-6 gap-4",
                        className
                    )}
                >
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary text-muted-foreground group-hover:text-primary-foreground transition-colors">
                        <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm uppercase tracking-widest">{label}</span>
                </Button>
            </Link>
        );
    }

    // Minimal text button (good for headers)
    return (
        <Link href={href}>
            <Button
                variant="ghost"
                className={cn(
                    "rounded-full gap-2 text-muted-foreground hover:text-foreground h-10 px-4 hover:bg-muted/50 transition-all",
                    className
                )}
            >
                <Icon className="w-5 h-5" />
                <span className="font-bold text-sm hidden sm:inline">{label}</span>
            </Button>
        </Link>
    );
}
