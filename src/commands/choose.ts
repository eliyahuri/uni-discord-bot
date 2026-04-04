import { ChatInputCommandInteraction } from "discord.js";
import { format } from "../utils/format";
import messages from "../utils/messages";

export default async function choose(
    interaction: ChatInputCommandInteraction,
): Promise<void> {
    const options = interaction.options
        .getString("options", true)
        .split(",")
        .map((option) => option.trim())
        .filter(Boolean);

    if (options.length < 2) {
        await interaction.reply({
            content: messages.commands.chooseInvalid,
            ephemeral: true,
        });
        return;
    }

    const choice = options[Math.floor(Math.random() * options.length)];
    await interaction.reply(
        format(messages.commands.chooseResult, {
            choice,
        }),
    );
}