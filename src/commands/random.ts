import { ChatInputCommandInteraction } from "discord.js";
import { format } from "../utils/format";
import messages from "../utils/messages";

export default async function random(
    interaction: ChatInputCommandInteraction,
): Promise<void> {
    const min = interaction.options.getInteger("min", true);
    const max = interaction.options.getInteger("max", true);

    if (min > max) {
        await interaction.reply({
            content: messages.commands.randomInvalidRange,
            ephemeral: true,
        });
        return;
    }

    const result = Math.floor(Math.random() * (max - min + 1)) + min;
    await interaction.reply(
        format(messages.commands.randomResult, {
            min,
            max,
            result,
        }),
    );
}