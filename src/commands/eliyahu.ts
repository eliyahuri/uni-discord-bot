import { ChatInputCommandInteraction } from "discord.js";
import { getLore } from "../studentLore";

export default async function eliyahu(
    interaction: ChatInputCommandInteraction,
) {
    await interaction.reply(`<@173926117172838401> ${getLore("eliyahu")}`);
}
