"use client";

import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { WifiOff, Wifi, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";

export default function OfflineAlert() {
    const isOnline = useOnlineStatus();
    const [showNotification, setShowNotification] = useState(false);
    const [previouslyOffline, setPreviouslyOffline] = useState(false);

    useEffect(() => {
        if (!isOnline) {
            setShowNotification(true);
            setPreviouslyOffline(true);
        } else if (previouslyOffline) {
            // Show "back online" message briefly then hide
            setShowNotification(true);
            const timer = setTimeout(() => {
                setShowNotification(false);
                setPreviouslyOffline(false);
            }, 3000);
            return () => clearTimeout(timer);
        } else {
            setShowNotification(false);
        }
    }, [isOnline, previouslyOffline]);

    return (
        <AnimatePresence>
            {showNotification && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-md"
                >
                    <div className={`p-4 rounded-2xl border shadow-2xl backdrop-blur-xl flex items-center justify-between gap-4 ${isOnline
                            ? "bg-primary/10 border-primary/20 text-primary"
                            : "bg-destructive/10 border-destructive/20 text-destructive"
                        }`}>
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl ${isOnline ? "bg-primary/20" : "bg-destructive/20"
                                }`}>
                                {isOnline ? (
                                    <Wifi className="w-5 h-5" />
                                ) : (
                                    <WifiOff className="w-5 h-5" />
                                )}
                            </div>
                            <div className="flex flex-col">
                                <p className="font-bold text-sm">
                                    {isOnline ? "Back Online" : "No Connection"}
                                </p>
                                <p className="text-xs opacity-80">
                                    {isOnline
                                        ? "Connection restored successfully."
                                        : "Check your internet settings."}
                                </p>
                            </div>
                        </div>
                        {!isOnline && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => window.location.reload()}
                                className="hover:bg-destructive/20 shrink-0"
                            >
                                <RefreshCcw className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
