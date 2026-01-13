"use server";

export async function getVOTDByDate(dateString: string) {
    try {
        // Parse date string (format: MMDDYYYY)
        const month = dateString.substring(0, 2);
        const day = dateString.substring(2, 4);
        const year = dateString.substring(4, 8);

        const date = new Date(`${year}-${month}-${day}`);
        const fullDate = new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        }).format(date);

        // Fetch from VerseOfTheDay.com
        const votdUrl = `https://www.verseoftheday.com/en/${dateString}/`;
        const response = await fetch(votdUrl, {
            next: { revalidate: 86400 } // Cache for 24 hours
        });

        if (!response.ok) {
            throw new Error('Failed to fetch devotional');
        }

        const html = await response.text();

        // Extract verse text
        const verseMatch = html.match(/<meta property="og:description" content="([^"]+)"/i);
        const verse = verseMatch ? verseMatch[1] : "";

        // Extract reference from title
        const titleMatch = html.match(/<title>([^—]+)—/i);
        const reference = titleMatch ? titleMatch[1].trim() : "";

        // Extract thoughts and prayer
        const thoughtsMatch = html.match(/<h3>Thoughts on Today's Verse...<\/h3>([\s\S]*?)<h3>/i);
        const prayerMatch = html.match(/<h3>My Prayer...<\/h3>([\s\S]*?)<h3>/i);

        let thoughts = thoughtsMatch
            ? thoughtsMatch[1].replace(/<[^>]*>/g, '').trim().split("The Thoughts and Prayer")[0].trim()
            : "";

        let prayer = prayerMatch
            ? prayerMatch[1].replace(/<[^>]*>/g, '').trim().split("The Thoughts and Prayer")[0].trim()
            : "";

        return {
            text: verse,
            reference,
            version: "New International Version",
            thoughts,
            prayer,
            date: dateString,
            fullDate
        };
    } catch (error) {
        console.error(`Error fetching VOTD for ${dateString}:`, error);
        return null;
    }
}

export async function getPreviousDevotionals(count: number = 7) {
    const devotionals = [];
    const now = new Date();

    // Set to Manila timezone
    const manilaDate = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Manila' }));

    for (let i = 1; i <= count; i++) {
        const date = new Date(manilaDate);
        date.setDate(date.getDate() - i);

        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        const dateKey = `${month}${day}${year}`;

        const shortDate = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        devotionals.push({
            dateKey,
            shortDate,
            dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'long' })
        });
    }

    return devotionals;
}
