"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FileDown, Calendar as CalendarIcon, Key } from "lucide-react";
import Link from "next/link";
import { MINISTRIES, NETWORKS } from "@/lib/church-data";

interface AdminClientProps {
    initialMinistry: string;
    initialNetwork: string;
    initialCluster: string;
    initialGender: string;
    initialDate: string;
}

export default function AdminClient({
    initialMinistry,
    initialNetwork,
    initialCluster,
    initialGender,
    initialDate,
}: AdminClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const updateFilters = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value === "all") {
            params.delete(key);
        } else {
            params.set(key, value);
        }
        router.push(`?${params.toString()}`);
    };

    const handleExport = () => {
        window.print();
    };

    return (
        <div className="space-y-6 bg-muted/30 p-4 sm:p-6 rounded-[2rem] border border-border/50">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                    <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground ml-1">Date</Label>
                    <Input
                        type="date"
                        value={initialDate}
                        onChange={(e) => updateFilters("date", e.target.value)}
                        className="bg-background rounded-xl border-none ring-1 ring-border h-11 focus:ring-2 focus:ring-primary font-bold text-xs"
                    />
                </div>

                <div className="space-y-1.5">
                    <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground ml-1">Ministry</Label>
                    <Select value={initialMinistry} onValueChange={(v) => updateFilters("ministry", v)}>
                        <SelectTrigger className="bg-background rounded-xl border-none ring-1 ring-border h-11 focus:ring-2 focus:ring-primary font-bold text-xs">
                            <SelectValue placeholder="Ministry" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-border shadow-2xl">
                            <SelectItem value="all">All Ministries</SelectItem>
                            {MINISTRIES.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-1.5">
                    <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground ml-1">Cluster</Label>
                    <Select value={initialCluster} onValueChange={(v) => updateFilters("cluster", v)}>
                        <SelectTrigger className="bg-background rounded-xl border-none ring-1 ring-border h-11 focus:ring-2 focus:ring-primary font-bold text-xs">
                            <SelectValue placeholder="Cluster" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-border shadow-2xl">
                            <SelectItem value="all">All Clusters</SelectItem>
                            <SelectItem value="Cluster 1">Cluster 1</SelectItem>
                            <SelectItem value="Cluster 2">Cluster 2</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-1.5">
                    <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground ml-1">Network</Label>
                    <Select value={initialNetwork} onValueChange={(v) => updateFilters("network", v)}>
                        <SelectTrigger className="bg-background rounded-xl border-none ring-1 ring-border h-11 focus:ring-2 focus:ring-primary font-bold text-xs">
                            <SelectValue placeholder="Network" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-border shadow-2xl">
                            <SelectItem value="all">All Networks</SelectItem>
                            {Array.from(new Set([
                                ...NETWORKS["Cluster 1"].Male,
                                ...NETWORKS["Cluster 1"].Female,
                                ...NETWORKS["Cluster 2"].Male,
                                ...NETWORKS["Cluster 2"].Female
                            ])).sort().map(n => (
                                <SelectItem key={n} value={n}>{n}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-1.5">
                    <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground ml-1">Gender</Label>
                    <Select value={initialGender} onValueChange={(v) => updateFilters("gender", v)}>
                        <SelectTrigger className="bg-background rounded-xl border-none ring-1 ring-border h-11 focus:ring-2 focus:ring-primary font-bold text-xs">
                            <SelectValue placeholder="Gender" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-border shadow-2xl">
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-border/50">
                <div className="grid grid-cols-2 sm:flex sm:flex-row gap-3 flex-1">
                    <Link href="/pin-generator" className="w-full sm:w-auto">
                        <Button className="w-full gap-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl h-11 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-amber-600/20 active:scale-95 transition-all">
                            <Key className="w-4 h-4" />
                            Daily PIN
                        </Button>
                    </Link>
                    <Link href="/admin/events" className="w-full sm:w-auto">
                        <Button className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-11 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all">
                            <CalendarIcon className="w-4 h-4" />
                            Manage Events
                        </Button>
                    </Link>
                </div>
                <Button
                    variant="outline"
                    onClick={handleExport}
                    className="w-full sm:w-auto gap-2 rounded-xl h-11 font-black text-[10px] uppercase tracking-widest border-border hover:bg-muted active:scale-95 transition-all"
                >
                    <FileDown className="w-4 h-4" />
                    Export Report
                </Button>
            </div>
        </div>
    );
}
