export interface Service {
    time: string;
    day: string;
    title: string;
    type: string;
}

export const REGULAR_SERVICES: Service[] = [
    { time: "08:30 AM", day: "Sunday", title: "First Service", type: "Main Gathering" },
    { time: "04:30 PM", day: "Sunday", title: "Second Service", type: "Main Gathering" },
    { time: "06:00 PM", day: "Tuesday", title: "Online Cell", type: "Online" },
    { time: "05:00 PM", day: "Wednesday", title: "Regeneration Campus", type: "Youth Ministry" },
    { time: "06:00 PM", day: "Friday", title: "Regeneration Upnext", type: "Youth Ministry" },
    { time: "06:00 PM", day: "Saturday", title: "Volunteer Service", type: "Volunteers" }
];
