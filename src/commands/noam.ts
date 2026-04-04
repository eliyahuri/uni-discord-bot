import { ChatInputCommandInteraction } from "discord.js";
import { getLore } from "../studentLore";

export default async function noam(interaction: ChatInputCommandInteraction) {
    await interaction.reply(`<@402922149041405974> ${getLore("noam")}`);
}
