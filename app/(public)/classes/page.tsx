import ClassEnrollmentClient from "./ClassEnrollmentClient";
import Image from "next/image";
import { GraduationCap } from "lucide-react";

import { trpcServer } from "@/lib/trpc/server";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "The Journey | Christian Life Center",
    description: "Discover the G12 Discipleship Journey and enroll in our School of Leaders classes.",
};

export default async function ClassesPage() {
    const caller = await trpcServer();
    const user = await caller.getMe();

    return (
        <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
            {/* HEADER */}
            <section className="relative pt-24 pb-12 md:pt-32 md:pb-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/bg/events.webp"
                        alt="Classes Background"
                        fill
                        className="object-cover opacity-20 scale-105"
                        priority
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-background via-background/80 to-background" />
                </div>

                <div className="relative z-10 max-w-[1920px] mx-auto px-4 md:px-8 space-y-6 sm:space-y-8 md:pt-4">
                    <div className="text-center space-y-4 sm:space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md mb-2 sm:mb-4">
                            <GraduationCap className="w-4 h-4 text-primary animate-bounce" />
                            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">The Journey</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-semibold tracking-tighter uppercase  leading-none">
                            Discipleship <span className="text-primary underline decoration-primary/20 underline-offset-8">Levels</span>
                        </h1>
                        <p className="max-w-3xl mx-auto text-muted-foreground font-thin text-base sm:text-lg leading-relaxed">
                            Life Class and SOL 1Ã¢â‚¬â€œ3 are discipleship and leadership levels in the G12 (Government of 12) church system, designed to move members from new believer to mature leader.
                        </p>
                    </div>

                    <ClassEnrollmentClient currentUser={user as any} />
                </div>
            </section>
        </div>
    );
}