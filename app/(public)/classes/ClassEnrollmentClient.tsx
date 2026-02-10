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
    CheckCircle2,
    LogOut,
    PlayCircle,
    AlertTriangle
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
    const unenrollMutation = trpc.unenrollStudent.useMutation();
    const { data: myEnrollments, refetch: refetchEnrollments } = trpc.getMyEnrollments.useQuery(undefined, {
        enabled: !!currentUser,
    });

    // Check if user is enrolled in any active class
    const activeEnrollments = (myEnrollments || []).filter(e => e.status === "active");
    const isEnrolled = activeEnrollments.length > 0;

    const classLevelLabels: Record<string, string> = {
        LIFE_CLASS: "Life Class",
        SOL_1: "SOL 1",
        SOL_2: "SOL 2",
        SOL_3: "SOL 3",
    };

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
                refetchEnrollments();
            }
        } catch (err: any) {
            toast.error("Enrollment failed", { description: err.message });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleUnenroll = async (level: string) => {
        if (!currentUser) return;
        setIsProcessing(true);

        try {
            const result = await unenrollMutation.mutateAsync({
                qrCodeId: currentUser.qrCodeId,
                classLevel: level
            });

            if (result.success) {
                toast.success("You have left the class.", {
                    description: `You've been unenrolled from ${classLevelLabels[level] || level.replace('_', ' ')}.`,
                    duration: 4000,
                });
                refetchEnrollments();
            }
        } catch (err: any) {
            toast.error("Failed to leave class", { description: err.message });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleContinueToClass = () => {
        if (!currentUser) {
            toast.info("Please log in first.");
            router.push("/registration?callbackUrl=/classes");
            return;
        }
        router.push(`/profile/${currentUser.qrCodeId}?tab=videos`);
    };

    const journeyData = [
        {
            id: "LIFE_CLASS",
            title: "Life Class",
            subtitle: "The Foundation (9 Weeks)",
            description: "A 9-week journey designed to consolidate your faith and prepare you for a personal encounter with God.",
            focus: [
                "Weeks 1-4: Pre-Encounter (Lessons 1-4)",
                "Week 5: Encounter (3-Day Weekend)",
                "Weeks 6-9: Post-Encounter (Lessons 6-9)"
            ],
            qualifiers: "Attending Cell group, Cell Celebration, and weekly services.",
            purpose: "Shift from passive attendee to a certified volunteer (ILD).",
            icon: <Heart className="w-6 h-6 text-emerald-500" />,
            color: "border-emerald-500/20 bg-emerald-500/5",
            accent: "bg-emerald-500"
        },
        {
            id: "SOL_1",
            title: "SOL 1",
            subtitle: "Faith and Vision (10 Weeks)",
            description: "First step in the School of Leaders. Build a firm foundation in Faith and the Vision.",
            focus: [
                "Pastored in His Love",
                "Power of a Vision",
                "1-Verse Evangelism"
            ],
            qualifiers: "Completed Life Class (Weeks 1-9) & Devotional Book.",
            purpose: "Invite 3 people to church and start leading yourself.",
            icon: <Compass className="w-6 h-6 text-primary" />,
            color: "border-primary/20 bg-primary/5",
            accent: "bg-primary"
        },
        {
            id: "SOL_2",
            title: "SOL 2",
            subtitle: "Character & Ministry (10 Weeks)",
            description: "Focus on character formation and learning how to win your family for Christ.",
            focus: [
                "A Winning Strategy",
                "Families with a Purpose",
                "Character Formation"
            ],
            qualifiers: "Completed SOL 1 (Weeks 1-10).",
            purpose: "Win your family and prepare to open a cell group.",
            icon: <ShieldCheck className="w-6 h-6 text-accent" />,
            color: "border-accent/20 bg-accent/5",
            accent: "bg-accent"
        },
        {
            id: "SOL_3",
            title: "SOL 3",
            subtitle: "Leadership Multiplication (10 Weeks)",
            description: "Advanced training to become a leader of 12 disciples and expand the church vision.",
            focus: [
                "Effective Leadership",
                "The Holy Spirit within Me",
                "Multiplication Strategy"
            ],
            qualifiers: "Completed SOL 2 (Weeks 1-10).",
            purpose: "Be a leader of 12 disciples and raise new leaders.",
            icon: <Rocket className="w-6 h-6 text-amber-500" />,
            color: "border-amber-500/20 bg-amber-500/5",
            accent: "bg-amber-500"
        }
    ];

    return (
        <div className="w-full max-w-6xl mx-auto space-y-16 pb-20">


            {/* THE LEVELS */}
            <div className="space-y-12">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-semibold uppercase  tracking-tight">The Training <span className="text-primary">Track</span></h2>
                    <p className="text-muted-foreground font-thin uppercase text-[10px] tracking-[0.3em]">Levels of Discipleship</p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {journeyData.map((level, idx) => {
                        const enrolledInThis = activeEnrollments.some(e => e.classLevel === level.id);
                        return (
                            <motion.div
                                key={level.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <Card className={cn("h-full border-2 rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all duration-500 relative", level.color)}>
                                    {enrolledInThis && (
                                        <div className="absolute top-4 right-4 z-10">
                                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 backdrop-blur-md">
                                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                                <span className="text-[9px] font-semibold uppercase tracking-widest text-emerald-500">Enrolled</span>
                                            </div>
                                        </div>
                                    )}
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
                                            <div className="space-y-2">
                                                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">Qualifiers</p>
                                                <p className="text-xs font-thin text-foreground/80 leading-tight">
                                                    {level.qualifiers}
                                                </p>
                                            </div>
                                            <div className="pt-2">
                                                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">Outcome Goal</p>
                                                <p className="text-xs font-thin mt-1 leading-relaxed text-foreground/80">{level.purpose}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            </div>



            {/* ACTION BAR (Fixed/Floating) */}
            <div className="fixed bottom-24 sm:bottom-10 left-1/2 -translate-x-1/2 w-[95%] max-w-2xl z-[60]">
                <div className="bg-background/80 backdrop-blur-3xl border border-white/20 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] rounded-[2rem] p-3 flex flex-col sm:flex-row items-center gap-3">
                    {isEnrolled ? (
                        <>
                            {/* ENROLLED STATE */}
                            <Button
                                onClick={handleContinueToClass}
                                className="w-full sm:flex-1 h-14 sm:h-16 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold uppercase text-lg shadow-xl shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-3 px-8"
                            >
                                <PlayCircle className="w-6 h-6" />
                                Continue to Class
                            </Button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        disabled={isProcessing}
                                        className="w-full sm:w-auto h-14 sm:h-16 rounded-2xl border-2 border-red-500/20 bg-background/50 hover:bg-red-500/5 text-red-500 font-semibold uppercase text-lg shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 px-8"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        Leave Class
                                        <ChevronDown className="w-5 h-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-[300px] bg-background/95 backdrop-blur-2xl border border-border/50 rounded-2xl p-2 shadow-2xl z-[70]">
                                    <div className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/60 border-b border-border/50 mb-2 flex items-center gap-2">
                                        <AlertTriangle className="w-3 h-3 text-amber-500" />
                                        Select class to leave
                                    </div>
                                    {activeEnrollments.map((enrollment) => (
                                        <DropdownMenuItem
                                            key={enrollment.id}
                                            onClick={() => handleUnenroll(enrollment.classLevel)}
                                            className="p-4 rounded-xl focus:bg-red-500/10 group cursor-pointer"
                                        >
                                            <div className="flex items-center gap-4 w-full">
                                                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center group-hover:bg-red-500 transition-colors">
                                                    <LogOut className="w-5 h-5 text-red-500 group-hover:text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold uppercase leading-none">
                                                        {classLevelLabels[enrollment.classLevel] || enrollment.classLevel.replace('_', ' ')}
                                                    </p>
                                                    <p className="text-[9px] font-thin text-muted-foreground uppercase mt-1">Tap to leave</p>
                                                </div>
                                            </div>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <>
                            {/* NOT ENROLLED STATE */}
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
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}   