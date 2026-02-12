"use client";

import { motion } from "framer-motion";
import { User as UserIcon, Phone, Mail, Users as UsersIcon, Calendar, Share2, Download, Edit3, Settings, ShieldCheck, Lightbulb, Home, Eye, Sparkles, LogOut, Lock, ExternalLink, Play, Book, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import ProfileClient, { ProfileIDPreview } from "./profile-client";
import EditProfile from "./edit-profile";
import SuggestionForm from "@/components/SuggestionForm";
import useMediaQuery from "@/hooks/use-media-query";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import React, { useState, useEffect } from "react";
import { SecurityGate } from "@/components/SecurityGate";
import { trpc } from "@/lib/trpc/client";
import { useRouter } from "next/navigation";

// Helper function to convert video URLs to embeddable format
function getEmbedUrl(url: string): string {
    if (!url) return '';
    return url;
}

interface ProfileViewProps {
    user: any;
    qrValue: string;
    attendance?: any[];
    enrollments?: { classLevel: string; status: string }[];
    initialAuthorized: boolean;
}

// Curriculum data moved to curriculum-data.ts

import { curriculum, classLevelToCurriculumKey } from "./curriculum-data";

export default function ProfileView({ user, qrValue, attendance = [], enrollments = [], initialAuthorized }: ProfileViewProps) {
    // Get enrolled class keys from database enrollments
    const [isDeveloperMode, setIsDeveloperMode] = useState(false);
    const [isLocalhost, setIsLocalhost] = useState(false);

    useEffect(() => {
        setIsLocalhost(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    }, []);

    // Get enrolled class keys from database enrollments
    const enrolledClassKeys = isDeveloperMode
        ? Object.keys(curriculum)
        : enrollments
            .filter(e => e.status === 'active' || e.status === 'completed')
            .map(e => classLevelToCurriculumKey[e.classLevel])
            .filter(Boolean);

    const [activeTab, setActiveTab] = useState("overview");

    const router = useRouter();
    const verifyMutation = trpc.verifyProfilePin.useMutation();
    const logoutMutation = trpc.logout.useMutation();

    const isMobile = useMediaQuery("(max-width: 1024px)");

    const handleLogout = async () => {
        await logoutMutation.mutateAsync();
        localStorage.removeItem(`profile_auth_${qrValue}`);
        localStorage.removeItem(`profile_auth_${qrValue}_date`);
        localStorage.removeItem("clc_is_premium");
        document.documentElement.classList.remove("premium");
        document.documentElement.removeAttribute("data-theme");
        toast.success("Profile access locked.");

        if (isMobile) {
            window.location.href = "/mobile";
        } else {
            window.location.href = "/";
        }
    };

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
    };

    const stagger = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <SecurityGate
            title="Identity Access"
            description="Enter your registered contact number to unlock your Digital ID."
            icon={<Lock className="w-8 h-8 text-primary" />}
            accentColor="primary"
            initialAuthorized={initialAuthorized}
            storageKey={`profile_auth_${qrValue}`}
            onVerify={async (pin) => {
                const result = await verifyMutation.mutateAsync({ qrCodeId: qrValue, pin });
                return result;
            }}
            onAuthorized={() => {
                toast.success("Access Granted");
            }}
            footerNote="Contact admin if you forgot your registered details."
        >
            <div className="min-h-screen py-4 px-2 sm:px-4 md:px-8 relative overflow-hidden bg-muted/20 pb-20 md:pb-8">
                {/* Dynamic Background */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-rose-500/5 rounded-full blur-[100px]" />
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="max-w-[1920px] mx-auto relative z-10 flex flex-col gap-6 sm:gap-8 md:pt-4"
                >
                    {/* Unified Navigation & Status Bar */}
                    <div className="flex items-center justify-between w-full px-2 sm:px-0">
                        <div className="flex items-center bg-card/60 backdrop-blur-3xl rounded-[1.25rem] border border-border/50 p-1 shadow-2xl ring-1 ring-white/5 animate-in fade-in slide-in-from-top-4 duration-500">
                            <Link href="/mobile">
                                <Button
                                    variant="ghost"
                                    className="rounded-xl h-10 px-3 sm:px-4 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all font-black uppercase text-[10px] tracking-widest gap-2"
                                >
                                    <Home className="w-4 h-4 text-primary" />
                                    <span className="hidden xs:inline">Home</span>
                                </Button>
                            </Link>

                            <div className="w-[1px] h-5 bg-border/50 mx-1" />

                            <Button
                                variant="ghost"
                                onClick={handleLogout}
                                className="rounded-xl h-10 px-3 sm:px-4 text-destructive hover:bg-destructive/10 hover:text-destructive transition-all font-black uppercase text-[10px] tracking-widest gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden xs:inline">Lock <span className="hidden sm:inline">Profile</span></span>
                            </Button>
                        </div>

                        {/* Developer Mode Toggle (Localhost Only) */}
                        {isLocalhost ? (
                            <div
                                onClick={() => {
                                    setIsDeveloperMode(!isDeveloperMode);
                                    toast.info(isDeveloperMode ? "Developer Mode Disabled" : "Developer Mode Enabled: All videos unlocked");
                                }}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 border rounded-full cursor-pointer transition-all duration-300",
                                    isDeveloperMode
                                        ? "bg-rose-500/10 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]"
                                        : "bg-amber-500/10 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]"
                                )}
                            >
                                <div className={cn(
                                    "w-2 h-2 rounded-full animate-pulse",
                                    isDeveloperMode ? "bg-rose-500" : "bg-amber-500"
                                )} />
                                <span className={cn(
                                    "text-[9px] font-black uppercase tracking-[0.2em]",
                                    isDeveloperMode ? "text-rose-600" : "text-amber-600 dark:text-amber-400"
                                )}>
                                    {isDeveloperMode ? (
                                        <span className="flex items-center gap-2">
                                            <Wrench className="w-3 h-3" />
                                            Dev Mode Active
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            {user.redeemPoints ?? 0} Reedem Points
                                        </span>
                                    )}
                                </span>
                            </div>
                        ) : (
                            /* Static Status Indicator for Production */
                            /* Redeem Points Display */
                            <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.1)]">
                                <span className="text-[9px] font-black uppercase tracking-[0.15em] text-amber-600 dark:text-amber-400">
                                    {user.redeemPoints ?? 0} Reeden Points
                                </span>
                            </div>
                        )}
                    </div>



                    <div className="w-full grid lg:grid-cols-[400px_1fr] gap-8">
                        {/* Left Column: ID Card & Quick Actions */}
                        <div className="space-y-6">
                            <Card className="overflow-hidden border-none shadow-2xl bg-card/80 backdrop-blur-xl ring-1 ring-white/10 relative group">
                                <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-rose-500/5 opacity-50" />

                                <div className="relative pt-12 pb-8 px-6 text-center space-y-4">
                                    {/* Interactive QR Section */}
                                    <div className="px-2 sm:px-6 pb-6 sm:pb-8">
                                        <div className="bg-white p-3 sm:p-4 rounded-2xl shadow-inner shadow-black/5 mx-auto w-fit mb-4 sm:mb-6">
                                            <div className="relative">
                                                <ProfileClient
                                                    user={user}
                                                    qrValue={qrValue}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center justify-center gap-2">
                                            <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">{user.firstName} {user.lastName}</h1>
                                            {user.isPremium && (
                                                <div className="bg-amber-500/10 p-1 rounded-full border border-amber-500/20 shrink-0">
                                                    <Sparkles className="w-3 h-3 text-amber-500" />
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-[10px] sm:text-sm font-medium text-muted-foreground uppercase tracking-widest">{user.ministry}</p>
                                    </div>

                                    {/* Actions: Desktop Show, Mobile Hidden (moved to drawer) */}
                                    <div className="hidden lg:flex justify-center gap-2 pt-2 pb-4">
                                        <div className="w-full max-w-[200px]">
                                            <ProfileIDPreview
                                                user={user}
                                                qrValue={qrValue}
                                                trigger={
                                                    <button className="w-full group relative flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded-full border border-primary/20 hover:border-primary/40 transition-all cursor-pointer overflow-hidden">
                                                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        <Eye className="w-3.5 h-3.5 text-primary relative z-10" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary relative z-10">Download ID</span>
                                                    </button>
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>


                            </Card>

                            <div className="hidden lg:grid grid-cols-1 gap-4">
                                <EditProfile user={user} />
                                <SuggestionForm
                                    userId={user.id}
                                    triggerButton={
                                        <Button
                                            variant="outline"
                                            className="w-full border-2 border-primary/10 hover:bg-primary/5 rounded-2xl font-black flex items-center justify-center gap-3 h-12 uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-black/5 hover:scale-[1.02] active:scale-95 transition-all"
                                        >
                                            <ShieldCheck className="w-5 h-5 text-primary" />
                                            Suggest
                                        </Button>
                                    }
                                />
                                <Link href="/suggestions">
                                    <Button
                                        variant="outline"
                                        className="w-full border-2 border-primary/10 hover:bg-primary/5 rounded-2xl font-black flex items-center justify-center gap-3 h-12 uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-black/5 hover:scale-[1.02] active:scale-95 transition-all"
                                    >
                                        <Lightbulb className="w-5 h-5 text-primary" />
                                        View Suggestions
                                    </Button>
                                </Link>
                            </div>

                        </div>

                        {/* Right Column: Detailed Info */}
                        <div className="space-y-6">
                            <Card className="h-full border-none shadow-xl bg-card/50 backdrop-blur-md ring-1 ring-border p-1">
                                <Tabs defaultValue="overview" className="h-full flex flex-col">
                                    <TabsList className="sticky top-0 z-20 w-full justify-start p-1.5 sm:p-2 bg-background/80 backdrop-blur-3xl border-b border-border/50 rounded-none h-auto gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none flex-nowrap">
                                        {[
                                            { id: "overview", label: "Info", icon: <UserIcon className="w-4 h-4" /> },
                                            { id: "activity", label: "Logs", icon: <Calendar className="w-4 h-4" /> }
                                        ].map((tab) => (
                                            <TabsTrigger
                                                key={tab.id}
                                                value={tab.id}
                                                className="rounded-xl px-4 sm:px-6 py-2.5 sm:py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold uppercase text-[10px] tracking-widest transition-all shrink-0 flex items-center gap-2"
                                            >
                                                {tab.icon}
                                                <span className="hidden sm:inline">{tab.label}</span>
                                                <span className="sm:hidden">{tab.label}</span>
                                            </TabsTrigger>
                                        ))}


                                    </TabsList>

                                    <div className="p-4 sm:p-6 md:p-8 flex-1">
                                        <TabsContent value="overview" className="mt-0 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                            <div className="grid gap-6">


                                                <div className="space-y-4">
                                                    <h3 className="text-sm font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                                                        <ShieldCheck className="w-4 h-4 text-primary" />
                                                        Personal Details
                                                    </h3>
                                                    <div className="grid sm:grid-cols-2 gap-4">
                                                        <InfoItem icon={<UserIcon />} label="Full Name" value={`${user.firstName} ${user.lastName}`} />
                                                        <InfoItem icon={<UsersIcon />} label="Gender" value={user.gender} />
                                                        <InfoItem icon={<UsersIcon />} label="Network" value={user.network} />
                                                        <InfoItem icon={<ShieldCheck />} label="Cluster" value={user.cluster} />
                                                        <InfoItem
                                                            icon={<Calendar />}
                                                            label="Member Since"
                                                            value={new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).replace(/^(\w+)/, '$1.')}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <h3 className="text-sm font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                                                        <Phone className="w-4 h-4 text-primary" />
                                                        Contact Information
                                                    </h3>
                                                    <div className="grid sm:grid-cols-2 gap-4">
                                                        <InfoItem icon={<Phone />} label="Phone" value={user.contactNumber} isCopyable />
                                                        <InfoItem icon={<Mail />} label="Email" value={user.email || "No email provided"} isCopyable />
                                                    </div>
                                                </div>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="activity" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                            <div className="space-y-6">
                                                {/* Attendance Records */}
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="text-sm font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                                                            <Calendar className="w-4 h-4 text-primary" />
                                                            Recent Attendance
                                                        </h3>
                                                        <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-widest">
                                                            {attendance?.length || 0} Records
                                                        </span>
                                                    </div>

                                                    {(attendance && attendance.length > 0) ? (
                                                        <div className="space-y-3">
                                                            {attendance.map((record: any) => (
                                                                <div key={record.id} className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors group">
                                                                    <div className="flex items-center gap-4">
                                                                        <div className="p-2.5 rounded-xl bg-green-500/10 text-green-500 ring-1 ring-green-500/20">
                                                                            <Check className="w-4 h-4" />
                                                                        </div>
                                                                        <div>
                                                                            <div className="flex items-center gap-2">
                                                                                <p className="text-sm font-bold text-foreground">Service Attendance</p>
                                                                                <span className="text-[9px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded-md border border-amber-500/20">+1 RP</span>
                                                                            </div>
                                                                            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                                                                                {new Date(record.scannedAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-background px-2 py-1 rounded-lg border border-border/50">
                                                                            {new Date(record.scannedAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="text-center py-12 space-y-4 rounded-3xl bg-muted/20 border border-dashed border-border">
                                                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                                                                <Calendar className="w-8 h-8 text-muted-foreground/50" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold text-lg">No Recent Activity</h4>
                                                                <p className="text-muted-foreground text-sm">Attendance records will appear here.</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </TabsContent>
                                    </div>
                                </Tabs>
                            </Card>
                        </div>
                    </div>
                </motion.div>
            </div>


        </SecurityGate>
    );
}

// LessonRow removed - moved to separate page or used locally there

function InfoItem({ icon, label, value, isCopyable }: { icon: any, label: string, value: string, isCopyable?: boolean }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (!value) return;
        navigator.clipboard.writeText(value);
        setCopied(true);
        toast.success(`${label} copied to clipboard`);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="group relative flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors overflow-hidden">
            <div className="shrink-0 p-2 sm:p-2.5 rounded-xl bg-background shadow-sm text-muted-foreground group-hover:text-primary transition-colors">
                {React.cloneElement(icon, { className: "w-3.5 h-3.5 sm:w-4 h-4" } as any)}
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest truncate">{label}</p>

                <TooltipProvider delayDuration={300}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="flex items-center gap-2 cursor-default">
                                <p className="text-sm font-bold text-foreground truncate">{value}</p>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{value}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            {isCopyable && (
                <button
                    onClick={handleCopy}
                    className="shrink-0 p-2 rounded-lg hover:bg-background text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-all focus:opacity-100 focus:outline-none"
                    title="Copy to clipboard"
                >
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
            )}
        </div>
    );
}
