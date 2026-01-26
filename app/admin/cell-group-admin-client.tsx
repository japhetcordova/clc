"use client";

import React from "react";
import { trpc } from "@/lib/trpc/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Mail, Phone, Calendar, MapPin, Clock, Loader2 } from "lucide-react";

export default function CellGroupAdminClient() {
    const { data: interests, isLoading } = trpc.getCellGroupInterests.useQuery();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <Card className="shadow-2xl border-border bg-card/50 backdrop-blur-xl rounded-[2rem] overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 py-4 sm:py-6 px-4 sm:px-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-violet-600/10 rounded-xl">
                        <Users className="w-5 h-5 text-violet-600" />
                    </div>
                    <CardTitle className="font-black text-lg sm:text-xl uppercase tracking-tighter">Cell Group Interests</CardTitle>
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted/50 px-3 py-1 rounded-full border border-border">
                    {interests?.length || 0} Total
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow className="border-border hover:bg-transparent">
                                <TableHead className="text-[10px] font-black uppercase tracking-widest h-12 pl-4 sm:pl-8">Name / Age</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Contact Info</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Demographics</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest h-12">Preferences</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest h-12 text-right pr-4 sm:pr-8">Submitted</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {!interests || interests.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-40 text-center text-muted-foreground font-bold italic">
                                        No interests recorded yet.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                interests.map((item) => (
                                    <TableRow key={item.id} className="border-border hover:bg-violet-600/5 transition-colors group">
                                        <TableCell className="pl-4 sm:pl-8 py-4">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="font-black text-sm sm:text-base text-foreground group-hover:text-violet-600 transition-colors">
                                                    {item.firstName} {item.lastName}
                                                </span>
                                                <span className="text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                                                    <Calendar className="w-2.5 h-2.5" />
                                                    Age: {(() => {
                                                        const birthDate = new Date(item.birthdate);
                                                        const today = new Date();
                                                        let age = today.getFullYear() - birthDate.getFullYear();
                                                        const m = today.getMonth() - birthDate.getMonth();
                                                        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                                                            age--;
                                                        }
                                                        return age;
                                                    })()} yrs old
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-xs font-bold text-foreground/80">
                                                    <Phone className="w-3 h-3 text-muted-foreground" />
                                                    {item.phoneNumber}
                                                </div>
                                                {item.email && (
                                                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground truncate max-w-[150px]">
                                                        <Mail className="w-3 h-3" />
                                                        {item.email}
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">{item.gender}</span>
                                                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium">
                                                    <MapPin className="w-3 h-3 shrink-0" />
                                                    <span className="truncate max-w-[120px]">{item.address}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tight ring-1 ${item.preferredService === "Morning"
                                                    ? "bg-amber-500/10 text-amber-500 ring-amber-500/20"
                                                    : "bg-indigo-500/10 text-indigo-500 ring-indigo-500/20"
                                                    }`}>
                                                    <Clock className="w-2.5 h-2.5 inline mr-1" />
                                                    {item.preferredService}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right pr-4 sm:pr-8 py-4">
                                            <span className="text-[10px] font-mono font-bold text-muted-foreground">
                                                {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                                <br />
                                                {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
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
