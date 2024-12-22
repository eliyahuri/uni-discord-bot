import { REST, Routes } from "discord.js";
import config from "./config/config";

export const commands = [
    {
        name: "ping",
        description: "Replies with Pong!",
    },
    {
        name: "representatives",
        description: "מציג את נציגי שנתון",
    },
    {
        name: "help",
        description: "מציג את רשימת הפקודות",
    },
    {
        name: "pizza",
        description: "מזכיר לכולם לבוא לפיצה",
    },
];

const rest = new REST({ version: "10" }).setToken(config.TOKEN);
const main = async () => {
    try {
        console.info("Started refreshing application (/) commands.");

        await rest.put(Routes.applicationCommands(config.CLIENT_ID), {
            body: commands,
        });

        console.info("Successfully reloaded application (/) commands.");
    } catch (error: any) {
        console.error(error["requestBody"]["json"]);
    }
};

main();
