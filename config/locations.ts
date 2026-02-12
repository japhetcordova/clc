export interface Location {
    id: string;
    name: string;
    lat: number;
    lng: number;
    address: string;
    district: string;
    region: string;
    type: "Campus" | "Watch Party";
    thumbnail: string;
    hostedBy?: string;
    phone?: string;
    googleMapsLink?: string;
    serviceTimes: string[];
}

export const DEFAULT_LOCATIONS: Location[] = [
    {
        id: "1",
        name: "Tagum",
        lat: 7.4515,
        lng: 125.8024,
        address: "Cor. Sobrecary and Pioneer Streets, Tagum City, Philippines, 8100",
        district: "Tagum City",
        region: "Mindanao",
        type: "Campus",
        thumbnail: "/location_thumbnails/tagum.webp",
        hostedBy: "Central Leadership",
        phone: "0916 461 3649",
        googleMapsLink: "https://www.google.com/maps/place/Christian+Life+Center+-+Tagum+City/@7.4515283,125.7997885,17z/data=!4m6!3m5!1s0x32f95313be6009a5:0x7425d83a59feb39c!8m2!3d7.4515283!4d125.8023634!16s%2Fg%2F11cs1slhl1?entry=ttu",
        serviceTimes: ["10:00 AM - 11:45 AM", "5:00 PM - 6:45 PM"]
    },
    {
        id: "2",
        name: "B.E DUJALI",
        lat: 7.4381,
        lng: 125.7214,
        address: "Purok 1-C Cabay angan B.E DUJALI",
        district: "B.E Dujali",
        region: "Mindanao",
        type: "Campus",
        thumbnail: "/location_thumbnails/dujali.webp",
        hostedBy: "Campus Pastor",
        phone: "0916 461 3649",
        googleMapsLink: "https://maps.app.goo.gl/azPmU49CvjmFcxVw5",
        serviceTimes: ["10:00 AM - 11:45 AM"]
    },
    {
        id: "3",
        name: "VALENCIA CITY",
        lat: 7.9037,
        lng: 125.0906,
        address: "Brgy poblacion, Fronting Old gaisano",
        district: "Valencia City",
        region: "Mindanao",
        type: "Campus",
        thumbnail: "/location_thumbnails/valencia.webp",
        hostedBy: "Campus Pastor",
        phone: "0916 461 3649",
        serviceTimes: ["10:00 AM - 11:45 AM"]
    },
    {
        id: "4",
        name: "Asuncion",
        lat: 7.5376,
        lng: 125.7539,
        address: "4th Floor Trocio Building, Cambanogoy, Asuncion",
        district: "Asuncion",
        region: "Mindanao",
        type: "Campus",
        thumbnail: "/location_thumbnails/asuncion.webp",
        hostedBy: "Campus Pastor",
        phone: "0916 461 3649",
        googleMapsLink: "https://maps.app.goo.gl/uy1oYG3hd586of5r6",
        serviceTimes: ["10:00 AM - 11:45 AM"]
    },
    {
        id: "5",
        name: "Kapalong",
        lat: 7.5848,
        lng: 125.7062,
        address: "Prk 10A Maniki Kapalong DDN",
        district: "Kapalong",
        region: "Mindanao",
        type: "Campus",
        thumbnail: "/location_thumbnails/kapalong.webp",
        hostedBy: "Campus Pastor",
        phone: "0916 461 3649",
        googleMapsLink: "https://maps.app.goo.gl/P5do1osMRtNGp1Qt6",
        serviceTimes: ["10:00 AM - 11:45 AM"]
    },
    {
        id: "6",
        name: "Cubao",
        lat: 14.6178,
        lng: 121.0571,
        address: "Cubao, Quezon City",
        district: "Metro Manila",
        region: "Luzon",
        type: "Watch Party",
        thumbnail: "/location_thumbnails/cubao.webp",
        hostedBy: "Church member",
        phone: "0916 461 3649",
        googleMapsLink: "https://maps.app.goo.gl/SGmZ7SfeahPyVA6j9",
        serviceTimes: ["10:00 AM - 11:45 AM"]
    },
    {
        id: "7",
        name: "Cebu",
        lat: 10.3157,
        lng: 123.8854,
        address: "Cebu City",
        district: "Cebu",
        region: "Visayas",
        type: "Watch Party",
        thumbnail: "/location_thumbnails/cebu.webp",
        hostedBy: "Church member",
        phone: "0916 461 3649",
        googleMapsLink: "https://maps.app.goo.gl/tXdtkzZQJkKD4uyh6",
        serviceTimes: ["10:00 AM - 11:45 AM"]
    },
    {
        id: "8",
        name: "Digos",
        lat: 6.7578,
        lng: 125.3527,
        address: "Digos City",
        district: "Davao del Sur",
        region: "Mindanao",
        type: "Campus",
        thumbnail: "/location_thumbnails/digos.webp",
        hostedBy: "Campus Pastor",
        phone: "0916 461 3649",
        googleMapsLink: "https://maps.app.goo.gl/93xTQH5hzHqueiRN9",
        serviceTimes: ["10:00 AM - 11:45 AM"]
    },
    {
        id: "9",
        name: "CDO",
        lat: 8.4542,
        lng: 124.6319,
        address: "Cagayan de Oro City",
        district: "Misamis Oriental",
        region: "Mindanao",
        type: "Campus",
        thumbnail: "/location_thumbnails/cdo.webp",
        hostedBy: "Campus Pastor",
        phone: "0916 461 3649",
        googleMapsLink: "https://maps.app.goo.gl/WvRiww1nW35J5uDv5",
        serviceTimes: ["10:00 AM - 11:45 AM"]
    },
    {
        id: "10",
        name: "Sto. Tomas",
        lat: 7.5338,
        lng: 125.6235,
        address: "Sto. Tomas, Davao del Norte",
        district: "Sto. Tomas",
        region: "Mindanao",
        type: "Campus",
        thumbnail: "/location_thumbnails/stotomas.webp",
        hostedBy: "Campus Pastor",
        phone: "0916 461 3649",
        googleMapsLink: "https://maps.app.goo.gl/iqP18wqJJ5H1eLP79",
        serviceTimes: ["10:00 AM - 11:45 AM"]
    },
    {
        id: "11",
        name: "Mati",
        lat: 6.9550,
        lng: 126.2165,
        address: "Mati City, Davao Oriental",
        district: "Mati City",
        region: "Mindanao",
        type: "Campus",
        thumbnail: "/location_thumbnails/mati.webp",
        hostedBy: "Campus Pastor",
        phone: "0916 461 3649",
        googleMapsLink: "https://maps.app.goo.gl/DqQZUkVMRaG3bd5c8",
        serviceTimes: ["10:00 AM - 11:45 AM"]
    },
    {
        id: "12",
        name: "Hong Kong",
        lat: 22.3371,
        lng: 114.1376,
        address: "Ling Nan Garden Lai Chi Kok Park Mei foo MTR Exit A",
        district: "Hong Kong",
        region: "International",
        type: "Campus",
        thumbnail: "/bg/events.webp",
        hostedBy: "Campus Pastor",
        phone: "0916 461 3649",
        googleMapsLink: "https://www.google.com/maps/search/?api=1&query=Ling+Nan+Garden+Lai+Chi+Kok+Park+Mei+Foo+Hong+Kong",
        serviceTimes: ["2:00 PM - 4:00 PM"]
    }
];

export const MAP_CONFIG = {
    defaultCenter: [7.4515, 125.8024] as [number, number],
    defaultZoom: 13,
    activeZoom: 16,
    tileLayerDark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
    tileLayerLight: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
};
