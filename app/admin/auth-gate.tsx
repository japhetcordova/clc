"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { verifyAdminPassword } from "@/lib/actions";

export default function AdminAuthGate({ children }: { children: React.ReactNode }) {
    const [password, setPassword] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const auth = localStorage.getItem("clc_admin_auth");
        if (auth === "true") {
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsVerifying(true);
        setError("");

        try {
            const result = await verifyAdminPassword(password);
            if (result.success) {
                localStorage.setItem("clc_admin_auth", "true");
                setIsAuthenticated(true);
            } else {
                setError(result.error || "Invalid administrator password.");
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
            <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-primary/5 to-background p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md"
                >
                    <Card className="border-none shadow-2xl bg-card/60 backdrop-blur-xl ring-1 ring-border overflow-hidden">
                        <div className="h-1.5 bg-linear-to-r from-primary via-accent to-primary animate-gradient-x" />
                        <CardHeader className="text-center pt-8">
                            <div className="flex justify-center mb-4">
                                <div className="p-3 bg-primary/10 rounded-2xl ring-1 ring-primary/20">
                                    <Lock className="w-8 h-8 text-primary" />
                                </div>
                            </div>
                            <CardTitle className="text-3xl font-black tracking-tight text-foreground uppercase italic">Security Gate</CardTitle>
                            <CardDescription className="text-muted-foreground font-medium">Entrance to Administrator Dashboard</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-10 pt-4">
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <Input
                                        type="password"
                                        placeholder="Enter Access Key"
                                        className="h-14 bg-background/50 border-border text-center text-lg font-bold tracking-[0.5em] rounded-2xl focus:ring-2 focus:ring-primary"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        autoFocus
                                    />
                                    {error && (
                                        <p className="text-xs font-bold text-destructive text-center">{error}</p>
                                    )}
                                </div>
                                <Button
                                    type="submit"
                                    disabled={isVerifying}
                                    className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-black text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
                                >
                                    {isVerifying ? (
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    ) : (
                                        <>
                                            Access Dashboard
                                            <ArrowRight className="ml-2 w-5 h-5" />
                                        </>
                                    )}
                                </Button>
                            </form>
                            <div className="mt-8 flex items-center justify-center gap-2 px-4 py-2 bg-muted/30 rounded-full w-fit mx-auto ring-1 ring-border">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                <span className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">Encrypted Access Control</span>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        );
    }

    return <>{children}</>;
}
