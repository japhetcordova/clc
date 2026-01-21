"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, LinkIcon } from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import { toast } from "sonner";

interface EventCTAProps {
    eventId: string;
    eventTitle: string;
    registrationLink?: string | null;
    initialInterestedCount: number;
}

export default function EventCTA({ eventId, eventTitle, registrationLink, initialInterestedCount }: EventCTAProps) {
    const [hasMarkedInterest, setHasMarkedInterest] = useState(false);
    const [interestedCount, setInterestedCount] = useState(initialInterestedCount);

    const markInterested = trpc.markEventInterested.useMutation({
        onSuccess: (data) => {
            setHasMarkedInterest(true);
            setInterestedCount(data.interestedCount || interestedCount + 1);
            toast.success("Thank you for your interest!");
        },
        onError: () => {
            toast.error("Something went wrong. Please try again.");
        }
    });

    const handleInterestClick = () => {
        if (hasMarkedInterest) {
            toast.info("You've already marked your interest!");
            return;
        }
        markInterested.mutate({ eventId });
    };

    const handleShare = async () => {
        const shareData = {
            title: eventTitle,
            text: `Check out this event: ${eventTitle}`,
            url: window.location.href
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
                toast.success("Shared successfully!");
            } catch (err) {
                if ((err as Error).name !== 'AbortError') {
                    // Fallback to clipboard
                    copyToClipboard();
                }
            }
        } else {
            // Fallback to clipboard
            copyToClipboard();
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
    };

    return (
        <div className="p-8 rounded-[3rem] bg-primary text-white shadow-2xl space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-[60px] -mr-16 -mt-16" />

            <h3 className="text-2xl font-black uppercase italic tracking-tighter relative z-10">Will you be there?</h3>
            <p className="text-sm font-medium opacity-80 relative z-10">
                {registrationLink
                    ? "Secure your spot by registering today."
                    : "Let us know if you're coming so we can prepare a seat for you."}
            </p>

            {interestedCount > 0 && (
                <p className="text-xs font-bold opacity-90 relative z-10">
                    {interestedCount} {interestedCount === 1 ? 'person is' : 'people are'} interested
                </p>
            )}

            <div className="space-y-3 relative z-10">
                {registrationLink ? (
                    <a
                        href={registrationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-full h-14 rounded-2xl bg-white text-primary font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-slate-100 transition-colors"
                    >
                        Register Now <LinkIcon className="w-3 h-3 ml-2" />
                    </a>
                ) : (
                    <Button
                        onClick={handleInterestClick}
                        disabled={hasMarkedInterest || markInterested.isPending}
                        className="w-full h-14 rounded-2xl bg-white text-primary font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-slate-100"
                    >
                        {hasMarkedInterest ? "Interest Marked ✓" : markInterested.isPending ? "Processing..." : "I'm Interested"}
                    </Button>
                )}

                <Button
                    onClick={handleShare}
                    variant="ghost"
                    className="w-full h-14 rounded-2xl border-white/20 bg-white/5 font-black uppercase text-xs tracking-[0.2em] text-white hover:bg-white/10"
                >
                    <Share2 className="w-4 h-4 mr-2" /> Share Event
                </Button>
            </div>
        </div>
    );
}
