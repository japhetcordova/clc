import "dotenv/config";
import { db } from "./db";
import { videos } from "./db/schema";

async function checkVideos() {
    const allVideos = await db.select().from(videos);
    console.log("Total videos in DB:", allVideos.length);

    const live = allVideos.filter(v => v.isLive);
    console.log("Live videos detected:", live.length);
    if (live.length > 0) {
        console.log("Live Video Details:", live.map(v => ({ id: v.fbId, title: v.title })));
    }

    console.log("\nLast 5 items in DB:");
    allVideos.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
    console.log(allVideos.slice(0, 5).map(v => ({
        id: v.fbId,
        title: v.title,
        isLive: v.isLive,
        publishedAt: v.publishedAt.toLocaleString()
    })));
}

checkVideos().catch(console.error);
