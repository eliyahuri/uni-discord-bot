import { ChatInputCommandInteraction } from "discord.js";

export default async function alert(interaction: ChatInputCommandInteraction) {
    const time = interaction.options.getString("time", true);
    const message = interaction.options.getString("message", true);
    await interaction.reply(`התראה תישלח בעוד ${time}: ${message}`);
    // Note: Scheduling the actual alert is not implemented here.
}
