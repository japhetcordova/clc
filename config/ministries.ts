export interface Ministry {
    id: string;
    name: string;
    description: string;
    roleDescription: string;
    responsibilities: string[];
}

export const DEFAULT_MINISTRIES: Ministry[] = [
    {
        id: "worship",
        name: "Worship Team",
        description: "Leading the congregation in praise and worship, setting the spiritual atmosphere for the service.",
        roleDescription: "As a Worship Team member, you will use your musical or vocal talents to lead others into God's presence. You'll work closely with the team to prepare and present music that honors God and edifies the church.",
        responsibilities: [
            "Lead worship during services",
            "Attend weekly rehearsals",
            "Maintain spiritual preparation",
            "Collaborate on song selection"
        ]
    },
    {
        id: "media",
        name: "Media",
        description: "Capturing moments and communicating the church's message through photography, video, and social media.",
        roleDescription: "The Media team tells the story of our church. You'll be involved in photography, videography, graphic design, or managing our social media presence to reach our community and beyond.",
        responsibilities: [
            "Photography & Videography",
            "Content creation for socials",
            "Live streaming management",
            "Event coverage"
        ]
    },
    {
        id: "usher",
        name: "Usher",
        description: "Welcoming guests and members, helping them find seats, and facilitating the offering.",
        roleDescription: "Ushers are the smiling faces that help maintain order and flow during services. Your role involves welcoming attendees, assisting with seating, and handling the collection of tithes and offerings with integrity.",
        responsibilities: [
            "Greet and seat attendees",
            "Collect offering",
            "Assist with communion",
            "Maintain auditorium order"
        ]
    },
    {
        id: "marshal",
        name: "Marshal",
        description: "Ensuring the safety and security of the church premises and attendees.",
        roleDescription: "Marshals protect the flock. You will monitor the church grounds, manage traffic flow, and ensure a safe environment for everyone attending our services and events.",
        responsibilities: [
            "Parking lot management",
            "Security surveillance",
            "Emergency response",
            "Venue safety checks"
        ]
    },
    {
        id: "production",
        name: "Production",
        description: "Managing the stage, lighting, and overall production quality of the service.",
        roleDescription: "The Production team works behind the scenes to create a seamless service experience. You'll handle lighting, stage management, and coordinate cues to ensure everything runs smoothly.",
        responsibilities: [
            "Lighting operation",
            "Stage management",
            "Service flow coordination",
            "Prop and set design"
        ]
    },
    {
        id: "kids-church",
        name: "Kid's Church",
        description: "Nurturing the next generation through age-appropriate teaching and activities.",
        roleDescription: "Invest in the future! In Kid's Church, you'll teach bible stories, lead games, and create a fun, safe environment where children can learn about Jesus and grow in their faith.",
        responsibilities: [
            "Teach lessons",
            "Lead activities & crafts",
            "Ensure child safety",
            "Parent communication"
        ]
    },
    {
        id: "technical",
        name: "Technical",
        description: "Handling the projection, lyrics, and presentation software during services.",
        roleDescription: "The Tech team ensures the message is seen. You'll operate the presentation software for lyrics, scripture, and sermon notes, ensuring visuals are timely and accurate.",
        responsibilities: [
            "Lyrics projection",
            "Sermon slides management",
            "Visual assets display",
            "Software operation"
        ]
    },
    {
        id: "pa",
        name: "PA",
        description: "Managing sound engineering and audio mixing for clear and balanced sound.",
        roleDescription: "The PA team ensures the message is heard. You will be responsible for mixing audio for the band and speakers, managing microphones, and maintaining audio equipment.",
        responsibilities: [
            "Live audio mixing",
            "Microphone management",
            "Equipment maintenance",
            "Sound check setup"
        ]
    },
    {
        id: "finance",
        name: "Finance",
        description: "Counting and recording tithes and offerings with integrity and transparency.",
        roleDescription: "The Finance team handles the church's resources with stewardship. You will assist in counting the offering, recording data, and ensuring financial integrity in our processes.",
        responsibilities: [
            "Count offerings",
            "Record financial data",
            "Maintain confidentiality",
            "Adhere to financial protocols"
        ]
    },
    {
        id: "arete",
        name: "Arete",
        description: "Creative arts team focused on drama, dance, and special presentations.",
        roleDescription: "Arete expresses worship through the arts. Whether it's dance, drama, or spoken word, you'll help craft creative moments that illustrate the gospel and move hearts.",
        responsibilities: [
            "Perform special numbers",
            "Choreography & script practice",
            "Creative service planning",
            "Costume & prop prep"
        ]
    },
    {
        id: "hosting",
        name: "Hosting",
        description: "Leading the service flow, making announcements, and engaging the congregation.",
        roleDescription: "Hosts are the voice of the service flow. You'll welcome everyone, facilitate transitions, make announcements, and help engage the congregation from the stage.",
        responsibilities: [
            "Service opening/closing",
            "Announcements",
            "Congregation engagement",
            "Platform presence"
        ]
    },
    {
        id: "writer",
        name: "Writer",
        description: "Crafting written content for blogs, devotionals, and church communications.",
        roleDescription: "Writers articulate the heart of the church. You'll create blog posts, devotionals, social media captions, and other written materials that inspire and inform our community.",
        responsibilities: [
            "Blog & devotional writing",
            "Copywriting for promo",
            "Editing & proofreading",
            "Content strategy"
        ]
    },
    {
        id: "general-services",
        name: "General Services",
        description: "Maintaing the cleanliness and preparation of the church facilities.",
        roleDescription: "General Services creates a welcoming physical environment. You'll help with facility maintenance, setup and teardown for events, and ensuring the church is clean and ready for guests.",
        responsibilities: [
            "Facility cleaning",
            "Event setup/teardown",
            "Maintenance repairs",
            "Supply inventory"
        ]
    }
];
