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
    },
    {
        id: "4",
        name: "CLC Visayan Village Hub",
        lat: 7.4215,
        lng: 125.8052,
        address: "Visayan Village, Tagum City",
        type: "Community Center",
        status: "Active",
        attendees: 310,
        lastUpdated: "Just now"
    },
    {
        id: "5",
        name: "CLC San Miguel Station",
        lat: 7.4682,
        lng: 125.8214,
        address: "San Miguel, Tagum City",
        type: "Small Group Hub",
        status: "Online",
        attendees: 145,
        lastUpdated: "10 mins ago"
    },
    {
        id: "6",
        name: "CLC Magugpo East Outreach",
        lat: 7.4521,
        lng: 125.8156,
        address: "Magugpo East, Tagum City",
        type: "Outreach Center",
        status: "Active",
        attendees: 280,
        lastUpdated: "4 mins ago"
    },
    {
        id: "7",
        name: "CLC Cuambogan Gathering",
        lat: 7.4854,
        lng: 125.7892,
        address: "Cuambogan, Tagum City",
        type: "Gathering Point",
        status: "Online",
        attendees: 95,
        lastUpdated: "1 min ago"
    },
    {
        id: "8",
        name: "CLC Madaum Coastal Hub",
        lat: 7.3782,
        lng: 125.8541,
        address: "Madaum, Tagum City",
        type: "Mission Station",
        status: "Active",
        attendees: 165,
        lastUpdated: "Just now"
    },
    {
        id: "9",
        name: "CLC Canocotan Network",
        lat: 7.4092,
        lng: 125.7725,
        address: "Canocotan, Tagum City",
        type: "Small Group Hub",
        status: "Online",
        attendees: 110,
        lastUpdated: "8 mins ago"
    },
    {
        id: "10",
        name: "CLC New Balamban Base",
        lat: 7.4921,
        lng: 125.8184,
        address: "New Balamban, Tagum City",
        type: "Community Center",
        status: "Active",
        attendees: 220,
        lastUpdated: "3 mins ago"
    },
    {
        id: "11",
        name: "CLC Pagsabangan Outreach",
        lat: 7.4582,
        lng: 125.7512,
        address: "Pagsabangan, Tagum City",
        type: "Outreach Center",
        status: "Online",
        attendees: 195,
        lastUpdated: "12 mins ago"
    },
    {
        id: "12",
        name: "CLC San Isidro Group",
        lat: 7.4725,
        lng: 125.8456,
        address: "San Isidro, Tagum City",
        type: "Small Group Hub",
        status: "Active",
        attendees: 85,
        lastUpdated: "Just now"
    },
    {
        id: "13",
        name: "CLC Tipaz Community",
        lat: 7.4362,
        lng: 125.7884,
        address: "Tipaz, Tagum City",
        type: "Gathering Point",
        status: "Online",
        attendees: 130,
        lastUpdated: "6 mins ago"
    },
    {
        id: "14",
        name: "CLC Magugpo West Center",
        lat: 7.4412,
        lng: 125.8012,
        address: "Magugpo West, Tagum City",
        type: "Outreach Center",
        status: "Active",
        attendees: 410,
        lastUpdated: "2 mins ago"
    }
];

export const MAP_CONFIG = {
    defaultCenter: [7.4478, 125.8093] as [number, number],
    defaultZoom: 13,
    activeZoom: 16,
    tileLayer: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
};
