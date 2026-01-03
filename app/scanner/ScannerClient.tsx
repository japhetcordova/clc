"use client";

import { useEffect, useState, useRef } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { markAttendance } from "@/lib/actions";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Scan, Clock, Loader2, XCircle, Camera, Repeat, ShieldCheck, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ScannerClient() {
    const [lastScan, setLastScan] = useState<{ success: boolean; user?: any; error?: string } | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isScannerReady, setIsScannerReady] = useState(false);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [cameras, setCameras] = useState<Array<{ id: string; label: string }>>([]);
    const [activeCameraId, setActiveCameraId] = useState<string | null>(null);

    // Safety Refs for synchronous locking
    const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
    const lastScannedId = useRef<string | null>(null);
    const processingRef = useRef(false);

    const onScanSuccess = async (decodedText: string) => {
        // 1. Triple-lock to prevent multiple simultaneous processing
        if (processingRef.current || isProcessing) return;

        let qrCodeId = decodedText;
        if (decodedText.includes("/profile/")) {
            qrCodeId = decodedText.split("/profile/").pop() || decodedText;
        }

        // 2. Prevent scanning the same ID twice within a session window
        if (lastScannedId.current === qrCodeId) return;

        // 3. Set locks
        processingRef.current = true;
        setIsProcessing(true);
        lastScannedId.current = qrCodeId;

        // 4. Pause scanner immediately to stop physical detection
        if (html5QrCodeRef.current?.isScanning) {
            try { await html5QrCodeRef.current.pause(); } catch (e) { }
        }

        try {
            const result = await markAttendance(qrCodeId);
            setLastScan(result);

            if (result.success && result.user) {
                toast.success(`Check-in successful!`, {
                    description: `Welcome, ${result.user.firstName}!`,
                    id: `success-${qrCodeId}`,
                    icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                });
            } else if (result.error) {
                // If it's already scanned, we still show the error but with a unique ID to prevent repeat toasts
                toast.error("Check-in failed", {
                    description: result.error,
                    id: `error-${qrCodeId}`
                });
            }
        } catch (err) {
            toast.error("Network Error", { description: "Failed to reach server." });
        }

        // 5. Cooldown: Keep the UI blocked for 3 seconds so the user can see the result
        setTimeout(async () => {
            // Resume scanner
            if (html5QrCodeRef.current?.isScanning) {
                try { await html5QrCodeRef.current.resume(); } catch (e) { }
            }

            // Release locks
            processingRef.current = false;
            setIsProcessing(false);
            setLastScan(null);

            // 6. Memory cleanup: Allow the same ID to be scanned again after another 5 seconds 
            // (in case a different admin needs to scan them or they came back later)
            setTimeout(() => {
                if (lastScannedId.current === qrCodeId) {
                    lastScannedId.current = null;
                }
            }, 5000);
        }, 3000);
    };

    const startScanner = async (cameraId: string) => {
        if (!html5QrCodeRef.current) return;

        try {
            if (html5QrCodeRef.current.isScanning) {
                await html5QrCodeRef.current.stop();
            }

            await html5QrCodeRef.current.start(
                cameraId,
                {
                    fps: 20,
                    qrbox: { width: 280, height: 280 },
                    aspectRatio: 1.0,
                },
                onScanSuccess,
                () => { }
            );
            setIsScannerReady(true);
            setActiveCameraId(cameraId);
        } catch (err) {
            console.error("Error starting scanner", err);
            toast.error("Failed to start camera.");
        }
    };

    const requestPermissionAndStart = async () => {
        try {
            const devices = await Html5Qrcode.getCameras();
            if (devices && devices.length > 0) {
                setCameras(devices);
                setHasPermission(true);
                const backCamera = devices.find(d =>
                    d.label.toLowerCase().includes("back") ||
                    d.label.toLowerCase().includes("environment") ||
                    d.label.toLowerCase().includes("rear")
                );
                await startScanner(backCamera?.id || devices[0].id);
            } else {
                toast.error("No cameras found.");
            }
        } catch (err) {
            setHasPermission(false);
            toast.error("Camera access denied.");
        }
    };

    const toggleCamera = async () => {
        if (cameras.length < 2 || !activeCameraId) return;
        const currentIndex = cameras.findIndex(c => c.id === activeCameraId);
        const nextIndex = (currentIndex + 1) % cameras.length;
        await startScanner(cameras[nextIndex].id);
    };

    useEffect(() => {
        html5QrCodeRef.current = new Html5Qrcode("reader");
        return () => {
            if (html5QrCodeRef.current?.isScanning) {
                html5QrCodeRef.current.stop().catch(() => { });
            }
        };
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground p-4 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 -left-20 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 -right-20 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full max-w-md space-y-4 sm:space-y-6 relative z-10 px-2 sm:px-0">
                <div className="text-center space-y-2">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex p-2.5 sm:p-3 bg-primary/10 rounded-2xl ring-1 ring-primary/20 mb-1 sm:mb-2"
                    >
                        <Scan className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                    </motion.div>
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-none">Attendance</h1>
                    <p className="text-muted-foreground font-medium text-xs sm:text-sm px-4">Scan QR Code for entry verification</p>
                </div>

                <div className="relative aspect-square w-full bg-card rounded-[2rem] sm:rounded-[3rem] overflow-hidden ring-1 ring-border shadow-2xl">
                    <div id="reader" className="w-full h-full overflow-hidden [&_video]:object-cover"></div>

                    {!isScannerReady && (
                        <div className="absolute inset-0 bg-card/80 backdrop-blur-xl flex flex-col items-center justify-center p-6 sm:p-8 text-center space-y-4 sm:space-y-6">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center ring-1 ring-primary/20">
                                <Camera className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-lg sm:text-xl font-black">{hasPermission === false ? "Access Blocked" : "Ready to Scan?"}</h3>
                                <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                                    {hasPermission === false ? "Enable camera in browser settings." : "Enable your camera to begin scanning."}
                                </p>
                            </div>
                            {hasPermission !== false && (
                                <Button onClick={requestPermissionAndStart} className="rounded-xl sm:rounded-2xl h-12 px-6 sm:px-8 font-bold bg-primary shadow-lg shadow-primary/20 transition-all hover:scale-105 text-sm sm:text-base">
                                    Enable Camera
                                </Button>
                            )}
                        </div>
                    )}

                    {isScannerReady && (
                        <>
                            <div className="absolute inset-0 pointer-events-none border-[20px] sm:border-[30px] border-background/20 opacity-50" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-64 sm:h-64 border-2 border-primary/50 rounded-2xl sm:rounded-3xl pointer-events-none">
                                <motion.div animate={{ top: ["0%", "100%", "0%"] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="absolute left-0 right-0 h-1 bg-primary z-20" />
                            </div>
                            <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-30">
                                {cameras.length > 1 && (
                                    <Button size="icon" variant="secondary" className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-background/80 backdrop-blur-md shadow-xl" onClick={toggleCamera}>
                                        <Repeat className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </Button>
                                )}
                                <Button size="icon" variant="secondary" className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-background/80 backdrop-blur-md shadow-xl" onClick={() => window.location.reload()}>
                                    <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                                </Button>
                            </div>
                        </>
                    )}

                    <AnimatePresence>
                        {isProcessing && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-accent/20 backdrop-blur-2xl flex flex-col items-center justify-center z-40">
                                <Loader2 className="w-12 h-12 sm:w-16 sm:h-16 text-accent animate-spin" />
                                <p className="font-black text-xl sm:text-2xl mt-6 sm:mt-8 tracking-tighter text-foreground">Verifying...</p>
                            </motion.div>
                        )}

                        {lastScan && (
                            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className={cn("absolute inset-x-4 sm:inset-x-6 bottom-4 sm:bottom-6 p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] flex flex-col items-center text-center gap-2 sm:gap-3 border shadow-2xl z-50 backdrop-blur-2xl", lastScan.success ? "bg-emerald-500/20 border-emerald-500/50" : "bg-destructive/20 border-destructive/50")}>
                                {lastScan.success ? <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-500" /> : <XCircle className="w-8 h-8 sm:w-10 sm:h-10 text-destructive" />}
                                <div className="space-y-1">
                                    <p className="font-black text-lg sm:text-xl leading-tight">
                                        {lastScan.success ? `Welcome, ${lastScan.user?.firstName}!` : lastScan.error}
                                    </p>
                                    {lastScan.user && (
                                        <div className="flex items-center justify-center gap-2">
                                            <span className="px-2 py-0.5 bg-background/50 rounded-md text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground ring-1 ring-border">{lastScan.user.ministry}</span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <Card className="bg-card/40 border-border text-foreground backdrop-blur-xl ring-1 ring-border shadow-lg">
                        <CardContent className="p-3 sm:p-4 flex flex-col items-center text-center space-y-1 sm:space-y-2">
                            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                            <p className="font-bold text-[10px] sm:text-xs uppercase tracking-wider">Live Sync</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/40 border-border text-foreground backdrop-blur-xl ring-1 ring-border shadow-lg">
                        <CardContent className="p-3 sm:p-4 flex flex-col items-center text-center space-y-1 sm:space-y-2">
                            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent" />
                            <p className="font-bold text-[10px] sm:text-xs uppercase tracking-wider">Secure</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
