/**
 * Get user's timezone from browser
 * @returns {string} - User's timezone (e.g., 'Asia/Kolkata', 'America/New_York')
 */
export const getUserTimezone = () => {
    try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (error) {
        console.warn('Could not detect timezone, defaulting to UTC');
        return 'UTC';
    }
};

/**
 * Format date for display in user's timezone
 * @param {Date|string} date - Date to format
 * @param {string} timezone - User's timezone
 * @returns {string} - Formatted date string
 */
export const formatDateInTimezone = (date, timezone = getUserTimezone()) => {
    try {
        const dateObj = new Date(date);
        return dateObj.toLocaleDateString('en-IN', {
            timeZone: timezone,
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (error) {
        return new Date(date).toLocaleDateString();
    }
};

/**
 * Get current date in user's timezone for date input default value
 * @param {string} timezone - User's timezone
 * @returns {string} - Date string in YYYY-MM-DD format
 */
export const getCurrentDateInTimezone = (timezone = getUserTimezone()) => {
    try {
        const now = new Date();
        const userDate = new Date(now.toLocaleString("en-US", {timeZone: timezone}));
        return userDate.toISOString().split('T')[0];
    } catch (error) {
        return new Date().toISOString().split('T')[0];
    }
};