import { ChatInputCommandInteraction } from "discord.js";
import { commands as commandsList } from "../utils/commandsList";
import messages from "../utils/messages";
import { format } from "../utils/format";

/**
 * Handler for the /help command. Sends a list of available commands with descriptions.
 * @param {ChatInputCommandInteraction} interaction - The interaction triggering this command.
 * @returns {Promise<void>}
 */
export default async function help(
    interaction: ChatInputCommandInteraction,
): Promise<void> {
    try {
        const helpText = commandsList
            .map((c) => `/${c.name} - ${c.description}`)
            .join("\n");
        await interaction.reply(format(messages.commands.help, { helpText }));
    } catch (error) {
        console.error("Error in help command:", error);
        await interaction.reply(messages.errors.errorOccurred);
    }
}
