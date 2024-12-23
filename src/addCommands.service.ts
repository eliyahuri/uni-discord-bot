import { REST, Routes } from "discord.js";
import config from "./config/config";
import { commands } from "./utils/commandsList";

const rest = new REST({ version: "10" }).setToken(config.TOKEN);
const main = async () => {
    try {
        console.info("Started refreshing application (/) commands.");

        await rest.put(Routes.applicationCommands(config.CLIENT_ID), {
            body: commands,
        });

        console.info("Successfully reloaded application (/) commands.");
    } catch (error: any) {
        console.error(error.message);
    }
};

main();
