"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, Download, Copy, Mail, Facebook, Instagram, Twitter, VolumeX } from "lucide-react";
import { toast } from "sonner";

interface VOTDClientProps {
    verseText: string;
    reference: string;
    audioUrl?: string;
}

export default function VOTDClient({ verseText, reference, audioUrl }: VOTDClientProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isSupported, setIsSupported] = useState(false);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Check if Speech Synthesis is supported
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            setIsSupported(true);

            // Create utterance
            const utterance = new SpeechSynthesisUtterance();
            utterance.text = `${verseText}. ${reference}`;
            utterance.rate = 0.9; // Slightly slower for clarity
            utterance.pitch = 1;
            utterance.volume = isMuted ? 0 : 1;

            // Event handlers
            utterance.onend = () => {
                setIsPlaying(false);
                setProgress(0);
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                }
            };

            utterance.onerror = (event) => {
                console.error('Speech synthesis error:', event);
                setIsPlaying(false);
                toast.error("Unable to play audio. Try the external link.");
            };

            utteranceRef.current = utterance;
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            if (typeof window !== 'undefined' && window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, [verseText, reference, isMuted]);

    const handlePlayPause = () => {
        if (!isSupported) {
            // Fallback to external audio link
            if (audioUrl) {
                window.open(audioUrl, '_blank');
                toast.info("Opening external audio player...");
            } else {
                toast.error("Text-to-speech is not supported in your browser.");
            }
            return;
        }

        if (isPlaying) {
            // Pause
            window.speechSynthesis.pause();
            setIsPlaying(false);
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        } else {
            // Play or Resume
            if (window.speechSynthesis.paused) {
                window.speechSynthesis.resume();
            } else {
                if (utteranceRef.current) {
                    window.speechSynthesis.speak(utteranceRef.current);

                    // Simulate progress (since we can't get real progress from Speech API)
                    const estimatedDuration = (verseText.length / 15) * 1000; // ~15 chars per second
                    const updateInterval = 100;
                    let elapsed = 0;

                    intervalRef.current = setInterval(() => {
                        elapsed += updateInterval;
                        const newProgress = Math.min((elapsed / estimatedDuration) * 100, 100);
                        setProgress(newProgress);

                        if (newProgress >= 100) {
                            if (intervalRef.current) {
                                clearInterval(intervalRef.current);
                            }
                        }
                    }, updateInterval);
                }
            }
            setIsPlaying(true);
        }
    };

    const handleStop = () => {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        setProgress(0);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
        if (utteranceRef.current) {
            utteranceRef.current.volume = !isMuted ? 0 : 1;
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(`"${verseText}" - ${reference}`);
        toast.success("Verse copied to clipboard!");
    };

    const handleDownloadAudio = () => {
        if (audioUrl) {
            window.open(audioUrl, '_blank');
            toast.info("Opening audio download link...");
        } else {
            toast.info("External audio not available. Use text-to-speech instead.");
        }
    };

    return (
        <>
            {/* Share and Copy Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-border/50">
                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Share:</span>
                    <div className="flex gap-2">
                        {[Mail, Facebook, Instagram, Twitter].map((Icon, i) => (
                            <Button
                                key={i}
                                variant="outline"
                                size="icon"
                                className="w-10 h-10 rounded-xl border-border/50 hover:bg-primary/10 hover:border-primary/50 transition-all"
                            >
                                <Icon className="w-4 h-4" />
                            </Button>
                        ))}
                    </div>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Button
                        variant="ghost"
                        className="rounded-xl gap-2 font-black uppercase text-xs tracking-widest text-muted-foreground hover:text-primary"
                        onClick={handleCopy}
                    >
                        <Copy className="w-4 h-4" />
                        Copy
                    </Button>
                    <Button className="rounded-xl gap-2 bg-primary font-black uppercase text-xs tracking-widest px-6">
                        <Download className="w-4 h-4" />
                        Save Image
                    </Button>
                </div>
            </div>

            {/* Audio Player Controls */}
            <div className="flex items-center gap-4 w-full">
                <Button
                    size="icon"
                    className="w-12 h-12 rounded-2xl bg-primary shadow-lg shadow-primary/20 shrink-0"
                    onClick={handlePlayPause}
                >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
                </Button>
                <div
                    className="flex-1 h-2 bg-background/50 rounded-full overflow-hidden relative group cursor-pointer"
                    onClick={handleStop}
                >
                    <div
                        className="absolute inset-y-0 left-0 bg-primary rounded-full group-hover:bg-primary/80 transition-all"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <span className="font-mono text-xs font-bold text-muted-foreground hidden sm:block">
                    {isSupported ? 'TTS Ready' : 'External'}
                </span>
                <div className="hidden md:flex items-center gap-2 text-muted-foreground">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8"
                        onClick={toggleMute}
                    >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8"
                        onClick={handleDownloadAudio}
                    >
                        <Download className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </>
    );
}
