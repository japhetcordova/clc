"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AboutCTA() {
    return (
        <section className="py-12 md:py-20 px-4 md:px-8 text-center">
            <div className="max-w-2xl mx-auto space-y-8">
                <h2 className="text-4xl font-black uppercase italic tracking-tight">Join Our Journey</h2>
                <p className="text-muted-foreground font-medium leading-relaxed">
                    There's a place for you in our story. Connect with us and discover your purpose in God's family.
                </p>
                <div className="flex justify-center gap-4">
                    <Link href="/registration">
                        <Button size="lg" className="h-14 px-10 rounded-2xl bg-primary font-black uppercase text-xs tracking-widest">
                            Get Started
                        </Button>
                    </Link>
                    <Link href="/locations">
                        <Button size="lg" variant="outline" className="h-14 px-10 rounded-2xl border-border bg-background font-black uppercase text-xs tracking-widest">
                            Our Locations
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
