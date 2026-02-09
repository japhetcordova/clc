"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, Plus, Trash2, CheckCircle2, Circle, Pencil, Image as ImageIcon, Speaker, Type } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export default function MobileHighlightsClient() {
    const { data: highlights, refetch } = trpc.getMobileHighlights.useQuery();
    const createMutation = trpc.createMobileHighlight.useMutation();
    const updateMutation = trpc.updateMobileHighlight.useMutation();
    const deleteMutation = trpc.deleteMobileHighlight.useMutation();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingHighlight, setEditingHighlight] = useState<any>(null);

    // Form State
    const [formData, setFormData] = useState({
        titlePrefix: "When you",
        highlightedWord: "declare",
        titleSuffix: "The Lord listens.",
        speaker: "Ptra. Arlene B. Molina",
        series: "Making God Our First",
        imageUrl: "/mobile-highlight.jpg",
        isActive: false
    });

    const handleOpenDialog = (highlight: any = null) => {
        if (highlight) {
            setEditingHighlight(highlight);
            setFormData({
                titlePrefix: highlight.titlePrefix,
                highlightedWord: highlight.highlightedWord,
                titleSuffix: highlight.titleSuffix,
                speaker: highlight.speaker,
                series: highlight.series,
                imageUrl: highlight.imageUrl,
                isActive: highlight.isActive
            });
        } else {
            setEditingHighlight(null);
            setFormData({
                titlePrefix: "When you",
                highlightedWord: "declare",
                titleSuffix: "The Lord listens.",
                speaker: "Ptra. Arlene B. Molina",
                series: "Making God Our First",
                imageUrl: "/mobile-highlight.jpg",
                isActive: false
            });
        }
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingHighlight) {
                await updateMutation.mutateAsync({
                    id: editingHighlight.id,
                    data: formData
                });
                toast.success("Highlight updated successfully");
            } else {
                await createMutation.mutateAsync(formData);
                toast.success("Highlight created successfully");
            }
            setIsDialogOpen(false);
            refetch();
        } catch (error) {
            toast.error("Failed to save highlight");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this highlight?")) return;
        try {
            await deleteMutation.mutateAsync({ id });
            toast.success("Highlight deleted");
            refetch();
        } catch (error) {
            toast.error("Failed to delete highlight");
        }
    };

    const handleToggleActive = async (highlight: any) => {
        try {
            await updateMutation.mutateAsync({
                id: highlight.id,
                data: { isActive: !highlight.isActive }
            });
            toast.success(`Highlight ${!highlight.isActive ? "activated" : "deactivated"}`);
            refetch();
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                    <h2 className="text-2xl font-black tracking-tight uppercase italic">Mobile Home <span className="text-primary">Highlights</span></h2>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Manage the hero section shown on the mobile app.</p>
                </div>
                <Button onClick={() => handleOpenDialog()} className="rounded-xl h-12 px-6 font-black uppercase text-[10px] tracking-[0.2em] gap-2 shadow-xl shadow-primary/20">
                    <Plus className="w-4 h-4" />
                    New Highlight
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {highlights?.map((highlight) => (
                        <motion.div
                            key={highlight.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                        >
                            <Card className={cn(
                                "relative overflow-hidden group border-border/50 hover:border-primary/50 transition-all duration-500 rounded-[2rem] shadow-xl",
                                highlight.isActive && "ring-2 ring-primary ring-offset-4 ring-offset-background"
                            )}>
                                <div className="aspect-video relative overflow-hidden">
                                    <Image
                                        src={highlight.imageUrl}
                                        alt={highlight.speaker}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        unoptimized={highlight.imageUrl.startsWith("http")}
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />

                                    {highlight.isActive && (
                                        <div className="absolute top-4 right-4 bg-primary text-white p-2 rounded-full shadow-lg animate-pulse">
                                            <CheckCircle2 className="w-4 h-4" />
                                        </div>
                                    )}

                                    <div className="absolute bottom-4 left-6 right-6">
                                        <h3 className="text-lg font-black text-white italic truncate uppercase leading-tight">
                                            {highlight.titlePrefix} {highlight.highlightedWord} {highlight.titleSuffix}
                                        </h3>
                                        <p className="text-[9px] font-black text-white/60 uppercase tracking-widest">
                                            {highlight.speaker}
                                        </p>
                                    </div>
                                </div>

                                <CardContent className="p-6 bg-card">
                                    <div className="flex gap-2">
                                        <Button
                                            variant={highlight.isActive ? "outline" : "default"}
                                            size="sm"
                                            className="flex-1 rounded-xl h-10 font-black uppercase text-[9px] tracking-widest"
                                            onClick={() => handleToggleActive(highlight)}
                                        >
                                            {highlight.isActive ? "Deactivate" : "Set Active"}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-10 w-10 rounded-xl border border-border"
                                            onClick={() => handleOpenDialog(highlight)}
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-10 w-10 rounded-xl border border-destructive/20 text-destructive hover:bg-destructive/10"
                                            onClick={() => handleDelete(highlight.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[600px] rounded-[2.5rem] bg-card/95 backdrop-blur-2xl border-border/50 shadow-2xl overflow-y-auto max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-black italic uppercase tracking-tighter">
                            {editingHighlight ? "Update Highlight" : "Create Highlight"}
                        </DialogTitle>
                        <DialogDescription className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                            {editingHighlight ? "Modify existing mobile hero section data." : "Add a new sermon highlight for the mobile home page."}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2.5">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                                    <Type className="w-3 h-3" />
                                    Title Prefix
                                </Label>
                                <Input
                                    value={formData.titlePrefix}
                                    onChange={(e) => setFormData({ ...formData, titlePrefix: e.target.value })}
                                    placeholder="e.g. When you"
                                    className="h-12 bg-background/50 border-border rounded-xl font-medium"
                                    required
                                />
                            </div>

                            <div className="space-y-2.5">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1 flex items-center gap-2">
                                    <Sparkles className="w-3 h-3" />
                                    Highlighted Word
                                </Label>
                                <Input
                                    value={formData.highlightedWord}
                                    onChange={(e) => setFormData({ ...formData, highlightedWord: e.target.value })}
                                    placeholder="e.g. declare"
                                    className="h-12 bg-primary/5 border-primary/20 text-primary rounded-xl font-black uppercase italic"
                                    required
                                />
                            </div>

                            <div className="sm:col-span-2 space-y-2.5">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                                    <Type className="w-3 h-3" />
                                    Title Suffix
                                </Label>
                                <Input
                                    value={formData.titleSuffix}
                                    onChange={(e) => setFormData({ ...formData, titleSuffix: e.target.value })}
                                    placeholder="e.g. The Lord listens."
                                    className="h-12 bg-background/50 border-border rounded-xl font-medium"
                                    required
                                />
                            </div>

                            <div className="space-y-2.5">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                                    <Speaker className="w-3 h-3" />
                                    Speaker Name
                                </Label>
                                <Input
                                    value={formData.speaker}
                                    onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
                                    placeholder="e.g. Ptra. Arlene"
                                    className="h-12 bg-background/50 border-border rounded-xl font-medium"
                                    required
                                />
                            </div>

                            <div className="space-y-2.5">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                                    <Plus className="w-3 h-3" />
                                    Series Title
                                </Label>
                                <Input
                                    value={formData.series}
                                    onChange={(e) => setFormData({ ...formData, series: e.target.value })}
                                    placeholder="e.g. Making God First"
                                    className="h-12 bg-background/50 border-border rounded-xl font-medium"
                                    required
                                />
                            </div>

                            <div className="sm:col-span-2 space-y-2.5">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                                    <ImageIcon className="w-3 h-3" />
                                    Highlight Image URL
                                </Label>
                                <Input
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                    placeholder="/mobile-highlight.jpg"
                                    className="h-12 bg-background/50 border-border rounded-xl font-medium"
                                    required
                                />
                                <p className="text-[9px] font-medium text-muted-foreground/60 px-1 italic">Note: Use '/mobile-highlight.jpg' for the captured service photo.</p>
                            </div>

                            <div className="flex items-center space-x-2 pt-2">
                                <Checkbox
                                    id="isActive"
                                    checked={formData.isActive}
                                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: !!checked })}
                                    className="rounded-md"
                                />
                                <label
                                    htmlFor="isActive"
                                    className="text-xs font-black uppercase tracking-widest text-foreground cursor-pointer"
                                >
                                    Activate this highlight immediately
                                </label>
                            </div>
                        </div>

                        <DialogFooter className="pt-4 border-t border-border/50 gap-2">
                            <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl h-12 font-bold uppercase text-[10px] tracking-widest">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="flex-1 rounded-xl h-12 font-black uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-primary/20">
                                {editingHighlight ? "Save Changes" : "Create Highlight"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
