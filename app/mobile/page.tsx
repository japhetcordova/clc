"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

import { motion, AnimatePresence } from "framer-motion";
import { QrCode, Shield, User, Users, Calendar, MessageSquare, Settings, Bell, Heart, MapPin, BookOpen, ChevronRight, Scan, Sparkles, Info, MoreHorizontal, Home, LogOut, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { EventCarousel } from "@/components/EventCarousel";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { trpc } from "@/lib/trpc/client";

export default function MobileDashboard() {
    const router = useRouter();
    const utils = trpc.useContext();
    const { user, isAdmin, me } = useCurrentUser();
    const { data: activeHighlight } = trpc.getActiveMobileHighlight.useQuery();
    const { data: publicEvents } = trpc.getPublicEvents.useQuery();

    const logoutMutation = trpc.logout.useMutation({
        onSuccess: () => {
            localStorage.removeItem("isAuthorized");
            utils.getMe.invalidate();
            router.push("/");
            toast.success("Successfully logged out");
        },
    });

    const handleLogout = () => logoutMutation.mutate();

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
            {/* Optimized Global Header Overlay */}
            <div className="fixed top-0 left-0 right-0 z-50 px-3 pt-3 flex items-center justify-between pointer-events-none">
                <div className="pointer-events-auto">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-background/40 backdrop-blur-xl border border-white/10 shadow-xl hover:bg-background/60">
                                <MoreHorizontal className="w-5 h-5 text-foreground" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-56 rounded-2xl border-white/10 backdrop-blur-2xl bg-background/90 p-2 shadow-2xl">
                            <DropdownMenuItem asChild>
                                <Link href={me?.qrCodeId ? `/profile/${me.qrCodeId}` : "/my-qr"} className="flex items-center gap-3 p-2.5 cursor-pointer rounded-xl hover:bg-primary/10 transition-colors">
                                    <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <span className="font-bold text-xs">My Profile</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-white/5" />
                            <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-3 p-2.5 cursor-pointer rounded-xl hover:bg-destructive/10 text-destructive transition-colors">
                                <div className="p-1.5 rounded-lg bg-destructive/10">
                                    <LogOut className="w-4 h-4" />
                                </div>
                                <span className="font-bold text-xs">Logout</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="pointer-events-auto flex items-center gap-2">
                    {/* Points Chip - Compact */}
                    <Link href={me?.qrCodeId ? `/profile/${me.qrCodeId}` : "#"}>
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 backdrop-blur-xl border border-amber-500/20 rounded-full shadow-lg transition-all active:scale-95">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
                            <span className="text-[10px] font-black tabular-nums text-amber-600 dark:text-amber-400">
                                {user?.redeemPoints ?? 0}
                            </span>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Header / Hero Section - Reduced Height */}
            <header className="relative min-h-[340px] flex flex-col overflow-hidden pb-8">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src={display.imageUrl}
                        alt="Sunday Service Highlight"
                        fill
                        className="object-cover scale-100"
                        priority
                        unoptimized={display.imageUrl.startsWith("http")}
                    />
                    {/* Premium Overlays */}
                    <div className="absolute inset-0 bg-linear-to-b from-black/20 via-background/60 to-background" />
                </div>

                {/* Compact sub-hero badge */}
                <div className="relative z-10 mt-auto px-6 pb-6">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-primary/20 backdrop-blur-md rounded-full border border-primary/20">
                        <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                        <span className="text-[8px] font-black uppercase tracking-wider text-primary">Featured</span>
                    </div>
                </div>
            </header>

            <main className="px-5 space-y-6 relative z-20">
                <div className="space-y-4 -mt-24">

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="-mx-6"
                    >
                        <EventCarousel events={publicEvents} hideHeader noCard className="pb-0" />
                    </motion.div>
                </div>
                {/* Main Menu Grid - Optimized List Layout */}
                <div className="grid grid-cols-1 gap-3">
                    {menuItems.map((item, i) => {
                        const Icon = item.icon;
                        return (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <Link href={item.href}>
                                    <div className="bg-card/40 backdrop-blur-md p-4 rounded-[1.5rem] border border-white/5 shadow-sm flex items-center gap-4 active:scale-[0.98] transition-all group hover:bg-card/60">
                                        <div className={`${item.color} p-3 rounded-xl text-white shadow-lg shadow-black/10 transition-transform group-hover:scale-110`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-black text-sm uppercase tracking-tighter text-foreground group-hover:text-primary transition-colors">
                                                {item.title}
                                            </h3>
                                            <p className="text-muted-foreground font-bold text-[9px] uppercase tracking-widest opacity-60">
                                                {item.description}
                                            </p>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-muted/30 flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity">
                                            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
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
