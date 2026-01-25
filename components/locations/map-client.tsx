"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { MAP_CONFIG, Location } from "@/config/locations";

// Fix for default marker icons in Leaflet with Next.js
const OrangeMarker = L.divIcon({
    className: "custom-div-icon",
    html: `<div class="w-4 h-4 bg-primary rounded-full border-2 border-background shadow-[0_0_15px_rgba(235,94,40,0.6)]"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
});

interface MapClientProps {
    locations: Location[];
    activeLocationId?: string | null;
    onLocationSelect?: (id: string | null) => void;
    view?: "list" | "map";
}

function MapUpdater({
    locations,
    activeLocationId,
    view,
    markerRefs
}: {
    locations: Location[];
    activeLocationId?: string | null;
    view?: "list" | "map";
    markerRefs: React.RefObject<{ [key: string]: L.Marker | null }>;
}) {
    const map = useMap();

    // Handle view transitions (List <-> Map)
    useEffect(() => {
        const invalidate = () => {
            map.invalidateSize();
        };

        // Invalidate immediately and after transition
        invalidate();
        const timers = [
            setTimeout(invalidate, 100),
            setTimeout(invalidate, 300),
            setTimeout(invalidate, 600), // After 500ms CSS transition
        ];

        return () => timers.forEach(t => clearTimeout(t));
    }, [map, view]);

    // Handle location centering and popup opening
    useEffect(() => {
        if (activeLocationId) {
            const loc = locations.find(l => l.id === activeLocationId);
            if (loc) {
                // Invalidate size BEFORE setting view to ensure center is calculated on current dimensions
                map.invalidateSize();

                // Small delay to ensure the browser has finished layouts
                const timer = setTimeout(() => {
                    // Offset center slightly to account for popup height
                    map.setView([loc.lat, loc.lng], MAP_CONFIG.activeZoom, {
                        animate: true,
                        duration: 1
                    });

                    // Open popup automatically
                    const marker = markerRefs.current?.[activeLocationId];
                    if (marker) {
                        marker.openPopup();
                    }
                }, 100);

                return () => clearTimeout(timer);
            }
        }
    }, [activeLocationId, locations, map, markerRefs]);

    return null;
}

export default function MapClient({ locations, activeLocationId, onLocationSelect, view }: MapClientProps) {
    const markerRefs = useRef<{ [key: string]: L.Marker | null }>({});

    return (
        <div className="w-full h-full min-h-[500px] overflow-hidden relative z-0">
            <style jsx global>{`
                .leaflet-container {
                    background: #020617 !important;
                    height: 100% !important;
                    width: 100% !important;
                }
                .leaflet-popup-content-wrapper {
                    background: rgba(15, 23, 42, 0.8) !important;
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 2rem !important;
                    color: #f8fafc !important;
                    padding: 0 !important;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
                }
                .leaflet-popup-tip {
                    background: rgba(15, 23, 42, 0.8) !important;
                }
                .leaflet-popup-content {
                    margin: 0 !important;
                    width: 280px !important;
                }
                @media (max-width: 640px) {
                    .leaflet-popup-content {
                        width: 240px !important;
                    }
                }
                .leaflet-attribution-container {
                    background: rgba(2, 6, 23, 0.6) !important;
                    backdrop-filter: blur(4px);
                    color: #64748b !important;
                    border: none !important;
                }
                .leaflet-attribution-container a {
                    color: #94a3b8 !important;
                }
            `}</style>
            <MapContainer
                center={MAP_CONFIG.defaultCenter}
                zoom={MAP_CONFIG.defaultZoom}
                scrollWheelZoom={false}
                className="w-full h-full"
                zoomControl={false}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution={MAP_CONFIG.attribution}
                    url={MAP_CONFIG.tileLayer}
                />
                <MapUpdater
                    locations={locations}
                    activeLocationId={activeLocationId}
                    view={view}
                    markerRefs={markerRefs}
                />
                {locations.map((loc) => (
                    <Marker
                        key={loc.id}
                        position={[loc.lat, loc.lng]}
                        icon={OrangeMarker}
                        ref={(ref) => {
                            if (ref) markerRefs.current[loc.id] = ref;
                        }}
                        eventHandlers={{
                            click: () => {
                                onLocationSelect?.(loc.id);
                            },
                        }}
                    >
                        <Popup>
                            <div className="p-6 space-y-4">
                                <div>
                                    <h3 className="font-black uppercase italic text-base tracking-tight text-white mb-0.5">{loc.name}</h3>
                                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{loc.type}</p>
                                </div>
                                <p className="text-[11px] text-slate-400 font-medium leading-relaxed">{loc.address}</p>
                                <div className="pt-4 border-t border-white/10 flex flex-col gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Service Times</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {loc.serviceTimes.map((time, idx) => (
                                                <span key={idx} className="text-[9px] font-black text-slate-300 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                                                    {time}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <a
                                        href={loc.googleMapsLink || `https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-2 rounded-xl bg-primary text-white text-[9px] font-black uppercase tracking-widest text-center transition-all hover:scale-105 active:scale-95 no-underline"
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
