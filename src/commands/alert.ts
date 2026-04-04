import { ChatInputCommandInteraction } from "discord.js";
import { client } from "../config/client";
import { parseTimeToMilliseconds } from "../functions/convertTime";
import { format } from "../utils/format";
import logger from "../utils/logger";
import messages from "../utils/messages";

export default async function alert(interaction: ChatInputCommandInteraction) {
    try {
        const time = interaction.options.getString("time", true);
        const message = interaction.options.getString("message", true);
        const duration = parseTimeToMilliseconds(time);

        if (!duration) {
            await interaction.reply({
                content: messages.commands.invalidTime,
                ephemeral: true,
            });
            return;
        }

        const targetDate = new Date(Date.now() + duration);
        const formattedTime = targetDate.toLocaleTimeString("he-IL", {
            hour: "2-digit",
            minute: "2-digit",
        });

        await interaction.reply({
            content: format(messages.commands.alertScheduled, {
                time: formattedTime,
            }),
            ephemeral: true,
        });

        setTimeout(() => {
            void client.users
                .send(
                    interaction.user.id,
                    format(messages.commands.alertFollowUp, {
                        userId: interaction.user.id,
                        message,
                    }),
                )
                .catch((error) => {
                    logger.error(error, "Failed to send scheduled alert");
                });
        }, duration);
    } catch (error) {
        logger.error(error, "Error in alert command");
        await interaction.reply(messages.errors.errorOccurred);
    }
}
