"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
    imageSize?: number;
    textSize?: "sm" | "base" | "lg" | "xl";
    showTagline?: boolean;
}

export default function Logo({
    className,
    imageSize = 40,
    textSize = "xl",
    showTagline = true
}: LogoProps) {
    const textSizes = {
        sm: "text-sm",
        base: "text-base",
        lg: "text-lg",
        xl: "text-xl"
    };

    return (
        <div className={cn("flex items-center gap-3", className)}>
            <Image
                src="/logo.webp"
                alt="CLC Logo"
                width={imageSize}
                height={imageSize}
                className="rounded-full shadow-lg shrink-0"
            />
            <div className="flex flex-col -space-y-1">
                <span className={cn(
                    "font-black uppercase tracking-tighter leading-none whitespace-nowrap",
                    textSizes[textSize]
                )}>
                    Christian Life Center
                </span>
                {showTagline && (
                    <span className="text-[10px] pt-1 font-black uppercase tracking-[0.3em] text-primary leading-none ml-0.5 whitespace-nowrap">
                        Tagum Campus
                    </span>
                )}
            </div>
        </div>
    );
}
