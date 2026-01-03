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
        <div className="flex flex-wrap gap-4 items-end bg-muted/30 p-4 rounded-xl">
            <div className="space-y-1.5 min-w-[140px]">
                <Label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Date</Label>
                <Input
                    type="date"
                    value={initialDate}
                    onChange={(e) => updateFilters("date", e.target.value)}
                    className="bg-background"
                />
            </div>

            <div className="space-y-1.5 min-w-[140px]">
                <Label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Ministry</Label>
                <Select value={initialMinistry} onValueChange={(v) => updateFilters("ministry", v)}>
                    <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Ministry" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Ministries</SelectItem>
                        {MINISTRIES.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-1.5 min-w-[140px]">
                <Label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Cluster</Label>
                <Select value={initialCluster} onValueChange={(v) => updateFilters("cluster", v)}>
                    <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Cluster" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Clusters</SelectItem>
                        <SelectItem value="Cluster 1">Cluster 1</SelectItem>
                        <SelectItem value="Cluster 2">Cluster 2</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-1.5 min-w-[140px]">
                <Label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Network</Label>
                <Select value={initialNetwork} onValueChange={(v) => updateFilters("network", v)}>
                    <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Network" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Networks</SelectItem>
                        {/* Show all networks combined from all clusters */}
                        {[...NETWORKS["Cluster 1"].Male, ...NETWORKS["Cluster 1"].Female, ...NETWORKS["Cluster 2"].Male, ...NETWORKS["Cluster 2"].Female].sort().map(n => (
                            <SelectItem key={n} value={n}>{n}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-1.5 min-w-[140px]">
                <Label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Gender</Label>
                <Select value={initialGender} onValueChange={(v) => updateFilters("gender", v)}>
                    <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex gap-2 ml-auto">
                <Link href="/pin-generator">
                    <Button variant="outline" size="sm" className="gap-2 border-amber-500/50 hover:bg-amber-500/10 text-amber-700">
                        <Key className="w-4 h-4" />
                        Daily PIN
                    </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
                    <FileDown className="w-4 h-4" />
                    Export Report
                </Button>
            </div>
        </div>
    );
}
