export interface Location {
    id: string;
    name: string;
    lat: number;
    lng: number;
    address: string;
    type: string;
    status: string;
    attendees: number;
    lastUpdated: string;
}

export const DEFAULT_LOCATIONS: Location[] = [
    {
        id: "1",
        name: "CLC Tagum HQ",
        lat: 7.4478,
        lng: 125.8093,
        address: "Briz District, Tagum City",
        type: "Headquarters",
        status: "Online",
        attendees: 1250,
        lastUpdated: "Just now"
    },
    {
        id: "2",
        name: "CLC Apokon Outreach",
        lat: 7.4355,
        lng: 125.8234,
        address: "Apokon, Tagum City",
        type: "Community Center",
        status: "Active",
        attendees: 420,
        lastUpdated: "2 mins ago"
    },
    {
        id: "3",
        name: "CLC Mankilam Hub",
        lat: 7.4612,
        lng: 125.7956,
        address: "Mankilam, Tagum City",
        type: "Small Group Hub",
        status: "Online",
        attendees: 180,
        lastUpdated: "5 mins ago"
    }
];

export const MAP_CONFIG = {
    defaultCenter: [7.4478, 125.8093] as [number, number],
    defaultZoom: 13,
    activeZoom: 16,
    tileLayer: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
};
