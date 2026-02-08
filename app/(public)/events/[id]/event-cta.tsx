"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, LinkIcon, Calendar } from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EventCTAProps {
    eventId: string;
    eventTitle: string;
    registrationLink?: string | null;
    initialInterestedCount: number;
    eventDate: string;
    eventTime: string;
    location: string;
    description: string;
}

export default function EventCTA({
    eventId,
    eventTitle,
    registrationLink,
    initialInterestedCount,
    eventDate,
    eventTime,
    location,
    description
}: EventCTAProps) {
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
                    copyToClipboard();
                }
            }
        } else {
            copyToClipboard();
        }
    };

    const getEventDates = () => {
        try {
            const [year, month, day] = eventDate.split("-").map(Number);
            const timeMatch = eventTime.match(/(\d+)(?::(\d+))?\s*(AM|PM)?/i);

            if (!timeMatch) throw new Error("Invalid time format");

            let hours = parseInt(timeMatch[1], 10);
            const minutes = parseInt(timeMatch[2] || "0", 10);
            const modifier = timeMatch[3]?.toUpperCase();

            if (modifier === "PM" && hours < 12) hours += 12;
            if (modifier === "AM" && hours === 12) hours = 0;

            const startDate = new Date(year, month - 1, day, hours, minutes);
            const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

            if (isNaN(startDate.getTime())) throw new Error("Invalid date");

            return { startDate, endDate };
        } catch (err) {
            console.error(err);
            return null;
        }
    };

    const handleGoogleCalendar = () => {
        const dates = getEventDates();
        if (!dates) {
            toast.error("Could not parse event date/time");
            return;
        }

        const formatDate = (date: Date) => date.toISOString().replace(/-|:|\.\d+/g, "");

        const url = new URL("https://www.google.com/calendar/render");
        url.searchParams.append("action", "TEMPLATE");
        url.searchParams.append("text", eventTitle);
        url.searchParams.append("details", description);
        url.searchParams.append("location", location);
        url.searchParams.append("dates", `${formatDate(dates.startDate)}/${formatDate(dates.endDate)}`);

        window.open(url.toString(), "_blank");
    };

    const handleICSDownload = () => {
        const dates = getEventDates();
        if (!dates) {
            toast.error("Could not parse event date/time");
            return;
        }

        const formatDate = (date: Date) => {
            return date.toISOString().replace(/-|:|\.\d+/g, "");
        };

        const escapeICS = (str: string) => {
            return str
                .replace(/[\\,;]/g, (match) => `\\${match}`)
                .replace(/\n/g, "\\n");
        };

        const icsContent = [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "PRODID:-//Christian Life Center//Event Calendar//EN",
            "BEGIN:VEVENT",
            `DTSTART:${formatDate(dates.startDate)}`,
            `DTEND:${formatDate(dates.endDate)}`,
            `SUMMARY:${escapeICS(eventTitle)}`,
            `DESCRIPTION:${escapeICS(description)}`,
            `LOCATION:${escapeICS(location)}`,
            "END:VEVENT",
            "END:VCALENDAR"
        ].join("\n");

        const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute("download", `${eventTitle.replace(/\s+/g, "_")}.ics`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Calendar file downloaded!");
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

                <div className="flex flex-col gap-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="w-full h-14 rounded-2xl border-white/20 bg-white/5 font-black uppercase text-[10px] tracking-widest text-white hover:bg-white/10 gap-2"
                            >
                                <Calendar className="w-4 h-4" /> Add to Calendar
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px] rounded-2xl p-2 bg-background border-border shadow-2xl">
                            <DropdownMenuItem
                                onClick={handleGoogleCalendar}
                                className="h-12 rounded-xl scale-95 hover:scale-100 transition-all font-bold uppercase text-[10px] tracking-widest gap-3 cursor-pointer"
                            >
                                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                </div>
                                Google Calendar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={handleICSDownload}
                                className="h-12 rounded-xl scale-95 hover:scale-100 transition-all font-bold uppercase text-[10px] tracking-widest gap-3 cursor-pointer"
                            >
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                </div>
                                Apple / Outlook
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                        onClick={handleShare}
                        variant="ghost"
                        className="w-full h-14 rounded-2xl border-white/20 bg-white/5 font-black uppercase text-[10px] tracking-widest text-white hover:bg-white/10 gap-2"
                    >
                        <Share2 className="w-4 h-4" /> Share Event
                    </Button>
                </div>
            </div>
        </div>
    );
}
