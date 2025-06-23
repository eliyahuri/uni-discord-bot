import { ChatInputCommandInteraction } from "discord.js";
import messages from "../utils/messages";
import logger from "../utils/logger";

/**
 * Handler for the /representatives command. Replies with the representatives message.
 * @param {ChatInputCommandInteraction} interaction - The interaction triggering this command.
 * @returns {Promise<void>}
 */
export default async function representatives(
    interaction: ChatInputCommandInteraction,
): Promise<void> {
    try {
        await interaction.reply(messages.commands.representatives);
    } catch (error) {
        logger.error(error, "Error in representatives command");
        await interaction.reply(messages.errors.errorOccurred);
    }
}
