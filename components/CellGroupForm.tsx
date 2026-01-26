"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface CellGroupFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CellGroupForm({ open, onOpenChange }: CellGroupFormProps) {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        birthMonth: "",
        birthDay: "",
        birthYear: "",
        email: "",
        phoneNumber: "",
        gender: "",
        address: "",
        preferredService: "Morning",
    });

    const mutation = trpc.submitCellGroupInterest.useMutation({
        onSuccess: () => {
            toast.success("Thank you! We'll contact you soon about joining a cell group.");
            onOpenChange(false);
            setFormData({
                firstName: "",
                lastName: "",
                birthMonth: "",
                birthDay: "",
                birthYear: "",
                email: "",
                phoneNumber: "",
                gender: "",
                address: "",
                preferredService: "Morning",
            });
        },
        onError: (error) => {
            toast.error(error.message || "Something went wrong. Please try again.");
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.birthMonth || !formData.birthDay || !formData.birthYear) {
            toast.error("Please select a complete birthdate.");
            return;
        }

        const formattedDate = `${formData.birthYear}-${formData.birthMonth.padStart(2, '0')}-${formData.birthDay.padStart(2, '0')}`;
        mutation.mutate({
            ...formData,
            birthdate: formattedDate
        });
    };

    const months = [
        { label: "January", value: "1" },
        { label: "February", value: "2" },
        { label: "March", value: "3" },
        { label: "April", value: "4" },
        { label: "May", value: "5" },
        { label: "June", value: "6" },
        { label: "July", value: "7" },
        { label: "August", value: "8" },
        { label: "September", value: "9" },
        { label: "October", value: "10" },
        { label: "November", value: "11" },
        { label: "December", value: "12" },
    ];

    const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => (currentYear - i).toString());

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] bg-card border-border backdrop-blur-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-primary">Find a Cell Group</DialogTitle>
                    <DialogDescription className="text-muted-foreground font-medium">
                        Fill out this form and we'll help you find a cell group that fits you.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName" className="text-[10px] font-black uppercase tracking-widest">First Name</Label>
                            <Input
                                id="firstName"
                                required
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                className="h-12 bg-background/50 border-border rounded-xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName" className="text-[10px] font-black uppercase tracking-widest">Last Name</Label>
                            <Input
                                id="lastName"
                                required
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                className="h-12 bg-background/50 border-border rounded-xl"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest">Birthdate</Label>
                        <div className="flex w-full bg-background/50 border border-border rounded-xl overflow-hidden focus-within:ring-1 focus-within:ring-primary/50 transition-all">
                            <Select value={formData.birthMonth} onValueChange={(v) => setFormData({ ...formData, birthMonth: v })}>
                                <SelectTrigger className="h-12 border-0 bg-transparent rounded-none focus:ring-0 flex-1 px-4">
                                    <SelectValue placeholder="Month" />
                                </SelectTrigger>
                                <SelectContent className="bg-popover border-border">
                                    {months.map(m => (
                                        <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <div className="w-px h-8 self-center bg-border/50" />

                            <Select value={formData.birthDay} onValueChange={(v) => setFormData({ ...formData, birthDay: v })}>
                                <SelectTrigger className="h-12 border-0 bg-transparent rounded-none focus:ring-0 w-[80px] px-3">
                                    <SelectValue placeholder="Day" />
                                </SelectTrigger>
                                <SelectContent className="bg-popover border-border">
                                    {days.map(d => (
                                        <SelectItem key={d} value={d}>{d}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <div className="w-px h-8 self-center bg-border/50" />

                            <Select value={formData.birthYear} onValueChange={(v) => setFormData({ ...formData, birthYear: v })}>
                                <SelectTrigger className="h-12 border-0 bg-transparent rounded-none focus:ring-0 w-[100px] px-3">
                                    <SelectValue placeholder="Year" />
                                </SelectTrigger>
                                <SelectContent className="bg-popover border-border">
                                    {years.map(y => (
                                        <SelectItem key={y} value={y}>{y}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="gender" className="text-[10px] font-black uppercase tracking-widest">Gender</Label>
                            <Select value={formData.gender} onValueChange={(v) => setFormData({ ...formData, gender: v })}>
                                <SelectTrigger className="h-12 bg-background/50 border-border rounded-xl">
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent className="bg-popover border-border">
                                    <SelectItem value="Male">Male</SelectItem>
                                    <SelectItem value="Female">Female</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber" className="text-[10px] font-black uppercase tracking-widest">Phone Number</Label>
                            <Input
                                id="phoneNumber"
                                type="tel"
                                required
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                className="h-12 bg-background/50 border-border rounded-xl"
                                placeholder="0912 345 6789"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest">Email Address (Optional)</Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="h-12 bg-background/50 border-border rounded-xl"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address" className="text-[10px] font-black uppercase tracking-widest">Address</Label>
                        <Input
                            id="address"
                            required
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="h-12 bg-background/50 border-border rounded-xl"
                        />
                    </div>

                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest">Preferable Sunday Service</Label>
                        <RadioGroup
                            value={formData.preferredService}
                            onValueChange={(v) => setFormData({ ...formData, preferredService: v })}
                            className="flex gap-6"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Morning" id="morning" className="text-primary border-primary" />
                                <Label htmlFor="morning" className="font-bold">Morning</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Afternoon" id="afternoon" className="text-primary border-primary" />
                                <Label htmlFor="afternoon" className="font-bold">Afternoon</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button
                            type="submit"
                            disabled={mutation.isPending}
                            className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
                        >
                            {mutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Submitting...
                                </>
                            ) : "Connect me to a Group"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
