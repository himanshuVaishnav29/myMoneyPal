/**
 * Timezone utility functions for handling user-specific date calculations
 */

/**
 * Get start and end of current month in user's timezone
 * @param {string} timezone - User's timezone (e.g., 'Asia/Kolkata', 'America/New_York')
 * @returns {Object} - {startOfMonth, endOfMonth}
 */
export const getCurrentMonthRange = (timezone = 'UTC') => {
    const now = new Date();
    
    // Get current date in user's timezone
    const userDate = new Date(now.toLocaleString("en-US", {timeZone: timezone}));
    
    // Calculate start of month in user's timezone
    const startOfMonth = new Date(userDate.getFullYear(), userDate.getMonth(), 1);
    
    // Calculate end of month in user's timezone
    const endOfMonth = new Date(userDate.getFullYear(), userDate.getMonth() + 1, 0, 23, 59, 59, 999);
    
    return { startOfMonth, endOfMonth };
};

/**
 * Get start and end of current week in user's timezone
 * @param {string} timezone - User's timezone
 * @returns {Object} - {startOfWeek, endOfWeek}
 */
export const getCurrentWeekRange = (timezone = 'UTC') => {
    const now = new Date();
    
    // Get current date in user's timezone
    const userDate = new Date(now.toLocaleString("en-US", {timeZone: timezone}));
    const dayOfWeek = userDate.getDay(); // 0 is Sunday, 6 is Saturday
    
    // Calculate start of week (Sunday) in user's timezone
    const startOfWeek = new Date(userDate);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(userDate.getDate() - dayOfWeek);
    
    // Calculate end of week (Saturday) in user's timezone
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    
    return { startOfWeek, endOfWeek };
};

/**
 * Convert date to user's timezone for comparison
 * @param {Date} date - Date to convert
 * @param {string} timezone - User's timezone
 * @returns {Date} - Date adjusted for user's timezone
 */
export const convertToUserTimezone = (date, timezone = 'UTC') => {
    return new Date(date.toLocaleString("en-US", {timeZone: timezone}));
};

/**
 * Get user's timezone from browser or default to UTC
 * @returns {string} - User's timezone
 */
export const getUserTimezone = () => {
    try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (error) {
        return 'UTC';
    }
};

export const convertToUTC = (date, timezone) => {
  return new Date(
    new Date(date.toLocaleString("en-US", { timeZone: timezone }))
      .toISOString()
  );
};

/**
 * Get today's date in YYYY-MM-DD format in user's timezone
 * @param {string} timezone - User's timezone
 * @returns {string} - Date string in YYYY-MM-DD format
 */
export const getTodayDateString = (timezone = 'UTC') => {
    const now = new Date();
    const userDate = new Date(now.toLocaleString("en-US", {timeZone: timezone}));
    const year = userDate.getFullYear();
    const month = String(userDate.getMonth() + 1).padStart(2, '0');
    const day = String(userDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * Get hours until tomorrow in user's timezone
 * @param {string} timezone - User's timezone
 * @returns {number} - Hours remaining until tomorrow
 */
export const getHoursUntilTomorrow = (timezone = 'UTC') => {
    const now = new Date();
    const userDate = new Date(now.toLocaleString("en-US", {timeZone: timezone}));
    const tomorrow = new Date(userDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const msUntilTomorrow = tomorrow - userDate;
    return Math.ceil(msUntilTomorrow / (1000 * 60 * 60));
};