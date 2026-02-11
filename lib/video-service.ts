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
 * Sync Facebook videos using the Graph API.
 * This follows Facebook's official guidelines:
 * 1. Fetch live_videos with broadcast_status=LIVE to detect active streams
 * 2. Store the embed_html for compliant embedding
 * 3. Fetch regular videos for the archive
 */
export async function syncFacebookVideos(accessToken?: string) {
    if (!accessToken) {
        console.warn("No Facebook Access Token provided. Skipping real sync.");
        return { success: false, error: "Missing token" };
    }

    try {
        console.log("Starting Facebook Video Sync...");

        // 0. Auto-upgrade to Page Access Token if possible
        // This is necessary because User Access Tokens often lack permission to fetch Page videos directly
        let effectiveToken = accessToken;
        try {
            const accountsResponse = await fetch(`https://graph.facebook.com/v19.0/me/accounts?access_token=${accessToken}`);
            if (accountsResponse.ok) {
                const accountsData = await accountsResponse.json();
                const page = accountsData.data?.find((p: any) => p.id === FB_PAGE_ID);
                if (page?.access_token) {
                    console.log("Successfully upgraded to Page Access Token");
                    effectiveToken = page.access_token;
                }
            }
        } catch (err) {
            console.warn("Failed to check for Page Access Token, proceeding with original token:", err);
        }

        // 1. Fetch ACTIVE live videos
        const broadcastStatuses = JSON.stringify(["LIVE"]);
        const liveResponse = await fetch(
            `https://graph.facebook.com/v19.0/${FB_PAGE_ID}/live_videos?fields=id,title,description,embed_html,status,creation_time,video{id,thumbnails},picture&broadcast_status=${encodeURIComponent(broadcastStatuses)}&access_token=${effectiveToken}`
        );

        // 2. Fetch recent videos for archive
        const videosResponse = await fetch(
            `https://graph.facebook.com/v19.0/${FB_PAGE_ID}/videos?fields=id,title,description,thumbnails,picture,embed_html,created_time&access_token=${effectiveToken}`
        );

        // Reset all isLive to false before updating
        await db.update(videos).set({ isLive: false, embedHtml: null });

        // Handle live videos first (priority)
        let liveCount = 0;
        let upcomingCount = 0;

        if (liveResponse.ok) {
            const liveData = await liveResponse.json();
            const liveVideos = liveData.data || [];
            console.log(`Found ${liveVideos.length} LIVE/SCHEDULED broadcasts`);

            for (const liveV of liveVideos) {
                // We process both LIVE and SCHEDULED
                const isActuallyLive = liveV.status === "LIVE";
                if (isActuallyLive) liveCount++;
                if (liveV.status === "SCHEDULED_PUBLISHED") upcomingCount++;

                const fbId = liveV.video?.id || liveV.id;

                // Get thumbnail: prioritize video.thumbnails, then picture, then fallback
                const thumbnail = liveV.video?.thumbnails?.data?.[0]?.uri
                    || liveV.picture
                    || `/bg/word.webp`;

                await db.insert(videos)
                    .values({
                        fbId: fbId,
                        title: liveV.title || "Worship Service Live",
                        description: liveV.description || "",
                        thumbnail: thumbnail,
                        videoUrl: `https://www.facebook.com/${FB_PAGE_ID}/videos/${fbId}/`,
                        embedHtml: liveV.embed_html || null,
                        isLive: isActuallyLive,
                        publishedAt: new Date(liveV.creation_time || Date.now()),
                    })
                    .onConflictDoUpdate({
                        target: videos.fbId,
                        set: {
                            isLive: isActuallyLive,
                            embedHtml: liveV.embed_html || null,
                            title: liveV.title || "Worship Service Live",
                            thumbnail: thumbnail,
                            publishedAt: new Date(liveV.creation_time || Date.now()),
                        }
                    });
            }
        } else {
            console.warn("Failed to fetch live_videos:", await liveResponse.text());
        }

        // Handle archived videos
        if (!videosResponse.ok) {
            const errorData = await videosResponse.json().catch(() => ({}));
            console.error("FB API Error (/videos):", errorData);
            throw new Error(`FB API error: ${videosResponse.statusText}`);
        }

        const videosData = await videosResponse.json();
        const fbVideos = videosData.data || [];

        for (const video of fbVideos) {
            // Priority: thumbnails query, then picture, then fallback
            const thumbnail = video.thumbnails?.data?.[0]?.uri
                || video.picture
                || "";

            await db.insert(videos)
                .values({
                    fbId: video.id,
                    title: video.title || "Worship Service",
                    description: video.description || "",
                    thumbnail: thumbnail,
                    videoUrl: `https://www.facebook.com/${FB_PAGE_ID}/videos/${video.id}/`,
                    embedHtml: video.embed_html || null,
                    isLive: false,
                    publishedAt: new Date(video.created_time),
                })
                .onConflictDoUpdate({
                    target: videos.fbId,
                    set: {
                        title: video.title || "Worship Service",
                        description: video.description || "",
                        thumbnail: thumbnail,
                        embedHtml: video.embed_html || null,
                        publishedAt: new Date(video.created_time),
                    }
                });
        }

        console.log(`Facebook Sync Completed. Live: ${liveCount}, Upcoming: ${upcomingCount}, Archived: ${fbVideos.length}`);
        return { success: true, liveCount, upcomingCount, archivedCount: fbVideos.length };
    } catch (error) {
        console.error("Failed to sync Facebook videos:", error);
        return { success: false, error: String(error) };
    }
}
