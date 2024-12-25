import { Events } from "discord.js";
import { client } from "./config/client";
import config from "./config/config";
import { commandHandlers } from "./functions/commandFunc";

client.on(Events.ClientReady, (readyClient) => {
    console.info(`Logged in as ${readyClient.user.tag}!`);
});

client.on(Events.InteractionCreate, async (interaction) => {
    // Only handle Chat Input commands (slash commands)
    if (!interaction.isChatInputCommand()) return;

    console.info(
        `Received interaction ${interaction.commandName} from ${interaction.user.tag}`,
    );

    // Retrieve the appropriate handler from the map
    const handler = commandHandlers[interaction.commandName];

    // Call the handler if it exists; otherwise respond with an error or ignore
    if (handler) {
        await handler(interaction);
    } else {
        await interaction.reply("Unknown command.");
    }
});

client.login(config.TOKEN);
