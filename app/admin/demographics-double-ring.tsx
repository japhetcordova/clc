"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { ChartPie, User } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { trpc } from "@/lib/trpc/client";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DemographicsDoubleRingProps {
    networkStats: Array<{ name: string; count: number }>;
    ministryStats: Array<{ name: string; count: number }>;
    periodCount: number;
}

const COLORS_NETWORKS = [
    'var(--chart-1)',
    'var(--chart-2)',
    'var(--chart-3)',
    'var(--chart-4)',
    'var(--chart-5)',
    'var(--accent)',
];

const COLORS_MINISTRIES = [
    'var(--primary)',
    'var(--secondary)',
    'var(--muted-foreground)',
    'var(--destructive)',
    'var(--foreground)',
];

export default function DemographicsDoubleRing({ networkStats, ministryStats, periodCount }: DemographicsDoubleRingProps) {
    const hasData = (networkStats?.length > 0) || (ministryStats?.length > 0);
    const [selectedSlice, setSelectedSlice] = useState<{ type: 'network' | 'ministry', value: string, count: number } | null>(null);

    // Query for member details - only runs when a slice is selected
    const { data: memberDetails, isLoading } = trpc.getTrendMemberDetails.useQuery(
        {
            type: selectedSlice?.type || 'network',
            value: selectedSlice?.value || ''
        },
        {
            enabled: !!selectedSlice,
        }
    );

    // Custom Tooltip
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            const isNetwork = networkStats?.some(n => n.name === data.name);

            return (
                <div className="bg-card/95 backdrop-blur-md border border-border/50 p-3 rounded-xl shadow-xl z-50">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                        {isNetwork ? "Network" : "Ministry"}
                    </p>
                    <p className="text-sm font-black text-foreground mb-1">{data.name}</p>
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-primary">{data.count}</span>
                        <span className="text-xs font-medium text-muted-foreground">Members</span>
                    </div>
                </div>
            );
        }
        return null;
    };

    if (!hasData) {
        return (
            <Card className="shadow-2xl border-border bg-card/50 backdrop-blur-xl rounded-[2rem] overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 py-4 sm:py-6 px-4 sm:px-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl">
                            <ChartPie className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="font-black text-lg sm:text-xl uppercase tracking-tighter">
                                Composition
                            </CardTitle>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="h-[200px] flex items-center justify-center">
                    <p className="text-muted-foreground font-medium">No demographic data available yet.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Networks Chart */}
                <Card className="shadow-2xl border-border bg-card/50 backdrop-blur-xl rounded-[2rem] overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 py-4 sm:py-6 px-4 sm:px-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-accent/10 rounded-xl">
                                <ChartPie className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                                <CardTitle className="font-black text-lg sm:text-xl uppercase tracking-tighter">
                                    Networks
                                </CardTitle>
                                <p className="text-xs text-muted-foreground font-medium mt-1">
                                    Distribution of unique attendees by Network across the last {periodCount} events
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-8">
                        <div className="h-[300px] w-full items-center justify-center flex">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <defs>
                                        <filter id="shadow-net" x="-50%" y="-50%" width="200%" height="200%">
                                            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="rgba(0,0,0,0.2)" opacity="0.5" />
                                        </filter>
                                    </defs>
                                    <Pie
                                        data={networkStats}
                                        dataKey="count"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        stroke="var(--card)"
                                        strokeWidth={4}
                                        className="cursor-pointer outline-none"
                                        onClick={(data) => {
                                            setSelectedSlice({
                                                type: 'network',
                                                value: data.name,
                                                count: data.count
                                            });
                                        }}
                                    >
                                        {networkStats?.map((entry, index) => (
                                            <Cell
                                                key={`cell-network-${index}`}
                                                fill={COLORS_NETWORKS[index % COLORS_NETWORKS.length]}
                                                style={{ filter: 'url(#shadow-net)' }}
                                                className="hover:opacity-80 transition-opacity cursor-pointer"
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend
                                        verticalAlign="bottom"
                                        height={36}
                                        iconType="circle"
                                        wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.7 }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Ministries Chart */}
                <Card className="shadow-2xl border-border bg-card/50 backdrop-blur-xl rounded-[2rem] overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 py-4 sm:py-6 px-4 sm:px-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-xl">
                                <ChartPie className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="font-black text-lg sm:text-xl uppercase tracking-tighter">
                                    Ministries
                                </CardTitle>
                                <p className="text-xs text-muted-foreground font-medium mt-1">
                                    Distribution of unique attendees by Ministry across the last {periodCount} events
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-8">
                        <div className="h-[300px] w-full items-center justify-center flex">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <defs>
                                        <filter id="shadow-min" x="-50%" y="-50%" width="200%" height="200%">
                                            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="rgba(0,0,0,0.2)" opacity="0.5" />
                                        </filter>
                                    </defs>
                                    <Pie
                                        data={ministryStats}
                                        dataKey="count"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        stroke="var(--card)"
                                        strokeWidth={4}
                                        className="cursor-pointer outline-none"
                                        onClick={(data) => {
                                            setSelectedSlice({
                                                type: 'ministry',
                                                value: data.name,
                                                count: data.count
                                            });
                                        }}
                                    >
                                        {ministryStats?.map((entry, index) => (
                                            <Cell
                                                key={`cell-ministry-${index}`}
                                                fill={COLORS_MINISTRIES[index % COLORS_MINISTRIES.length]}
                                                style={{ filter: 'url(#shadow-min)' }}
                                                className="hover:opacity-80 transition-opacity cursor-pointer"
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend
                                        verticalAlign="bottom"
                                        height={36}
                                        iconType="circle"
                                        wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.7 }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={!!selectedSlice} onOpenChange={(open) => !open && setSelectedSlice(null)}>
                <DialogContent className="max-w-2xl bg-card border-border">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl font-black uppercase tracking-tight">
                            <div className={`p-2 rounded-lg ${selectedSlice?.type === 'network' ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'}`}>
                                <ChartPie className="w-5 h-5" />
                            </div>
                            {selectedSlice?.value}
                        </DialogTitle>
                        <DialogDescription>
                            Showing {selectedSlice?.count} unique attendees from this {selectedSlice?.type} in the last {periodCount} events.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-4 border rounded-xl overflow-hidden">
                        <div className="bg-muted/30 px-4 py-3 border-b border-border flex items-center justify-between">
                            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Member List</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-background border border-border text-foreground">
                                {memberDetails?.length || 0} Found
                            </span>
                        </div>
                        <ScrollArea className="h-[400px]">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
                                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                    <span className="text-xs font-medium">Loading members...</span>
                                </div>
                            ) : memberDetails && memberDetails.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/10 hover:bg-muted/10">
                                            <TableHead className="text-xs font-bold w-[200px]">Name</TableHead>
                                            <TableHead className="text-xs font-bold">Contact</TableHead>
                                            <TableHead className="text-xs font-bold text-right">Groups</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {memberDetails.map((member) => (
                                            <TableRow key={member.id} className="hover:bg-muted/30">
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                            <User className="w-4 h-4 text-primary" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold leading-none">{member.firstName} {member.lastName}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-xs text-muted-foreground">
                                                    {member.contactNumber}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex flex-col items-end gap-1">
                                                        <span className="px-1.5 py-0.5 rounded bg-accent/10 text-[9px] font-bold text-accent uppercase tracking-tight">
                                                            {member.network}
                                                        </span>
                                                        <span className="px-1.5 py-0.5 rounded bg-primary/10 text-[9px] font-bold text-primary uppercase tracking-tight">
                                                            {member.ministry}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center">
                                    <p className="text-sm font-medium">No members found.</p>
                                    <p className="text-xs opacity-70 mt-1">This might be due to missing attendance records for this group.</p>
                                </div>
                            )}
                        </ScrollArea>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
