import { ChatInputCommandInteraction } from "discord.js";
import messages from "../utils/messages";

/**
 * Handler for the /pizza command. Replies with pizza invitation message.
 * @param {ChatInputCommandInteraction} interaction - The interaction triggering this command.
 * @returns {Promise<void>}
 */
export default async function pizza(
    interaction: ChatInputCommandInteraction,
): Promise<void> {
    try {
        await interaction.reply(messages.commands.pizza);
    } catch (error) {
        console.error("Error in pizza command:", error);
        await interaction.reply(messages.errors.errorOccurred);
    }
}
