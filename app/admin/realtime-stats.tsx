"use client";

import { trpc } from "@/lib/trpc/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, Award, TrendingUp } from "lucide-react";
import { useSearchParams } from "next/navigation";

const REFETCH_INTERVAL = 5000; // 5 seconds

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface RealtimeStatsProps {
    initialData: any;
}

export default function RealtimeStats({ initialData }: RealtimeStatsProps) {
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

    const topMinistry = data.ministryStats.length > 0
        ? data.ministryStats.sort((a, b) => b.count - a.count)[0]
        : null;

    const topNetwork = data.networkStats.length > 0
        ? data.networkStats.sort((a, b) => b.count - a.count)[0]
        : null;

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
            <Card className="shadow-xl shadow-primary/5 border-primary/10 bg-linear-to-br from-primary/10 to-transparent backdrop-blur-sm rounded-3xl">
                <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2 p-3 sm:p-6">
                    <CardTitle className="text-[9px] sm:text-xs font-black uppercase tracking-widest text-muted-foreground">Registered</CardTitle>
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </CardHeader>
                <CardContent className="p-3 sm:p-6 pt-0">
                    <div className="text-2xl sm:text-4xl font-black text-foreground">{data.totalUsers}</div>
                    <p className="text-[8px] sm:text-[10px] font-bold text-muted-foreground uppercase mt-0.5 sm:mt-1 tracking-tighter">Members</p>
                </CardContent>
            </Card>

            <Card className="shadow-xl shadow-accent/5 border-accent/10 bg-linear-to-br from-accent/10 to-transparent backdrop-blur-sm rounded-3xl">
                <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2 p-3 sm:p-6">
                    <CardTitle className="text-[9px] sm:text-xs font-black uppercase tracking-widest text-muted-foreground">Scanned</CardTitle>
                    <UserCheck className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                </CardHeader>
                <CardContent className="p-3 sm:p-6 pt-0">
                    <div className="text-2xl sm:text-4xl font-black text-foreground">{data.attendanceToday}</div>
                    <p className="text-[8px] sm:text-[10px] font-bold text-muted-foreground uppercase mt-0.5 sm:mt-1 tracking-tighter">Unique</p>
                </CardContent>
            </Card>

            <Card className="shadow-lg border-border bg-card rounded-3xl">
                <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2 p-3 sm:p-6">
                    <CardTitle className="text-[9px] sm:text-xs font-black uppercase tracking-widest text-muted-foreground">Top Min</CardTitle>
                    <Award className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </CardHeader>
                <CardContent className="p-3 sm:p-6 pt-0">
                    <div className="text-base sm:text-xl font-black truncate text-foreground leading-tight">
                        {topMinistry ? topMinistry.name : "---"}
                    </div>
                    <p className="text-[8px] sm:text-[10px] font-bold text-muted-foreground uppercase mt-0.5 sm:mt-1 tracking-tighter">Leading Participation</p>
                </CardContent>
            </Card>

            <Card className="shadow-lg border-border bg-card rounded-3xl">
                <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2 p-3 sm:p-6">
                    <CardTitle className="text-[9px] sm:text-xs font-black uppercase tracking-widest text-muted-foreground">Top Net</CardTitle>
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                </CardHeader>
                <CardContent className="p-3 sm:p-6 pt-0">
                    <div className="text-base sm:text-xl font-black truncate text-foreground leading-tight">
                        {topNetwork ? topNetwork.name : "---"}
                    </div>
                    <p className="text-[8px] sm:text-[10px] font-bold text-muted-foreground uppercase mt-0.5 sm:mt-1 tracking-tighter">Collective Reach</p>
                </CardContent>
            </Card>
        </div>
    );
}
