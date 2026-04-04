import { ChatInputCommandInteraction } from "discord.js";
import { format } from "../utils/format";
import messages from "../utils/messages";

export default async function coinflip(
    interaction: ChatInputCommandInteraction,
): Promise<void> {
    const result = Math.random() < 0.5 ? "עץ" : "פלי";

    await interaction.reply(
        format(messages.commands.coinflip, {
            result,
        }),
    );
}