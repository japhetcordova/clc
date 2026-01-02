"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FileDown, Calendar as CalendarIcon } from "lucide-react";

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
                        <SelectItem value="Worship Team">Worship Team</SelectItem>
                        <SelectItem value="Media">Media</SelectItem>
                        <SelectItem value="Usher">Usher</SelectItem>
                        <SelectItem value="Marshal">Marshal</SelectItem>
                        <SelectItem value="Production">Production</SelectItem>
                        <SelectItem value="Kid's Church">Kid's Church</SelectItem>
                        <SelectItem value="Technical">Technical</SelectItem>
                        <SelectItem value="PA">PA</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Arete">Arete</SelectItem>
                        <SelectItem value="Hosting">Hosting</SelectItem>
                        <SelectItem value="Writers">Writers</SelectItem>
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
                        <SelectItem value="Grenadier">Grenadier</SelectItem>
                        <SelectItem value="Better You">Better You</SelectItem>
                        <SelectItem value="Overcomers">Overcomers</SelectItem>
                        <SelectItem value="Kingdom Souldiers">Kingdom Souldiers</SelectItem>
                        <SelectItem value="Light-bearers">Light-bearers</SelectItem>
                        <SelectItem value="WOW">WOW</SelectItem>
                        <SelectItem value="Loved">Loved</SelectItem>
                        <SelectItem value="Phoenix">Phoenix</SelectItem>
                        <SelectItem value="Conquerors">Conquerors</SelectItem>
                        <SelectItem value="Pearls">Pearls</SelectItem>
                        <SelectItem value="Dauntless">Dauntless</SelectItem>
                        <SelectItem value="Royalties">Royalties</SelectItem>
                        <SelectItem value="Bravehearts">Bravehearts</SelectItem>
                        <SelectItem value="Astig">Astig</SelectItem>
                        <SelectItem value="Transformer">Transformer</SelectItem>
                        <SelectItem value="Invincible">Invincible</SelectItem>
                        <SelectItem value="Generals">Generals</SelectItem>
                        <SelectItem value="Champs">Champs</SelectItem>
                        <SelectItem value="Unbreakable multiplier">Unbreakable multiplier</SelectItem>
                        <SelectItem value="Exemplary">Exemplary</SelectItem>
                        <SelectItem value="Gems">Gems</SelectItem>
                        <SelectItem value="Diamonds">Diamonds</SelectItem>
                        <SelectItem value="Bride">Bride</SelectItem>
                        <SelectItem value="Fab">Fab</SelectItem>
                        <SelectItem value="Triumphant">Triumphant</SelectItem>
                        <SelectItem value="Visionary">Visionary</SelectItem>
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

            <div className="ml-auto">
                <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
                    <FileDown className="w-4 h-4" />
                    Export Report
                </Button>
            </div>
        </div>
    );
}
