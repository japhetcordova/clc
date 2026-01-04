"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { MAP_CONFIG, Location } from "@/config/locations";

// Fix for default marker icons in Leaflet with Next.js
const DefaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapClientProps {
    locations: Location[];
    activeLocationId?: string | null;
    onLocationSelect?: (id: string | null) => void;
}

function MapUpdater({ locations, activeLocationId }: { locations: Location[]; activeLocationId?: string | null }) {
    const map = useMap();

    useEffect(() => {
        if (activeLocationId) {
            const loc = locations.find(l => l.id === activeLocationId);
            if (loc) {
                map.setView([loc.lat, loc.lng], MAP_CONFIG.activeZoom, {
                    animate: true,
                    duration: 1
                });
            }
        } else if (locations.length > 0) {
            const bounds = L.latLngBounds(locations.map(loc => [loc.lat, loc.lng]));
            map.fitBounds(bounds, { padding: [50, 50], animate: true, duration: 1 });
        }
    }, [activeLocationId, locations, map]);

    return null;
}

export default function MapClient({ locations, activeLocationId, onLocationSelect }: MapClientProps) {
    return (
        <div className="w-full h-full min-h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl border border-border bg-muted/20 relative z-0">
            <MapContainer
                center={MAP_CONFIG.defaultCenter}
                zoom={MAP_CONFIG.defaultZoom}
                scrollWheelZoom={false}
                className="w-full h-full"
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution={MAP_CONFIG.attribution}
                    url={MAP_CONFIG.tileLayer}
                />
                <MapUpdater locations={locations} activeLocationId={activeLocationId} />
                {locations.map((loc) => (
                    <Marker
                        key={loc.id}
                        position={[loc.lat, loc.lng]}
                        eventHandlers={{
                            click: () => {
                                onLocationSelect?.(loc.id);
                            },
                        }}
                    >
                        <Popup>
                            <div className="p-2">
                                <h3 className="font-black uppercase italic text-sm tracking-tight">{loc.name}</h3>
                                <p className="text-[10px] text-muted-foreground font-medium mt-1">{loc.address}</p>
                                <div className="mt-3 pt-2 border-t border-border flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-600">Active Now</span>
                                    </div>
                                    <a
                                        href={`https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-white text-[9px] font-black uppercase tracking-widest hover:bg-primary/90 transition-all no-underline"
                                    >
                                        Get Directions
                                    </a>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
