"use client";

import { ArrowLeft, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

export default function NotFound() {
    return (
        <div className="relative min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
                <div className="space-y-8 max-w-md">
                    {/* Minimal 404 Logo/Text */}
                    <div className="space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/60">Error Code</span>
                        <h1 className="text-8xl md:text-9xl font-black tracking-tighter italic">404</h1>
                    </div>

                    {/* Simple Message */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold uppercase tracking-tight italic">Page not found</h2>
                        <p className="text-muted-foreground text-sm font-medium leading-relaxed px-4">
                            The page you are looking for doesn't exist or has been moved.
                            Let's get you back on track.
                        </p>
                    </div>

                    {/* Direct Actions */}
                    <div className="flex flex-col gap-3 pt-4">
                        <Link href="/">
                            <Button className="w-full h-12 rounded-xl bg-primary text-white font-bold uppercase tracking-widest text-xs shadow-lg shadow-primary/10 hover:shadow-primary/25 transition-all">
                                <Home className="w-4 h-4 mr-2" />
                                Return Home
                            </Button>
                        </Link>
                        <Link href="javascript:history.back()">
                            <Button variant="ghost" className="w-full h-12 rounded-xl font-bold uppercase tracking-widest text-[10px] text-muted-foreground hover:text-primary">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Go Back
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>

        </div>
    );
}
