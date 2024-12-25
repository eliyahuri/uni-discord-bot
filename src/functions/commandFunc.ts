import { ChatInputCommandInteraction } from "discord.js";
import { commands } from "../utils/commandsList";
import { parseTimeToMilliseconds } from "./convertTime";

interface MyCommand {
    name: string;
    description: string;
}

type CommandHandler = (
    interaction: ChatInputCommandInteraction,
) => Promise<void>;

export const commandHandlers: Record<string, CommandHandler> = {
    ping: async (interaction) => {
        if (Math.random() <= 0.1) {
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

    alert: async (interaction) => {
        const time = interaction.options.getString("time");
        const message = interaction.options.getString("message");
        if (!time) {
            await interaction.reply(
                "\u05dc\u05d0 \u05e0\u05de\u05e6\u05d0 \u05d6\u05de\u05df",
            );
            return;
        }

        const msTime = parseTimeToMilliseconds(time);
        if (!msTime) {
            await interaction.reply(
                "\u05d6\u05de\u05df \u05dc\u05d0 \u05ea\u05e7\u05d9\u05df",
            );
            return;
        }

        const targetDate = new Date(Date.now() + msTime);
        const hours = targetDate.getHours().toString().padStart(2, "0");
        const minutes = targetDate.getMinutes().toString().padStart(2, "0");

        const formattedTime = `${hours}:${minutes}`;

        await interaction.reply(
            `\u05e0\u05e7\u05d1\u05e2\u05d4 \u05d4\u05ea\u05e8\u05d0\u05d4 \u05dc\u05d1\u05e2\u05d5\u05d3 ${time} \u05e2\u05d3 \u05dc${formattedTime} \u05e2\u05dd \u05d4\u05d4\u05d5\u05d3\u05e2\u05d4: ${message}`,
        );

        setTimeout(async () => {
            await interaction.followUp(
                `<@${interaction.user.id}> \u05d4\u05ea\u05e8\u05d0\u05d4! ${message}`,
            );
        }, msTime);
    },
};
