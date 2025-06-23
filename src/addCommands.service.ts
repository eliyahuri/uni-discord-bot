import { REST, Routes } from "discord.js";
import config from "./config/config";
import { commands } from "./utils/commandsList";
import logger from "./utils/logger";

const rest = new REST({ version: "10" }).setToken(config.TOKEN);
const main = async () => {
    try {
        logger.info("Started refreshing application (/) commands.");

        await rest.put(Routes.applicationCommands(config.CLIENT_ID), {
            body: commands,
        });

        logger.info("Successfully reloaded application (/) commands.");
    } catch (error: any) {
        logger.error(error, "Error refreshing application commands");
    }
};

main();
