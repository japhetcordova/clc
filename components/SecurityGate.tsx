"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp";
import { motion } from "framer-motion";
import { Loader2, ArrowRight } from "lucide-react";

interface SecurityGateProps {
    children: React.ReactNode;
    title: string;
    description: string;
    icon: React.ReactNode;
    accentColor: "amber" | "primary" | "emerald";
    isOTP?: boolean;
    onVerify: (pin: string) => Promise<{ success: boolean; error?: string }>;
    onAuthorized: () => void;
    initialAuthorized: boolean;
    storageKey?: string;
    storageValue?: string;
    checkMidnight?: boolean;
    onMidnight?: () => Promise<any> | any;
    footerNote?: string;
}

export function SecurityGate({
    children,
    title,
    description,
    icon,
    accentColor,
    isOTP = false,
    onVerify,
    onAuthorized,
    initialAuthorized,
    storageKey,
    storageValue = "true",
    checkMidnight = true,
    onMidnight,
    footerNote
}: SecurityGateProps) {
    const [pin, setPin] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [authorized, setAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const getToday = () => new Date().toISOString().split("T")[0];

    // Initial Auth Check
    useEffect(() => {
        if (initialAuthorized) {
            setAuthorized(true);
        } else if (storageKey) {
            const today = getToday();
            const stored = localStorage.getItem(storageKey);
            const storedDate = localStorage.getItem(`${storageKey}_date`);

            if (stored === storageValue && storedDate === today) {
                setAuthorized(true);
            }
        }
        setIsLoading(false);
    }, [initialAuthorized, storageKey, storageValue]);

    // Midnight Watcher
    useEffect(() => {
        if (!authorized || !checkMidnight) return;

        const watcher = setInterval(() => {
            const now = new Date();
            if (now.getHours() === 0 && now.getMinutes() === 0 && now.getSeconds() < 2) {
                handleLogout();
            }
        }, 1000);

        return () => clearInterval(watcher);
    }, [authorized, checkMidnight]);

    const handleLogout = async () => {
        if (onMidnight) await onMidnight();
        if (storageKey) {
            localStorage.removeItem(storageKey);
            localStorage.removeItem(`${storageKey}_date`);
        }
        setAuthorized(false);
        setPin("");
    };

    const handleVerify = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (pin.length < 4) {
            setError("Input is too short.");
            return;
        }

        setIsVerifying(true);
        setError("");

        try {
            const result = await onVerify(pin);
            if (result.success) {
                if (storageKey) {
                    localStorage.setItem(storageKey, storageValue);
                    localStorage.setItem(`${storageKey}_date`, getToday());
                }
                onAuthorized();
                setAuthorized(true);
            } else {
                setError(result.error || "Invalid entry.");
            }
        } catch (err) {
            setError("Verification failed. Please try again.");
        } finally {
            setIsVerifying(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!authorized) {
        const colors = {
            amber: "from-amber-500 via-orange-500 to-amber-500 text-amber-600 ring-amber-500/20 bg-amber-500/10 hover:bg-amber-700 bg-amber-600 focus:ring-amber-500",
            primary: "from-primary via-accent to-primary text-primary ring-primary/20 bg-primary/10 hover:bg-primary/90 bg-primary focus:ring-primary",
            emerald: "from-emerald-500 via-teal-500 to-emerald-500 text-emerald-600 ring-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-700 bg-emerald-600 focus:ring-emerald-500",
        };

        const colorSet = colors[accentColor];
        const [gradient, textColor, ringColor, bgColor, btnHover, btnBg, focusRing] = colorSet.split(" ");

        return (
            <div className={`min-h-screen flex items-center justify-center bg-linear-to-br from-background via-${accentColor}-500/5 to-background p-4`}>
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
                    <Card className="border-none shadow-2xl bg-card/60 backdrop-blur-xl ring-1 ring-border overflow-hidden">
                        <div className={`h-1.5 bg-linear-to-r ${gradient}`} />
                        <CardHeader className="text-center pt-6 sm:pt-8 px-4">
                            <div className="flex justify-center mb-4">
                                <div className={`p-3 ${bgColor} rounded-2xl ring-1 ${ringColor}`}>
                                    {icon}
                                </div>
                            </div>
                            <CardTitle className="text-2xl sm:text-3xl font-black tracking-tight text-foreground uppercase italic leading-tight">{title}</CardTitle>
                            <CardDescription className="text-xs sm:text-sm text-muted-foreground font-medium">{description}</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-8 sm:pb-10 pt-4 px-4 sm:px-8">
                            <form onSubmit={handleVerify} className="space-y-6">
                                <div className="space-y-2">
                                    {isOTP ? (
                                        <div className="flex justify-center">
                                            <InputOTP maxLength={6} value={pin} onChange={(v) => setPin(v)} autoFocus>
                                                <InputOTPGroup className="gap-1 sm:gap-2">
                                                    <InputOTPSlot index={0} className="w-9 h-14 sm:w-12 sm:h-16 text-xl sm:text-2xl font-black bg-background/50 border-2 rounded-lg sm:rounded-xl" />
                                                    <InputOTPSlot index={1} className="w-9 h-14 sm:w-12 sm:h-16 text-xl sm:text-2xl font-black bg-background/50 border-2 rounded-lg sm:rounded-xl" />
                                                    <InputOTPSlot index={2} className="w-9 h-14 sm:w-12 sm:h-16 text-xl sm:text-2xl font-black bg-background/50 border-2 rounded-lg sm:rounded-xl" />
                                                </InputOTPGroup>
                                                <InputOTPSeparator className="mx-1 sm:mx-2" />
                                                <InputOTPGroup className="gap-1 sm:gap-2">
                                                    <InputOTPSlot index={3} className="w-9 h-14 sm:w-12 sm:h-16 text-xl sm:text-2xl font-black bg-background/50 border-2 rounded-lg sm:rounded-xl" />
                                                    <InputOTPSlot index={4} className="w-9 h-14 sm:w-12 sm:h-16 text-xl sm:text-2xl font-black bg-background/50 border-2 rounded-lg sm:rounded-xl" />
                                                    <InputOTPSlot index={5} className="w-9 h-14 sm:w-12 sm:h-16 text-xl sm:text-2xl font-black bg-background/50 border-2 rounded-lg sm:rounded-xl" />
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </div>
                                    ) : (
                                        <Input
                                            type="password"
                                            placeholder="Enter Security Key"
                                            className={`h-14 bg-background/50 border-border text-center text-lg font-bold tracking-[0.5em] rounded-2xl focus:ring-2 ${focusRing}`}
                                            value={pin}
                                            onChange={(e) => setPin(e.target.value)}
                                            autoFocus
                                        />
                                    )}
                                    {error && <p className="text-[10px] sm:text-xs font-bold text-destructive text-center mt-2">{error}</p>}
                                </div>
                                <Button
                                    type="submit"
                                    disabled={isVerifying}
                                    className={`w-full h-14 sm:h-16 rounded-xl sm:rounded-2xl ${btnBg} ${btnHover} text-white font-black text-lg sm:text-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 sm:gap-3`}
                                >
                                    {isVerifying ? <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" /> : (
                                        <>
                                            Unlock Access
                                            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                                        </>
                                    )}
                                </Button>
                            </form>
                            {footerNote && (
                                <p className="mt-8 text-center text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                                    {footerNote}
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        );
    }

    return <>{children}</>;
}
