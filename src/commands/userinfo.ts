import { ChatInputCommandInteraction } from "discord.js";
import messages from "../utils/messages";
import { format } from "../utils/format";
import logger from "../utils/logger";

/**
 * Handler for the /userinfo command. Replies with information about a specified user.
 * @param {ChatInputCommandInteraction} interaction - The interaction triggering this command.
 * @returns {Promise<void>}
 */
export default async function userinfo(
    interaction: ChatInputCommandInteraction,
): Promise<void> {
    try {
        const user = interaction.options.getUser("user", true);
        const member = interaction.guild?.members.cache.get(user.id);
        const joined = member?.joinedAt?.toLocaleDateString() || "Unknown";
        const created = user.createdAt.toLocaleDateString();
        await interaction.reply(
            format(messages.commands.userInfoReport, {
                tag: user.tag,
                created,
                joined,
            }),
        );
    } catch (error) {
        logger.error(error, "Error in userinfo command");
        await interaction.reply(messages.commands.userinfoFailed);
    }
}
