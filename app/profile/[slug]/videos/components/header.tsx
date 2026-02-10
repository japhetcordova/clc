"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface HeaderProps {
    qrValue: string;
    scrolled: boolean;
    isLocalhost: boolean;
    isDeveloperMode: boolean;
    setIsDeveloperMode: (val: boolean) => void;
}

export function Header({ qrValue, scrolled, isLocalhost, isDeveloperMode, setIsDeveloperMode }: HeaderProps) {
    return (
        <header className={cn(
            "sticky top-0 z-50 transition-all duration-300 px-4 sm:px-8",
            scrolled ? "bg-card/90 backdrop-blur-2xl border-b border-white/5 py-3 shadow-lg" : "py-6"
        )}>
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link href={`/profile/${qrValue}`}>
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 transition-colors h-12 w-12 border border-white/5 bg-card/50 backdrop-blur-md">
                            <ArrowLeft className="w-6 h-6 text-primary" />
                        </Button>
                    </Link>
                    <div className="min-w-0">
                        <h1 className={cn(
                            "font-black uppercase tracking-tighter flex items-center gap-2 italic transition-all duration-300 truncate",
                            scrolled ? "text-lg sm:text-xl" : "text-2xl sm:text-4xl"
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
    );
}
