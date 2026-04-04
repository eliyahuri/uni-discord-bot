import { ChatInputCommandInteraction } from "discord.js";
import { format } from "../utils/format";
import logger from "../utils/logger";
import messages from "../utils/messages";

export default async function serverinfo(
    interaction: ChatInputCommandInteraction,
): Promise<void> {
    try {
        const guild = interaction.guild;

        if (!guild) {
            await interaction.reply({
                content: messages.commands.serverinfoFailed,
                ephemeral: true,
            });
            return;
        }

        await interaction.reply(
            format(messages.commands.serverInfoReport, {
                name: guild.name,
                memberCount: guild.memberCount,
            }),
        );
    } catch (error) {
        logger.error(error, "Error in serverinfo command");
        await interaction.reply(messages.commands.serverinfoFailed);
    }
}