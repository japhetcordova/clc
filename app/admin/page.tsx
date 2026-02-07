import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, UserCheck, Calendar, TrendingUp, Award, Tv } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AdminLogout from "@/app/admin/logout-button";
import PaginationControls from "@/app/admin/pagination-controls";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { PieChart, BarChart3, Map, Heart, Sparkles } from "lucide-react";
import { SortHeader } from "./sort-header";
import { TabSwitcher } from "./tab-switcher";
import { trpcServer } from "@/lib/trpc/server";
import WeeklyTrendsChart from "./weekly-trends-chart";
import DemographicsDoubleRing from "./demographics-double-ring";
import MemberSearch from "./member-search";
import MobileHighlightsClient from "./mobile-highlights-client";
import AnnouncementsAdminClient from "./announcements-admin-client";
import CellGroupAdminClient from "./cell-group-admin-client";
import G12JourneyAdminClient from "./g12-journey-admin-client";
import RealtimeAttendance from "./realtime-attendance";
import RealtimeStats from "./realtime-stats";
import RealtimeSidebar from "./realtime-sidebar";

import { cache } from "react";

// Optimal caching for instant loads without breaking dynamic behavior
export const revalidate = 60; // Cache for 60 seconds
export const fetchCache = 'default-cache'; // Prefer cache over network
export const preferredRegion = 'auto'; // Deploy to optimal region

// Cache expensive data fetches for the duration of the request
const getAdminData = cache(async (params: {
    date?: string;
    ministry?: string;
    network?: string;
    gender?: string;
    cluster?: string;
    page: number;
    atSort?: string;
    atOrder?: "asc" | "desc";
    memSort?: string;
    memOrder?: "asc" | "desc";
    search?: string;
}) => {
    const caller = await trpcServer();
    return caller.getAdminDashboard(params);
});

const getWeeklyTrendsData = cache(async () => {
    const caller = await trpcServer();
    return caller.getWeeklyTrends();
});

