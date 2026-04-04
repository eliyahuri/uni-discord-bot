import { ChatInputCommandInteraction } from "discord.js";
import { format } from "../utils/format";
import logger from "../utils/logger";
import messages from "../utils/messages";

export default async function avatar(
    interaction: ChatInputCommandInteraction,
): Promise<void> {
    try {
        const user = interaction.options.getUser("user") ?? interaction.user;
        const avatarUrl = user.displayAvatarURL({ size: 1024 });

        await interaction.reply({
            content: format(messages.commands.avatar, {
                tag: user.tag,
            }),
            files: [avatarUrl],
        });
    } catch (error) {
        logger.error(error, "Error in avatar command");
        await interaction.reply(messages.errors.errorOccurred);
    }
}