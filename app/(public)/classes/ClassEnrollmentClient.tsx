"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
    GraduationCap,
    ArrowRight,
    ShieldCheck,
    LayoutGrid,
    Users,
    Zap,
    Heart,
    Compass,
    Rocket,
    ChevronDown,
    CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface User {
    id: string;
    firstName: string;
    lastName: string;
    qrCodeId: string;
}

export default function ClassEnrollmentClient({ currentUser }: { currentUser: User | null }) {
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const enrollMutation = trpc.enrollStudentByQr.useMutation();

    const handleEnroll = async (level: string) => {
        if (!currentUser) {
            toast.info("Please log in to enroll.");
            router.push("/registration?callbackUrl=/classes");
            return;
        }
        setIsProcessing(true);

        try {
            const result = await enrollMutation.mutateAsync({
                qrCodeId: currentUser.qrCodeId,
                classLevel: level
            });

            if (result.success) {
                toast.success("Enrollment Request Received!", {
                    description: `We've got your request for ${level.replace('_', ' ')}. We'll get back to you and let you know once it's updated!`,
                    duration: 6000,
                    icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                });
            }
        } catch (err: any) {
            toast.error("Enrollment failed", { description: err.message });
        } finally {
            setIsProcessing(false);
        }
    };

    const journeyData = [
        {
            id: "LIFE_CLASS",
            title: "Life Class",
            subtitle: "The Entry Level",
            description: "The starting point in the G12 journey for new believers or attendees. Learn how to live the Christian life.",
            focus: ["Basic Christian life", "Relationship with God", "Values, discipline, and identity"],
            purpose: "Prepare for deeper discipleship and establish a spiritual foundation.",
            icon: <Heart className="w-6 h-6 text-emerald-500" />,
            color: "border-emerald-500/20 bg-emerald-500/5",
            accent: "bg-emerald-500"
        },
        {
            id: "SOL_1",
            title: "SOL 1",
            subtitle: "Foundations of Leadership",
            description: "First step in the School of Leaders. Start learning how to lead yourself and others.",
            focus: ["Salvation & Lordship", "Vision of the church", "Discipleship principles"],
            purpose: "Build a solid leadership foundation. Ready to serve and disciple.",
            icon: <Compass className="w-6 h-6 text-primary" />,
            color: "border-primary/20 bg-primary/5",
            accent: "bg-primary"
        },
        {
            id: "SOL_2",
            title: "SOL 2",
            subtitle: "Character & Ministry",
            description: "Focus on character formation and ministry involvement. Trust and accountability.",
            focus: ["Character formation", "Ministry involvement", "Faithfulness"],
            purpose: "Serve in church and start assisting in cell groups. Trusted to lead others.",
            icon: <ShieldCheck className="w-6 h-6 text-accent" />,
            color: "border-accent/20 bg-accent/5",
            accent: "bg-accent"
        },
        {
            id: "SOL_3",
            title: "SOL 3",
            subtitle: "Leadership & Multiplication",
            description: "Advanced leadership training. Focus on mentoring and church vision expansion.",
            focus: ["Leadership multiplication", "Mentoring", "Church vision and expansion"],
            purpose: "Lead cell groups and disciple leaders. Ready to raise leaders, not followers.",
            icon: <Rocket className="w-6 h-6 text-amber-500" />,
            color: "border-amber-500/20 bg-amber-500/5",
            accent: "bg-amber-500"
        }
    ];

    return (
        <div className="w-full max-w-6xl mx-auto space-y-16 pb-20">
            {/* G12 OVERVIEW */}
            <div className="grid md:grid-cols-2 gap-8 items-center pt-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="space-y-6"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-primary">Discover G12</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-semibold uppercase  tracking-tighter leading-none">
                        What is <span className="text-primary">G12?</span>
                    </h2>
                    <div className="space-y-4 text-muted-foreground font-thin text-lg leading-relaxed">
                        <p>
                            G12 (Government of 12) is a Christian discipleship system popular in churches worldwide, built around Jesus' model of 12 disciples.
                        </p>
                        <ul className="space-y-3">
                            <li className="flex gap-3">
                                <Zap className="w-5 h-5 text-primary shrink-0 mt-1" />
                                <span>Originated by Pastor CÃƒÂ©sar Castellanos (Colombia)</span>
                            </li>
                            <li className="flex gap-3">
                                <Users className="w-5 h-5 text-primary shrink-0 mt-1" />
                                <span>Focuses on discipleship, leadership multiplication, and church growth</span>
                            </li>
                            <li className="flex gap-3">
                                <LayoutGrid className="w-5 h-5 text-primary shrink-0 mt-1" />
                                <span>Spiritual + Organizational structure (The Ladder of Success)</span>
                            </li>
                        </ul>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative"
                >
                    <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
                    <Card className="relative bg-card/60 backdrop-blur-2xl border-border/50 rounded-[3rem] overflow-hidden shadow-2xl">
                        <CardContent className="p-8 md:p-12 text-center space-y-6">
                            <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                <Users className="w-10 h-10 text-primary" />
                            </div>
                            <h3 className="text-2xl font-semibold uppercase  tracking-tight">Multiplication is the Vision</h3>
                            <p className="text-muted-foreground font-thin">"Go and make disciples of all nations..."</p>
                            <div className="flex justify-center gap-4">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="h-3 w-3 rounded-full bg-primary/20 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* THE LEVELS */}
            <div className="space-y-12">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-semibold uppercase  tracking-tight">The Training <span className="text-primary">Track</span></h2>
                    <p className="text-muted-foreground font-thin uppercase text-[10px] tracking-[0.3em]">Levels of Discipleship</p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {journeyData.map((level, idx) => (
                        <motion.div
                            key={level.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Card className={cn("h-full border-2 rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all duration-500", level.color)}>
                                <CardHeader className="space-y-4 p-8">

                                    <div className="space-y-1">
                                        <CardTitle className="text-2xl font-semibold uppercase  tracking-tighter">{level.title}</CardTitle>
                                        <CardDescription className="font-thin text-[10px] uppercase tracking-widest text-muted-foreground">{level.subtitle}</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent className="px-8 pb-8 space-y-6">
                                    <p className="text-sm font-thin leading-relaxed">{level.description}</p>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">Key Focus</p>
                                            <ul className="space-y-1.5">
                                                {level.focus.map((item, i) => (
                                                    <li key={i} className="flex gap-2 text-xs font-thin items-start leading-tight">
                                                        <div className={cn("w-1.5 h-1.5 rounded-full mt-1 shrink-0", level.accent)} />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="pt-2">
                                            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">Outcome</p>
                                            <p className="text-xs font-thin  mt-1 leading-relaxed text-foreground/80">{level.purpose}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* PROGRESSION VISUAL */}
            <div className="bg-card/40 backdrop-blur-xl border border-border/50 rounded-[3rem] p-8 md:p-12">
                <div className="max-w-4xl mx-auto space-y-12">
                    <div className="text-center space-y-2">
                        <h3 className="text-2xl font-semibold uppercase  tracking-tight">The Simple Progression</h3>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-[28px] left-[10%] right-[10%] h-1 bg-linear-to-r from-emerald-500 via-primary to-amber-500 opacity-20" />

                        {journeyData.map((level, i) => (
                            <div key={level.id} className="relative z-10 flex flex-col items-center gap-4 text-center group">
                                <div className={cn("w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl transition-transform group-hover:scale-110", level.accent)}>
                                    {i + 1}
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-semibold uppercase  tracking-widest">{level.title}</p>
                                    <p className="text-[9px] font-thin text-muted-foreground uppercase tracking-widest leading-none">
                                        {i === 0 ? "The Foundation" : i === 1 ? "The Step Up" : i === 2 ? "The Growth" : "The Multiplication"}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ACTION BAR (Fixed/Floating) */}
            <div className="fixed bottom-24 sm:bottom-10 left-1/2 -translate-x-1/2 w-[95%] max-w-2xl z-[60]">
                <div className="bg-background/80 backdrop-blur-3xl border border-white/20 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] rounded-[2rem] p-3 flex flex-col sm:flex-row items-center gap-3">
                    <Button
                        disabled={isProcessing}
                        onClick={() => handleEnroll("LIFE_CLASS")}
                        className="w-full sm:flex-1 h-14 sm:h-16 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold uppercase  text-lg shadow-xl shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-3 px-8"
                    >
                        Enroll Life Class
                        <ArrowRight className="w-6 h-6" />
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full sm:w-auto h-14 sm:h-16 rounded-2xl border-2 border-primary/20 bg-background/50 hover:bg-primary/5 text-primary font-semibold uppercase  text-lg shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 px-8"
                            >
                                Continue Path
                                <ChevronDown className="w-6 h-6" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[280px] bg-background/95 backdrop-blur-2xl border border-border/50 rounded-2xl p-2 shadow-2xl z-[70]">
                            <div className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/60 border-b border-border/50 mb-2">
                                School of Leaders
                            </div>
                            <DropdownMenuItem
                                onClick={() => handleEnroll("SOL_1")}
                                className="p-4 rounded-xl focus:bg-primary/10 group cursor-pointer"
                            >
                                <div className="flex items-center gap-4 w-full">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                                        <Compass className="w-5 h-5 text-primary group-hover:text-white" />
                                    </div>
                                    <div>
                                        <p className="font-semibold uppercase  leading-none">SOL 1</p>
                                        <p className="text-[9px] font-thin text-muted-foreground uppercase mt-1">Foundations</p>
                                    </div>
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleEnroll("SOL_2")}
                                className="p-4 rounded-xl focus:bg-accent/10 group cursor-pointer"
                            >
                                <div className="flex items-center gap-4 w-full">
                                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent transition-colors">
                                        <ShieldCheck className="w-5 h-5 text-accent group-hover:text-white" />
                                    </div>
                                    <div>
                                        <p className="font-semibold uppercase  leading-none">SOL 2</p>
                                        <p className="text-[9px] font-thin text-muted-foreground uppercase mt-1">Character & Ministry</p>
                                    </div>
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleEnroll("SOL_3")}
                                className="p-4 rounded-xl focus:bg-amber-500/10 group cursor-pointer"
                            >
                                <div className="flex items-center gap-4 w-full">
                                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500 transition-colors">
                                        <Rocket className="w-5 h-5 text-amber-500 group-hover:text-white" />
                                    </div>
                                    <div>
                                        <p className="font-semibold uppercase  leading-none">SOL 3</p>
                                        <p className="text-[9px] font-thin text-muted-foreground uppercase mt-1">Multiplication</p>
                                    </div>
                                </div>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
}