"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, ShieldCheck, Calendar, Clock, AlertCircle, KeyRound, Timer } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { generateDailyPin } from "@/lib/actions";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PinGeneratorClientProps {
    initialPin: {
        pin: string;
        date: string;
        createdAt: string | Date;
    } | null;
}

export default function PinGeneratorClient({ initialPin }: PinGeneratorClientProps) {
    const [activePin, setActivePin] = useState(initialPin);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [securityKey, setSecurityKey] = useState("");
    const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);

    useEffect(() => {
        if (!activePin) {
            setTimeLeft(null);
            return;
        }

        const updateTimer = () => {
            const now = new Date();
            const midnight = new Date();
            midnight.setHours(24, 0, 0, 0);

            const diff = midnight.getTime() - now.getTime();

            if (diff <= 0) {
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
                setActivePin(null);
                return;
            }

            const h = Math.floor(diff / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft({ hours: h, minutes: m, seconds: s });
        };

        updateTimer();
        const timer = setInterval(updateTimer, 1000);

        return () => clearInterval(timer);
    }, [activePin]);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!securityKey) return;

        setIsGenerating(true);
        try {
            const result = await generateDailyPin(securityKey);
            if (result.success && 'pin' in result && result.pin) {
                setActivePin(result.pin as any);
                toast.success((result as any).message || "Daily PIN generated successfully!");
                setIsDialogOpen(false);
                setSecurityKey("");
            } else {
                toast.error(('error' in result ? result.error : null) || "Failed to generate PIN.");
            }
        } catch (error) {
            toast.error("An unexpected error occurred.");
        } finally {
            setIsGenerating(false);
        }
    };

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const formatNumber = (num: number) => num.toString().padStart(2, '0');

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-background via-amber-500/5 to-background p-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
                <Card className="border-none shadow-2xl bg-card/60 backdrop-blur-xl ring-1 ring-border overflow-hidden">
                    <div className="h-1.5 bg-linear-to-r from-amber-500 via-orange-500 to-amber-500" />
                    <CardHeader className="text-center pb-2 pt-6 sm:pt-8">
                        <div className="flex justify-center mb-2">
                            <div className="p-2 bg-amber-500/10 rounded-xl ring-1 ring-amber-500/20">
                                <ShieldCheck className="w-6 h-6 text-amber-600" />
                            </div>
                        </div>
                        <CardTitle className="text-xl sm:text-2xl font-black tracking-tight uppercase italic px-4">Daily Access Control</CardTitle>
                        <CardDescription className="text-xs sm:text-sm font-bold flex items-center justify-center gap-2 text-amber-700/80">
                            <Calendar className="w-4 h-4" />
                            {today}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6 pt-4 pb-10">
                        <AnimatePresence mode="wait">
                            {activePin ? (
                                <motion.div
                                    key="pin-display"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="space-y-6"
                                >
                                    <div className="bg-amber-500/5 rounded-3xl p-5 sm:p-8 border border-amber-500/10 text-center relative overflow-hidden group">
                                        <div className="absolute -top-4 -right-4 p-4 opacity-5 pointer-events-none">
                                            <RefreshCw className="w-24 h-24 sm:w-32 sm:h-32" />
                                        </div>
                                        <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-amber-700/60 mb-2">Active Scanner PIN</p>
                                        <div
                                            className="text-4xl sm:text-6xl font-black tracking-[0.05em] sm:tracking-[0.2em] text-amber-900 font-mono cursor-pointer hover:scale-105 transition-all active:scale-95 group-hover:text-amber-600 px-1 relative z-10"
                                            onClick={() => {
                                                if (activePin) {
                                                    navigator.clipboard.writeText(activePin.pin);
                                                    toast.success("PIN copied to clipboard!");
                                                }
                                            }}
                                            title="Click to copy"
                                        >
                                            {activePin.pin}
                                        </div>
                                        <div className="mt-4 flex flex-col items-center gap-2">
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-amber-600/80 uppercase">
                                                <Clock className="w-3.5 h-3.5" />
                                                Generated at {new Date(activePin.createdAt).toLocaleTimeString()}
                                            </div>

                                            {timeLeft && (
                                                <div className="mt-4 pt-4 border-t border-amber-500/10 w-full">
                                                    <p className="text-[9px] font-black uppercase tracking-widest text-amber-700/50 mb-3">Expires in</p>
                                                    <div className="flex justify-center gap-2 sm:gap-4">
                                                        <div className="flex flex-col items-center">
                                                            <div className="text-xl sm:text-2xl font-black text-amber-900 tabular-nums">
                                                                {formatNumber(timeLeft.hours)}
                                                            </div>
                                                            <span className="text-[7px] sm:text-[8px] font-bold text-amber-700/60 uppercase">Hours</span>
                                                        </div>
                                                        <div className="text-xl sm:text-2xl font-light text-amber-300 self-start mt-[-2px]">:</div>
                                                        <div className="flex flex-col items-center">
                                                            <div className="text-xl sm:text-2xl font-black text-amber-900 tabular-nums">
                                                                {formatNumber(timeLeft.minutes)}
                                                            </div>
                                                            <span className="text-[7px] sm:text-[8px] font-bold text-amber-700/60 uppercase">Mins</span>
                                                        </div>
                                                        <div className="text-xl sm:text-2xl font-light text-amber-300 self-start mt-[-2px]">:</div>
                                                        <div className="flex flex-col items-center">
                                                            <div className="text-xl sm:text-2xl font-black text-amber-700 tabular-nums">
                                                                {formatNumber(timeLeft.seconds)}
                                                            </div>
                                                            <span className="text-[7px] sm:text-[8px] font-bold text-amber-700/60 uppercase">Secs</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10 flex items-start gap-3">
                                        <Timer className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                        <p className="text-[11px] font-medium text-blue-900/70 leading-relaxed">
                                            This security code is temporary and will automatically expire at midnight.
                                            Ensure all scanners are synchronized with this active PIN.
                                        </p>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="no-pin"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="py-10 text-center space-y-6"
                                >
                                    <div className="mx-auto w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                                        <RefreshCw className="w-10 h-10 text-muted-foreground opacity-20" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-black text-foreground uppercase tracking-tight">No PIN Active</h3>
                                        <p className="text-sm text-muted-foreground font-medium max-w-[280px] mx-auto">
                                            A security PIN has not been generated for today yet.
                                        </p>
                                    </div>
                                    <Button
                                        onClick={() => setIsDialogOpen(true)}
                                        disabled={isGenerating}
                                        className="h-14 px-8 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black text-lg shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.02]"
                                    >
                                        {isGenerating ? <RefreshCw className="w-6 h-6 animate-spin mr-2" /> : <RefreshCw className="w-5 h-5 mr-3" />}
                                        Generate Today's PIN
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </CardContent>
                </Card>

                <div className="mt-8 text-center">
                    <Button variant="ghost" onClick={() => { localStorage.removeItem("clc_pin_gen_auth"); window.location.reload(); }} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-destructive">
                        End Security Session
                    </Button>
                </div>
            </motion.div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-md border-none bg-card/95 backdrop-blur-xl shadow-2xl rounded-[2rem]">
                    <DialogHeader className="space-y-3">
                        <div className="mx-auto w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center ring-1 ring-amber-500/20">
                            <KeyRound className="w-6 h-6 text-amber-600" />
                        </div>
                        <DialogTitle className="text-center text-2xl font-black uppercase italic tracking-tight">Access Confirmation</DialogTitle>
                        <DialogDescription className="text-center font-medium">
                            Please enter your security key to authorize today's PIN generation.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleGenerate} className="space-y-6 pt-4">
                        <div className="space-y-2">
                            <Label htmlFor="securityKey" className="font-bold ml-1">Daily Security Key</Label>
                            <Input
                                id="securityKey"
                                type="password"
                                placeholder="••••••••"
                                className="h-14 bg-background/50 border-border text-center text-lg font-bold tracking-widest rounded-2xl focus:ring-2 focus:ring-amber-500"
                                value={securityKey}
                                onChange={(e) => setSecurityKey(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <DialogFooter className="sm:justify-center">
                            <Button
                                type="submit"
                                disabled={isGenerating || !securityKey}
                                className="w-full h-14 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black text-lg shadow-lg shadow-amber-500/20 transition-all"
                            >
                                {isGenerating ? <RefreshCw className="w-5 h-5 animate-spin" /> : "Authorize & Generate"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
