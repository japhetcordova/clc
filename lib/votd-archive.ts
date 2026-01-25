import { decodeHTMLEntities } from "./utils";

export async function getVOTDByDate(dateInput: string) {
    try {
        let dateKey = dateInput;
        let date: Date;

        // 1. Handle MMDDYYYY format (our primary key)
        if (/^\d{8}$/.test(dateInput)) {
            const month = dateInput.substring(0, 2);
            const day = dateInput.substring(2, 4);
            const year = dateInput.substring(4, 8);
            date = new Date(`${year}-${month}-${day}`);
        }
        // 2. Handle ISO or other parseable formats (e.g., 2026-01-13)
        else {
            date = new Date(dateInput);
            if (isNaN(date.getTime())) throw new Error("Invalid date format");

            const m = String(date.getMonth() + 1).padStart(2, '0');
            const d = String(date.getDate()).padStart(2, '0');
            const y = date.getFullYear();
            dateKey = `${m}${d}${y}`;
        }

        const fullDate = new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        }).format(date);

        // Fetch from VerseOfTheDay.com
        const votdUrl = `https://www.verseoftheday.com/en/${dateKey}/`;

        const response = await fetch(votdUrl, {
            next: { revalidate: 86400 } // Cache for 24 hours
        });

        if (!response.ok) {
            throw new Error('Failed to fetch devotional');
        }

        const html = await response.text();

        // 1. Extract reference from title (much more robustly)
        const fullTitleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
        const fullTitle = fullTitleMatch ? fullTitleMatch[1].trim() : "";
        const reference = fullTitle.split(/[—–-]/)[0].trim(); // Split by em-dash, en-dash, or regular dash

        // 2. Extract verse text from og:description
        const verseMatch = html.match(/<meta\s+property="og:description"\s+content="([^"]+)"/i) ||
            html.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
        const verse = verseMatch ? verseMatch[1] : "";

        // 3. Extract thoughts and prayer with improved markers
        const thoughtsMatch = html.match(/<h3>Thoughts on Today's Verse...<\/h3>([\s\S]*?)<h3>/i) ||
            html.match(/<h[23]>Thoughts[\s\S]*?<\/h[23]>([\s\S]*?)<h/i);

        const prayerMatch = html.match(/<h3>My Prayer...<\/h3>([\s\S]*?)<h3>/i) ||
            html.match(/<h[23]>My Prayer[\s\S]*?<\/h[23]>([\s\S]*?)<h/i);

        const cleanContent = (content: string) => {
            let text = content
                .replace(/<br\s*\/?>/gi, '\n')
                .replace(/<\/p>/gi, '\n')
                .replace(/<[^>]*>/g, '')
                // Only split if asterisks are preceded by whitespace (likely a footer)
                // and strictly not if they are attached to a word (likely a marker)
                .replace(/\s+(\*{1,4})/g, '\n$1');

            return decodeHTMLEntities(text.split("The Thoughts and Prayer")[0].trim());
        };

        const thoughts = thoughtsMatch ? cleanContent(thoughtsMatch[1]) : "";
        const prayer = prayerMatch ? cleanContent(prayerMatch[1]) : "";

        // 4. Extract audio URL
        const audioMatch = html.match(/<source\s+src="([^"]+)"\s+type="audio\/mpeg"/i);
        const audioUrl = audioMatch ? audioMatch[1] : undefined;

        return {
            text: decodeHTMLEntities(verse.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()),
            reference: decodeHTMLEntities(reference),
            version: "New International Version",
            thoughts,
            prayer,
            audioUrl,
            date: dateKey,
            fullDate
        };
    } catch (error) {
        console.error(`Error fetching VOTD for ${dateInput}:`, error);
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
