"use client";

import { motion } from "framer-motion";
import { QrCode, User, Home, MapPin, BookOpen, Shield, GraduationCap, Tv } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function MobileNav() {
    const pathname = usePathname();
    const { isAdmin } = useCurrentUser();

    const links = [
        { name: "App", href: "/mobile", icon: Home },
        { name: "Watch", href: "/watch", icon: Tv },
        { name: "Classes", href: "/classes", icon: GraduationCap },
        { name: "Verse", href: "/word", icon: BookOpen },
        ...(isAdmin ? [{ name: "Admin", href: "/admin", icon: Shield }] : []),
        { name: "My QR", href: "/my-qr", icon: QrCode },
    ];

    // Only show on mobile
    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 pb-safe">
            <div className="bg-background/90 backdrop-blur-2xl border-t border-border/50 px-1 py-1.5 flex items-center justify-between shadow-[0_-8px_30px_rgb(0,0,0,0.12)]">
                {links.map((link) => {
                    const isActive = pathname === link.href ||
                        (link.href !== "/" && pathname.startsWith(link.href)) ||
                        (link.href === "/my-qr" && pathname.startsWith("/profile/"));
                    const Icon = link.icon;

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "relative flex flex-col items-center justify-center gap-1 group flex-1 rounded-2xl transition-all duration-300",
                                isActive ? "flex-grow-[1.5]" : ""
                            )}
                        >
                            <div className={cn(
                                "p-2 rounded-xl transition-all duration-300",
                                isActive ? "bg-primary/10 text-primary scale-110" : "text-muted-foreground/60 group-active:scale-95"
                            )}>
                                <Icon className="size-5" />
                            </div>

                            {isActive && (
                                <span className="text-[9px] font-black uppercase tracking-widest text-primary animate-in fade-in slide-in-from-bottom-1 duration-200 leading-none">
                                    {link.name}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
