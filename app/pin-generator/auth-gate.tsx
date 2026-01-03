"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, ShieldCheck, ArrowRight, Loader2, Key } from "lucide-react";
import { motion } from "framer-motion";
import { verifyPinGeneratorPassword } from "@/lib/actions";

export default function PinGeneratorAuthGate({ children }: { children: React.ReactNode }) {
    const [password, setPassword] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const auth = localStorage.getItem("clc_pin_gen_auth");
        if (auth === "authorized") {
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsVerifying(true);
        setError("");

        try {
            const result = await verifyPinGeneratorPassword(password);
            if (result.success) {
                localStorage.setItem("clc_pin_gen_auth", "authorized");
                setIsAuthenticated(true);
            } else {
                setError(result.error || "Invalid security password.");
            }
        } catch (err) {
            setError("Security check failed. Please try again.");
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

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-amber-500/5 to-background p-4">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
                    <Card className="border-none shadow-2xl bg-card/60 backdrop-blur-xl ring-1 ring-border overflow-hidden">
                        <div className="h-1.5 bg-linear-to-r from-amber-500 via-orange-500 to-amber-500" />
                        <CardHeader className="text-center pt-8">
                            <div className="flex justify-center mb-4">
                                <div className="p-3 bg-amber-500/10 rounded-2xl ring-1 ring-amber-500/20">
                                    <Key className="w-8 h-8 text-amber-600" />
                                </div>
                            </div>
                            <CardTitle className="text-3xl font-black tracking-tight text-foreground uppercase italic">PIN Master</CardTitle>
                            <CardDescription className="text-muted-foreground font-medium">Restricted Security Control Area</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-10 pt-4">
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <Input
                                        type="password"
                                        placeholder="Enter Security Key"
                                        className="h-14 bg-background/50 border-border text-center text-lg font-bold tracking-[0.5em] rounded-2xl focus:ring-2 focus:ring-amber-500"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        autoFocus
                                    />
                                    {error && <p className="text-xs font-bold text-destructive text-center">{error}</p>}
                                </div>
                                <Button
                                    type="submit"
                                    disabled={isVerifying}
                                    className="w-full h-14 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black text-lg shadow-lg shadow-amber-500/20 transition-all"
                                >
                                    {isVerifying ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                        <>
                                            Begin PIN Session
                                            <ArrowRight className="ml-2 w-5 h-5" />
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        );
    }

    return <>{children}</>;
}
