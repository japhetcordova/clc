"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { updateUser } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit3, Save, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ClusterSelect, NetworkSelect, MinistrySelect } from "@/components/ChurchFormFields";

const formSchema = z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    gender: z.string().min(1, "Gender is required"),
    network: z.string().min(1, "Network is required"),
    cluster: z.string().min(1, "Cluster is required"),
    contactNumber: z.string().min(10, "Valid contact number is required"),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    ministry: z.string().min(1, "Ministry is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface EditProfileProps {
    user: any;
}

export default function EditProfile({ user }: EditProfileProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: user.firstName,
            lastName: user.lastName,
            gender: user.gender,
            network: user.network,
            cluster: user.cluster,
            contactNumber: user.contactNumber,
            email: user.email || "",
            ministry: user.ministry,
        },
    });

    const onSubmit = async (data: FormValues) => {
        setIsSubmitting(true);
        const result = await updateUser(user.qrCodeId, data);
        setIsSubmitting(false);

        if (result.success) {
            toast.success("Profile updated successfully!");
            setIsOpen(false);
            window.location.reload(); // Quick way to refresh server data
        } else {
            toast.error("Failed to update profile.");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="col-span-2 w-full h-12 rounded-2xl border-2 border-dashed border-primary/20 text-primary font-black uppercase tracking-widest hover:bg-primary/5 hover:border-primary/50 transition-all gap-2">
                    <Edit3 className="w-4 h-4" />
                    Modify Profile Details
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] bg-card/95 backdrop-blur-2xl ring-1 ring-border p-0 overflow-hidden">
                <div className="h-2 bg-linear-to-r from-primary via-accent to-primary" />
                <div className="p-8">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter">Edit Member Profile</DialogTitle>
                        <DialogDescription className="text-muted-foreground">Keep your church profile information up to date.</DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">First Name</Label>
                                <Input className="bg-background/50" {...register("firstName")} />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Last Name</Label>
                                <Input className="bg-background/50" {...register("lastName")} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Gender</Label>
                            <Select defaultValue={watch("gender")} onValueChange={(v) => { setValue("gender", v); setValue("network", ""); }}>
                                <SelectTrigger className="bg-background/50">
                                    <SelectValue placeholder="Gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Male">Male</SelectItem>
                                    <SelectItem value="Female">Female</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Cluster</Label>
                                <ClusterSelect
                                    value={watch("cluster")}
                                    onValueChange={(v) => { setValue("cluster", v); setValue("network", ""); }}
                                    className="h-10 rounded-lg"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Network</Label>
                                <NetworkSelect
                                    cluster={watch("cluster")}
                                    gender={watch("gender")}
                                    value={watch("network")}
                                    onValueChange={(v) => setValue("network", v)}
                                    className="h-10 rounded-lg"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Ministry Involvement</Label>
                            <MinistrySelect
                                value={watch("ministry")}
                                onValueChange={(v) => setValue("ministry", v)}
                                className="h-10 rounded-lg"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Contact Number</Label>
                            <Input className="bg-background/50" {...register("contactNumber")} />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email</Label>
                            <Input className="bg-background/50" {...register("email")} />
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} className="flex-1 h-12 rounded-2xl font-black uppercase tracking-widest">Cancel</Button>
                            <Button type="submit" disabled={isSubmitting} className="flex-1 h-12 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
