"use client";

import { useEffect, useState } from "react";
import { Download, Smartphone, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";

export default function InstallPWA() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            return;
        }

        // Check for iOS
        const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        setIsIOS(ios);

        if (ios) {
            // Show prompt for iOS after a delay
            const timer = setTimeout(() => setShowPrompt(true), 5000);
            return () => clearTimeout(timer);
        }

        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowPrompt(true);
        };

        window.addEventListener("beforeinstallprompt", handler);
        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setDeferredPrompt(null);
            setShowPrompt(false);
        }
    };

    return (
        <AnimatePresence>
            {showPrompt && (
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 100 }}
                    className="fixed bottom-24 left-4 right-4 z-[110] md:hidden"
                >
                    <div className="bg-primary text-white p-6 rounded-[2rem] shadow-2xl relative overflow-hidden">
                        {/* Background Decoration */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

                        <button
                            onClick={() => setShowPrompt(false)}
                            className="absolute top-4 right-4 p-1 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-start gap-4">
                            <div className="bg-white p-3 rounded-2xl shadow-lg shrink-0">
                                <Smartphone className="w-6 h-6 text-primary" />
                            </div>
                            <div className="space-y-1 pr-6">
                                <h3 className="text-lg font-black uppercase italic tracking-tighter">Download CLC App</h3>
                                <p className="text-xs font-bold text-white/80 leading-relaxed uppercase tracking-wider">
                                    {isIOS
                                        ? "Tap the Share icon and 'Add to Home Screen' to install our app."
                                        : "Install our app for a faster and smoother scanning experience."
                                    }
                                </p>
                            </div>
                        </div>

                        {!isIOS && (
                            <Button
                                onClick={handleInstall}
                                className="w-full mt-6 bg-white text-primary hover:bg-white/90 font-black uppercase italic tracking-tighter rounded-xl h-12"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Install Now
                            </Button>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
