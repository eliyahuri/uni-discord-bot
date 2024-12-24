export function parseTimeToMilliseconds(input: string): number | null {
    // Regular expressions to match individual time components
    const daysRegex = /(\d+)d/; // Matches "1d"
    const hoursRegex = /(\d+)h/; // Matches "1h"
    const minutesRegex = /(\d+)m/; // Matches "15m"
    const secondsRegex = /(\d+)s/; // Matches "10s"
    const hhmmRegex = /^(\d{1,2}):(\d{2})$/; // Matches "15:30"

    // Split input into parts for combined formats
    const parts = input.split(" ");

    // Initialize total milliseconds
    let totalMilliseconds = 0;

    // Process each part
    for (const part of parts) {
        let match;

        // Match days
        match = daysRegex.exec(part);
        if (match) {
            totalMilliseconds += parseInt(match[1], 10) * 24 * 60 * 60 * 1000;
            continue;
        }

        // Match hours
        match = hoursRegex.exec(part);
        if (match) {
            totalMilliseconds += parseInt(match[1], 10) * 60 * 60 * 1000;
            continue;
        }

        // Match minutes
        match = minutesRegex.exec(part);
        if (match) {
            totalMilliseconds += parseInt(match[1], 10) * 60 * 1000;
            continue;
        }

        // Match seconds
        match = secondsRegex.exec(part);
        if (match) {
            totalMilliseconds += parseInt(match[1], 10) * 1000;
            continue;
        }

        // Match HH:MM format (time of day)
        match = hhmmRegex.exec(part);
        if (match) {
            const now = new Date();
            const hours = parseInt(match[1], 10);
            const minutes = parseInt(match[2], 10);

            if (hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) {
                const target = new Date(now);
                target.setHours(hours, minutes, 0, 0);

                if (target < now) {
                    target.setDate(target.getDate() + 1); // If the target time is in the past, move to the next day
                }

                totalMilliseconds += target.getTime() - now.getTime();
            }
        }
    }

    // Return total milliseconds if valid, otherwise null
    return totalMilliseconds > 0 ? totalMilliseconds : null;
}
