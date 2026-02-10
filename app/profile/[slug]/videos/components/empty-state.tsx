"use client";

import Link from "next/link";
import { Book, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState() {
    return (
        <div className="text-center py-24 space-y-6">
            <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto ring-8 ring-primary/5">
                <Book className="w-10 h-10 text-muted-foreground/50" />
            </div>
            <div className="space-y-2">
                <h2 className="font-black text-2xl uppercase italic tracking-tighter">No Active Enrollments</h2>
                <p className="text-muted-foreground text-xs uppercase tracking-widest max-w-xs mx-auto">You are not currently enrolled in any class levels to access materials.</p>
            </div>
            <Link href="/classes">
                <Button className="rounded-2xl h-12 px-8 font-black uppercase text-[11px] tracking-widest gap-3 shadow-xl">
                    Browse Classes
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </Link>
        </div>
    );
}
