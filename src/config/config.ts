import dotenv from "dotenv";
import envVar from "env-var";

dotenv.config();

const representativeIds = envVar
    .get("DISCORD_REPRESENTATIVE_USER_IDS")
    .default("173926117172838401,402922149041405974")
    .asString()
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

const config = {
    TOKEN: envVar.get("DISCORD_TOKEN").required().asString(),
    CLIENT_ID: envVar.get("DISCORD_CLIENT_ID").required().asString(),
    REPRESENTATIVE_USER_IDS: representativeIds,
    RANDOM_EVENTS_ENABLED: envVar
        .get("DISCORD_RANDOM_EVENTS_ENABLED")
        .default("false")
        .asBool(),
    RANDOM_EVENTS_CHANNEL_ID: envVar
        .get("DISCORD_RANDOM_EVENTS_CHANNEL_ID")
        .default("")
        .asString(),
    RANDOM_EVENTS_INTERVAL_MINUTES: Math.max(
        5,
        envVar
            .get("DISCORD_RANDOM_EVENTS_INTERVAL_MINUTES")
            .default("180")
            .asInt(),
    ),
    VOICE_IGNORE_MINUTES: Math.max(
        1,
        envVar.get("DISCORD_VOICE_IGNORE_MINUTES").default("2").asInt(),
    ),
};

export default config;
