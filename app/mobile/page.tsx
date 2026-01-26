"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

import { motion } from "framer-motion";
import { QrCode, Shield, User, Users, Calendar, MessageSquare, Settings, Bell, Heart, MapPin, BookOpen, ChevronRight, Scan, Sparkles, Info } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { trpc } from "@/lib/trpc/client";

export default function MobileDashboard() {
    const { isAdmin } = useCurrentUser();
    const { data: activeHighlight } = trpc.getActiveMobileHighlight.useQuery();

    const defaultHighlight = {
        titlePrefix: "When you",
        highlightedWord: "declare",
        titleSuffix: "The Lord listens.",
        speaker: "Ptr. Arlene B. Molina",
        series: "Making God Our First",
        imageUrl: "/mobile-highlight.jpg"
    };

    const display = activeHighlight || defaultHighlight;

    const menuItems = [
        {
            title: "Outreaches",
            description: "Find a location near you",
            icon: MapPin,
            href: "/locations",
            color: "bg-blue-500",
            textColor: "text-blue-500"
        },
        {
            title: "About Us",
            description: "Our mission and vision",
            icon: Info,
            href: "/about",
            color: "bg-indigo-500",
            textColor: "text-indigo-500"
        },
        {
            title: "Ministries",
            description: "Find where you belong",
            icon: Users,
            href: "/ministries",
            color: "bg-rose-500",
            textColor: "text-rose-500"
        },
        {
            title: "Scanner",
            description: "Mark attendance with QR",
            icon: Scan,
            href: "/scanner",
            color: "bg-cyan-500",
            textColor: "text-cyan-500"
        }
    ];

    const quickActions = [
        { icon: MessageSquare, label: "Suggestions", href: "/suggestions" },
        { icon: Heart, label: "Giving", href: "/giving" },
        { icon: Bell, label: "Updates", href: "/events" },
        { icon: Settings, label: "Settings", href: "#" },
    ];

    const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | "unsupported">("default");

    useEffect(() => {
        if (!("Notification" in window)) {
            setNotificationPermission("unsupported");
        } else {
            setNotificationPermission(Notification.permission);
        }
    }, []);

    const handleEnableNotifications = async () => {
        if (!("Notification" in window)) {
            toast.error("Notifications not supported", {
                description: "Your browser does not support desktop notifications."
            });
            return;
        }

        try {
            const permission = await Notification.requestPermission();
            setNotificationPermission(permission);

            if (permission === "granted") {
                toast.success("Notifications Enabled!", {
                    description: "You will now receive updates from CLC Tagum."
                });
                new Notification("Welcome to CLC Digital", {
                    body: "You have successfully enabled notifications.",
                    icon: "/logo2.webp"
                });
            } else if (permission === "denied") {
                toast.error("Permission Denied", {
                    description: "Please enable notifications in your browser settings to receive updates."
                });
            }
        } catch (err) {
            toast.error("Configuration Error", {
                description: "Failed to request notification permission."
            });
        }
    };

    return (
        <div className="min-h-screen bg-background pb-32">
            {/* Header / Hero Section with Highlight */}
            <header className="relative min-h-[450px] flex flex-col justify-end overflow-hidden pb-12">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src={display.imageUrl}
                        alt="Sunday Service Highlight"
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* Premium Overlays */}
                    <div className="absolute inset-0 bg-linear-to-b from-background/20 via-background/60 to-background" />
                    <div className="absolute inset-0 bg-linear-to-r from-background/40 to-transparent" />
                </div>

                <div className="relative z-10 px-6 space-y-6">

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-4"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 backdrop-blur-md border border-white/10">
                            <Sparkles className="w-3 h-3 text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Sunday Highlight</span>
                        </div>

                        <div className="space-y-1">
                            <h2 className="text-3xl font-black tracking-tight text-white uppercase italic leading-[1.1]">
                                {display.titlePrefix} <span className="text-primary italic">{display.highlightedWord}</span>,<br />
                                <span className="text-4xl">{display.titleSuffix}</span>
                            </h2>
                            <p className="text-white/60 font-bold text-[10px] uppercase tracking-widest pl-1">
                                {display.speaker} • {display.series}
                            </p>
                        </div>
                    </motion.div>
                </div>
            </header>

            <main className="px-6 mt-8 space-y-8">
                {/* Main Menu Grid */}
                <div className="grid grid-cols-1 gap-4">
                    {menuItems.map((item, i) => {
                        const Icon = item.icon;
                        return (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Link href={item.href}>
                                    <div className="bg-card p-6 rounded-[2rem] border border-border shadow-sm flex items-center gap-5 active:scale-[0.98] transition-all group">
                                        <div className={`${item.color} p-4 rounded-2xl text-white shadow-lg shadow-black/20`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-black text-lg uppercase italic tracking-tighter text-foreground group-hover:text-primary transition-colors">
                                                {item.title}
                                            </h3>
                                            <p className="text-muted-foreground font-bold text-[10px] uppercase tracking-wider">
                                                {item.description}
                                            </p>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                            <ChevronRight className="w-4 h-4 text-muted-foreground opacity-50" />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Quick Actions Row */}
                <div className="space-y-4">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground pl-2">
                        Quick Connections
                    </h2>
                    <div className="grid grid-cols-4 gap-4">
                        {quickActions.map((action, i) => {
                            const Icon = action.icon;
                            return (
                                <Link key={action.label} href={action.href} className="flex flex-col items-center gap-2 group">
                                    <div className="w-14 h-14 bg-card rounded-2xl shadow-sm border border-border flex items-center justify-center group-active:scale-95 transition-all text-muted-foreground group-hover:text-primary group-hover:border-primary/20">
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                                        {action.label}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Promotional Banner */}
                <div className="bg-primary p-6 rounded-[2.5rem] text-primary-foreground relative overflow-hidden shadow-xl shadow-primary/20">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                    <div className="relative z-10 space-y-4">
                        <div className="space-y-1">
                            <h3 className="text-xl font-black uppercase italic tracking-tighter">Stay Connected</h3>
                            <p className="text-xs font-bold text-primary-foreground/80 uppercase tracking-widest">Never miss a blessing from our family.</p>
                        </div>
                        <Button
                            onClick={handleEnableNotifications}
                            disabled={notificationPermission === "granted" || notificationPermission === "unsupported"}
                            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl h-10 px-6 font-black uppercase italic tracking-tighter text-xs"
                        >
                            {notificationPermission === "granted" ? "Notifications Active" :
                                notificationPermission === "unsupported" ? "Not Supported" :
                                    "Enable Notifications"}
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
}
