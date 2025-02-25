import dotenv from "dotenv";
import envVar from "env-var";

dotenv.config();
const config = {
    TOKEN: envVar.get("DISCORD_TOKEN").required().asString(),
    CLIENT_ID: envVar.get("DISCORD_CLIENT_ID").required().asString(),
};

export default config;
