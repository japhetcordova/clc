"use client";

import { trpc } from "@/lib/trpc/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { useSearchParams } from "next/navigation";

const REFETCH_INTERVAL = 5000; // 5 seconds

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface RealtimeSidebarProps {
    initialData: any;
}

export default function RealtimeSidebar({ initialData }: RealtimeSidebarProps) {
    const searchParams = useSearchParams();
    const date = searchParams.get("date") || initialData.filterDate;

    const { data } = trpc.getAdminDashboard.useQuery(
        {
            page: 1,
            date,
        },
        {
            initialData,
            refetchInterval: REFETCH_INTERVAL,
            refetchIntervalInBackground: true,
        }
    );

    return (
        <div className="flex flex-col gap-6 sm:gap-8">
            <Card className="bg-card shadow-xl border-border shrink-0">
                <CardHeader className="border-b border-border mb-4">
                    <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Ministry Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {data.ministryStats.length === 0 ? (
                        <p className="text-xs text-muted-foreground font-bold text-center py-4">No activity recorded</p>
                    ) : (
                        data.ministryStats.map((stat) => (
                            <div key={stat.name} className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-foreground/70">
                                    <span>{stat.name}</span>
                                    <span className="text-primary">{stat.count}</span>
                                </div>
                                <div className="h-2 w-full bg-muted rounded-full overflow-hidden shadow-inner">
                                    <div
                                        style={{ width: `${data.attendanceToday > 0 ? (stat.count / data.attendanceToday) * 100 : 0}%` }}
                                        className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                                    />
                                </div>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>

            <Card className="bg-card shadow-xl border-border flex flex-col max-h-[500px]">
                <CardHeader className="border-b border-border mb-4">
                    <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Network Participation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 flex-1 overflow-auto">
                    {data.networkStats.length === 0 ? (
                        <p className="text-xs text-muted-foreground font-bold text-center py-4">No activity recorded</p>
                    ) : (
                        data.networkStats.map((stat) => (
                            <div key={stat.name} className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-foreground/70">
                                    <span>{stat.name}</span>
                                    <span className="text-accent">{stat.count}</span>
                                </div>
                                <div className="h-2 w-full bg-muted rounded-full overflow-hidden shadow-inner">
                                    <div
                                        style={{ width: `${data.attendanceToday > 0 ? (stat.count / data.attendanceToday) * 100 : 0}%` }}
                                        className="h-full bg-accent rounded-full transition-all duration-1000 ease-out"
                                    />
                                </div>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>

            <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10 space-y-3 shrink-0">
                <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <h4 className="text-xs font-black uppercase tracking-widest text-primary">Insights</h4>
                </div>
                <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                    Participation is currently at <span className="text-foreground font-black">{data.totalUsers > 0 ? ((data.attendanceToday / data.totalUsers) * 100).toFixed(1) : 0}%</span> of the total registered church family.
                </p>
            </div>
        </div>
    );
}
