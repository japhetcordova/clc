"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
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
        }
    }, [activeLocationId, locations, map]);

    return null;
}

export default function MapClient({ locations, activeLocationId, onLocationSelect }: MapClientProps) {
    return (
        <div className="w-full h-full min-h-[500px] overflow-hidden relative z-0">
            <style jsx global>{`
                .leaflet-container {
                    background: #f8fafc !important;
                }
                .leaflet-popup-content-wrapper {
                    background: rgba(255, 255, 255, 0.9) !important;
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(0, 0, 0, 0.05);
                    border-radius: 1.5rem !important;
                    color: #0f172a !important;
                    padding: 0 !important;
                    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1) !important;
                }
                .leaflet-popup-tip {
                    background: rgba(255, 255, 255, 0.9) !important;
                }
                .leaflet-popup-content {
                    margin: 0 !important;
                    width: 240px !important;
                }
            `}</style>
            <MapContainer
                center={MAP_CONFIG.defaultCenter}
                zoom={MAP_CONFIG.defaultZoom}
                scrollWheelZoom={true}
                className="w-full h-full"
                zoomControl={false}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                <MapUpdater locations={locations} activeLocationId={activeLocationId} />
                {locations.map((loc) => (
                    <Marker
                        key={loc.id}
                        position={[loc.lat, loc.lng]}
                        icon={OrangeMarker}
                        eventHandlers={{
                            click: () => {
                                onLocationSelect?.(loc.id);
                            },
                        }}
                    >
                        <Popup>
                            <div className="p-5 space-y-3">
                                <div>
                                    <h3 className="font-black uppercase italic text-sm tracking-tight text-slate-900 mb-0.5">{loc.name}</h3>
                                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{loc.type}</p>
                                </div>
                                <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{loc.address}</p>
                                <div className="pt-3 border-t border-slate-100 flex flex-col gap-3">
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-primary"></div>
                                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Service Times</span>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {loc.serviceTimes.map((time, idx) => (
                                                <span key={idx} className="text-[8px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
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
