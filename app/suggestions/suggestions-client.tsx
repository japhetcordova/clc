"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Lightbulb, User, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import BackButton from "@/components/BackButton";
import { trpc } from "@/lib/trpc/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import SuggestionForm from "@/components/SuggestionForm";
import { formatDistanceToNow } from "date-fns";

interface Author {
    firstName: string;
    lastName: string;
}

interface Suggestion {
    id: string;
    content: string;
    isAnonymous: boolean;
    userId: string;
    likeCount: number;
    createdAt: Date;
    author: Author | null;
    isLikedByCurrentUser: boolean;
}

interface SuggestionsClientProps {
    initialSuggestions: Suggestion[];
    currentUser: {
        id: string;
        firstName: string;
        lastName: string;
        qrCodeId: string;
    };
}

export default function SuggestionsClient({ initialSuggestions, currentUser }: SuggestionsClientProps) {
    const [suggestions, setSuggestions] = useState(initialSuggestions);
    const likeMutation = trpc.toggleSuggestionLike.useMutation();

    const handleLike = (suggestionId: string) => {
        likeMutation.mutate({ suggestionId, userId: currentUser.id }, {
            onSuccess: (result) => {
                if (result.success) {
                    // Optimistically update the UI (already did by mutation logic or manually)
                    setSuggestions(prev => prev.map(s => {
                        if (s.id === suggestionId) {
                            return {
                                ...s,
                                isLikedByCurrentUser: result.liked!,
                                likeCount: result.likeCount!,
                            };
                        }
                        return s;
                    }));
                }
            },
            onError: (err) => {
                toast.error("Failed to update like");
            }
        });
    };

    const handleSuggestionSubmitted = () => {
        // Refresh the page to show new suggestion
        window.location.reload();
    };

    return (
        <div className="max-w-[1920px] mx-auto px-4 md:px-8 pt-12 pb-24 md:py-20 space-y-12 md:pt-32">
            {/* Header */}
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter flex items-center gap-4 text-foreground leading-none">
                            <Lightbulb className="w-12 h-12 md:w-16 md:h-16 text-primary" />
                            Suggestions
                        </h1>
                        <p className="text-muted-foreground text-lg font-medium max-w-2xl">
                            Share your ideas and help us improve together. Your voice matters in building our community.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <BackButton
                            href={`/profile/${currentUser.qrCodeId}`}
                            label="Back to Profile"
                        />
                        <SuggestionForm userId={currentUser.id} onSuccess={handleSuggestionSubmitted} />
                    </div>
                </div>

                <div className="h-[2px] w-full bg-border/50 rounded-full" />
            </div>

            {/* Suggestions Feed */}
            <div className="">
                {suggestions.length === 0 ? (
                    <div className="text-center py-20 space-y-6 bg-muted/30 rounded-[3rem] border border-border/50">
                        <div className="w-24 h-24 mx-auto rounded-full bg-muted/50 flex items-center justify-center">
                            <Lightbulb className="w-12 h-12 text-muted-foreground/50" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-muted-foreground uppercase tracking-tight">No suggestions yet</h3>
                            <p className="text-base text-muted-foreground/70">Be the first to share your ideas!</p>
                        </div>
                    </div>
                ) : (
                    <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                        {suggestions.map((suggestion) => (
                            <div
                                key={suggestion.id}
                                className="break-inside-avoid mb-6 bg-muted/20 hover:bg-muted/40 transition-colors rounded-3xl p-6 group relative"
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between gap-4 mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                            <User className="w-4 h-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm tracking-tight leading-none">
                                                {suggestion.isAnonymous
                                                    ? "Anonymous"
                                                    : `${suggestion.author?.firstName} ${suggestion.author?.lastName}`
                                                }
                                            </p>
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
                                                {formatDistanceToNow(new Date(suggestion.createdAt), { addSuffix: true })}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Compact Like */}
                                    <button
                                        onClick={() => handleLike(suggestion.id)}
                                        disabled={likeMutation.isPending}
                                        className={cn(
                                            "flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all text-xs font-bold",
                                            suggestion.isLikedByCurrentUser
                                                ? "bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
                                                : "bg-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                        )}
                                    >
                                        <Heart
                                            className={cn(
                                                "w-3.5 h-3.5 transition-transform group-active:scale-90",
                                                suggestion.isLikedByCurrentUser && "fill-current"
                                            )}
                                        />
                                        {suggestion.likeCount > 0 && <span>{suggestion.likeCount}</span>}
                                    </button>
                                </div>

                                {/* Content */}
                                <p className="text-foreground/90 leading-relaxed text-sm whitespace-pre-wrap font-medium">
                                    {suggestion.content}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer Info */}
            {
                suggestions.length > 0 && (
                    <div className="text-center pt-8 pb-4 border-t border-border/50">
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                            Showing {suggestions.length} {suggestions.length === 1 ? 'suggestion' : 'suggestions'}
                        </p>
                    </div>
                )
            }
        </div >
    );
}
