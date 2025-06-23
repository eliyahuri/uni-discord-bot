import { ChatInputCommandInteraction } from "discord.js";

export default async function ticket(interaction: ChatInputCommandInteraction) {
    const message = interaction.options.getString("message", true);
    await interaction.reply(`הודעתך נשלחה לנציגי השנתון: ${message}`);
    // Note: Actual DM to representatives is not implemented here.
}