export default async function AdminDashboard({
    searchParams,
}: {
    searchParams: Promise<{
        date?: string;
        ministry?: string;
        network?: string;
        gender?: string;
        cluster?: string;
        page?: string;
        atSort?: string;
        atOrder?: "asc" | "desc";
        memSort?: string;
        memOrder?: "asc" | "desc";
        tab?: string;
        search?: string;
    }>;
}) {
    const params = await searchParams;

    const [data, weeklyTrends] = await Promise.all([
        getAdminData({
            date: params.date,
            ministry: params.ministry,
            network: params.network,
            gender: params.gender,
            cluster: params.cluster,
            page: Number(params.page) || 1,
            atSort: params.atSort,
            atOrder: params.atOrder,
            memSort: params.memSort,
            memOrder: params.memOrder,
            search: params.search,
        }),
        getWeeklyTrendsData(),
    ]);

    const page = Number(params.page) || 1;

    return (
        <div className="p-2 sm:p-4 md:p-6 space-y-6 sm:space-y-8 w-full min-h-screen bg-background text-foreground transition-colors duration-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">Admin Dashboard</h1>
                    <p className="text-xs sm:text-sm text-muted-foreground font-medium">Global church attendance and member engagement records.</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="flex-1 sm:flex-none bg-primary/5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl flex items-center justify-center gap-2 border border-primary/10 ring-1 ring-primary/5 shadow-inner">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="font-bold text-xs sm:text-sm text-foreground whitespace-nowrap">{data.filterDate}</span>
                    </div>
                    <Link href="/admin/watch">
                        <Button variant="outline" size="icon" className="rounded-2xl border-primary/20 bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all shadow-lg shadow-primary/5">
                            <Tv className="w-4 h-4" />
                        </Button>
                    </Link>
                    <AdminLogout />
                </div>
            </div>

            <Tabs value={params.tab || "attendance"} className="space-y-6 sm:space-y-8">
                <TabSwitcher />

                <TabsContent value="attendance" className="space-y-6 sm:space-y-8 animate-in fade-in zoom-in-95 duration-500">

                    <RealtimeStats initialData={data} />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 pb-10 items-start">
                        <RealtimeAttendance initialData={data} />
                        <RealtimeSidebar initialData={data} />
                    </div>
                </TabsContent>

                <TabsContent value="demographics" className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                        <Card className="bg-card/50 border-border rounded-3xl">
                            <CardHeader className="pb-2 p-4 sm:p-6">
                                <CardTitle className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <PieChart className="w-4 h-4 text-primary" />
                                    Gender
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 sm:p-6 pt-0">
                                <div className="space-y-3">
                                    {data.totalGenderStats.map(stat => (
                                        <div key={stat.name} className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-foreground/80">{stat.name}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm sm:text-lg font-black">{stat.count}</span>
                                                <span className="text-[8px] font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                                                    {((stat.count / data.totalUsers) * 100).toFixed(0)}%
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-card/50 border-border rounded-3xl">
                            <CardHeader className="pb-2 p-4 sm:p-6">
                                <CardTitle className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <Map className="w-4 h-4 text-accent" />
                                    Clusters
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 sm:p-6 pt-0">
                                <div className="space-y-3">
                                    {data.totalClusterStats.map(stat => (
                                        <div key={stat.name} className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-foreground/80">{stat.name}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm sm:text-lg font-black">{stat.count}</span>
                                                <span className="text-[8px] font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                                                    {((stat.count / data.totalUsers) * 100).toFixed(0)}%
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <div className="col-span-2 p-4 sm:p-8 bg-accent/5 rounded-3xl border border-accent/10 flex flex-col justify-center gap-3">
                            <div className="flex items-center gap-2">
                                <Award className="w-5 h-5 text-accent" />
                                <h4 className="text-xs sm:text-sm font-black uppercase tracking-widest text-accent">Registration Insight</h4>
                            </div>
                            <p className="text-xs sm:text-sm font-medium text-muted-foreground leading-relaxed">
                                Your church family now consists of <span className="text-foreground font-black">{data.totalUsers}</span> registered members across <span className="text-foreground font-black">2 Clusters</span> and <span className="text-foreground font-black">{data.totalNetworkStats.length}</span> individual cell networks.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 pap-10">
                        {/* Registered by Ministry */}
                        <Card className="bg-card shadow-2xl border-border rounded-[2rem] overflow-hidden">
                            <CardHeader className="bg-muted/30 border-b border-border py-4 sm:py-6 px-6 sm:px-8">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-xs sm:text-sm font-black uppercase tracking-tighter flex items-center gap-2">
                                        <Heart className="w-4 h-4 text-rose-500" />
                                        Ministry Distribution
                                    </CardTitle>
                                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground">Global Count</span>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 sm:p-8 space-y-3 h-[500px] sm:h-[600px] overflow-y-auto custom-scrollbar">
                                {data.totalMinistryStats.map((stat) => (
                                    <div key={stat.name} className="space-y-2">
                                        <div className="flex justify-between text-[10px] sm:text-[11px] font-black uppercase tracking-tight text-foreground/80">
                                            <span>{stat.name}</span>
                                            <span className="text-rose-500">{stat.count} members</span>
                                        </div>
                                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                            <div
                                                style={{ width: `${(stat.count / data.totalUsers) * 100}%` }}
                                                className="h-full bg-rose-500 rounded-full transition-all duration-1000 ease-out"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Registered by Network */}
                        <Card className="bg-card shadow-2xl border-border rounded-[2rem] overflow-hidden">
                            <CardHeader className="bg-muted/30 border-b border-border py-4 sm:py-6 px-6 sm:px-8">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-xs sm:text-sm font-black uppercase tracking-tighter flex items-center gap-2">
                                        <BarChart3 className="w-4 h-4 text-blue-500" />
                                        Network Breakdown
                                    </CardTitle>
                                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground">Reach</span>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 sm:p-8 space-y-3 h-[500px] sm:h-[600px] overflow-y-auto custom-scrollbar">
                                {data.totalNetworkStats.map((stat) => (
                                    <div key={stat.name} className="space-y-2">
                                        <div className="flex justify-between text-[10px] sm:text-[11px] font-black uppercase tracking-tight text-foreground/80">
                                            <span>{stat.name}</span>
                                            <span className="text-blue-500">{stat.count} members</span>
                                        </div>
                                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                            <div
                                                style={{ width: `${(stat.count / data.totalUsers) * 100}%` }}
                                                className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                </TabsContent>

                <TabsContent value="members" className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                    <Card className="shadow-2xl border-border bg-card/50 backdrop-blur-xl rounded-[2rem] overflow-hidden">
                        <CardHeader className="flex flex-col md:flex-row items-center justify-between border-b border-border/50 py-4 sm:py-6 px-4 sm:px-8 gap-4">
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <div className="p-2 bg-blue-600/10 rounded-xl">
                                    <Users className="w-5 h-5 text-blue-600" />
                                </div>
                                <CardTitle className="font-black text-lg sm:text-xl uppercase tracking-tighter">Registered Members</CardTitle>
                            </div>

                            <div className="flex flex-col-reverse sm:flex-row items-center gap-3 w-full md:w-auto">
                                <MemberSearch />
                                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted/50 px-3 py-1 rounded-full border border-border shrink-0 ml-auto sm:ml-0">
                                    {data.totalMembersCount} Total
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-muted/30">
                                        <TableRow className="border-border hover:bg-transparent">
                                            <TableHead className="text-[10px] font-black uppercase tracking-widest h-12 pl-4 sm:pl-8">
                                                <SortHeader label="Member Name" sortKey="name" currentSort={params.memSort} currentOrder={params.memOrder} paramKey="memSort" orderParamKey="memOrder" />
                                            </TableHead>
                                            <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">
                                                <SortHeader label="Contact" sortKey="contact" currentSort={params.memSort} currentOrder={params.memOrder} paramKey="memSort" orderParamKey="memOrder" />
                                            </TableHead>
                                            <TableHead className="text-[10px] font-black uppercase tracking-widest h-12 hidden sm:table-cell">
                                                <SortHeader label="Details" sortKey="gender" currentSort={params.memSort} currentOrder={params.memOrder} paramKey="memSort" orderParamKey="memOrder" />
                                            </TableHead>
                                            <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">
                                                <SortHeader label="Groups" sortKey="ministry" currentSort={params.memSort} currentOrder={params.memOrder} paramKey="memSort" orderParamKey="memOrder" />
                                            </TableHead>
                                            <TableHead className="text-[10px] font-black uppercase tracking-widest h-12 text-right pr-4 sm:pr-8">
                                                <SortHeader label="Joined" sortKey="joined" className="justify-end" currentSort={params.memSort} currentOrder={params.memOrder} paramKey="memSort" orderParamKey="memOrder" />
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {data.paginatedMembers.map((member) => (
                                            <TableRow key={member.id} className="border-border hover:bg-blue-600/5 transition-colors group">
                                                <TableCell className="pl-4 sm:pl-8 py-4">
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="font-black text-sm sm:text-base text-foreground group-hover:text-blue-600 transition-all flex items-center gap-1.5">
                                                            {member.firstName} {member.lastName}
                                                            {member.isPremium && (
                                                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-full">
                                                                    <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                                                                </span>
                                                            )}
                                                        </span>
                                                        <span className="text-[9px] font-bold text-muted-foreground uppercase">
                                                            ID: {member.qrCodeId}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-xs font-bold text-foreground/80">{member.contactNumber}</span>
                                                        {member.email && <span className="text-[9px] text-muted-foreground truncate max-w-[150px]">{member.email}</span>}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden sm:table-cell">
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">{member.gender}</span>
                                                        <span className="text-[10px] font-bold text-primary">{member.cluster}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[9px] font-black uppercase tracking-tight ring-1 ring-primary/20">
                                                            {member.ministry}
                                                        </span>
                                                        <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[9px] font-black uppercase tracking-tight ring-1 ring-accent/20">
                                                            {member.network}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right pr-4 sm:pr-8 py-4">
                                                    <span className="text-[10px] font-mono font-bold text-muted-foreground">
                                                        {new Date(member.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            <PaginationControls currentPage={page} totalPages={data.totalMemberPages} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="trends" className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <WeeklyTrendsChart data={weeklyTrends} />

                    <DemographicsDoubleRing
                        networkStats={data.trendNetworkStats}
                        ministryStats={data.trendMinistryStats}
                        periodCount={weeklyTrends.length}
                    />
                </TabsContent>

                <TabsContent value="highlights" className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
                    <MobileHighlightsClient />
                </TabsContent>

                <TabsContent value="announcements" className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <AnnouncementsAdminClient />
                </TabsContent>

                <TabsContent value="cell-groups" className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
                    <CellGroupAdminClient />
                </TabsContent>

                <TabsContent value="g12-journey" className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <G12JourneyAdminClient />
                </TabsContent>
            </Tabs>
        </div>
    );

}
