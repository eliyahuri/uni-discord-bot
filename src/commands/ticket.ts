import { ChatInputCommandInteraction } from "discord.js";
import config from "../config/config";
import { client } from "../config/client";
import { format } from "../utils/format";
import logger from "../utils/logger";
import messages from "../utils/messages";

export default async function ticket(interaction: ChatInputCommandInteraction) {
    try {
        const message = interaction.options.getString("message", true);
        const recipients = config.REPRESENTATIVE_USER_IDS;

        if (recipients.length === 0) {
            await interaction.reply({
                content: messages.commands.ticketNoRepresentatives,
                ephemeral: true,
            });
            return;
        }

        const payload = format(messages.commands.ticketPrefix, {
            userId: interaction.user.id,
            message,
        });

        const results = await Promise.allSettled(
            recipients.map((userId) => client.users.send(userId, payload)),
        );

        const sentCount = results.filter(
            (result) => result.status === "fulfilled",
        ).length;

        if (sentCount === 0) {
            await interaction.reply({
                content: messages.commands.ticketDeliveryFailed,
                ephemeral: true,
            });
            return;
        }

        await interaction.reply({
            content: messages.commands.ticketSent,
            ephemeral: true,
        });
    } catch (error) {
        logger.error(error, "Error in ticket command");
        await interaction.reply(messages.errors.errorOccurred);
    }
}
