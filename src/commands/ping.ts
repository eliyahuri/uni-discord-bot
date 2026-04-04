import { ChatInputCommandInteraction } from "discord.js";
import logger from "../utils/logger";
import { formatErrorResponse, formatResponse } from "../responseFormatter";

/**
 * Handler for the /ping command. Replies with a joke or a simple pong message.
 * @param {ChatInputCommandInteraction} interaction - The interaction triggering this command.
 * @returns {Promise<void>}
 */
export default async function ping(
    interaction: ChatInputCommandInteraction,
): Promise<void> {
    try {
        const content = await formatResponse(interaction.user.id, {
            normal: "כן כן אני חי.",
            funny: "כן כן אני חי, לצערי גם אתה.",
            spicy: "אני חי. לא יודע למה גם אתה בודק את זה במקום ללמוד.",
        });

        await interaction.reply(content);
    } catch (error) {
        logger.error(error, "Error in ping command");
        await interaction.reply(await formatErrorResponse(interaction.user.id));
    }
}
