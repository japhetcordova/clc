import { decodeHTMLEntities } from "./utils";

export async function getVOTD() {
    try {
        // Prepare date key for VerseOfTheDay.com scraping (MMDDYYYY)
        const now = new Date();
        const manilaParts = new Intl.DateTimeFormat('en-US', {
            timeZone: 'Asia/Manila',
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
        }).formatToParts(now);

        const month = manilaParts.find(p => p.type === 'month')?.value;
        const day = manilaParts.find(p => p.type === 'day')?.value;
        const year = manilaParts.find(p => p.type === 'year')?.value;
        const dateKey = `${month}${day}${year}`;

        const fullDate = new Intl.DateTimeFormat('en-US', {
            timeZone: 'Asia/Manila',
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        }).format(now);

        // Fetch both APIs in parallel with timeout
        // Note: BibleGateway doesn't take a date, so it might be out of sync with Manila time
        const [bgResult, votdResult] = await Promise.allSettled([
            // BibleGateway API
            fetch("https://www.biblegateway.com/votd/get/?format=json&version=NIV", {
                next: { revalidate: 3600 },
                signal: AbortSignal.timeout(5000) // 5 second timeout
            }).then(res => res.json()),

            // VerseOfTheDay.com
            fetch(`https://www.verseoftheday.com/en/${dateKey}/`, {
                next: { revalidate: 3600 },
                signal: AbortSignal.timeout(5000)
            }).then(res => res.text())
        ]);

        // Variables to hold our results
        let text = "";
        let reference = "";
        let thoughts = "When we become Christians through faith and our baptism into Christ, the Holy Spirit makes us one with all other Christians around the world. Race, gender, and social status are not what matter in our lives.";
        let prayer = "Abba Father, thank you for adopting me into your family. May we, your children, truly be one on earth now, as we will be when we are all together around your throne in heaven. Amen.";
        let audioUrl = undefined;
        let permalink = undefined;
        let version = "New International Version";

        // 1. Extract from VerseOfTheDay.com FIRST (since it's tied to our Manila dateKey)
        if (votdResult.status === 'fulfilled') {
            const html = votdResult.value;

            // Extract reference from title
            const fullTitleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
            const fullTitle = fullTitleMatch ? decodeHTMLEntities(fullTitleMatch[1].trim()) : "";
            reference = fullTitle.split(/[—–-]/)[0].trim();

            // Extract verse text from og:description
            const verseMatch = html.match(/<meta\s+property="og:description"\s+content="([^"]+)"/i) ||
                html.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
            text = verseMatch ? decodeHTMLEntities(verseMatch[1].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()) : "";

            // Extract thoughts and prayer 
            const thoughtsMatch = html.match(/<h3>Thoughts on Today's Verse...<\/h3>([\s\S]*?)<h3>/i) ||
                html.match(/<h[23]>Thoughts[\s\S]*?<\/h[23]>([\s\S]*?)<h/i);
            const prayerMatch = html.match(/<h3>My Prayer...<\/h3>([\s\S]*?)<h3>/i) ||
                html.match(/<h[23]>My Prayer[\s\S]*?<\/h[23]>([\s\S]*?)<h/i);

            const cleanContent = (content: string) => {
                let text = content
                    .replace(/<br\s*\/?>/gi, '\n')
                    .replace(/<\/p>/gi, '\n')
                    .replace(/<[^>]*>/g, '')
                    .replace(/\s+(\*{1,4})/g, '\n$1');
                return decodeHTMLEntities(text.split("The Thoughts and Prayer")[0].trim());
            };

            if (thoughtsMatch) thoughts = cleanContent(thoughtsMatch[1]);
            if (prayerMatch) prayer = cleanContent(prayerMatch[1]);

            // Extract audio URL
            const audioMatch = html.match(/<source\s+src="([^"]+)"\s+type="audio\/mpeg"/i);
            if (audioMatch) audioUrl = audioMatch[1];
        }

        // 2. If VerseOfTheDay.com failed to provide text/reference, fallback to BibleGateway
        if ((!text || !reference) && bgResult.status === 'fulfilled') {
            const bgVotd = bgResult.value.votd;
            if (bgVotd) {
                if (!text) {
                    const rawText = bgVotd.content || bgVotd.text;
                    text = decodeHTMLEntities(rawText.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim());
                }
                if (!reference) {
                    reference = decodeHTMLEntities(bgVotd.display_ref || bgVotd.reference);
                }
                version = bgVotd.version || version;
                audioUrl = audioUrl || bgVotd.audiolink;
                permalink = bgVotd.permalink;
            }
        }

        // 3. Final Fallback
        if (!text) {
            text = "Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.";
            reference = "Proverbs 3:5-6";
        }

        return {
            text,
            reference,
            version,
            audioUrl,
            permalink,
            thoughts,
            prayer,
            date: dateKey,
            fullDate
        };
    } catch (error) {
        console.error("Error fetching VOTD:", error);
        // Fallback to static data if everything fails
        return {
            text: "Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
            reference: "Proverbs 3:5-6",
            version: "New International Version",
            thoughts: "When we become Christians through faith and our baptism into Christ, the Holy Spirit makes us one with all other Christians around the world.",
            prayer: "Abba Father, thank you for adopting me into your family. Amen.",
            fullDate: new Date().toLocaleDateString('en-US', {
                timeZone: 'Asia/Manila',
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            })
        };
    }
}
