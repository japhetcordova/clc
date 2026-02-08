import { db } from "@/db";
import { videos } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

// CLC Tagum Facebook Page ID
const FB_PAGE_ID = "1549536122038390"; // Corrected ID for Christian Life Center - Tagum City

export async function getRecentVideos() {
    return await db.select()
        .from(videos)
        .orderBy(desc(videos.publishedAt))
        .limit(20);
}

export async function getLiveVideo() {
    const [live] = await db.select()
        .from(videos)
        .where(eq(videos.isLive, true))
        .limit(1);

    return live || null;
}

/**
 * This is a simplified "sync" function. 
 * In a real-world app, you'd use a Facebook Graph API token.
 * For now, we'll implement the logic to handle the sync if a token is provided.
 */
export async function syncFacebookVideos(accessToken?: string) {
    if (!accessToken) {
        console.warn("No Facebook Access Token provided. Skipping real sync.");
        return { success: false, error: "Missing token" };
    }

    try {
        const response = await fetch(
            `https://graph.facebook.com/v19.0/${FB_PAGE_ID}/videos?fields=id,title,description,thumbnails,source,is_live,created_time&access_token=${accessToken}`
        );

        if (!response.ok) {
            throw new Error(`FB API error: ${response.statusText}`);
        }



        const data = await response.json();
        const fbVideos = data.data || [];

        for (const video of fbVideos) {
            const thumbnail = video.thumbnails?.data?.[0]?.uri || "";

            await db.insert(videos)
                .values({
                    fbId: video.id,
                    title: video.title || "Untitled Service",
                    description: video.description || "",
                    thumbnail: thumbnail,
                    videoUrl: `https://www.facebook.com/watch/?v=${video.id}`,
                    isLive: video.is_live || false,
                    publishedAt: new Date(video.created_time),
                })
                .onConflictDoUpdate({
                    target: videos.fbId,
                    set: {
                        isLive: video.is_live || false,
                        title: video.title || "Untitled Service",
                        description: video.description || "",
                        thumbnail: thumbnail,
                    }
                });
        }

        return { success: true, count: fbVideos.length };
    } catch (error) {
        console.error("Failed to sync Facebook videos:", error);
        return { success: false, error: String(error) };
    }
}
