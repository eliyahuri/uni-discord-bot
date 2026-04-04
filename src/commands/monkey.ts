import { ChatInputCommandInteraction } from "discord.js";
import logger from "../utils/logger";
import messages from "../utils/messages";
import { getAssetFiles } from "../utils/assets";

export default async function monkey(interaction: ChatInputCommandInteraction) {
    try {
        const requestedCount = interaction.options.getInteger("count") ?? 1;
        const count = Math.min(Math.max(requestedCount, 1), 4);
        const monkeyImages = await getAssetFiles("monkeyImages");

        const selectedImages = [...monkeyImages]
            .sort(() => Math.random() - 0.5)
            .slice(0, count)
            .map((file) => file.path);

        await interaction.reply({
            content: messages.commands.monkey,
            files: selectedImages,
        });
    } catch (error) {
        logger.error(error, "Error in monkey command");
        await interaction.reply(messages.errors.errorOccurred);
    }
}
