import { decodeHTMLEntities } from "./utils";

export async function getVOTD() {
    try {
        // Prepare date key for VerseOfTheDay.com scraping (MMDDYYYY)
        const now = new Date();
        const manilaDate = new Intl.DateTimeFormat('en-US', {
            timeZone: 'Asia/Manila',
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
        }).formatToParts(now);

        const month = manilaDate.find(p => p.type === 'month')?.value;
        const day = manilaDate.find(p => p.type === 'day')?.value;
        const year = manilaDate.find(p => p.type === 'year')?.value;
        const dateKey = `${month}${day}${year}`;

        const fullDate = new Intl.DateTimeFormat('en-US', {
            timeZone: 'Asia/Manila',
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        }).format(now);

        // Fetch both APIs in parallel with timeout
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

        // Extract BibleGateway data
        let votd = null;
        if (bgResult.status === 'fulfilled') {
            votd = bgResult.value.votd;
        }

        // Extract VerseOfTheDay.com data
        let thoughts = "When we become Christians through faith and our baptism into Christ, the Holy Spirit makes us one with all other Christians around the world. Race, gender, and social status are not what matter in our lives.";
        let prayer = "Abba Father, thank you for adopting me into your family. May we, your children, truly be one on earth now, as we will be when we are all together around your throne in heaven. Amen.";

        if (votdResult.status === 'fulfilled') {
            const html = votdResult.value;
            const thoughtsMatch = html.match(/<h3>Thoughts on Today's Verse...<\/h3>([\s\S]*?)<h3>/i);
            const prayerMatch = html.match(/<h3>My Prayer...<\/h3>([\s\S]*?)<h3>/i);

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

            if (thoughtsMatch) {
                thoughts = cleanContent(thoughtsMatch[1]);
            }
            if (prayerMatch) {
                prayer = cleanContent(prayerMatch[1]);
            }
        }

        return {
            text: decodeHTMLEntities(votd?.content || votd?.text || "Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight."),
            reference: decodeHTMLEntities(votd?.display_ref || votd?.reference || "Proverbs 3:5-6"),
            version: votd?.version || "New International Version",
            audioUrl: votd?.audiolink,
            permalink: votd?.permalink,
            thoughts,
            prayer,
            date: dateKey,
            fullDate
        };
    } catch (error) {
        console.error("Error fetching VOTD:", error);
        // Fallback to static data if API fails
        return {
            text: "Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
            reference: "Proverbs 3:5-6",
            version: "New International Version",
            thoughts: "When we become Christians through faith and our baptism into Christ, the Holy Spirit makes us one with all other Christians around the world.",
            prayer: "Abba Father, thank you for adopting me into your family. Amen.",
            fullDate: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
        };
    }
}
