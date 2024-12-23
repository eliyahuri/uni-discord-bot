import {
    Client,
    Events,
    GatewayIntentBits,
    ChatInputCommandInteraction,
} from "discord.js";
import config from "./config/config";

// If you have an array of commands elsewhere:
import { commands } from "./utils/commandsList";

// Optional: define the shape of a command in `commands`
interface MyCommand {
    name: string;
    description: string;
    // add fields as needed
}

// Type alias for a command handler function
type CommandHandler = (
    interaction: ChatInputCommandInteraction,
) => Promise<void>;

// Record of command names to handler functions
const commandHandlers: Record<string, CommandHandler> = {
    ping: async (interaction) => {
        await interaction.reply("Pong!");
    },

    representatives: async (interaction) => {
        await interaction.reply(
            "יגל גרוס: 0515204882 \n אליהו חורי: 0584304307",
        );
    },

    help: async (interaction) => {
        // Example: if you want to display your commands array
        await interaction.reply(
            commands
                .map((c: MyCommand) => `/${c.name} - ${c.description}`)
                .join("\n"),
        );
    },

    pizza: async (interaction) => {
        await interaction.reply("@here בואו לפיצה הדיקן בשעה 20:00");
    },

    summary: async (interaction) => {
        const option = interaction.options.getString("option");
        await interaction.reply(`You selected ${option}`);
    },
};

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on(Events.ClientReady, (readyClient) => {
    console.log(`Logged in as ${readyClient.user.tag}!`);
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

void client.login(config.TOKEN);
