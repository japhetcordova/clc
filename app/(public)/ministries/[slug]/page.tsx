"use client";

import { motion } from "framer-motion";
import {
    ChevronLeft,
    Users,
    Sparkles,
    Star,
    CheckCircle2,
    Target,
    ArrowRight,
    HandHeart,
    Music,
    Video,
    Shield,
    Clapperboard,
    Baby,
    Mic2,
    Settings,
    DollarSign,
    Speech,
    PenTool
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";

const MINISTRY_ICONS: Record<string, any> = {
    "worship-team": Music,
    "media": Video,
    "usher": HandHeart,
    "marshal": Shield,
    "production": Clapperboard,
    "kids-church": Baby,
    "technical": Settings,
    "pa": Mic2,
    "finance": DollarSign,
    "arete": Sparkles,
    "hosting": Speech,
    "writer": PenTool
};

const MOCK_MINISTRIES: Record<string, any> = {
    "worship-team": {
        title: "Worship Team",
        desc: "The Worship Team is dedicated to creating an environment where people can encounter the presence of God through music and creative arts. We believe worship is a lifestyle, not just a Sunday moment.",
        vision: "To lead the congregation into a deep, authentic, and transformative worship experience.",
        requirements: ["Proficiency in instrument/vocals", "Consistent attendance", "Audition required", "Heart for service"],
        roles: ["Vocalists", "Keyboardists", "Guitarists", "Drummers", "Creative Directors"]
    },
    "media": {
        title: "Media Team",
        desc: "The Media Team captures and communicates the story of GOC through visuals, photography, and digital content. We are the digital storytellers of our church family.",
        vision: "To broadcast the Gospel with excellence across all digital platforms.",
        requirements: ["Basic photography/video skills", "Reliability", "Willingness to learn", "Laptop (optional)"],
        roles: ["Photographers", "Videographers", "Social Media Managers", "Editors"]
    }
};

export default function MinistryDetailPage() {
    const params = useParams();
    const slug = params.slug as string;
    const ministry = MOCK_MINISTRIES[slug] || {
        title: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        desc: "Joining this team is a powerful step in serving the Kingdom. We provide all the training and community support you need to thrive in your service.",
        vision: "To serve our church family with excellence and love.",
        requirements: ["Willing heart", "Consistency", "Community participation"],
        roles: ["Team Member", "Support Staff", "Leader In Training"]
    };

    const Icon = MINISTRY_ICONS[slug] || Star;

    return (
        <div className="flex flex-col min-h-screen bg-background">
            {/* HEADER */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/bg/ministries.png"
                        alt="Ministry Background"
                        fill
                        className="object-cover opacity-10 scale-105"
                        priority
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-background via-background/80 to-background" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6">
                    <div className="space-y-6">
                        <Link href="/ministries">
                            <Button variant="ghost" className="p-0 h-auto gap-2 text-muted-foreground hover:text-primary hover:bg-transparent mb-4 text-[10px] font-black uppercase tracking-widest">
                                <ChevronLeft className="w-4 h-4" /> All Ministries
                            </Button>
                        </Link>

                        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                            <div className="p-6 bg-primary/10 rounded-[2rem] text-primary">
                                <Icon className="w-12 h-12" />
                            </div>
                            <div className="space-y-2">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                >
                                    <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter hover:text-primary transition-colors cursor-default">
                                        {ministry.title}
                                    </h1>
                                </motion.div>
                                <p className="text-sm font-black text-muted-foreground uppercase tracking-widest italic">Christian Life Center Ministry Branch</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CONTENT */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20">
                    <div className="space-y-12">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <Info className="w-5 h-5 text-primary" />
                                <h3 className="font-black uppercase text-xl italic tracking-tight">Mission & Heart</h3>
                            </div>
                            <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                                {ministry.desc}
                            </p>
                            <div className="p-8 rounded-[2rem] bg-primary/5 border border-primary/10 space-y-3">
                                <h4 className="font-black uppercase text-sm tracking-widest text-primary flex items-center gap-2">
                                    <Target className="w-4 h-4" /> Our Vision
                                </h4>
                                <p className="text-muted-foreground font-medium italic">{ministry.vision}</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <Users className="w-5 h-5 text-primary" />
                                <h3 className="font-black uppercase text-xl italic tracking-tight">Requirement Checklist</h3>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {ministry.requirements.map((req: string, i: number) => (
                                    <div key={i} className="flex gap-3 items-center p-4 rounded-2xl bg-card border border-border">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                        <span className="text-xs font-black uppercase tracking-tight">{req}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-12">
                        <div className="space-y-6">
                            <h3 className="font-black uppercase text-xl italic tracking-tight flex items-center gap-3">
                                <Sparkles className="w-5 h-5 text-amber-500" /> Key Roles
                            </h3>
                            <div className="space-y-4">
                                {ministry.roles.map((role: string, i: number) => (
                                    <div key={i} className="group p-6 rounded-[2rem] bg-card border border-border flex justify-between items-center hover:border-primary/20 transition-all">
                                        <span className="font-black uppercase text-sm tracking-tighter italic">{role}</span>
                                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-10 rounded-[3rem] bg-foreground text-background space-y-6 shadow-2xl">
                            <h3 className="text-3xl font-black uppercase italic tracking-tighter">Ready to Serve?</h3>
                            <p className="text-sm font-medium opacity-70">Complete your registration profile and select "{ministry.title}" in the ministry options to get started.</p>
                            <Link href="/registration" className="block">
                                <Button className="w-full h-14 rounded-2xl bg-primary text-white font-black uppercase text-xs tracking-[0.2em] hover:scale-[1.02] transition-transform">
                                    Click to Apply Now
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

function Info(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
        </svg>
    );
}
