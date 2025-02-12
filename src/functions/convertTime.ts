/**
 * Converts a time from a readable format to milliseconds. The format is a space-separated list of time units. The units can be:
 * - `Xd` for days
 * - `Xh` for hours
 * - `Xm` for minutes
 * - `Xs` for seconds
 * - `HH:MM` for a time of day
 *  - The time is interpreted as the next occurrence of that time of day.
 *
 * @param {string} input
 * @returns {number} The time in milliseconds.
 *
 * @example
 * ```ts
 *  parseTimeToMilliseconds("1d 2h 3m 4s"); // 93784000
 * parseTimeToMilliseconds("1d 2h 3m 4s 5h"); // 93784000
 * parseTimeToMilliseconds("1d 2h 3m 4s 5h 6m"); // 93784600
 * ```
 */
export function parseTimeToMilliseconds(input: string): number | null {
    const regex =
        /(?:(\d+)d)|(?:(\d+)h)|(?:(\d+)m)|(?:(\d+)s)|^(\d{1,2}):(\d{2})$/g;
    let totalMilliseconds = 0;
    let match;
    const now = new Date();

    while ((match = regex.exec(input)) !== null) {
        if (match[1])
            totalMilliseconds += parseInt(match[1], 10) * 86400000; // Days to ms
        else if (match[2])
            totalMilliseconds += parseInt(match[2], 10) * 3600000; // Hours to ms
        else if (match[3])
            totalMilliseconds += parseInt(match[3], 10) * 60000; // Minutes to ms
        else if (match[4])
            totalMilliseconds += parseInt(match[4], 10) * 1000; // Seconds to ms
        else if (match[5] && match[6]) {
            const hours = parseInt(match[5], 10);
            const minutes = parseInt(match[6], 10);
            if (hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) {
                const target = new Date(now);
                target.setHours(hours, minutes, 0, 0);
                if (target < now) target.setDate(target.getDate() + 1);
                totalMilliseconds += target.getTime() - now.getTime();
            }
        }
    }
    return totalMilliseconds > 0 ? totalMilliseconds : null;
}
