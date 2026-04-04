import { Events } from "discord.js";
import { client } from "../config/client";
import logger from "../utils/logger";
import { startRandomEvents } from "../randomEvents";

client.once(Events.ClientReady, (readyClient) => {
    logger.info(`Logged in as ${client.user?.tag}!`);
    startRandomEvents(readyClient);
});
