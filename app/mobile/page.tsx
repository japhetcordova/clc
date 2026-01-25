"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

import { motion } from "framer-motion";
import { QrCode, Shield, User, Calendar, MessageSquare, Settings, Bell, Heart, MapPin, BookOpen, ChevronRight, Scan } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function MobileDashboard() {
    const { isAdmin } = useCurrentUser();

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
            title: "Verse of the Day",
            description: "Daily spiritual nourishment",
            icon: BookOpen,
            href: "/word",
            color: "bg-purple-500",
            textColor: "text-purple-500"
        },
        ...(isAdmin ? [{
            title: "Admin",
            description: "View church records",
            icon: Shield,
            href: "/admin",
            color: "bg-orange-500",
            textColor: "text-orange-500"
        }] : []),
        {
            title: "Scanner",
            description: "Mark attendance with QR",
            icon: Scan,
            href: "/scanner",
            color: "bg-cyan-500",
            textColor: "text-cyan-500"
        },
        {
            title: "My QR Code",
            description: "Your digital member ID",
            icon: User,
            href: "/my-qr",
            color: "bg-emerald-500",
            textColor: "text-emerald-500"
        },
        {
            title: "Events",
            description: "Upcoming gatherings",
            icon: Calendar,
            href: "/events",
            color: "bg-rose-500",
            textColor: "text-rose-500"
        }
    ];

    const quickActions = [
        { icon: MessageSquare, label: "Suggestions", href: "/suggestions" },
        { icon: Heart, label: "Giving", href: "/giving" },
        { icon: Bell, label: "Updates", href: "#" },
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
                    icon: "/logo.webp"
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
            {/* Header */}
            <header className="bg-card px-6 pt-16 pb-8 rounded-b-[3rem] shadow-sm border-b border-border/50">
                <div className="flex justify-between items-center mb-8">
                    <Logo />
                </div>

                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tight text-foreground uppercase italic">
                        Hello, Church!
                    </h1>
                    <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest pl-1">
                        Welcome to your digital home
                    </p>
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
