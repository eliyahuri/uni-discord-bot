import { Client, Events, GatewayIntentBits } from "discord.js";
import { commands } from "./utils/commandsList";
import config from "./config/config";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on(Events.ClientReady, (readyClient) => {
    console.log(`Logged in as ${readyClient.user.tag}!`);
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    console.info(
        `Received interaction ${interaction.commandName} from ${interaction.user.tag}`,
    );

    if (interaction.commandName === "ping") {
        await interaction.reply("Pong!");
    } else if (interaction.commandName === "representatives") {
        await interaction.reply(
            "יגל גרוס: 0515204882 \n אליהו חורי: 0584304307",
        );
    } else if (interaction.commandName === "help") {
        await interaction.reply(
            commands
                .map((command) => `/${command.name} - ${command.description}`)
                .join("\n"),
        );
    } else if (interaction.commandName === "pizza") {
        await interaction.reply("@here בואו לפיצה הדיקן בשעה 20:00");
    } else if (interaction.commandName === "summary") {
        const option = interaction.options.getString("option");
        await interaction.reply(`You selected ${option}`);
    }
});

client.login(config.TOKEN);
