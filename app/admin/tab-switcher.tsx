"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCheck, Users2, Users, TrendingUp, Sparkles } from "lucide-react";

export function TabSwitcher() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const activeTab = searchParams.get("tab") || "attendance";

    const updateTab = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", value);
        router.push(`?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="bg-muted/30 p-1.5 rounded-2xl inline-flex ring-1 ring-border w-full sm:w-auto overflow-x-auto no-scrollbar">
            <TabsList className="bg-transparent gap-1.5 h-11 w-full sm:w-auto">
                <TabsTrigger
                    value="attendance"
                    onClick={() => updateTab("attendance")}
                    className="flex-1 sm:flex-none rounded-xl font-black uppercase text-[9px] sm:text-[10px] tracking-widest gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg h-8 px-4"
                >
                    <UserCheck className="w-3.5 h-3.5" />
                    Attendance
                </TabsTrigger>
                <TabsTrigger
                    value="demographics"
                    onClick={() => updateTab("demographics")}
                    className="flex-1 sm:flex-none rounded-xl font-black uppercase text-[9px] sm:text-[10px] tracking-widest gap-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-lg h-8 px-4"
                >
                    <Users2 className="w-3.5 h-3.5" />
                    Demographics
                </TabsTrigger>
                <TabsTrigger
                    value="members"
                    onClick={() => updateTab("members")}
                    className="flex-1 sm:flex-none rounded-xl font-black uppercase text-[9px] sm:text-[10px] tracking-widest gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg h-8 px-4"
                >
                    <Users className="w-3.5 h-3.5" />
                    Members
                </TabsTrigger>
                <TabsTrigger
                    value="trends"
                    onClick={() => updateTab("trends")}
                    className="flex-1 sm:flex-none rounded-xl font-black uppercase text-[9px] sm:text-[10px] tracking-widest gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg h-8 px-4"
                >
                    <TrendingUp className="w-3.5 h-3.5" />
                    Graph Trend
                </TabsTrigger>
                <TabsTrigger
                    value="highlights"
                    onClick={() => updateTab("highlights")}
                    className="flex-1 sm:flex-none rounded-xl font-black uppercase text-[9px] sm:text-[10px] tracking-widest gap-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg h-8 px-4"
                >
                    <Sparkles className="w-3.5 h-3.5" />
                    Highlights
                </TabsTrigger>
            </TabsList>
        </div>
    );
}
