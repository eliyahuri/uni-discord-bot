import { ChatInputCommandInteraction } from "discord.js";
import messages from "../utils/messages";
import { format } from "../utils/format";
import logger from "../utils/logger";

/**
 * Handler for the /ping command. Replies with a joke or a simple pong message.
 * @param {ChatInputCommandInteraction} interaction - The interaction triggering this command.
 * @returns {Promise<void>}
 */
export default async function ping(
    interaction: ChatInputCommandInteraction,
): Promise<void> {
    try {
        if (Math.random() <= 0.1) {
            await interaction.reply(
                format(messages.commands.ping.joke, {
                    userId: interaction.user.id,
                }),
            );
            setTimeout(async () => {
                await interaction.editReply(messages.commands.ping.reply);
            }, 3000);
        } else {
            await interaction.reply(messages.commands.ping.reply);
        }
    } catch (error) {
        logger.error(error, "Error in ping command");
        await interaction.reply(messages.errors.errorOccurred);
    }
}
