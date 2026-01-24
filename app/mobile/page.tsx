"use client";

import { motion } from "framer-motion";
import { QrCode, Shield, User, Calendar, MessageSquare, Settings, Bell, Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

export default function MobileDashboard() {
    const menuItems = [
        {
            title: "Scanner",
            description: "Mark attendance with QR",
            icon: QrCode,
            href: "/scanner",
            color: "bg-blue-500",
            textColor: "text-blue-500"
        },
        {
            title: "Admin",
            description: "View church records",
            icon: Shield,
            href: "/admin",
            color: "bg-purple-500",
            textColor: "text-purple-500"
        },
        {
            title: "My Profile",
            description: "Your digital member ID",
            icon: User,
            href: "/profile",
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

    return (
        <div className="min-h-screen bg-slate-50 pb-32">
            {/* Header */}
            <header className="bg-white px-6 pt-16 pb-8 rounded-b-[3rem] shadow-sm">
                <div className="flex justify-between items-center mb-8">
                    <Logo />
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-slate-400" />
                    </div>
                </div>

                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase italic">
                        Hello, Church!
                    </h1>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-widest pl-1">
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
                                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5 active:scale-[0.98] transition-all group">
                                        <div className={`${item.color} p-4 rounded-2xl text-white shadow-lg`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-black text-lg uppercase italic tracking-tighter text-slate-800 group-hover:text-primary transition-colors">
                                                {item.title}
                                            </h3>
                                            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                                                {item.description}
                                            </p>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
                                            <motion.div
                                                animate={{ x: [0, 5, 0] }}
                                                transition={{ repeat: Infinity, duration: 1.5 }}
                                            >
                                                <Shield className="w-4 h-4 text-slate-300 transform rotate-90" />
                                            </motion.div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Quick Actions Row */}
                <div className="space-y-4">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-2">
                        Quick Connections
                    </h2>
                    <div className="grid grid-cols-4 gap-4">
                        {quickActions.map((action, i) => {
                            const Icon = action.icon;
                            return (
                                <Link key={action.label} href={action.href} className="flex flex-col items-center gap-2 group">
                                    <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center group-active:scale-95 transition-all text-slate-600 group-hover:text-primary group-hover:border-primary/20">
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                                        {action.label}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Promotional Banner */}
                <div className="bg-primary p-6 rounded-[2.5rem] text-white relative overflow-hidden shadow-xl shadow-primary/20">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                    <div className="relative z-10 space-y-4">
                        <div className="space-y-1">
                            <h3 className="text-xl font-black uppercase italic tracking-tighter">Stay Connected</h3>
                            <p className="text-xs font-bold text-white/80 uppercase tracking-widest">Never miss a blessing from our family.</p>
                        </div>
                        <Button className="bg-white text-primary hover:bg-slate-100 rounded-xl h-10 px-6 font-black uppercase italic tracking-tighter text-xs">
                            Enable Notifications
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
}
