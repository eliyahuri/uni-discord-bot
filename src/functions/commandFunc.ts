import { ChatInputCommandInteraction } from "discord.js";
import { commands } from "../utils/commandsList";

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
export const commandHandlers: Record<string, CommandHandler> = {
    ping: async (interaction) => {
        if (Math.random() === 0.1) {
            await interaction.reply(
                `<@${interaction.user.id}> אני פה הצילו אליהו מחזיק אותי כמו עבד בבקשה תעזרו לי`,
            );
            setTimeout(() => {
                interaction.editReply("Pong!");
            }, 3000);
        } else {
            await interaction.reply("Pong!");
        }
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