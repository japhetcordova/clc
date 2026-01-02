"use client";

import { useEffect, useState, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { markAttendance } from "@/lib/actions";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Scan, Clock, Loader2, Sparkles, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ScannerPage() {
    const [lastScan, setLastScan] = useState<{ success: boolean; user?: any; error?: string } | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            "reader",
            {
                fps: 20,
                qrbox: { width: 280, height: 280 },
                aspectRatio: 1.0,
                showTorchButtonIfSupported: true
            },
            false
        );

        async function onScanSuccess(decodedText: string) {
            if (isProcessing) return;

            setIsProcessing(true);

            let qrCodeId = decodedText;
            if (decodedText.includes("/profile/")) {
                qrCodeId = decodedText.split("/profile/").pop() || decodedText;
            }

            const result = await markAttendance(qrCodeId);
            setLastScan(result);
            setIsProcessing(false);

            if (result.success && result.user) {
                toast.success(`Check-in successful for ${result.user.firstName}!`);
            } else if (result.error) {
                toast.error(result.error);
            }

            setTimeout(() => {
                setLastScan(null);
            }, 5000);
        }

        scanner.render(onScanSuccess, () => { });
        scannerRef.current = scanner;

        return () => {
            scanner.clear().catch(error => console.error("Failed to clear scanner", error));
        };
    }, [isProcessing]);

    return (
        <div className="min-h-screen bg-background text-foreground p-4 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 -right-20 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />

            <div className="w-full max-w-md space-y-8 relative z-10">
                <div className="text-center space-y-3">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex p-3 bg-primary/10 rounded-2xl ring-1 ring-primary/20 mb-2"
                    >
                        <Scan className="w-8 h-8 text-primary" />
                    </motion.div>
                    <h1 className="text-4xl font-black tracking-tight text-foreground">Attendance</h1>
                    <p className="text-muted-foreground font-medium">Quick scan for event check-in</p>
                </div>

                <div className="relative aspect-square w-full bg-card rounded-[2.5rem] overflow-hidden ring-1 ring-border shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]">
                    <div id="reader" className="w-full h-full overflow-hidden [&_video]:object-cover [&_video]:w-full [&_video]:h-full"></div>

                    {/* Scanning Overlay */}
                    <div className="absolute inset-0 pointer-events-none border-[40px] border-background/40" />

                    <AnimatePresence>
                        {isProcessing && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-accent/15 backdrop-blur-xl flex flex-col items-center justify-center z-10"
                            >
                                <div className="relative">
                                    <div className="absolute inset-0 bg-accent/20 blur-2xl rounded-full animate-pulse" />
                                    <Loader2 className="w-16 h-16 text-accent animate-spin relative z-10" />
                                </div>
                                <p className="font-black text-2xl mt-8 tracking-tighter text-foreground text-center px-6">
                                    Verifying Identity...
                                </p>
                            </motion.div>
                        )}

                        {lastScan && (
                            <motion.div
                                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                                className={cn(
                                    "absolute inset-x-6 bottom-6 p-6 rounded-3xl flex flex-col items-center text-center gap-3 border shadow-2xl z-20 backdrop-blur-xl",
                                    lastScan.success
                                        ? "bg-emerald-500/20 border-emerald-500/50"
                                        : "bg-destructive/20 border-destructive/50"
                                )}
                            >
                                {lastScan.success ? (
                                    <div className="bg-emerald-500 p-2 rounded-full">
                                        <CheckCircle2 className="w-6 h-6 text-white" />
                                    </div>
                                ) : (
                                    <div className="bg-destructive p-2 rounded-full">
                                        <XCircle className="w-6 h-6 text-white" />
                                    </div>
                                )}
                                <div className="space-y-1">
                                    <p className="font-black text-xl leading-tight text-foreground">
                                        {lastScan.success ? `Welcome, ${lastScan.user?.firstName}!` : lastScan.error}
                                    </p>
                                    {lastScan.user && (
                                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest opacity-80">
                                            {lastScan.user.network} • {lastScan.user.ministry}
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <Card className="bg-card/50 border-border text-foreground backdrop-blur-xl ring-1 ring-border shadow-xl">
                    <CardContent className="pt-6 pb-6">
                        <div className="flex items-start gap-4 text-sm">
                            <div className="bg-primary/10 p-2.5 rounded-xl shrink-0">
                                <Clock className="w-5 h-5 text-primary" />
                            </div>
                            <div className="space-y-1">
                                <p className="font-bold text-foreground">Automatic Sync</p>
                                <p className="text-muted-foreground leading-relaxed text-xs font-medium">One scan per member per day. Records are synced instantly to the admin dashboard.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-center flex-col items-center gap-4">
                    <Button variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-muted font-bold rounded-2xl h-11 px-6 transition-all" onClick={() => window.location.reload()}>
                        Reset Camera
                    </Button>

                    <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full ring-1 ring-border">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">System Online</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
