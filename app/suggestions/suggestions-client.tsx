"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Lightbulb, User, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import BackButton from "@/components/BackButton";
import { toggleSuggestionLike } from "@/lib/actions";
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
    const [isPending, startTransition] = useTransition();

    const handleLike = (suggestionId: string) => {
        startTransition(async () => {
            const result = await toggleSuggestionLike(suggestionId, currentUser.id);

            if (result.success) {
                // Optimistically update the UI
                setSuggestions(prev => prev.map(s => {
                    if (s.id === suggestionId) {
                        return {
                            ...s,
                            isLikedByCurrentUser: result.liked!,
                            likeCount: result.liked ? s.likeCount + 1 : s.likeCount - 1,
                        };
                    }
                    return s;
                }));
            } else {
                toast.error(result.error || "Failed to update like");
            }
        });
    };

    const handleSuggestionSubmitted = () => {
        // Refresh the page to show new suggestion
        window.location.reload();
    };

    return (
        <div className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
            {/* Header */}
            <div className="space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="space-y-2">
                        <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter flex items-center gap-3">
                            <Lightbulb className="w-10 h-10 text-primary" />
                            Suggestions
                        </h1>
                        <p className="text-muted-foreground text-sm md:text-base font-medium">
                            Share your ideas and help us improve together
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <BackButton
                            href={`/profile/${currentUser.qrCodeId}`}
                            label="Back to Profile"
                        />
                        <SuggestionForm userId={currentUser.id} onSuccess={handleSuggestionSubmitted} />
                    </div>
                </div>

                <div className="h-[2px] w-20 bg-primary rounded-full" />
            </div>

            {/* Suggestions Feed */}
            <div className="space-y-4">
                {suggestions.length === 0 ? (
                    <div className="text-center py-16 space-y-4">
                        <div className="w-20 h-20 mx-auto rounded-full bg-muted/50 flex items-center justify-center">
                            <Lightbulb className="w-10 h-10 text-muted-foreground/50" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-muted-foreground">No suggestions yet</h3>
                            <p className="text-sm text-muted-foreground/70">Be the first to share your ideas!</p>
                        </div>
                    </div>
                ) : (
                    suggestions.map((suggestion) => (
                        <div
                            key={suggestion.id}
                            className="group relative p-6 rounded-[2rem] bg-card border-2 border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
                        >
                            {/* Suggestion Header */}
                            <div className="flex items-start justify-between gap-4 mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <User className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">
                                            {suggestion.isAnonymous
                                                ? "Anonymous"
                                                : `${suggestion.author?.firstName} ${suggestion.author?.lastName}`
                                            }
                                        </p>
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                            <Clock className="w-3 h-3" />
                                            <span>
                                                {formatDistanceToNow(new Date(suggestion.createdAt), { addSuffix: true })}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Like Button */}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleLike(suggestion.id)}
                                    disabled={isPending}
                                    className={cn(
                                        "rounded-full gap-2 transition-all",
                                        suggestion.isLikedByCurrentUser
                                            ? "text-rose-500 hover:text-rose-600"
                                            : "text-muted-foreground hover:text-rose-500"
                                    )}
                                >
                                    <Heart
                                        className={cn(
                                            "w-5 h-5 transition-all",
                                            suggestion.isLikedByCurrentUser && "fill-current"
                                        )}
                                    />
                                    <span className="font-bold text-sm">{suggestion.likeCount}</span>
                                </Button>
                            </div>

                            {/* Suggestion Content */}
                            <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                                {suggestion.content}
                            </p>

                            {/* Decorative gradient on hover */}
                            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        </div>
                    ))
                )}
            </div>

            {/* Footer Info */}
            {suggestions.length > 0 && (
                <div className="text-center pt-8 pb-4">
                    <p className="text-sm text-muted-foreground">
                        Showing {suggestions.length} {suggestions.length === 1 ? 'suggestion' : 'suggestions'}
                    </p>
                </div>
            )}
        </div>
    );
}
