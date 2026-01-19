"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from "recharts";
import { TrendingUp } from "lucide-react";

interface WeeklyTrendsChartProps {
    data: Array<{
        week: string;
        count: number;
        fullDate: string;
    }>;
}

export default function WeeklyTrendsChart({ data }: WeeklyTrendsChartProps) {
    const maxCount = Math.max(...data.map(d => d.count), 1);
    const avgCount = data.reduce((sum, d) => sum + d.count, 0) / data.length;

    // Custom Tooltip Component
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-card/95 backdrop-blur-md border border-border/50 p-4 rounded-xl shadow-xl">
                    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">
                        {label}
                    </p>
                    <p className="text-xs font-medium text-muted-foreground mb-2">
                        {payload[0].payload.fullDate}
                    </p>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                        <span className="text-lg font-black text-foreground">
                            {payload[0].value}
                        </span>
                        <span className="text-xs font-bold text-muted-foreground uppercase">
                            Attendees
                        </span>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <Card className="shadow-2xl border-border bg-card/50 backdrop-blur-xl rounded-[2rem] overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 py-4 sm:py-6 px-4 sm:px-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-accent/10 rounded-xl">
                        <TrendingUp className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                        <CardTitle className="font-black text-lg sm:text-xl uppercase tracking-tighter">
                            Weekly Attendance Trends
                        </CardTitle>
                        <p className="text-xs text-muted-foreground font-medium mt-1">
                            Total unique attendees per service over the last {data.length} recorded services
                        </p>
                        <p className="text-[10px] text-muted-foreground/70 font-medium mt-0.5">
                            • Avg: {avgCount.toFixed(0)} per week
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-8">
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" vertical={false} />
                            <XAxis
                                dataKey="week"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'var(--foreground)', fontSize: 11, fontWeight: 700 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'var(--foreground)', fontSize: 11, fontWeight: 700 }}
                                domain={[0, 'auto']}
                                allowDecimals={false}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border)', strokeWidth: 2, strokeDasharray: '5 5' }} />
                            <Area
                                type="monotone"
                                dataKey="count"
                                stroke="var(--accent)"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorCount)"
                                dot={{
                                    fill: "var(--accent)",
                                    r: 6,
                                    strokeWidth: 4,
                                    stroke: "var(--card)"
                                }}
                                activeDot={{
                                    r: 8,
                                    fill: "var(--accent)",
                                    stroke: "var(--card)",
                                    strokeWidth: 4
                                }}
                            >
                                <LabelList
                                    dataKey="count"
                                    position="top"
                                    offset={12}
                                    className="fill-[var(--foreground)] font-black text-[12px]"
                                    formatter={(value: number) => value}
                                />
                            </Area>
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-muted/30 rounded-2xl p-4 border border-border/50 hover:bg-muted/50 transition-colors">
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Peak Week</p>
                        <p className="text-2xl font-black text-foreground">{maxCount}</p>
                    </div>
                    <div className="bg-accent/5 rounded-2xl p-4 border border-accent/20 hover:bg-accent/10 transition-colors">
                        <p className="text-[9px] font-black uppercase tracking-widest text-accent/80 mb-1">This Week</p>
                        <p className="text-2xl font-black text-accent">{data[data.length - 1]?.count || 0}</p>
                    </div>
                    <div className="bg-muted/30 rounded-2xl p-4 border border-border/50 hover:bg-muted/50 transition-colors">
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Average</p>
                        <p className="text-2xl font-black text-foreground">{avgCount.toFixed(0)}</p>
                    </div>
                    <div className="bg-muted/30 rounded-2xl p-4 border border-border/50 hover:bg-muted/50 transition-colors">
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Growth</p>
                        <div className="flex items-baseline gap-1">
                            <p className={`text-2xl font-black ${data.length >= 2 && data[data.length - 1].count >= data[data.length - 2].count
                                ? 'text-[hsl(var(--primary))]'
                                : 'text-destructive'
                                }`}>
                                {data.length >= 2
                                    ? `${data[data.length - 1].count >= data[data.length - 2].count ? '+' : ''}${data[data.length - 1].count - data[data.length - 2].count}`
                                    : '—'}
                            </p>
                            <span className="text-[10px] font-bold text-muted-foreground">vs last week</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
