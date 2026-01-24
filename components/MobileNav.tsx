"use client";

import { motion } from "framer-motion";
import { QrCode, Shield, User, Home, Info, Scan } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function MobileNav() {
    const pathname = usePathname();

    const links = [
        { name: "App", href: "/mobile", icon: Home },
        { name: "Scanner", href: "/scanner", icon: Scan },
        { name: "Admin", href: "/admin", icon: Shield },
        { name: "My QR", href: "/my-qr", icon: QrCode },
    ];

    // Only show on mobile
    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] pb-safe">
            <div className="bg-background/80 backdrop-blur-2xl border-t border-border/50 px-6 py-3 flex items-center justify-between shadow-[0_-8px_30px_rgb(0,0,0,0.12)]">
                {links.map((link) => {
                    const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                    const Icon = link.icon;

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="relative flex flex-col items-center gap-1 group"
                        >
                            <div className={cn(
                                "p-2 rounded-2xl transition-all duration-300",
                                isActive ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110" : "text-muted-foreground group-active:scale-90"
                            )}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <span className={cn(
                                "text-[9px] font-black uppercase tracking-widest transition-colors duration-300",
                                isActive ? "text-primary" : "text-muted-foreground"
                            )}>
                                {link.name}
                            </span>

                            {isActive && (
                                <motion.div
                                    layoutId="mobileNavDot"
                                    className="absolute -top-1 w-1 h-1 bg-primary rounded-full"
                                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                />
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
