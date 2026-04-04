import { getVoiceConnection } from "@discordjs/voice";
import type { Client } from "discord.js";
import config from "./config/config";
import logger from "./utils/logger";

interface VoiceSession {
    guildId: string;
    voiceChannelId: string;
    textChannelId?: string;
    timer?: NodeJS.Timeout;
}

const sessions = new Map<string, VoiceSession>();

const joinLines = [
    "נכנסתי לקול. מפעיל ambiance של ספרייה בדמיון שלך, כי למציאות אין תקציב.",
    "הגעתי. חבר'ה, אתם לא לומדים נכון, אבל לפחות עכשיו יש לזה witness.",
];

const disappointedLines = [
    "התעלמתם ממני אז הלכתי. כמו מתרגל עם גבולות.",
    "נשארתי לבד, התאכזבתי, ויצאתי. חוויה לימודית לכל הצדדים.",
];

function pickRandom<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)] as T;
}

async function sendTextNotice(client: Client, channelId: string | undefined, content: string) {
    if (!channelId) {
        return;
    }

    const channel = await client.channels.fetch(channelId);
    if (channel?.isTextBased() && "send" in channel) {
        await channel.send(content);
    }
}

function clearSessionTimer(session: VoiceSession) {
    if (session.timer) {
        clearTimeout(session.timer);
        session.timer = undefined;
    }
}

export function getVoiceJoinLine() {
    return pickRandom(joinLines);
}

export function registerVoiceSession(
    client: Client,
    guildId: string,
    voiceChannelId: string,
    textChannelId?: string,
) {
    const current = sessions.get(guildId);
    if (current) {
        clearSessionTimer(current);
    }

    const session: VoiceSession = { guildId, voiceChannelId, textChannelId };
    sessions.set(guildId, session);
    scheduleIgnoreTimer(client, session);
}

function scheduleIgnoreTimer(client: Client, session: VoiceSession) {
    clearSessionTimer(session);
    session.timer = setTimeout(async () => {
        try {
            const guild = client.guilds.cache.get(session.guildId);
            const voiceChannel = guild?.channels.cache.get(session.voiceChannelId);
            if (!voiceChannel?.isVoiceBased()) {
                return;
            }

            const humanCount = voiceChannel.members.filter(
                (member) => !member.user.bot,
            ).size;

            if (humanCount <= 1) {
                getVoiceConnection(session.guildId)?.destroy();
                await sendTextNotice(
                    client,
                    session.textChannelId,
                    pickRandom(disappointedLines),
                );
                sessions.delete(session.guildId);
            }
        } catch (error) {
            logger.error(error, "Failed handling voice ignore timer");
        }
    }, config.VOICE_IGNORE_MINUTES * 60 * 1000);
}

export async function syncVoiceSession(client: Client, guildId: string) {
    const session = sessions.get(guildId);
    if (!session) {
        return;
    }

    const guild = client.guilds.cache.get(guildId);
    const voiceChannel = guild?.channels.cache.get(session.voiceChannelId);
    if (!voiceChannel?.isVoiceBased()) {
        sessions.delete(guildId);
        return;
    }

    const humanCount = voiceChannel.members.filter((member) => !member.user.bot).size;

    if (humanCount === 0) {
        clearSessionTimer(session);
        getVoiceConnection(guildId)?.destroy();
        await sendTextNotice(client, session.textChannelId, pickRandom(disappointedLines));
        sessions.delete(guildId);
        return;
    }

    if (humanCount === 1) {
        scheduleIgnoreTimer(client, session);
        return;
    }

    clearSessionTimer(session);
}