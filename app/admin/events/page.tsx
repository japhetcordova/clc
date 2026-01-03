import { db } from "@/db";
import { events } from "@/db/schema";
import { desc } from "drizzle-orm";
import EventsClient from "./events-client";
import { ChevronLeft, LayoutDashboard, Calendar } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminEventsPage() {
    // Fetch all events sorted by creation date
    const allEvents = await db.select().from(events).orderBy(desc(events.createdAt));

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
                {/* Header Navigation */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-4">
                        <Link href="/admin">
                            <Button variant="ghost" className="p-0 h-auto gap-2 text-muted-foreground hover:text-primary hover:bg-transparent text-[10px] font-black uppercase tracking-widest">
                                <ChevronLeft className="w-4 h-4" /> Back to Dashboard
                            </Button>
                        </Link>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                                <Calendar className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">Event <span className="text-primary italic">Control</span></h1>
                        </div>
                    </div>
                </div>

                {/* CRUD Client Component */}
                <EventsClient initialEvents={allEvents} />
            </div>
        </div>
    );
}
