"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Megaphone, Plus, Trash2, Pencil, Calendar as CalendarIcon, Tag } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function AnnouncementsAdminClient() {
    const { data: announcements, refetch } = trpc.getAnnouncements.useQuery();
    const createMutation = trpc.createAnnouncement.useMutation();
    const updateMutation = trpc.updateAnnouncement.useMutation();
    const deleteMutation = trpc.deleteAnnouncement.useMutation();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState<any>(null);

    const [formData, setFormData] = useState({
        title: "",
        content: "",
        type: "News",
        date: new Date().toISOString().split('T')[0]
    });

    const handleOpenDialog = (announcement: any = null) => {
        if (announcement) {
            setEditingAnnouncement(announcement);
            setFormData({
                title: announcement.title,
                content: announcement.content,
                type: announcement.type,
                date: announcement.date
            });
        } else {
            setEditingAnnouncement(null);
            setFormData({
                title: "",
                content: "",
                type: "News",
                date: new Date().toISOString().split('T')[0]
            });
        }
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingAnnouncement) {
                await updateMutation.mutateAsync({
                    id: editingAnnouncement.id,
                    data: formData
                });
                toast.success("Announcement updated");
            } else {
                await createMutation.mutateAsync(formData);
                toast.success("Announcement created");
            }
            setIsDialogOpen(false);
            refetch();
        } catch (error) {
            toast.error("Failed to save announcement");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this announcement?")) return;
        try {
            await deleteMutation.mutateAsync({ id });
            toast.success("Announcement deleted");
            refetch();
        } catch (error) {
            toast.error("Failed to delete announcement");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                    <h2 className="text-2xl font-black tracking-tight uppercase italic">Recent <span className="text-rose-500">Updates</span></h2>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest text-wrap">Manage church announcements and news articles.</p>
                </div>
                <Button onClick={() => handleOpenDialog()} className="rounded-xl h-12 px-6 font-black uppercase text-[10px] tracking-[0.2em] gap-2 shadow-xl shadow-rose-500/20 bg-rose-500 hover:bg-rose-600">
                    <Plus className="w-4 h-4" />
                    New Update
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {announcements?.map((ann) => (
                        <motion.div
                            key={ann.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                        >
                            <Card className="h-full rounded-[2rem] border-border/50 hover:border-rose-500/30 transition-all duration-300 shadow-lg flex flex-col group">
                                <CardHeader className="flex flex-row items-start justify-between space-y-0 p-6">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-rose-500">{ann.type}</span>
                                            <span className="text-[9px] font-bold text-muted-foreground">{ann.date}</span>
                                        </div>
                                        <CardTitle className="text-lg font-black uppercase italic tracking-tight group-hover:text-rose-500 transition-colors">{ann.title}</CardTitle>
                                    </div>
                                    <Megaphone className="w-5 h-5 text-muted-foreground/30 group-hover:text-rose-500 transition-colors shrink-0" />
                                </CardHeader>
                                <CardContent className="flex-1 p-6 pt-0 space-y-6">
                                    <p className="text-xs text-muted-foreground line-clamp-3 font-medium leading-relaxed">
                                        {ann.content}
                                    </p>
                                    <div className="flex gap-2 mt-auto">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="flex-1 rounded-xl h-10 font-black uppercase text-[9px] tracking-widest bg-muted/50 hover:bg-primary hover:text-white"
                                            onClick={() => handleOpenDialog(ann)}
                                        >
                                            <Pencil className="w-3 h-3 mr-2" />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-10 w-10 rounded-xl border border-destructive/20 text-destructive hover:bg-destructive/10"
                                            onClick={() => handleDelete(ann.id)}
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
                <DialogContent className="sm:max-w-[600px] rounded-[2.5rem] bg-card/95 backdrop-blur-2xl border-border/50 shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-black italic uppercase tracking-tighter">
                            {editingAnnouncement ? "Update Announcement" : "Create Announcement"}
                        </DialogTitle>
                        <DialogDescription className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                            Official church news and community updates.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Title</Label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="h-12 bg-background/50 border-border rounded-xl font-bold uppercase italic"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Type</Label>
                                    <Select
                                        value={formData.type}
                                        onValueChange={(v) => setFormData({ ...formData, type: v })}
                                    >
                                        <SelectTrigger className="h-12 bg-background/50 border-border rounded-xl">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Admin">Admin</SelectItem>
                                            <SelectItem value="News">News</SelectItem>
                                            <SelectItem value="Community">Community</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Date</Label>
                                    <Input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        className="h-12 bg-background/50 border-border rounded-xl"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Content</Label>
                                <Textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="min-h-[150px] bg-background/50 border-border rounded-xl py-4 font-medium"
                                    required
                                />
                            </div>
                        </div>

                        <DialogFooter className="pt-4 border-t border-border/50 gap-2">
                            <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl h-12 font-bold uppercase text-[10px] tracking-widest">
                                Cancel
                            </Button>
                            <Button type="submit" className="flex-1 rounded-xl h-12 font-black uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-rose-500/20 bg-rose-500 hover:bg-rose-600">
                                {editingAnnouncement ? "Save Changes" : "Post Update"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
