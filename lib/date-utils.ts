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
