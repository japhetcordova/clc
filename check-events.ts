import { db } from "./db/index.js";
import { events } from "./db/schema.js";

async function checkEvents() {
    try {
        const allEvents = await db.select().from(events);
        console.log(`\n📊 Total events in database: ${allEvents.length}\n`);

        if (allEvents.length > 0) {
            console.log("Events found:");
            allEvents.forEach((event, index) => {
                console.log(`\n${index + 1}. ${event.title}`);
                console.log(`   Date: ${event.date}`);
                console.log(`   Time: ${event.time}`);
                console.log(`   Location: ${event.location}`);
                console.log(`   Category: ${event.category}`);
                console.log(`   ID: ${event.id}`);
            });
        } else {
            console.log("⚠️  No events found in the database.");
            console.log("The events page will show an empty state.");
        }

        process.exit(0);
    } catch (error) {
        console.error("Error checking events:", error);
        process.exit(1);
    }
}

checkEvents();
