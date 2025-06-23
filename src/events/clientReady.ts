import { Events } from "discord.js";
import { client } from "../config/client";
import logger from "../utils/logger";

client.once(Events.ClientReady, () => {
    logger.info(`Logged in as ${client.user?.tag}!`);
});
