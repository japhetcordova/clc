"use client";

import React from "react";
import { trpc } from "@/lib/trpc/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, CheckCircle2, XCircle, Clock, Loader2, User, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function G12JourneyAdminClient() {
    const utils = trpc.useUtils();
    const { data: enrollments, isLoading } = trpc.getClassEnrollments.useQuery();
    const updateMutation = trpc.updateClassEnrollmentStatus.useMutation({
        onSuccess: () => {
            utils.getClassEnrollments.invalidate();
            toast.success("Status updated successfully");
        }
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
        );
    }

    const handleStatusUpdate = async (id: string, status: "active" | "completed" | "dropped") => {
        await updateMutation.mutateAsync({ id, status });
    };

    return (
        <Card className="shadow-2xl border-border bg-card/50 backdrop-blur-xl rounded-[2rem] overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 py-4 sm:py-6 px-4 sm:px-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-xl">
                        <GraduationCap className="w-5 h-5 text-emerald-500" />
                    </div>
                    <CardTitle className="font-black text-lg sm:text-xl uppercase tracking-tighter">G12 Journey Enrollments</CardTitle>
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted/50 px-3 py-1 rounded-full border border-border">
                    {enrollments?.length || 0} Total
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow className="border-border hover:bg-transparent">
                                <TableHead className="text-[10px] font-black uppercase tracking-widest h-12 pl-4 sm:pl-8">Student / Network</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Level</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Status</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Enrolled At</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest h-12 text-right pr-4 sm:pr-8">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {!enrollments || enrollments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-40 text-center text-muted-foreground font-bold italic">
                                        No enrollment requests yet.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                enrollments.map((item) => (
                                    <TableRow key={item.id} className="border-border hover:bg-emerald-500/5 transition-colors group">
                                        <TableCell className="pl-4 sm:pl-8 py-4">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="font-black text-sm sm:text-base text-foreground group-hover:text-emerald-500 transition-colors">
                                                    {item.user.firstName} {item.user.lastName}
                                                </span>
                                                <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                                                    <User className="w-3 h-3" />
                                                    {item.user.network}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest ring-1 ring-primary/20">
                                                {item.classLevel.replace('_', ' ')}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <StatusBadge status={item.status} />
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-bold text-foreground/80 lowercase">
                                                    {new Date(item.enrolledAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                                </span>
                                                <span className="text-[9px] font-mono text-muted-foreground">
                                                    {new Date(item.enrolledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right pr-4 sm:pr-8 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                {item.status === 'active' && (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg"
                                                            onClick={() => handleStatusUpdate(item.id, 'completed')}
                                                            title="Mark as Completed"
                                                        >
                                                            <CheckCircle2 className="w-5 h-5" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-8 w-8 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg"
                                                            onClick={() => handleStatusUpdate(item.id, 'dropped')}
                                                            title="Mark as Dropped"
                                                        >
                                                            <XCircle className="w-5 h-5" />
                                                        </Button>
                                                    </>
                                                )}
                                                {item.status !== 'active' && (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 px-2 text-muted-foreground hover:text-foreground text-[10px] font-black uppercase tracking-widest rounded-lg"
                                                        onClick={() => handleStatusUpdate(item.id, 'active')}
                                                    >
                                                        Re-activate
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}

function StatusBadge({ status }: { status: string }) {
    switch (status) {
        case 'active':
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase tracking-widest ring-1 ring-blue-500/20">
                    <Clock className="w-3 h-3" />
                    Pending
                </span>
            );
        case 'completed':
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest ring-1 ring-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified
                </span>
            );
        case 'dropped':
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px] font-black uppercase tracking-widest ring-1 ring-border">
                    <XCircle className="w-3 h-3" />
                    Dropped
                </span>
            );
        default:
            return null;
    }
}
