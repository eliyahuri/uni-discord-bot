import { ChatInputCommandInteraction } from "discord.js";

export default async function weather(
    interaction: ChatInputCommandInteraction,
) {
    const city = interaction.options.getString("city", true);
    await interaction.reply(`מזג האוויר ב-${city}: (דמו, אין נתונים אמיתיים)`);
    // Note: Actual weather API integration is not implemented here.
}
