import { db } from "@/db";
import { users, attendance } from "@/db/schema";
import { count, eq, sql, and, gte, lte, desc } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, UserCheck, Calendar, Filter, TrendingUp, Award } from "lucide-react";
import AdminClient from "@/app/admin/admin-client";
import AdminLogout from "@/app/admin/logout-button";
import PaginationControls from "@/app/admin/pagination-controls";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, Users2, PieChart, BarChart3, Map, Heart } from "lucide-react";

import { getTodayString } from "@/lib/date-utils";

export default async function AdminDashboard({
    searchParams,
}: {
    searchParams: { date?: string; ministry?: string; network?: string; gender?: string; cluster?: string; page?: string };
}) {
    const params = await searchParams;
    const filterDate = params.date || getTodayString();

    // Fetch Stats
    const [totalUsers] = await db.select({ value: count() }).from(users);
    const [attendanceToday] = await db.select({ value: count() })
        .from(attendance)
        .where(eq(attendance.scanDate, filterDate));

    // Fetch Attendance Records for the table
    const filters = [eq(attendance.scanDate, filterDate)];
    if (params.ministry && params.ministry !== "all") {
        filters.push(eq(users.ministry, params.ministry));
    }
    if (params.network && params.network !== "all") {
        filters.push(eq(users.network, params.network));
    }
    if (params.gender && params.gender !== "all") {
        filters.push(eq(users.gender, params.gender));
    }
    if (params.cluster && params.cluster !== "all") {
        filters.push(eq(users.cluster, params.cluster));
    }

    const attendanceList = await db.select({
        id: attendance.id,
        scannedAt: attendance.scannedAt,
        user: {
            firstName: users.firstName,
            lastName: users.lastName,
            ministry: users.ministry,
            network: users.network,
            cluster: users.cluster,
            gender: users.gender,
        }
    })
        .from(attendance)
        .innerJoin(users, eq(attendance.userId, users.id))
        .where(and(...filters))
        .orderBy(sql`${attendance.scannedAt} DESC`);

    // Pagination Logic
    const page = Number(params.page) || 1;
    const pageSize = 15;
    const totalRecords = attendanceList.length;
    const totalPages = Math.ceil(totalRecords / pageSize);
    const paginatedList = attendanceList.slice((page - 1) * pageSize, page * pageSize);

    // aggregation for charts (Filtered)
    const ministryStats = await db.select({
        name: users.ministry,
        count: count(),
    })
        .from(attendance)
        .innerJoin(users, eq(attendance.userId, users.id))
        .where(and(...filters))
        .groupBy(users.ministry);

    const networkStats = await db.select({
        name: users.network,
        count: count(),
    })
        .from(attendance)
        .innerJoin(users, eq(attendance.userId, users.id))
        .where(and(...filters))
        .groupBy(users.network);

    // --- NEW: TOTAL REGISTRATION STATS (Demographics) ---
    const totalMinistryStats = await db.select({
        name: users.ministry,
        count: count(),
    })
        .from(users)
        .groupBy(users.ministry)
        .orderBy(desc(count()));

    const totalNetworkStats = await db.select({
        name: users.network,
        count: count(),
    })
        .from(users)
        .groupBy(users.network)
        .orderBy(desc(count()));

    const totalGenderStats = await db.select({
        name: users.gender,
        count: count(),
    })
        .from(users)
        .groupBy(users.gender);

    const totalClusterStats = await db.select({
        name: users.cluster,
        count: count(),
    })
        .from(users)
        .groupBy(users.cluster);

    return (
        <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 max-w-7xl mx-auto min-h-screen bg-background text-foreground transition-colors duration-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">Admin Dashboard</h1>
                    <p className="text-xs sm:text-sm text-muted-foreground font-medium">Global church attendance and member engagement records.</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="flex-1 sm:flex-none bg-primary/5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl flex items-center justify-center gap-2 border border-primary/10 ring-1 ring-primary/5 shadow-inner">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="font-bold text-xs sm:text-sm text-foreground whitespace-nowrap">{filterDate}</span>
                    </div>
                    <AdminLogout />
                </div>
            </div>

            <Tabs defaultValue="attendance" className="space-y-6 sm:space-y-8">
                <div className="bg-muted/30 p-1.5 rounded-2xl inline-flex ring-1 ring-border w-full sm:w-auto overflow-x-auto no-scrollbar">
                    <TabsList className="bg-transparent gap-1.5 h-11 w-full sm:w-auto">
                        <TabsTrigger
                            value="attendance"
                            className="flex-1 sm:flex-none rounded-xl font-black uppercase text-[9px] sm:text-[10px] tracking-widest gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg h-8 px-4"
                        >
                            <UserCheck className="w-3.5 h-3.5" />
                            Attendance
                        </TabsTrigger>
                        <TabsTrigger
                            value="demographics"
                            className="flex-1 sm:flex-none rounded-xl font-black uppercase text-[9px] sm:text-[10px] tracking-widest gap-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-lg h-8 px-4"
                        >
                            <Users2 className="w-3.5 h-3.5" />
                            Demographics
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="attendance" className="space-y-6 sm:space-y-8 animate-in fade-in zoom-in-95 duration-500">

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                        <Card className="shadow-xl shadow-primary/5 border-primary/10 bg-linear-to-br from-primary/10 to-transparent backdrop-blur-sm rounded-3xl">
                            <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2 p-3 sm:p-6">
                                <CardTitle className="text-[9px] sm:text-xs font-black uppercase tracking-widest text-muted-foreground">Registered</CardTitle>
                                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                            </CardHeader>
                            <CardContent className="p-3 sm:p-6 pt-0">
                                <div className="text-2xl sm:text-4xl font-black text-foreground">{totalUsers.value}</div>
                                <p className="text-[8px] sm:text-[10px] font-bold text-muted-foreground uppercase mt-0.5 sm:mt-1 tracking-tighter">Members</p>
                            </CardContent>
                        </Card>

                        <Card className="shadow-xl shadow-accent/5 border-accent/10 bg-linear-to-br from-accent/10 to-transparent backdrop-blur-sm rounded-3xl">
                            <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2 p-3 sm:p-6">
                                <CardTitle className="text-[9px] sm:text-xs font-black uppercase tracking-widest text-muted-foreground">Scanned</CardTitle>
                                <UserCheck className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                            </CardHeader>
                            <CardContent className="p-3 sm:p-6 pt-0">
                                <div className="text-2xl sm:text-4xl font-black text-foreground">{attendanceToday.value}</div>
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
                                    {ministryStats.length > 0 ? (
                                        `${ministryStats.sort((a, b) => b.count - a.count)[0].name}`
                                    ) : "---"}
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
                                    {networkStats.length > 0 ? (
                                        `${networkStats.sort((a, b) => b.count - a.count)[0].name}`
                                    ) : "---"}
                                </div>
                                <p className="text-[8px] sm:text-[10px] font-bold text-muted-foreground uppercase mt-0.5 sm:mt-1 tracking-tighter">Collective Reach</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 pb-10">
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="shadow-2xl border-border bg-card/50 backdrop-blur-xl rounded-[2rem] overflow-hidden">
                                <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 py-4 sm:py-6 px-4 sm:px-8">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-primary/10 rounded-xl">
                                            <UserCheck className="w-5 h-5 text-primary" />
                                        </div>
                                        <CardTitle className="font-black text-lg sm:text-xl uppercase tracking-tighter">Live Attendance</CardTitle>
                                    </div>
                                    <Filter className="w-5 h-5 text-muted-foreground opacity-50" />
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="px-4 sm:px-8 pt-6">
                                        <AdminClient
                                            initialMinistry={params.ministry || "all"}
                                            initialNetwork={params.network || "all"}
                                            initialCluster={params.cluster || "all"}
                                            initialGender={params.gender || "all"}
                                            initialDate={filterDate}
                                            attendanceData={attendanceList}
                                        />
                                    </div>

                                    <div className="mt-6 border-t border-border/50">
                                        <Table className="relative">
                                            <TableHeader className="bg-muted/30">
                                                <TableRow className="border-border hover:bg-transparent">
                                                    <TableHead className="text-[10px] font-black uppercase tracking-widest h-12 pl-4 sm:pl-8">Time/Member</TableHead>
                                                    <TableHead className="text-[10px] font-black uppercase tracking-widest h-12 hidden sm:table-cell">Cluster</TableHead>
                                                    <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Group</TableHead>
                                                    <TableHead className="text-[10px] font-black uppercase tracking-widest h-12 text-right pr-4 sm:pr-8">Info</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {paginatedList.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={4} className="h-40 text-center text-muted-foreground font-bold italic">
                                                            Waiting for scans...
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    paginatedList.map((record) => (
                                                        <TableRow key={record.id} className="border-border hover:bg-primary/5 transition-colors group">
                                                            <TableCell className="pl-4 sm:pl-8 py-4">
                                                                <div className="flex flex-col gap-0.5">
                                                                    <span className="font-black text-sm sm:text-base text-foreground group-hover:text-primary transition-colors">
                                                                        {record.user.firstName} {record.user.lastName}
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
                                    <PaginationControls currentPage={page} totalPages={totalPages} />
                                </CardContent>
                            </Card>
                        </div>

                        <div className="flex flex-col gap-6 sm:gap-8 h-full">
                            <Card className="bg-card shadow-xl border-border shrink-0">
                                <CardHeader className="border-b border-border mb-4">
                                    <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Ministry Breakdown</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {ministryStats.length === 0 ? (
                                        <p className="text-xs text-muted-foreground font-bold text-center py-4">No activity recorded</p>
                                    ) : (
                                        ministryStats.map((stat) => (
                                            <div key={stat.name} className="space-y-2">
                                                <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-foreground/70">
                                                    <span>{stat.name}</span>
                                                    <span className="text-primary">{stat.count}</span>
                                                </div>
                                                <div className="h-2 w-full bg-muted rounded-full overflow-hidden shadow-inner">
                                                    <div
                                                        style={{ width: `${(stat.count / attendanceToday.value) * 100}%` }}
                                                        className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                                                    />
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </CardContent>
                            </Card>

                            <Card className="bg-card shadow-xl border-border h-[34%] flex flex-col min-h-0">
                                <CardHeader className="border-b border-border mb-4">
                                    <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Network Participation</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6 flex-1 overflow-auto">
                                    {networkStats.length === 0 ? (
                                        <p className="text-xs text-muted-foreground font-bold text-center py-4">No activity recorded</p>
                                    ) : (
                                        networkStats.map((stat) => (
                                            <div key={stat.name} className="space-y-2">
                                                <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-foreground/70">
                                                    <span>{stat.name}</span>
                                                    <span className="text-accent">{stat.count}</span>
                                                </div>
                                                <div className="h-2 w-full bg-muted rounded-full overflow-hidden shadow-inner">
                                                    <div
                                                        style={{ width: `${(stat.count / attendanceToday.value) * 100}%` }}
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
                                    Participation is currently at <span className="text-foreground font-black">{attendanceToday.value > 0 ? ((attendanceToday.value / totalUsers.value) * 100).toFixed(1) : 0}%</span> of the total registered church family.
                                </p>
                            </div>
                        </div>
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
                                    {totalGenderStats.map(stat => (
                                        <div key={stat.name} className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-foreground/80">{stat.name}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm sm:text-lg font-black">{stat.count}</span>
                                                <span className="text-[8px] font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                                                    {((stat.count / totalUsers.value) * 100).toFixed(0)}%
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
                                    {totalClusterStats.map(stat => (
                                        <div key={stat.name} className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-foreground/80">{stat.name}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm sm:text-lg font-black">{stat.count}</span>
                                                <span className="text-[8px] font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                                                    {((stat.count / totalUsers.value) * 100).toFixed(0)}%
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
                            <p className="text-xs sm:text-sm font-medium text-muted-foreground leading-relaxed max-w-md">
                                Your church family now consists of <span className="text-foreground font-black">{totalUsers.value}</span> registered members across <span className="text-foreground font-black">2 Clusters</span> and <span className="text-foreground font-black">{totalNetworkStats.length}</span> individual cell networks.
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
                            <CardContent className="p-6 sm:p-8 space-y-5">
                                {totalMinistryStats.map((stat) => (
                                    <div key={stat.name} className="space-y-2">
                                        <div className="flex justify-between text-[10px] sm:text-[11px] font-black uppercase tracking-tight text-foreground/80">
                                            <span>{stat.name}</span>
                                            <span className="text-rose-500">{stat.count} members</span>
                                        </div>
                                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                            <div
                                                style={{ width: `${(stat.count / totalUsers.value) * 100}%` }}
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
                            <CardContent className="p-4 sm:p-8 space-y-3 max-h-[500px] sm:max-h-[600px] overflow-y-auto custom-scrollbar">
                                {totalNetworkStats.map((stat) => (
                                    <div key={stat.name} className="flex items-center justify-between p-3 sm:p-4 rounded-2xl bg-muted/20 border border-border/50 hover:bg-muted/40 transition-colors">
                                        <div className="space-y-1">
                                            <p className="text-[10px] sm:text-xs font-black uppercase tracking-tight">{stat.name}</p>
                                            <div className="h-1 w-24 sm:w-32 bg-muted rounded-full">
                                                <div
                                                    className="h-full bg-blue-500 rounded-full"
                                                    style={{ width: `${(stat.count / totalUsers.value) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-base sm:text-lg font-black text-blue-600 leading-none">{stat.count}</p>
                                            <p className="text-[8px] sm:text-[9px] font-bold text-muted-foreground uppercase">{((stat.count / totalUsers.value) * 100).toFixed(1)}%</p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
