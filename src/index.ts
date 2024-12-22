import { Client, Events, GatewayIntentBits } from "discord.js";
import config from "./config/config";
import { setTimeout } from "node:timers/promises";
import { commands } from "./commands";
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on(Events.ClientReady, (readyClient) => {
    console.log(`Logged in as ${readyClient.user.tag}!`);
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    console.log(
        `Received interaction ${interaction.commandName} from ${interaction.user.tag}`,
    );

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
            commands
                .map((command) => `/${command.name} - ${command.description}`)
                .join("\n"),
        );
    }

    if (interaction.commandName === "pizza") {
        await interaction.reply("@here בואו לפיצה הדיקן בשעה 20:00");
    }
});

client.login(config.TOKEN);
