import ClassEnrollmentClient from "./ClassEnrollmentClient";
import Image from "next/image";
import { GraduationCap } from "lucide-react";
import { redirect } from "next/navigation";
import { trpcServer } from "@/lib/trpc/server";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "The Journey | Christian Life Center",
        description: "Discover the G12 Discipleship Journey and enroll in our School of Leaders classes.",
        openGraph: {
            url: "/classes",
            images: ["/logo.webp"],
        }
    };
}


export default async function ClassesPage() {
    const caller = await trpcServer();
    const user = await caller.getMe();

    if (user) {
        const enrollments = await caller.getMyEnrollments();
        const activeEnrollments = enrollments.filter((e) => e.status === "active" || e.status === "completed");

        if (activeEnrollments.length > 0) {
            redirect(`/profile/${user.qrCodeId}/videos`);
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-background relative overflow-hidden pb-24">

            {/* HERO SECTION - Optimized for mobile */}
            <section className="relative pt-20 md:pt-32 pb-10 md:pb-20 overflow-hidden mb-6 md:mb-12">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/bg/events.webp"
                        alt="Classes Background"
                        fill
                        className="object-cover opacity-15 scale-105"
                        priority
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-background via-background/80 to-background" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 space-y-4 md:space-y-8">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md">
                            <GraduationCap className="w-3.5 h-3.5 text-primary" />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">The Journey</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.9]">
                            Discipleship <br /> <span className="text-primary">Levels</span>
                        </h1>
                        <p className="max-w-xl text-muted-foreground font-medium text-xs sm:text-sm md:text-lg leading-relaxed opacity-80 line-clamp-2 md:line-clamp-none">
                            Life Class is the core of our Consolidation stage. Transition from new believer to leader through the SOL track.
                        </p>
                    </div>

                    <ClassEnrollmentClient currentUser={user as any} />
                </div>
            </section>
        </div>
    );
}