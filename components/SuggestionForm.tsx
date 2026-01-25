"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Lightbulb, Send, UserCircle, UserX } from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SuggestionFormProps {
    userId: string;
    onSuccess?: () => void;
    triggerButton?: React.ReactNode;
}

export default function SuggestionForm({ userId, onSuccess, triggerButton }: SuggestionFormProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [content, setContent] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(false);
    const suggestionMutation = trpc.createSuggestion.useMutation();
    const [isPending, startTransition] = useTransition();
    const [isDesktop, setIsDesktop] = useState(true);

    // Media query hook - FIXED: Changed from useState to useEffect
    useEffect(() => {
        if (typeof window !== "undefined") {
            const mediaQuery = window.matchMedia("(min-width: 768px)");
            setIsDesktop(mediaQuery.matches);

            const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
            mediaQuery.addEventListener("change", handler);
            return () => mediaQuery.removeEventListener("change", handler);
        }
    }, []);

    const handleSubmit = () => {
        if (!content.trim()) {
            toast.error("Please write your suggestion first");
            return;
        }

        if (content.length > 500) {
            toast.error("Suggestion is too long (max 500 characters)");
            return;
        }

        startTransition(async () => {
            try {
                const result = await suggestionMutation.mutateAsync({
                    content,
                    isAnonymous,
                    userId,
                });

                if (result.success) {
                    toast.success("Suggestion submitted successfully!");
                    setContent("");
                    setIsAnonymous(false);
                    setOpen(false);
                    onSuccess?.();

                    // Redirect to suggestions page
                    router.push("/suggestions");
                }
            } catch (error: any) {
                toast.error(error.message || "Failed to submit suggestion");
            }
        });
    };

    const defaultTrigger = (
        <Button
            variant="outline"
            className="border-2 border-primary/10 hover:bg-primary/5 rounded-2xl font-black flex items-center justify-center gap-3 h-12 uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-black/5 hover:scale-[1.02] active:scale-95 transition-all"
        >
            <Lightbulb className="w-5 h-5 text-primary" />
            Send Suggestion
        </Button>
    );

    const formFields = (
        <div className="space-y-6 p-6">
            <div className="space-y-3">
                <Label htmlFor="suggestion-content" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                    Your Suggestion
                </Label>
                <Textarea
                    id="suggestion-content"
                    placeholder="Share your ideas, feedback, or suggestions to help us improve..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    maxLength={500}
                    className="min-h-[150px] resize-none rounded-2xl border-2 focus:border-primary transition-colors"
                    disabled={isPending}
                />
                <p className="text-xs text-muted-foreground">
                    {content.length} / 500 characters
                </p>
            </div>

            <div className="space-y-3">
                <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                    Submit As
                </Label>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => setIsAnonymous(false)}
                        disabled={isPending}
                        className={cn(
                            "p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all border-2",
                            !isAnonymous
                                ? "bg-primary text-primary-foreground border-primary shadow-lg scale-[1.02]"
                                : "bg-muted/50 border-transparent hover:bg-muted"
                        )}
                    >
                        <UserCircle className="w-6 h-6" />
                        <span className="text-xs font-bold">With My Name</span>
                    </button>
                    <button
                        onClick={() => setIsAnonymous(true)}
                        disabled={isPending}
                        className={cn(
                            "p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all border-2",
                            isAnonymous
                                ? "bg-primary text-primary-foreground border-primary shadow-lg scale-[1.02]"
                                : "bg-muted/50 border-transparent hover:bg-muted"
                        )}
                    >
                        <UserX className="w-6 h-6" />
                        <span className="text-xs font-bold">Anonymously</span>
                    </button>
                </div>
            </div>
        </div>
    );

    const formSubmitButton = (
        <Button
            onClick={handleSubmit}
            disabled={isPending || !content.trim()}
            className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase text-xs tracking-widest shadow-xl shadow-primary/30 flex items-center justify-center gap-3 active:scale-95 transition-all"
        >
            <Send className="w-5 h-5" />
            {isPending ? "Submitting..." : "Submit Suggestion"}
        </Button>
    );

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    {triggerButton || defaultTrigger}
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] rounded-[2.5rem] p-0 border-none bg-background/95 backdrop-blur-2xl shadow-2xl">
                    <DialogHeader className="p-6 pb-0">
                        <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-3">
                            Share Your Suggestion
                        </DialogTitle>
                        <p className="text-muted-foreground text-sm font-medium pt-2">
                            Help us improve by sharing your ideas and feedback
                        </p>
                    </DialogHeader>
                    {formFields}
                    <div className="p-6 pt-0">
                        {formSubmitButton}
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                {triggerButton || defaultTrigger}
            </DrawerTrigger>
            <DrawerContent className="max-h-[90vh] rounded-t-[2.5rem]">
                <DrawerHeader className="text-left">
                    <DrawerTitle className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-3">
                        Share Your Suggestion
                    </DrawerTitle>
                    <p className="text-muted-foreground text-sm font-medium pt-2">
                        Help us improve by sharing your ideas and feedback
                    </p>
                </DrawerHeader>
                <div className="overflow-y-auto flex-1 pb-safe">
                    {formFields}
                </div>
                <div className="p-6 border-t border-border/50 bg-background/50 backdrop-blur-xl pb-10">
                    {formSubmitButton}
                </div>
            </DrawerContent>
        </Drawer>
    );
}
