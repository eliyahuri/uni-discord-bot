import { ChatInputCommandInteraction } from "discord.js";
import messages from "../utils/messages";

export default async function roll(interaction: ChatInputCommandInteraction) {
    const sides = interaction.options.getInteger("sides") ?? 6;
    const count = interaction.options.getInteger("count") ?? 1;

    if (sides < 2 || sides > 1000) {
        await interaction.reply({
            content: messages.commands.rollInvalidSides,
            ephemeral: true,
        });
        return;
    }

    if (count < 1 || count > 25) {
        await interaction.reply({
            content: messages.commands.rollInvalidCount,
            ephemeral: true,
        });
        return;
    }

    const results = Array.from(
        { length: count },
        () => Math.floor(Math.random() * sides) + 1,
    );

    await interaction.reply(
        `הטלת ${count} קוביות (${sides} פאות): ${results.join(", ")}`,
    );
}
