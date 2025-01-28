import envVar from "env-var";
import dotenv from "dotenv";

dotenv.config();
const config = {
    TOKEN: envVar.get("DISCORD_TOKEN").required().asString(),
    CLIENT_ID: envVar.get("DISCORD_CLIENT_ID").required().asString(),
    RIOT_API_KEY: envVar.get("RIOT_API_KEY").required().asString(),
};

export default config;
