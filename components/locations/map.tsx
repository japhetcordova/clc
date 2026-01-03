"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const MapClient = dynamic(() => import("./map-client"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl border border-border bg-muted/20 flex items-center justify-center">
            <div className="text-center space-y-4">
                <Skeleton className="w-16 h-16 rounded-full mx-auto" />
                <div className="space-y-2">
                    <Skeleton className="w-48 h-4 mx-auto" />
                    <Skeleton className="w-32 h-3 mx-auto" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground animate-pulse">
                    Initializing Real-Time Map...
                </p>
            </div>
        </div>
    )
});

interface Location {
    id: string;
    name: string;
    lat: number;
    lng: number;
    address: string;
    type: string;
    lastUpdated: string;
}

interface MapProps {
    locations: Location[];
    activeLocationId?: string;
}

export default function Map(props: MapProps) {
    return <MapClient {...props} />;
}
