import type { Client } from "discord.js";
import config from "./config/config";
import logger from "./utils/logger";

const randomEventMessages = [
    "מישהו באמת הבין את התרגול או שכולנו פשוט מהנהנים מקצועית?",
    "Reminder: אתם בפיגור. אני רק השליח, אל תירו בבוט.",
    "שאלה אקדמית: מתי בדיוק תכננתם להתחיל את המטלה?",
    "עדכון מצב: הפאניקה מתקדמת יפה.",
    "אם פתחתם את הסיכום רק כדי להרגיש אנשים טובים יותר, זה עדיין לא למידה.",
];

let intervalHandle: NodeJS.Timeout | null = null;

function pickRandom<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)] as T;
}

export function startRandomEvents(client: Client<true>) {
    if (
        intervalHandle ||
        !config.RANDOM_EVENTS_ENABLED ||
        !config.RANDOM_EVENTS_CHANNEL_ID
    ) {
        return;
    }

    const everyMs = config.RANDOM_EVENTS_INTERVAL_MINUTES * 60 * 1000;

    intervalHandle = setInterval(async () => {
        try {
            const channel = await client.channels.fetch(config.RANDOM_EVENTS_CHANNEL_ID);
            if (!channel?.isTextBased() || !("send" in channel)) {
                return;
            }

            await channel.send(pickRandom(randomEventMessages));
        } catch (error) {
            logger.error(error, "Failed sending random event message");
        }
    }, everyMs);

    logger.info(
        `Random events enabled for channel ${config.RANDOM_EVENTS_CHANNEL_ID} every ${config.RANDOM_EVENTS_INTERVAL_MINUTES} minutes`,
    );
}