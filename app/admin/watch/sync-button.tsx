"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function VideoSync() {
    const [isLoading, setIsLoading] = useState(false);
    const utils = trpc.useContext();

    const syncMutation = trpc.syncVideos.useMutation({
        onSuccess: (data) => {
            if (data.success) {
                toast.success(`Synced ${data.count} videos!`);
                utils.getVideos.invalidate();
            } else {
                toast.error(`Sync failed: ${data.error}`);
            }
            setIsLoading(false);
        },
        onError: (err) => {
            toast.error(`Error: ${err.message}`);
            setIsLoading(false);
        }
    });

    const handleSync = () => {
        const token = window.prompt("Enter Facebook Page/App Access Token:");
        if (!token) return;

        setIsLoading(true);
        syncMutation.mutate({ accessToken: token });
    };

    return (
        <div className="p-6 rounded-[2rem] border border-border bg-card shadow-xl space-y-4">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h3 className="font-black uppercase italic tracking-tighter text-xl">Facebook Sync</h3>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Update live and archived videos</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                    <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
                Connect directly to Facebook Graph API to fetch the latest live stream and video archives. This will automatically update the public watch page.
            </p>

            <Button
                onClick={handleSync}
                disabled={isLoading}
                className="w-full h-12 rounded-xl bg-primary font-bold uppercase tracking-widest text-xs gap-2"
            >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                Sync Now
            </Button>
        </div>
    );
}
