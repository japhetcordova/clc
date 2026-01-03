"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp";
import { ShieldAlert, ArrowRight, Loader2, KeyRound } from "lucide-react";
import { motion } from "framer-motion";
import { validateScannerPin } from "@/lib/actions";
import { toast } from "sonner";

export default function ScannerAuthGate({
    children,
    isAuthorized
}: {
    children: React.ReactNode;
    isAuthorized: boolean
}) {
    const [pin, setPin] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [authorized, setAuthorized] = useState(isAuthorized);
    const [error, setError] = useState("");

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (pin.length < 4) {
            setError("Password/PIN is too short.");
            return;
        }

        setIsVerifying(true);
        setError("");

        try {
            const result = await validateScannerPin(pin);
            if (result.success) {
                setAuthorized(true);
                toast.success("Access granted. Scanner initialized.");
            } else {
                setError(result.error || "Invalid PIN.");
                toast.error(result.error || "Security validation failed.");
            }
        } catch (err) {
            setError("Connection failed. Try again.");
        } finally {
            setIsVerifying(false);
        }
    };

    if (authorized) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-primary/5 to-background p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
                <Card className="border-none shadow-2xl bg-card/60 backdrop-blur-xl ring-1 ring-border overflow-hidden">
                    <div className="h-1.5 bg-linear-to-r from-primary via-indigo-500 to-primary animate-pulse" />
                    <CardHeader className="text-center pt-8">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 bg-primary/10 rounded-2xl ring-1 ring-primary/20">
                                <ShieldAlert className="w-8 h-8 text-primary" />
                            </div>
                        </div>
                        <CardTitle className="text-3xl font-black tracking-tight text-foreground uppercase italic">Scanner Lock</CardTitle>
                        <CardDescription className="text-muted-foreground font-medium">Daily Security PIN Required</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-10 pt-4">
                        <form onSubmit={handleVerify} className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-center">
                                    <InputOTP
                                        maxLength={6}
                                        value={pin}
                                        onChange={(v) => setPin(v)}
                                        autoFocus
                                    >
                                        <InputOTPGroup className="gap-2">
                                            <InputOTPSlot index={0} className="w-12 h-16 text-2xl font-black bg-background/50 border-2 rounded-xl" />
                                            <InputOTPSlot index={1} className="w-12 h-16 text-2xl font-black bg-background/50 border-2 rounded-xl" />
                                            <InputOTPSlot index={2} className="w-12 h-16 text-2xl font-black bg-background/50 border-2 rounded-xl" />
                                        </InputOTPGroup>
                                        <InputOTPSeparator className="mx-2" />
                                        <InputOTPGroup className="gap-2">
                                            <InputOTPSlot index={3} className="w-12 h-16 text-2xl font-black bg-background/50 border-2 rounded-xl" />
                                            <InputOTPSlot index={4} className="w-12 h-16 text-2xl font-black bg-background/50 border-2 rounded-xl" />
                                            <InputOTPSlot index={5} className="w-12 h-16 text-2xl font-black bg-background/50 border-2 rounded-xl" />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>
                                {error && (
                                    <p className="text-xs font-bold text-destructive text-center animate-bounce">{error}</p>
                                )}
                            </div>
                            <Button
                                type="submit"
                                disabled={isVerifying}
                                className="w-full h-16 rounded-2xl bg-slate-900 text-white font-black text-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                            >
                                {isVerifying ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                    <>
                                        Unlock Scanner
                                        <ArrowRight className="w-6 h-6" />
                                    </>
                                )}
                            </Button>
                        </form>
                        <p className="mt-8 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                            PINs are valid for 24 hours only.
                        </p>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
