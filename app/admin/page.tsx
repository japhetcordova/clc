import { db } from "@/db";
import { users, attendance } from "@/db/schema";
import { count, eq, sql, and, gte, lte } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, UserCheck, Calendar, Filter, TrendingUp, Award } from "lucide-react";
import AdminClient from "@/app/admin/admin-client";
import AdminLogout from "@/app/admin/logout-button";
import { motion } from "framer-motion";

export default async function AdminDashboard({
    searchParams,
}: {
    searchParams: { date?: string; ministry?: string; network?: string; gender?: string; cluster?: string };
}) {
    const params = await searchParams;
    const filterDate = params.date || new Date().toISOString().split("T")[0];

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

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto min-h-screen bg-background text-foreground transition-colors duration-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-foreground">Admin Dashboard</h1>
                    <p className="text-muted-foreground font-medium">Global community attendance and member engagement records.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-primary/5 px-4 py-2.5 rounded-2xl flex items-center gap-2 border border-primary/10 ring-1 ring-primary/5 shadow-inner">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="font-bold text-sm text-foreground">{filterDate}</span>
                    </div>
                    <AdminLogout />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="shadow-xl shadow-primary/5 border-primary/10 bg-linear-to-br from-primary/10 to-transparent backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Total Registered</CardTitle>
                        <Users className="h-5 w-5 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-foreground">{totalUsers.value}</div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1 tracking-tighter">Community Members</p>
                    </CardContent>
                </Card>

                <Card className="shadow-xl shadow-accent/5 border-accent/10 bg-linear-to-br from-accent/10 to-transparent backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Attendance Today</CardTitle>
                        <UserCheck className="h-5 w-5 text-accent" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-foreground">{attendanceToday.value}</div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1 tracking-tighter">Unique Scans</p>
                    </CardContent>
                </Card>

                <Card className="shadow-lg border-border bg-card">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Top Ministry</CardTitle>
                        <Award className="h-5 w-5 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-black truncate text-foreground">
                            {ministryStats.length > 0 ? (
                                `${ministryStats.sort((a, b) => b.count - a.count)[0].name}`
                            ) : "No data"}
                        </div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1 tracking-tighter">Highest Participation</p>
                    </CardContent>
                </Card>

                <Card className="shadow-lg border-border bg-card">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Top Network</CardTitle>
                        <TrendingUp className="h-5 w-5 text-accent" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl font-black truncate text-foreground">
                            {networkStats.length > 0 ? (
                                `${networkStats.sort((a, b) => b.count - a.count)[0].name}`
                            ) : "No data"}
                        </div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1 tracking-tighter">Leading Collective</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
                <div className="lg:col-span-2">
                    <Card className="shadow-2xl border-border bg-card/50 backdrop-blur-xl">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-border mb-6">
                            <CardTitle className="font-black text-xl">Attendance Records</CardTitle>
                            <Filter className="w-5 h-5 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <AdminClient
                                initialMinistry={params.ministry || "all"}
                                initialNetwork={params.network || "all"}
                                initialCluster={params.cluster || "all"}
                                initialGender={params.gender || "all"}
                                initialDate={filterDate}
                            />

                            <div className="rounded-2xl border border-border mt-8 overflow-hidden shadow-inner">
                                <Table>
                                    <TableHeader className="bg-muted/50">
                                        <TableRow className="border-border hover:bg-transparent">
                                            <TableHead className="text-xs font-black uppercase tracking-widest h-12">Time</TableHead>
                                            <TableHead className="text-xs font-black uppercase tracking-widest h-12">Member</TableHead>
                                            <TableHead className="text-xs font-black uppercase tracking-widest h-12">Cluster</TableHead>
                                            <TableHead className="text-xs font-black uppercase tracking-widest h-12">Ministry</TableHead>
                                            <TableHead className="text-xs font-black uppercase tracking-widest h-12">Network</TableHead>
                                            <TableHead className="text-xs font-black uppercase tracking-widest h-12 text-right pr-6">Gender</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {attendanceList.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground font-bold">
                                                    No scans found for the selected criteria.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            attendanceList.map((record) => (
                                                <TableRow key={record.id} className="border-border hover:bg-muted/30 transition-colors">
                                                    <TableCell className="font-mono text-[10px] font-bold text-muted-foreground uppercase">
                                                        {new Date(record.scannedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </TableCell>
                                                    <TableCell className="font-black text-foreground">
                                                        {record.user.firstName} {record.user.lastName}
                                                    </TableCell>
                                                    <TableCell className="text-xs font-bold text-muted-foreground">{record.user.cluster}</TableCell>
                                                    <TableCell>
                                                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider ring-1 ring-primary/20">
                                                            {record.user.ministry}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-sm font-bold text-foreground/80">{record.user.network}</TableCell>
                                                    <TableCell className="text-sm font-medium text-muted-foreground text-right pr-6">{record.user.gender}</TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-8">
                    <Card className="bg-card shadow-xl border-border">
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
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(stat.count / attendanceToday.value) * 100}%` }}
                                                className="h-full bg-primary rounded-full"
                                                transition={{ duration: 1, ease: "easeOut" }}
                                            />
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    <Card className="bg-card shadow-xl border-border">
                        <CardHeader className="border-b border-border mb-4">
                            <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Network Participation</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
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
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(stat.count / attendanceToday.value) * 100}%` }}
                                                className="h-full bg-accent rounded-full"
                                                transition={{ duration: 1, ease: "easeOut" }}
                                            />
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10 space-y-3">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-primary" />
                            <h4 className="text-xs font-black uppercase tracking-widest text-primary">Insights</h4>
                        </div>
                        <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                            Participation is currently at <span className="text-foreground font-black">{attendanceToday.value > 0 ? ((attendanceToday.value / totalUsers.value) * 100).toFixed(1) : 0}%</span> of the total registered community.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
