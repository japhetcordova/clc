"use client";

import { motion } from "framer-motion";
import { User as UserIcon, Phone, Mail, Users as UsersIcon, Calendar, Share2, Download, Edit3, Settings, ShieldCheck, Lightbulb, Home, Eye, Sparkles, LogOut, Lock, ExternalLink, Play, Book, CheckCircle, ChevronRight } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import ProfileClient, { ProfileIDPreview } from "./profile-client";
import EditProfile from "./edit-profile";
import SuggestionForm from "@/components/SuggestionForm";
import BackButton from "@/components/BackButton";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerClose } from "@/components/ui/drawer";
import { ListFilter, MoreHorizontal } from "lucide-react";
import useMediaQuery from "@/hooks/use-media-query";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import React, { useState, useEffect } from "react";
import { SecurityGate } from "@/components/SecurityGate";
import { trpc } from "@/lib/trpc/client";
import { useRouter } from "next/navigation";

interface ProfileViewProps {
    user: any;
    qrValue: string;
    attendance?: any[];
    initialAuthorized: boolean;
}

export default function ProfileView({ user, qrValue, attendance = [], initialAuthorized }: ProfileViewProps) {
    const [activeTab, setActiveTab] = useState("overview");
    const [selectedLevel, setSelectedLevel] = useState("LIFE CLASS");
    const [selectedVideo, setSelectedVideo] = useState({
        title: "Learning from our mistakes",
        url: "https://drive.google.com/file/d/1_W8zzegFlI1ps8D3K_ayqWahapGQpf6m/view?t=4"
    });
    const [isPlaying, setIsPlaying] = useState(false);

    const curriculum = {
        "LIFE CLASS": [
            { id: 1, title: "Mistakes", description: "Learning from our mistakes", url: "https://drive.google.com/file/d/1_W8zzegFlI1ps8D3K_ayqWahapGQpf6m/view?t=4" },
            { id: 2, title: "Best Deal", description: "The best deal of your life", url: "https://drive.google.com/file/d/18ylXOsVTLqgvfsGipUk_aHszI7pCbNDl/view?t=2" },
            { id: 3, title: "Experience", description: "The best experience of your life", url: "https://drive.google.com/file/d/1EK460jNHQ1kTbcLWKBlw4qWQvQQ7ew_w/view" },
            { id: 4, title: "Battle", description: "Life is a battle", url: "https://drive.google.com/file/d/1uI3jVNVKLBoHbTUFJeQAafgQKt06fWlY/view" },
            { id: 6, title: "Secret", description: "Discover the secret that will transform your life", url: "https://drive.google.com/file/d/1rxj7e-qD7nnKv-3UIHyY3pc8uFtmq7Uu/view?t=3" },
            { id: 7, title: "Decisions", description: "Your decisions defines you", url: "https://drive.google.com/file/d/1FCnGsOAgFAzUAvsQNVtzTy0h8-V2EIrs/view" },
            { id: 8, title: "God's Best", description: "Nothing less but God's best", url: "https://drive.google.com/file/d/13s23yytyzwIv5pyfEiVkKoZ-2w7lkdlE/view" },
            { id: 9, title: "Beginning", description: "A new beginning", url: "https://drive.google.com/file/d/1CBM6Ivr8GvfVhYdisUUX6QuiIwxuckhK/view" }
        ],
        "SOL 1": {
            "MODULE 1": [
                { id: 1, title: "His Love", description: "Pastored in His Love", url: "https://drive.google.com/file/d/1NEQGUFER4q-MbuhXsIvNlUSYe7IuhwMM/view" },
                { id: 2, title: "Relationship", description: "Cultivating a relationship with God", url: "https://drive.google.com/file/d/1piZ0t8EWCdA9mZ0JJcCS6aQ9v8hbcNUQ/view" },
                { id: 3, title: "Praise", description: "The power of praise and worship", url: "https://drive.google.com/file/d/1pSRrthORhk5bxldxqtqC8qv6dBoK4Ks8/view" },
                { id: 4, title: "Strengthened", description: "Strengthened in God", url: "https://drive.google.com/file/d/170ggH8xQa5hdswBhjD3qHAeapGJDgpD-/view" },
                { id: 5, title: "Warfare", description: "Spiritual warfare", url: "https://drive.google.com/file/d/1YrE9h3-wy9AMZ1GWItw6duNciRS5q0c6/view" },
                { id: 6, title: "Redemption", description: "The redemptive power of the blood", url: "https://drive.google.com/file/d/1VGSyltQ3PxoZOIrjwpKwGlIX9MD-LydQ/view?t=1" },
                { id: 7, title: "The Bible", description: "The Bible will transform your life", url: "https://drive.google.com/file/d/11XLP84Ne3bioOfvYq1sAojPO7o2TjoJ6/view" },
                { id: 8, title: "Anointing", description: "The anointing of the Holy Spirit", url: "https://drive.google.com/file/d/1mO5-2PKz_JMwrcDP98_PIUS6hfi_XxXg/view" },
                { id: 9, title: "Prosperity", description: "The blessing of prosperity", url: "https://drive.google.com/file/d/1ZUMni4kmxWCv5GlEvrqRD38tZM60d5l8/view" },
                { id: 10, title: "The Church", description: "Building the church", url: "https://drive.google.com/file/d/1R6RCnrXV_Nf-IAc-zI25G54Gk4uwkqWd/view" }
            ],
            "MODULE 2": [
                { id: 1, title: "Vision", description: "What is vision", url: "https://drive.google.com/file/d/1OOW4WoEo6heWdJa2IxilKu0akjqqbsUs/view" },
                { id: 2, title: "G12", description: "Principles of G12", url: "https://drive.google.com/file/d/1ng0jhS6425kU1VV6cQGnksb4qD78AfyX/view" },
                { id: 3, title: "Foundation", description: "A firm foundation", url: "https://drive.google.com/file/d/13AbhmzZhePao7fyQeVPqMppQ3snWWVf8/view" },
                { id: 4, title: "Government of 12", description: "The vision of the government of 12", url: "https://drive.google.com/file/d/1U1Q1EGj_LAPDNp8rq_VONXSUGYLb8WoF/view" },
                { id: 5, title: "The Team", description: "Forming the best team", url: "https://drive.google.com/file/d/1E-hUl-Fo96jLJggms4TGbNyoHXD2xO9P/view" },
                { id: 6, title: "Leadership", description: "Successful leadership", url: "https://drive.google.com/file/d/1HSafVO_JYGBjSiH4pKEzbNP-Kug2kRTN/view" },
                { id: 7, title: "Winning", description: "The art of winning", url: "https://drive.google.com/file/d/1_ebcYkvOhCsc5vYPVeAGItEvEUM8ykte/view" },
                { id: 8, title: "Cell Group", description: "Blessing through the cell group", url: "https://drive.google.com/file/d/1jxbKzDmREIMEtX8iTYVkqxP1UN0nNHOt/view" },
                { id: 9, title: "Consolidate", description: "Ready to consolidate", url: "https://drive.google.com/file/d/1lHsm4tGN9CP3UP8Z197e-W8m9zxF5iwN/view" },
                { id: 10, title: "144", description: "The power of 144", url: "https://drive.google.com/file/d/1FwIh0iPrlJfGyKvlMfkrf2dDvdiVrepQ/view" }
            ]
        },
        "SOL 2": {
            "MODULE 3": [
                { id: 1, title: "Glory", description: "The present glory", url: "https://drive.google.com/file/d/1CEuV43DwF7ghCoZfwW6HvbhoQqwyOq1p/view" },
                { id: 2, title: "Winning Principles", description: "Key principles of winning", url: "https://drive.google.com/file/d/1VZRYL-3iFIE6OVacV-m9gd0PyZukEVU6/view" },
                { id: 3, title: "Evangelism Power", description: "The power of evangelism", url: "https://drive.google.com/file/d/1SwEE79nThWVuf-rDMD6zO79eeI3ZXDWQ/view" },
                { id: 4, title: "Effectiveness", description: "Effective evangelism", url: "https://drive.google.com/file/d/1tbyL8goBvfcFlqDR5BJ9e5MyybzUH7Qs/view" },
                { id: 5, title: "Anointing", description: "The anointing to win", url: "https://drive.google.com/file/d/1_oBXls6TPAIPTUfn-0mSbDJo-Tlk6W1b/view" },
                { id: 6, title: "Compassion", description: "Compassion", url: "https://drive.google.com/file/d/1V0L3TcEan8b9b6ERJYZUYv-bOe-UR2O-/view" },
                { id: 7, title: "Generosity", description: "Generosity", url: "https://drive.google.com/file/d/1exFJS4TuVFdjrBgKxQw3VxHW64M1AX-i/view" },
                { id: 8, title: "Faith", description: "Faith", url: "https://drive.google.com/file/d/1iR2ek87hDE_32Xfp0jukPHXQWEzINR-t/view" },
                { id: 9, title: "Cell Vision", description: "The cell vision", url: "https://drive.google.com/file/d/1DoUPSgFayXUMusQUAL4Hgg1y-jLtawgV/view" },
                { id: 10, title: "Structure", description: "Structure and development", url: "" }
            ],
            "MODULE 4": [
                { id: 1, title: "Purpose", description: "Families with a purpose", url: "https://drive.google.com/file/d/1cwl8_cGSSn5iDTHYwMKZusiOiZRup9sw/view" },
                { id: 2, title: "Roles", description: "The roles of the parents and the children", url: "https://drive.google.com/file/d/190L-bcsdH5XUXPLn-TNe6ohrswZYxIH-/view" },
                { id: 3, title: "Inner Healing", description: "Inner healing for the family", url: "https://drive.google.com/file/d/1pEdEJQaBPMgLNQeTMKnB_dUWbsei4C5r/view" },
                { id: 4, title: "Marriage Pillars", description: "Seven pillars for a happy marriage", url: "https://drive.google.com/file/d/12CmOHn3mdvnkPdRdsqMyaH67a1ANxLMx/view" },
                { id: 5, title: "Fatherhood", description: "The blessing of fatherhood", url: "https://drive.google.com/file/d/1YMpjfqHrmUG4pteSsxKIG_uCPwNNhmOC/view" },
                { id: 6, title: "Right Person?", description: "Is this the right person", url: "https://drive.google.com/file/d/1ywQvwMWBRi59WxB4ZhqOetOdeJgdlCsQ/view" },
                { id: 7, title: "True Love", description: "True love", url: "https://drive.google.com/file/d/15nRnMfLYkCjSLzwwO0pDIxAi94gUeu8P/view" },
                { id: 8, title: "Courtship", description: "Seven steps for a successful courtship", url: "https://drive.google.com/file/d/1_l1n49NDGRmfXC5RowWq8loiYJVGaaIE/view" },
                { id: 9, title: "Communication", description: "Strengthening communication for marriage", url: "" },
                { id: 10, title: "Ten Commandments", description: "Gods ten commandments for the family", url: "" }
            ]
        },
        "SOL 3": {
            "MODULE 5": [
                { id: 1, title: "Faith Leader", description: "A leader of faith", url: "https://drive.google.com/file/d/11F8EVW_cJuMwSs2HJWjAifo5QNypq-TD/view" },
                { id: 2, title: "Love for Sheep", description: "The leaders love for the sheep", url: "https://drive.google.com/file/d/1no1S8Sbf0o75Vl3w21LhG6sWOgwkiAkm/view" },
                { id: 3, title: "Builder", description: "A leader that builds", url: "https://drive.google.com/file/d/1P72XaB3AKU2nUVGTEoQCJJ5ef7MJ_knY/view" },
                { id: 4, title: "Servant Heart", description: "A leader with the heart of a servant", url: "https://drive.google.com/file/d/1Fdbcxanw4_UhM8DBtMdc_7q7obsC9MKl/view" },
                { id: 5, title: "Control", description: "The leader controlled by the Holy Spirit", url: "https://drive.google.com/file/d/1EaS0TtqygxCMuD1aK_Dx4zLGATr4LmMd/view" },
                { id: 6, title: "Preaching", description: "The leader preaching the word", url: "https://drive.google.com/file/d/1o-CR6jDrQ56RiTiWYEonKiEgAFg8n8RA/view" },
                { id: 7, title: "Counseling", description: "The leader and counseling", url: "https://drive.google.com/file/d/1gT84Gg6ecycC5zzagSDXxusPl1_ED5_y/view" },
                { id: 8, title: "Supervision", description: "The leader and supervision", url: "https://drive.google.com/file/d/1lBjmcOfgrd1AwOXiRRWAlrgd9XY3rFGH/view" },
                { id: 9, title: "Price", description: "The price of leadership", url: "https://drive.google.com/file/d/16DkCMR1P1wvwCClxk1hDECN5ZVZDBNCm/view" },
                { id: 10, title: "Formation", description: "The leader and the formation of disciples", url: "https://drive.google.com/file/d/1-oM5sg98W4jnocxn9BpfHl4Hk7nvp7Tf/view" }
            ],
            "MODULE 6": [
                { id: 1, title: "Holy Spirit & Me", description: "The holy spirit and me", url: "https://drive.google.com/file/d/1_b7kavauUl_OCz7PX_PqW4s5OdmbsIAi/view" },
                { id: 2, title: "Preparation", description: "Preparing to receive the holy spirit", url: "https://drive.google.com/file/d/1NJjJ5bGAcIiOkZB5LMb8NMUolr0loaAw/view" },
                { id: 3, title: "Knowing", description: "Knowing the holy spirit", url: "https://drive.google.com/file/d/1woWgz_MQ5mC7pOawjENvqm1-lpNoqAhq/view" },
                { id: 4, title: "Fruit Part 1", description: "The fruit of the holy spirit", url: "https://drive.google.com/file/d/1idU0DuYToJI_RIw7zTgmheixayrdE700/view" },
                { id: 5, title: "Fruit Part 2", description: "The fruit of the holy spirit part 2", url: "https://drive.google.com/file/d/1HS0Ah5b5Gb2lNaROw15pwZQyMVcWz-hR/view" },
                { id: 6, title: "Fruit Part 3", description: "The fruit of the holy spirit part 3", url: "https://drive.google.com/file/d/1pESsJIQLdbSRrSBn2bS-bl98zYqzbGNn/view" },
                { id: 7, title: "Gifts Intro", description: "Introduction of the gifts of the holy spirit", url: "https://drive.google.com/file/d/15k_NkX0bxgvmqnJWTJfc67ks6zdRl-Ki/view" },
                { id: 8, title: "Revelation", description: "Gifts of the revelation", url: "https://drive.google.com/file/d/1QaoqTS-8tU0-YHOtP8uvBpIIhf6OHC9_/view" },
                { id: 9, title: "Power", description: "Gifts of power", url: "https://drive.google.com/file/d/1c7c9a94suLWy_lB9UTRGMgRIChdcowZ6/view" },
                { id: 10, title: "Inspiration", description: "Gifts of inspiration", url: "" }
            ]
        }
    };

    const router = useRouter();
    const verifyMutation = trpc.verifyProfilePin.useMutation();
    const logoutMutation = trpc.logout.useMutation();

    const handleLogout = async () => {
        await logoutMutation.mutateAsync();
        localStorage.removeItem(`profile_auth_${qrValue}`);
        localStorage.removeItem(`profile_auth_${qrValue}_date`);
        localStorage.removeItem("clc_is_premium");
        document.documentElement.classList.remove("premium");
        document.documentElement.removeAttribute("data-theme");
        toast.success("Profile access locked.");
        window.location.reload();
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

                        {/* Status Indicator (Optional but adds premium feel) */}
                        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-600">Session Secure</span>
                        </div>
                    </div>

                    {/* Mobile Bottom Navigation Bar */}
                    <div className="xs:hidden fixed bottom-1 left-1 right-1 z-40 bg-card/80 backdrop-blur-3xl border border-border/50 px-6 py-3 flex items-center justify-between pb-safe rounded-[2rem] shadow-2xl ring-1 ring-white/5">
                        <Link href="/mobile" className="flex flex-col items-center gap-1 group">
                            <div className="p-2 rounded-xl group-active:bg-primary/10 transition-colors">
                                <Home className="w-5 h-5 text-muted-foreground group-active:text-primary" />
                            </div>
                            <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground group-active:text-primary leading-none">Home</span>
                        </Link>
                        <button
                            onClick={() => {
                                (document.querySelector('[value="classes"]') as HTMLElement)?.click();
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="flex flex-col items-center gap-1 group"
                        >
                            <div className="p-2 rounded-xl group-active:bg-primary/10 transition-colors">
                                <Book className="w-5 h-5 text-muted-foreground group-active:text-primary" />
                            </div>
                            <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground group-active:text-primary leading-none">Videos</span>
                        </button>
                        <button
                            onClick={() => {
                                (document.querySelector('[value="overview"]') as HTMLElement)?.click();
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="flex flex-col items-center gap-1 group"
                        >
                            <div className="p-2 rounded-xl group-active:bg-primary/10 transition-colors">
                                <UserIcon className="w-5 h-5 text-muted-foreground group-active:text-primary" />
                            </div>
                            <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground group-active:text-primary leading-none">Info</span>
                        </button>
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

                            {/* Mobile Quick Actions Floating Trigger */}
                            <div className="lg:hidden fixed bottom-6 right-6 z-50">
                                <Drawer>
                                    <DrawerTrigger asChild>
                                        <Button size="lg" className="h-14 w-14 rounded-full shadow-2xl shadow-primary/40 bg-primary text-primary-foreground hover:scale-110 active:scale-90 transition-all">
                                            <MoreHorizontal className="w-6 h-6 shrink-0" />
                                        </Button>
                                    </DrawerTrigger>
                                    <DrawerContent className="bg-card/95 backdrop-blur-2xl border-t border-border/50 rounded-t-[2rem]">
                                        <div className="p-6 pb-12 space-y-6">
                                            <DrawerHeader className="p-0">
                                                <DrawerTitle className="text-xl font-black uppercase italic tracking-tighter text-left">Account Actions</DrawerTitle>
                                            </DrawerHeader>
                                            <div className="grid grid-cols-1 gap-3">
                                                <EditProfile user={user} />
                                                <SuggestionForm
                                                    userId={user.id}
                                                    triggerButton={
                                                        <Button
                                                            variant="outline"
                                                            className="w-full border-2 border-primary/10 hover:bg-primary/5 rounded-2xl font-black flex items-center justify-start px-6 gap-4 h-14 uppercase text-[10px] tracking-[0.2em] transition-all"
                                                        >
                                                            <ShieldCheck className="w-5 h-5 text-primary" />
                                                            Create Suggestion
                                                        </Button>
                                                    }
                                                />
                                                <Link href="/suggestions" className="w-full">
                                                    <Button
                                                        variant="outline"
                                                        className="w-full border-2 border-primary/10 hover:bg-primary/5 rounded-2xl font-black flex items-center justify-start px-6 gap-4 h-14 uppercase text-[10px] tracking-[0.2em] transition-all"
                                                    >
                                                        <Lightbulb className="w-5 h-5 text-primary" />
                                                        Community Board
                                                    </Button>
                                                </Link>
                                                <ProfileIDPreview
                                                    user={user}
                                                    qrValue={qrValue}
                                                    trigger={
                                                        <Button
                                                            variant="outline"
                                                            className="w-full border-2 border-primary/10 hover:bg-primary/5 rounded-2xl font-black flex items-center justify-start px-6 gap-4 h-14 uppercase text-[10px] tracking-[0.2em] transition-all"
                                                        >
                                                            <Download className="w-5 h-5 text-primary" />
                                                            Access Digital ID
                                                        </Button>
                                                    }
                                                />
                                            </div>
                                            <DrawerClose asChild>
                                                <Button variant="ghost" className="w-full rounded-2xl h-12 font-bold uppercase text-[10px] tracking-widest">Close Menu</Button>
                                            </DrawerClose>
                                        </div>
                                    </DrawerContent>
                                </Drawer>
                            </div>
                        </div>

                        {/* Right Column: Detailed Info */}
                        <div className="space-y-6">
                            <Card className="h-full border-none shadow-xl bg-card/50 backdrop-blur-md ring-1 ring-border p-1">
                                <Tabs defaultValue="overview" className="h-full flex flex-col">
                                    <TabsList className="sticky top-0 z-20 w-full justify-start p-1.5 sm:p-2 bg-background/80 backdrop-blur-3xl border-b border-border/50 rounded-none h-auto gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none flex-nowrap">
                                        {[
                                            { id: "overview", label: "Info", icon: <UserIcon className="w-4 h-4" /> },
                                            { id: "activity", label: "Logs", icon: <Calendar className="w-4 h-4" /> },
                                            { id: "classes", label: "Videos", icon: <Book className="w-4 h-4" /> }
                                        ].map((tab) => (
                                            <TabsTrigger
                                                key={tab.id}
                                                value={tab.id}
                                                className="rounded-xl px-4 sm:px-6 py-2.5 sm:py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold uppercase text-[10px] tracking-widest transition-all shrink-0 flex items-center gap-2"
                                            >
                                                {tab.icon}
                                                <span className="hidden sm:inline">{tab.id === "classes" ? "Materials" : tab.id}</span>
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
                                                                        <p className="text-sm font-bold text-foreground">Service Attendance</p>
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
                                        </TabsContent>

                                        <TabsContent value="classes" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                            <div className="space-y-6">
                                                {/* Curriculum Header */}
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                    <div>
                                                        <h3 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
                                                            <Book className="w-5 h-5 text-primary" />
                                                            The Journey Curriculum
                                                        </h3>
                                                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mt-1">Select a level to view modules and lessons</p>
                                                    </div>
                                                </div>

                                                {/* Level Selector */}
                                                <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 mb-2">
                                                    {Object.keys(curriculum).map((level) => (
                                                        <Button
                                                            key={level}
                                                            variant={selectedLevel === level ? "default" : "outline"}
                                                            onClick={() => {
                                                                setSelectedLevel(level);
                                                                // Set default video to first lesson of first module/level
                                                                const levelData = curriculum[level as keyof typeof curriculum];
                                                                const firstLesson = Array.isArray(levelData) ? levelData[0] : (Object.values(levelData)[0] as any[])[0];
                                                                if (firstLesson) {
                                                                    setSelectedVideo({ title: firstLesson.description, url: firstLesson.url });
                                                                    setIsPlaying(false);
                                                                }
                                                            }}
                                                            className={cn(
                                                                "rounded-xl h-11 px-6 font-black uppercase text-[10px] sm:text-[11px] tracking-widest shrink-0 transition-all",
                                                                selectedLevel === level && "shadow-[0_10px_20px_-5px_rgba(var(--primary-rgb),0.3)]"
                                                            )}
                                                        >
                                                            {level}
                                                        </Button>
                                                    ))}
                                                </div>

                                                <div className="grid lg:grid-cols-[1fr_350px] gap-8">
                                                    {/* Video Player Section */}
                                                    <div className="space-y-6">
                                                        <div className="aspect-video w-full rounded-2xl sm:rounded-[2.5rem] overflow-hidden bg-black shadow-2xl ring-1 ring-border/50 relative group">
                                                            {!isPlaying && selectedVideo.url ? (
                                                                <div
                                                                    className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer group/overlay"
                                                                    onClick={() => setIsPlaying(true)}
                                                                >
                                                                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent z-0" />
                                                                    <div className="w-20 h-20 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center border border-primary/30 group-hover/overlay:scale-110 group-hover/overlay:bg-primary transition-all duration-500 relative z-10">
                                                                        <Play className="w-8 h-8 text-white fill-white ml-1" />
                                                                    </div>
                                                                    <div className="absolute bottom-6 left-6 right-6 z-10">
                                                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-1">Session Available</p>
                                                                        <h5 className="text-lg font-black text-white uppercase italic leading-none">{selectedVideo.title}</h5>
                                                                    </div>
                                                                </div>
                                                            ) : selectedVideo.url ? (
                                                                <iframe
                                                                    src={selectedVideo.url.replace('/view', '/preview').split('?')[0] + "?autoplay=1"}
                                                                    className="w-full h-full border-none"
                                                                    allow="autoplay"
                                                                    allowFullScreen
                                                                />
                                                            ) : (
                                                                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground bg-muted/20">
                                                                    <Play className="w-12 h-12 mb-4 opacity-20" />
                                                                    <p className="font-black uppercase text-xs tracking-widest">Video Not Available Yet</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1 sm:px-4">
                                                            <div className="space-y-1">
                                                                <div className="flex items-center gap-2 flex-wrap">
                                                                    <span className="text-[9px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-widest">{selectedLevel}</span>
                                                                    <h4 className="font-black text-lg sm:text-xl uppercase tracking-tighter italic leading-none">{selectedVideo.title}</h4>
                                                                </div>
                                                                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Active Session Player</p>
                                                            </div>
                                                            {selectedVideo.url && (
                                                                <Link
                                                                    href={selectedVideo.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="w-full sm:w-auto"
                                                                >
                                                                    <Button variant="outline" size="sm" className="w-full sm:w-auto rounded-xl sm:rounded-full gap-2 text-[10px] font-black uppercase tracking-widest h-10 px-6">
                                                                        Open on Drive
                                                                        <ExternalLink className="w-3 h-3" />
                                                                    </Button>
                                                                </Link>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Lesson List Section */}
                                                    <div className="space-y-4 lg:max-h-[600px] lg:overflow-y-auto lg:pr-2 scrollbar-thin scrollbar-thumb-primary/20">
                                                        {Array.isArray(curriculum[selectedLevel as keyof typeof curriculum]) ? (
                                                            <div className="space-y-3">
                                                                {(curriculum[selectedLevel as keyof typeof curriculum] as any[]).map((lesson) => (
                                                                    <LessonRow
                                                                        key={lesson.id}
                                                                        lesson={lesson}
                                                                        isSelected={selectedVideo.url === lesson.url}
                                                                        onSelect={() => {
                                                                            setSelectedVideo({ title: lesson.description, url: lesson.url });
                                                                            setIsPlaying(true);
                                                                        }}
                                                                    />
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            Object.entries(curriculum[selectedLevel as keyof typeof curriculum] as Record<string, any[]>).map(([moduleName, lessons]) => (
                                                                <div key={moduleName} className="space-y-4">
                                                                    <div className="sticky top-0 z-10 bg-card/60 backdrop-blur-md py-2 px-1 border-b border-border/50">
                                                                        <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{moduleName}</h5>
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        {lessons.map((lesson) => (
                                                                            <LessonRow
                                                                                key={lesson.id}
                                                                                lesson={lesson}
                                                                                isSelected={selectedVideo.url === lesson.url}
                                                                                onSelect={() => {
                                                                                    setSelectedVideo({ title: lesson.description, url: lesson.url });
                                                                                    setIsPlaying(true);
                                                                                }}
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            ))
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Full Archive CTA */}
                                                <div className="text-center py-10 px-6 sm:px-12 space-y-6 rounded-3xl sm:rounded-[3rem] bg-linear-to-br from-primary/5 via-transparent to-rose-500/5 border border-border/50 relative overflow-hidden group mt-8">
                                                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                                    <div className="relative space-y-6">
                                                        <div className="max-w-md mx-auto space-y-3">
                                                            <h4 className="font-black text-2xl uppercase tracking-tighter italic leading-none">Resource Archive</h4>
                                                            <p className="text-muted-foreground text-[10px] font-medium leading-relaxed uppercase tracking-widest">
                                                                Can't find what you're looking for? Access all recorded sessions, modules, and handouts in our full cloud storage archive.
                                                            </p>
                                                        </div>
                                                        <div className="pt-2">
                                                            <Link
                                                                href="https://drive.google.com/drive/folders/13d1rw_OHwwiPMq6hJkc01Ee-RL0OoEUr"
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="w-full sm:w-auto inline-block"
                                                            >
                                                                <Button className="w-full sm:w-auto rounded-2xl px-12 h-14 font-black uppercase text-[10px] tracking-[0.25em] shadow-xl hover:-translate-y-1 active:scale-95 transition-all gap-3 bg-primary text-primary-foreground">
                                                                    Go to Full Archive
                                                                    <ExternalLink className="w-4 h-4" />
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    </div>
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

function LessonRow({ lesson, isSelected, onSelect }: { lesson: any, isSelected: boolean, onSelect: () => void }) {
    return (
        <button
            onClick={onSelect}
            disabled={!lesson.url}
            className={cn(
                "w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition-all text-left group",
                isSelected
                    ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : lesson.url
                        ? "bg-card hover:bg-muted/50 border-border/50"
                        : "bg-muted/10 border-dashed border-border/30 opacity-50 cursor-not-allowed"
            )}
        >
            <div className={cn(
                "w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 transition-colors text-[10px] font-black",
                isSelected ? "bg-white/20" : "bg-primary/10 text-primary"
            )}>
                {isSelected ? <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" /> : <Play className="w-3.5 h-3.5 sm:w-4 h-4" />}
            </div>
            <div className="flex-1 min-w-0">
                <p className={cn("text-[9px] sm:text-[10px] font-black uppercase tracking-widest leading-none mb-1", isSelected ? "text-white/70" : "text-muted-foreground")}>Lesson {lesson.id}</p>
                <h6 className="text-xs sm:text-xs font-bold uppercase tracking-tight truncate shrink-0">{lesson.title}</h6>
                {lesson.url ? (
                    <p className={cn("text-[8px] sm:text-[9px] font-medium uppercase truncate hidden xs:block mt-0.5", isSelected ? "text-white/50" : "text-muted-foreground/60")}>{lesson.description}</p>
                ) : (
                    <p className="text-[8px] font-black uppercase tracking-widest text-primary/40 mt-1">Coming Soon</p>
                )}
            </div>
            {lesson.url ? (
                <ChevronRight className={cn("w-4 h-4 opacity-60 transition-all", isSelected ? "text-white" : "text-primary")} />
            ) : (
                <Lock className="w-3.5 h-3.5 text-muted-foreground/30" />
            )}
        </button>
    );
}

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
