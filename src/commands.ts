import { REST, Routes } from "discord.js";
import config from "./config/config";

const commands = [
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
];

const rest = new REST({ version: "10" }).setToken(config.TOKEN);
const main = async () => {
    try {
        console.info("Started refreshing application (/) commands.");
        const data = await rest.put(
            Routes.applicationCommands(config.CLIENT_ID),
            {
                body: commands,
            },
        );
        console.info("Successfully reloaded application (/) commands:", data);
    } catch (error) {
        if (error instanceof Error && "response" in error) {
            console.error("API Error:", (error as any).response.data);
        } else {
            console.error("Unexpected Error:", error);
        }
    }
};

main();
