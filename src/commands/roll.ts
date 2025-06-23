import { ChatInputCommandInteraction } from "discord.js";

export default async function roll(interaction: ChatInputCommandInteraction) {
    const sides = interaction.options.getInteger("sides") || 6;
    const result = Math.floor(Math.random() * sides) + 1;
    await interaction.reply(`הטלת קוביה (${sides} פאות): ${result}`);
}
