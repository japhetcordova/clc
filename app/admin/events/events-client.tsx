"use client";

import { useState } from "react";
import { ChurchEvent } from "@/db/schema";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Calendar, MapPin, Tag, Clock } from "lucide-react";

interface EventsClientProps {
    initialEvents: ChurchEvent[];
}

export default function EventsClient({ initialEvents }: EventsClientProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<ChurchEvent | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        category: "regular",
        tag: "",
        image: "",
        maxCapacity: "",
        registrationLink: "",
        contactPerson: "",
        googleMapsLink: ""
    });

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            date: "",
            time: "",
            location: "",
            category: "regular",
            tag: "",
            image: "",
            maxCapacity: "",
            registrationLink: "",
            contactPerson: "",
            googleMapsLink: ""
        });
        setEditingEvent(null);
    };

    const handleEdit = (event: ChurchEvent) => {
        setEditingEvent(event);
        setFormData({
            title: event.title,
            description: event.description,
            date: event.date,
            time: event.time,
            location: event.location,
            category: event.category,
            tag: event.tag,
            image: event.image || "",
            maxCapacity: event.maxCapacity || "",
            registrationLink: event.registrationLink || "",
            contactPerson: event.contactPerson || "",
            googleMapsLink: event.googleMapsLink || ""
        });
        setIsDialogOpen(true);
    };

    const utils = trpc.useUtils();
    const createMutation = trpc.createEvent.useMutation({
        onSuccess: () => {
            toast.success("Event created successfully");
            utils.getEvents.invalidate();
            setIsDialogOpen(false);
            resetForm();
        }
    });
    const updateMutation = trpc.updateEvent.useMutation({
        onSuccess: () => {
            toast.success("Event updated successfully");
            utils.getEvents.invalidate();
            setIsDialogOpen(false);
            resetForm();
        }
    });
    const deleteMutation = trpc.deleteEvent.useMutation({
        onSuccess: () => {
            toast.success("Event deleted");
            utils.getEvents.invalidate();
        }
    });

    const { data: events, isLoading: isFetching } = trpc.getEvents.useQuery(undefined, {
        initialData: initialEvents as any,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (editingEvent) {
                await updateMutation.mutateAsync({ id: editingEvent.id, data: formData });
            } else {
                await createMutation.mutateAsync(formData as any);
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this event?")) return;
        try {
            await deleteMutation.mutateAsync({ id });
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black uppercase italic tracking-tighter">Event <span className="text-primary">Management</span></h2>
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) resetForm();
                }}>
                    <DialogTrigger asChild>
                        <Button className="h-12 px-6 rounded-xl bg-primary font-black uppercase text-[10px] tracking-widest gap-2">
                            <Plus className="w-4 h-4" /> Add New Event
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] overflow-y-auto max-h-[90vh]">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-black uppercase italic">{editingEvent ? "Edit Event" : "Create New Event"}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-6 py-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase font-black">Event Title</Label>
                                <Input
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g. Super Sunday: Vision Day"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase font-black">Date</Label>
                                    <Input
                                        type="date"
                                        required
                                        value={formData.date}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase font-black">Time</Label>
                                    <Input
                                        required
                                        value={formData.time}
                                        onChange={e => setFormData({ ...formData, time: e.target.value })}
                                        placeholder="e.g. 08:00 AM"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase font-black">Location</Label>
                                <Input
                                    required
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="e.g. Main Sanctuary"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase font-black">Category</Label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="special">Special</SelectItem>
                                            <SelectItem value="regular">Regular</SelectItem>
                                            <SelectItem value="leadership">Leadership</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase font-black">Display Tag</Label>
                                    <Select
                                        value={formData.tag}
                                        onValueChange={(value) => setFormData({ ...formData, tag: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select tag" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Weekly">Weekly</SelectItem>
                                            <SelectItem value="High Priority">High Priority</SelectItem>
                                            <SelectItem value="Special Event">Special Event</SelectItem>
                                            <SelectItem value="Community">Community</SelectItem>
                                            <SelectItem value="Youth">Youth</SelectItem>
                                            <SelectItem value="Kids">Kids</SelectItem>
                                            <SelectItem value="Worship">Worship</SelectItem>
                                            <SelectItem value="Missions">Missions</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase font-black">Description</Label>
                                <Textarea
                                    required
                                    rows={4}
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Describe the event details..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase font-black">Image URL (Optional)</Label>
                                <Input
                                    value={formData.image}
                                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                                    placeholder="/path/to/image.png"
                                />
                            </div>

                            {/* 5TH SECTION: Event Management & Registration */}
                            <div className="pt-4 border-t border-border space-y-4">
                                <h3 className="text-sm font-black uppercase italic text-primary">Event Management & Registration</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] uppercase font-black">Max Capacity (Optional)</Label>
                                        <Input
                                            value={formData.maxCapacity}
                                            onChange={e => setFormData({ ...formData, maxCapacity: e.target.value })}
                                            placeholder="e.g. 500 people"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] uppercase font-black">Contact Person (Optional)</Label>
                                        <Input
                                            value={formData.contactPerson}
                                            onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
                                            placeholder="e.g. Pastor John"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] uppercase font-black">Registration Link (Optional)</Label>
                                        <Input
                                            value={formData.registrationLink}
                                            onChange={e => setFormData({ ...formData, registrationLink: e.target.value })}
                                            placeholder="https://forms.google.com/..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] uppercase font-black">Google Maps Link (Optional)</Label>
                                        <Input
                                            value={formData.googleMapsLink}
                                            onChange={e => setFormData({ ...formData, googleMapsLink: e.target.value })}
                                            placeholder="https://maps.google.com/..."
                                        />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={isLoading} className="w-full h-12 rounded-xl bg-primary font-black uppercase text-xs tracking-widest">
                                    {isLoading ? "Saving..." : editingEvent ? "Update Event" : "Create Event"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="font-black uppercase text-[10px]">Title</TableHead>
                            <TableHead className="font-black uppercase text-[10px]">Date & Time</TableHead>
                            <TableHead className="font-black uppercase text-[10px]">Category</TableHead>
                            <TableHead className="font-black uppercase text-[10px]">Interested</TableHead>
                            <TableHead className="font-black uppercase text-[10px] text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {events.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground font-medium uppercase text-[10px] tracking-widest">
                                    No events found. Start by adding one.
                                </TableCell>
                            </TableRow>
                        ) : (
                            events.map((event) => (
                                <TableRow key={event.id} className="hover:bg-muted/30 transition-colors">
                                    <TableCell>
                                        <div className="space-y-1">
                                            <p className="font-black uppercase italic tracking-tight">{event.title}</p>
                                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                                <MapPin className="w-3 h-3" />
                                                <span>{event.location}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1 text-[10px]">
                                            <div className="flex items-center gap-2 font-bold text-primary">
                                                <Calendar className="w-3 h-3" />
                                                <span>{event.date}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Clock className="w-3 h-3" />
                                                <span>{event.time}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Tag className="w-3 h-3 text-muted-foreground" />
                                            <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-muted border border-border">
                                                {event.category}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl font-black text-primary">{event.interestedCount || 0}</span>
                                            <span className="text-[10px] text-muted-foreground uppercase">people</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => handleEdit(event)}
                                                className="w-8 h-8 rounded-lg hover:border-primary hover:text-primary"
                                            >
                                                <Pencil className="w-3.5 h-3.5" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => handleDelete(event.id)}
                                                className="w-8 h-8 rounded-lg hover:border-rose-500 hover:text-rose-500"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
