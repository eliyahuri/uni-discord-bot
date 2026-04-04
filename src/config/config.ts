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
};

export default config;
