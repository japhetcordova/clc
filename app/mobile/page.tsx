"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

import { motion } from "framer-motion";
import { Users, MessageSquare, Bell, Heart, MapPin, BookOpen, ChevronRight, Scan, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { EventCarousel } from "@/components/EventCarousel";
import { trpc } from "@/lib/trpc/client";

export default function MobileDashboard() {
    const router = useRouter();
    const utils = trpc.useContext();
    const { data: activeHighlight } = trpc.getActiveMobileHighlight.useQuery();
    const { data: publicEvents } = trpc.getPublicEvents.useQuery();
    const { data: votd } = trpc.getVOTD.useQuery();
    const { data: announcements } = trpc.getAnnouncements.useQuery();

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
        imageUrl: "https://scontent.fdvo1-2.fna.fbcdn.net/v/t39.30808-6/629890478_1320699636756877_7258081727079813244_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=cc71e4&_nc_eui2=AeGH1jHk-ZFQ_FnATuR4yWpC9vE-SWJdRj328T5JYl1GPZowdIfQg7P0b6RXkvdpAhwFZvpqzpYUWIompSiLitA_&_nc_ohc=uo3B27ehlmAQ7kNvwFmlnuK&_nc_oc=AdkaiWBTNTsRkEFwtoIyu_RSl_1sF8QTekd8UzS4q53ESdYxCwvMWFDWY0FEBIBCuW8&_nc_zt=23&_nc_ht=scontent.fdvo1-2.fna&_nc_gid=SgrOjfZotIUyd6S401RIvA&oh=00_AfuD0ExGuKUvNNy3B_9N7J31yrL3bq8DCHeRib8GODUnjw&oe=69939DFA"
    };

    const display = activeHighlight || defaultHighlight;

    const menuItems = [
        {
            title: "Scanner",
            description: "Quick attendance check-in",
            icon: Scan,
            href: "/scanner",
            color: "bg-emerald-500",
            textColor: "text-emerald-500"
        },
        {
            title: "Giving",
            description: "Support our mission",
            icon: Heart,
            href: "/giving",
            color: "bg-rose-500",
            textColor: "text-rose-500"
        },
        {
            title: "Suggestions",
            description: "We're listening to you",
            icon: MessageSquare,
            href: "/suggestions",
            color: "bg-indigo-500",
            textColor: "text-indigo-500"
        }
    ];

    const quickActions = [
        { icon: MapPin, label: "Outreaches", href: "/locations" },
        { icon: Users, label: "Ministries", href: "/ministries" },
        { icon: Bell, label: "Updates", href: "/events" },
        { icon: Info, label: "About", href: "/about" },
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
        <div className="min-h-screen bg-background ">

            {/* Header / Hero Section - Responsive Height for Full Image */}
            <header className="relative w-full flex flex-col overflow-hidden">
                {/* Background Image Container */}
                <div className="relative w-full z-0">
                    <img
                        src={display.imageUrl}
                        alt="Sunday Service Highlight"
                        className="w-full h-auto block bg-background"
                    />
                    {/* Premium Overlays - Adjusted for responsive height */}
                    <div className="absolute inset-0 bg-linear-to-b from-black/0 via-background/20 to-background" />


                </div>
            </header>

            <main className="px-5 space-y-6 relative z-20 pb-12">
                <div className="space-y-4 mt-6">
                    {/* Verse of the Day Quick Highlight */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative"
                    >
                        <Link href="/word">
                            <div className="bg-background/40 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden group active:scale-[0.98] transition-all">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/20 transition-colors" />

                                <div className="space-y-4 relative z-10">
                                    <div className="flex items-center justify-between">
                                        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary">
                                            <BookOpen className="w-3.5 h-3.5" />
                                            <span className="text-[9px] font-black uppercase tracking-widest text-primary">Daily Word</span>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-sm font-bold italic text-foreground leading-snug line-clamp-3 opacity-90">
                                            "{votd?.text || "Let all that you do be done in love."}"
                                        </p>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary italic">
                                            {votd?.reference || "1 Corinthians 16:14"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>

                    {/* Other Highlights - Event Carousel / Announcements */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="-mx-6"
                    >
                        <EventCarousel events={publicEvents} hideHeader noCard className="pb-0" />
                    </motion.div>
                </div>

                {/* Main Action Menu */}
                <div className="grid grid-cols-1 gap-3">
                    {menuItems.map((item, i) => {
                        const Icon = item.icon;
                        return (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 + 0.4 }}
                            >
                                <Link href={item.href}>
                                    <div className="bg-card/30 backdrop-blur-md p-4 rounded-[1.5rem] border border-white/5 shadow-sm flex items-center gap-4 active:scale-[0.98] transition-all group hover:bg-card/50">
                                        <div className={`${item.color} p-3 rounded-xl text-white shadow-lg shadow-black/5 transition-transform group-hover:scale-110`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-black text-sm uppercase tracking-tighter text-foreground group-hover:text-primary transition-colors">
                                                {item.title}
                                            </h3>
                                            <p className="text-muted-foreground font-black text-[9px] uppercase tracking-widest opacity-40">
                                                {item.description}
                                            </p>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-muted/20 flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity">
                                            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Announcements Highlight */}
                {announcements && announcements.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground pl-2">
                            Latest Updates
                        </h2>
                        <div className="space-y-3">
                            {announcements.slice(0, 2).map((anno, i) => (
                                <motion.div
                                    key={anno.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 + 0.6 }}
                                    className="p-4 rounded-2xl bg-muted/30 border border-border/50 flex items-start gap-3"
                                >
                                    <div className="w-1 h-10 bg-primary rounded-full shrink-0 mt-1" />
                                    <div className="min-w-0">
                                        <h4 className="font-black uppercase text-[10px] tracking-tight text-foreground truncate">{anno.title}</h4>
                                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5 leading-tight">{anno.content}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
