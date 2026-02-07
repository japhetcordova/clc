"use client";

import { trpc } from "@/lib/trpc/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCheck, Filter, Calendar, Sparkles, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { SortHeader } from "./sort-header";
import { useSearchParams } from "next/navigation";
import PaginationControls from "./pagination-controls";
import AdminClient from "./admin-client";
import { cn } from "@/lib/utils";

const REFETCH_INTERVAL = 5000; // 5 seconds

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface RealtimeAttendanceProps {
    initialData: any;
}

export default function RealtimeAttendance({ initialData }: RealtimeAttendanceProps) {
    const searchParams = useSearchParams();

    const page = Number(searchParams.get("page")) || 1;
    const ministry = searchParams.get("ministry") || "all";
    const network = searchParams.get("network") || "all";
    const gender = searchParams.get("gender") || "all";
    const cluster = searchParams.get("cluster") || "all";
    const date = searchParams.get("date") || initialData.filterDate;
    const atSort = searchParams.get("atSort") || undefined;
    const atOrder = (searchParams.get("atOrder") as "asc" | "desc") || "desc";

    const { data, isRefetching, isFetching } = trpc.getAdminDashboard.useQuery(
        {
            page,
            ministry: ministry !== "all" ? ministry : undefined,
            network: network !== "all" ? network : undefined,
            gender: gender !== "all" ? gender : undefined,
            cluster: cluster !== "all" ? cluster : undefined,
            date,
            atSort,
            atOrder,
        },
        {
            initialData,
            refetchInterval: REFETCH_INTERVAL,
            refetchIntervalInBackground: true,
        }
    );

    const isLive = !isFetching || isRefetching;

    return (
        <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-2xl border-border bg-card/50 backdrop-blur-xl rounded-[2rem] overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 py-4 sm:py-6 px-4 sm:px-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl">
                            <UserCheck className="w-5 h-5 text-primary" />
                        </div>
                        <CardTitle className="font-black text-lg sm:text-xl uppercase tracking-tighter">Live Attendance</CardTitle>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all",
                            isLive
                                ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                        )}>
                            {isRefetching ? (
                                <RefreshCw className="w-3 h-3 animate-spin" />
                            ) : isLive ? (
                                <Wifi className="w-3 h-3" />
                            ) : (
                                <WifiOff className="w-3 h-3" />
                            )}
                            {isRefetching ? "Syncing" : isLive ? "Live" : "Offline"}
                        </div>
                        <Filter className="w-5 h-5 text-muted-foreground opacity-50" />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="px-4 sm:px-8 pt-6">
                        <AdminClient
                            initialMinistry={ministry}
                            initialNetwork={network}
                            initialCluster={cluster}
                            initialGender={gender}
                            initialDate={data.filterDate}
                            attendanceData={data.attendanceList}
                        />
                    </div>

                    <div className="mt-6 border-t border-border/50">
                        <Table className="relative">
                            <TableHeader className="bg-muted/30">
                                <TableRow className="border-border hover:bg-transparent">
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest h-12 pl-4 sm:pl-8">
                                        <SortHeader label="Time/Member" sortKey="time" currentSort={atSort} currentOrder={atOrder} paramKey="atSort" orderParamKey="atOrder" />
                                    </TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest h-12 hidden sm:table-cell">
                                        <SortHeader label="Cluster" sortKey="cluster" currentSort={atSort} currentOrder={atOrder} paramKey="atSort" orderParamKey="atOrder" />
                                    </TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">
                                        <SortHeader label="Group" sortKey="ministry" currentSort={atSort} currentOrder={atOrder} paramKey="atSort" orderParamKey="atOrder" />
                                    </TableHead>
                                    <TableHead className="text-[10px] font-black uppercase tracking-widest h-12 text-right pr-4 sm:pr-8">
                                        <SortHeader label="Info" sortKey="network" className="justify-end" currentSort={atSort} currentOrder={atOrder} paramKey="atSort" orderParamKey="atOrder" />
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.paginatedList.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-40 text-center text-muted-foreground font-bold italic">
                                            Waiting for scans...
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    data.paginatedList.map((record) => (
                                        <TableRow key={record.id} className="border-border hover:bg-primary/5 transition-colors group">
                                            <TableCell className="pl-4 sm:pl-8 py-4">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="font-black text-sm sm:text-base text-foreground group-hover:text-primary transition-all flex items-center gap-1.5">
                                                        {record.user.firstName} {record.user.lastName}
                                                        {record.user.isPremium && (
                                                            <span className="inline-flex items-center gap-1 px-1 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-full">
                                                                <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                                                            </span>
                                                        )}
                                                    </span>
                                                    <span className="font-mono text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                                                        <Calendar className="w-2.5 h-2.5" />
                                                        {new Date(record.scannedAt).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', timeZone: "Asia/Manila" })}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                <span className="text-xs font-bold text-muted-foreground bg-muted/50 px-2 py-1 rounded-lg">
                                                    {record.user.cluster}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1.5">
                                                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[9px] font-black uppercase tracking-tight ring-1 ring-primary/20">
                                                        {record.user.ministry}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right pr-4 sm:pr-8 py-4">
                                                <div className="flex flex-col items-end gap-0.5">
                                                    <span className="text-xs font-bold text-foreground/80">{record.user.network}</span>
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">{record.user.gender}</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <PaginationControls currentPage={page} totalPages={data.totalPages} />
                </CardContent>
            </Card>
        </div>
    );
}
