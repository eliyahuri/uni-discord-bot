import { ChatInputCommandInteraction } from "discord.js";
import logger from "../utils/logger";
import messages from "../utils/messages";

export default async function echo(
    interaction: ChatInputCommandInteraction,
): Promise<void> {
    try {
        const text = interaction.options.getString("text", true);
        const isPrivate = interaction.options.getBoolean("private") ?? false;

        await interaction.reply({
            content: text,
            ephemeral: isPrivate,
        });
    } catch (error) {
        logger.error(error, "Error in echo command");
        await interaction.reply(messages.commands.echoFailed);
    }
}