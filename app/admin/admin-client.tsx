"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FileDown, Calendar as CalendarIcon, Key, Loader2, RefreshCw } from "lucide-react";
import Link from "next/link";
import { MINISTRIES, NETWORKS } from "@/lib/church-data";
import { useTransition } from "react";
import { cn } from "@/lib/utils";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface AttendanceRecord {
    id: string;
    scannedAt: Date;
    user: {
        firstName: string;
        lastName: string;
        ministry: string;
        network: string;
        cluster: string;
        gender: string;
    };
}

interface AdminClientProps {
    initialMinistry: string;
    initialNetwork: string;
    initialCluster: string;
    initialGender: string;
    initialDate: string;
    attendanceData: AttendanceRecord[];
}

export default function AdminClient({
    initialMinistry,
    initialNetwork,
    initialCluster,
    initialGender,
    initialDate,
    attendanceData,
}: AdminClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const updateFilters = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value === "all") {
            params.delete(key);
        } else {
            params.set(key, value);
        }

        startTransition(() => {
            router.push(`?${params.toString()}`);
        });
    };

    const handleExport = () => {
        const doc = new jsPDF();
        const primaryColor: [number, number, number] = [15, 23, 42]; // Slate 900
        const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
        const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

        // sort alphabetically by Name
        const sortedData = [...attendanceData].sort((a, b) =>
            a.user.lastName.localeCompare(b.user.lastName) || a.user.firstName.localeCompare(b.user.firstName)
        );

        // Service Name determination
        const dateObj = new Date(initialDate);
        const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
        const serviceName = `${dayName} Service`;

        // Helper for Uniform Title Case
        const toTitleCase = (str: string) => {
            if (!str) return "";
            return str
                .toLowerCase()
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        };

        const formatDate = (dateStr: string) => {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
        };

        // Header
        const drawHeader = (data: any) => {
            doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.rect(0, 0, 210, 40, 'F'); // Increased height
            doc.setFont("helvetica", "bold");
            doc.setFontSize(20);
            doc.setTextColor(255, 255, 255);
            doc.text("Christian Life Center", 14, 22); // Shifted down, Title Case

            doc.setFontSize(9);
            doc.setTextColor(148, 163, 184); // Slate 400
            // Added Service Name to subtitle
            doc.text(`Attendance Report | ${formatDate(initialDate)} | ${serviceName}`, 14, 32);
        };

        // Draw header for the first page
        drawHeader(null);

        // Stats Calculation
        const totalAttendance = attendanceData.length;

        // Get all unique networks
        const allPossibleNetworks = Array.from(new Set([
            ...NETWORKS["Cluster 1"].Male,
            ...NETWORKS["Cluster 1"].Female,
            ...NETWORKS["Cluster 2"].Male,
            ...NETWORKS["Cluster 2"].Female
        ])).sort();

        // Initialize with zeros
        const initialNetworks: Record<string, number> = {};
        allPossibleNetworks.forEach(n => initialNetworks[n] = 0);

        const initialMinistries: Record<string, number> = {};
        MINISTRIES.forEach(m => initialMinistries[m] = 0);

        const networks = attendanceData.reduce((acc, r) => {
            const n = r.user.network || "No Network";
            acc[n] = (acc[n] || 0) + 1;
            return acc;
        }, initialNetworks);

        const ministries = attendanceData.reduce((acc, r) => {
            const m = r.user.ministry || "No Ministry";
            acc[m] = (acc[m] || 0) + 1;
            return acc;
        }, initialMinistries);

        // Helper for summary drawing
        let currentY = 50;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text(`Total Attendance: ${totalAttendance}`, 14, currentY);
        currentY += 12;

        const drawMiniChart = (title: string, data: Record<string, number>) => {
            const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
            if (entries.length === 0) return;

            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.text(title, 14, currentY);
            currentY += 6;

            const max = Math.max(...entries.map(e => e[1]));

            entries.forEach(([name, count]) => {
                const barWidth = (count / max) * 100;

                // Simple page overflow check for summary
                if (currentY > pageHeight - 20) {
                    doc.addPage();
                    drawHeader(null); // Draw header on new page
                    currentY = 55;
                }

                doc.setFillColor(241, 245, 249); // Slate 100
                doc.rect(60, currentY - 3.5, 100, 4, 'F');
                doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
                doc.rect(60, currentY - 3.5, barWidth, 4, 'F');

                doc.setFont("helvetica", "normal");
                doc.setFontSize(7);
                doc.setTextColor(71, 85, 105); // Slate 600
                doc.text(toTitleCase(name), 14, currentY);
                doc.text(count.toString(), 165, currentY);
                currentY += 6;
            });
            currentY += 6;
        };

        drawMiniChart("Attendance by Network", networks);
        drawMiniChart("Attendance by Ministry", ministries);

        const createTableBody = (data: typeof attendanceData) => data.map(record => [
            toTitleCase(`${record.user.lastName}, ${record.user.firstName}`),
            new Date(record.scannedAt).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', timeZone: "Asia/Manila" }),
            record.user.ministry,
            toTitleCase(record.user.network),
            toTitleCase(record.user.cluster),
            toTitleCase(record.user.gender)
        ]);

        const noMinistryFiltered = sortedData.filter(r => r.user.ministry === "No Ministry");
        const noNetworkFiltered = sortedData.filter(r => r.user.network === "No Network");

        const commonTableOptions: any = {
            theme: 'plain',
            styles: { fontSize: 8, cellPadding: 3, lineColor: [226, 232, 240], lineWidth: 0.1 },
            headStyles: { fillColor: primaryColor, textColor: [255, 255, 255], fontStyle: 'bold' },
            alternateRowStyles: { fillColor: [250, 250, 250] },
            margin: { top: 55 },
            didDrawPage: (data: any) => {
                drawHeader(data);
                const str = `Page ${data.pageNumber}`;
                doc.setFontSize(8);
                doc.setTextColor(150);
                doc.text(str, pageWidth - 20, pageHeight - 10, { align: 'right' });
                doc.text(`Generated by CLC Apps Platform | ${formatDate(new Date().toISOString())}`, 14, pageHeight - 10);
            }
        };

        // Table 1: No Ministry
        if (noMinistryFiltered.length > 0) {
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.setTextColor(185, 28, 28); // Red 700 for highlighting
            doc.text("Attendees with No Ministry", 14, currentY + 5);

            autoTable(doc, {
                ...commonTableOptions,
                head: [['Member Name', 'Time', 'Ministry', 'Network', 'Cluster', 'Gender']],
                body: createTableBody(noMinistryFiltered),
                startY: currentY + 10,
            });
            currentY = (doc as any).lastAutoTable.finalY + 10;
        }

        // Table 2: No Network
        if (noNetworkFiltered.length > 0) {
            if (currentY > pageHeight - 40) {
                doc.addPage();
                drawHeader(null);
                currentY = 50;
            }
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.setTextColor(185, 28, 28); // Red 700
            doc.text("Attendees with No Network", 14, currentY);

            autoTable(doc, {
                ...commonTableOptions,
                head: [['Member Name', 'Time', 'Ministry', 'Network', 'Cluster', 'Gender']],
                body: createTableBody(noNetworkFiltered),
                startY: currentY + 5,
            });
            currentY = (doc as any).lastAutoTable.finalY + 10;
        }

        // Main Table: Full List
        if (currentY > pageHeight - 40) {
            doc.addPage();
            drawHeader(null);
            currentY = 50;
        }
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text("Full Attendance List", 14, currentY);

        autoTable(doc, {
            ...commonTableOptions,
            head: [['Member Name', 'Time', 'Ministry', 'Network', 'Cluster', 'Gender']],
            body: createTableBody(sortedData),
            startY: currentY + 5,
        });

        doc.save(`CLC_Attendance_${initialDate}.pdf`);
    };

    return (
        <div className="relative">
            {isPending && (
                <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] z-50 flex items-center justify-center rounded-[2rem]">
                    <div className="bg-background/80 p-4 rounded-2xl shadow-xl border border-border/50 flex flex-col items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Updating...</span>
                    </div>
                </div>
            )}

            <div className={cn("space-y-6 bg-muted/30 p-4 sm:p-6 rounded-[2rem] border border-border/50 transition-opacity duration-300", isPending ? "opacity-50" : "opacity-100")}>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                    <div className="space-y-1.5 col-span-2 sm:col-span-1">
                        <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground ml-1">Date</Label>
                        <Input
                            type="date"
                            value={initialDate}
                            onChange={(e) => updateFilters("date", e.target.value)}
                            disabled={isPending}
                            className="bg-background rounded-xl border-none ring-1 ring-border h-11 focus:ring-2 focus:ring-primary font-bold text-xs"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground ml-1">Ministry</Label>
                        <Select value={initialMinistry} onValueChange={(v) => updateFilters("ministry", v)} disabled={isPending}>
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
                        <Select value={initialCluster} onValueChange={(v) => updateFilters("cluster", v)} disabled={isPending}>
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
                        <Select value={initialNetwork} onValueChange={(v) => updateFilters("network", v)} disabled={isPending}>
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
                        <Select value={initialGender} onValueChange={(v) => updateFilters("gender", v)} disabled={isPending}>
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
                        disabled={isPending}
                        className="w-full sm:w-auto gap-2 rounded-xl h-11 font-black text-[10px] uppercase tracking-widest border-border hover:bg-muted active:scale-95 transition-all"
                    >
                        <FileDown className="w-4 h-4" />
                        Export Report
                    </Button>
                </div>
            </div>
        </div>
    );
}
