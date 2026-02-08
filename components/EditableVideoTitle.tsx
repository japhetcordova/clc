"use client";

import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc/client";
import { Pencil, Check, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface EditableVideoTitleProps {
    videoId: string;
    initialTitle: string;
    className?: string;
}

export function EditableVideoTitle({ videoId, initialTitle, className }: EditableVideoTitleProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(initialTitle);
    const [isAdmin, setIsAdmin] = useState(false);
    const updateTitleMutation = trpc.updateVideoTitle.useMutation();

    useEffect(() => {
        const adminAuth = localStorage.getItem("clc_admin_auth");
        const today = new Date().toLocaleDateString("en-CA");
        const adminAuthDate = localStorage.getItem("clc_admin_auth_date");

        if (adminAuth === "true" && adminAuthDate === today) {
            setIsAdmin(true);
        }
    }, []);

    const handleSave = async () => {
        if (!title.trim()) {
            toast.error("Title cannot be empty");
            return;
        }

        try {
            await updateTitleMutation.mutateAsync({
                id: videoId,
                manualTitle: title.trim(),
            });
            setIsEditing(false);
            toast.success("Title updated");
        } catch (error) {
            toast.error("Failed to update title");
        }
    };

    if (!isAdmin) {
        return <span className={className}>{title}</span>;
    }

    if (isEditing) {
        return (
            <div className="flex items-center gap-2 w-full max-w-lg pointer-events-auto">
                <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={cn(
                        "h-10 bg-background/50 border-primary/50 font-black uppercase italic tracking-tighter text-xl text-foreground",
                        className
                    )}
                    autoFocus
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleSave();
                        if (e.key === "Escape") {
                            setIsEditing(false);
                            setTitle(initialTitle);
                        }
                    }}
                />
                <button
                    onClick={handleSave}
                    disabled={updateTitleMutation.isPending}
                    className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg hover:bg-emerald-500/20 transition-colors shrink-0"
                >
                    {updateTitleMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                </button>
                <button
                    onClick={() => {
                        setIsEditing(false);
                        setTitle(initialTitle);
                    }}
                    className="p-2 bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-500/20 transition-colors shrink-0"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        );
    }

    return (
        <div className="group relative inline-flex items-center gap-2 max-w-full pointer-events-auto">
            <span className={cn("truncate", className)}>{title}</span>
            <button
                onClick={() => setIsEditing(true)}
                className="opacity-0 group-hover:opacity-100 p-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all shrink-0"
                title="Edit Title"
            >
                <Pencil className="w-3 h-3" />
            </button>
        </div>
    );
}
