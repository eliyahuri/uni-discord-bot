import { Client, Events, GatewayIntentBits } from "discord.js";
import config from "./config/config";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on(Events.ClientReady, (readyClient) => {
    console.log(`Logged in as ${readyClient.user.tag}!`);
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "ping") {
        await interaction.reply("Pong!");
    }
    if (interaction.commandName === "representatives") {
        await interaction.reply(
            "יגל גרוס: 0515204882 \n אליהו חורי: 0584304307",
        );
    }
    if (interaction.commandName === "help") {
        await interaction.reply(
            "הפקודות הן: \n 1. ping \n 2. representatives \n 3. help",
        );
    }
});

client.login(config.TOKEN);
