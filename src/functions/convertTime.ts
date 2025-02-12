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
    const daysRegex = /(\d+)d/;
    const hoursRegex = /(\d+)h/;
    const minutesRegex = /(\d+)m/;
    const secondsRegex = /(\d+)s/;
    const hhmmRegex = /^(\d{1,2}):(\d{2})$/;

    const parts = input.split(" ");
    let totalMilliseconds = 0;

    for (const part of parts) {
        let match: RegExpExecArray | null;

        match = daysRegex.exec(part);
        if (match) {
            totalMilliseconds += parseInt(match[1], 10) * 24 * 60 * 60 * 1000;
            continue;
        }

        match = hoursRegex.exec(part);
        if (match) {
            totalMilliseconds += parseInt(match[1], 10) * 60 * 60 * 1000;
            continue;
        }

        match = minutesRegex.exec(part);
        if (match) {
            totalMilliseconds += parseInt(match[1], 10) * 60 * 1000;
            continue;
        }

        match = secondsRegex.exec(part);
        if (match) {
            totalMilliseconds += parseInt(match[1], 10) * 1000;
            continue;
        }

        match = hhmmRegex.exec(part);
        if (match) {
            const now = new Date();
            const hours = parseInt(match[1], 10);
            const minutes = parseInt(match[2], 10);

            if (hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) {
                const target = new Date(now);
                target.setHours(hours, minutes, 0, 0);

                if (target < now) {
                    target.setDate(target.getDate() + 1);
                }

                totalMilliseconds += target.getTime() - now.getTime();
            }
        }
    }

    return totalMilliseconds > 0 ? totalMilliseconds : null;
}
