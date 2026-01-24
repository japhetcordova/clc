export const getTodayString = () => {
    // Returns YYYY-MM-DD in Asia/Manila timezone
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Manila',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(new Date());
};

export const getManilaMidnight = () => {
    const now = new Date();
    // Get current time in Manila
    const manilaTimeStr = now.toLocaleString('en-US', { timeZone: 'Asia/Manila' });
    const manilaDate = new Date(manilaTimeStr);

    // Set to 24:00:00 (next midnight) in Manila time
    const midnight = new Date(manilaTimeStr);
    midnight.setHours(24, 0, 0, 0);

    // Calculate how many MS from 'now' in Manila until 'midnight' in Manila
    const msUntilMidnight = midnight.getTime() - manilaDate.getTime();

    // Return a global Date object that corresponds to that moment
    return new Date(now.getTime() + msUntilMidnight);
};

export const getPrayerAndFastingDay = () => {
    // Campaign: Jan 10 - Jan 31, 2026
    const startDate = new Date('2026-01-10T00:00:00Z'); // Using UTC for simplified start of day calculation
    // Adjust to Manila start of day
    const manilaStart = new Date('2026-01-10T00:00:00+08:00');

    // Get current time in Manila
    const nowStr = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' });
    const nowInManila = new Date(nowStr);

    // Reset both to midnight for accurate day counting
    const d1 = new Date(manilaStart.getFullYear(), manilaStart.getMonth(), manilaStart.getDate());
    const d2 = new Date(nowInManila.getFullYear(), nowInManila.getMonth(), nowInManila.getDate());

    const diffTime = d2.getTime() - d1.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

    if (diffDays < 1 || diffDays > 22) return null; // 21 days + buffer if needed, but 21 is target

    return diffDays;
};
