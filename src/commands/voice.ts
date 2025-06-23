import { ChatInputCommandInteraction } from "discord.js";

export default async function voice(interaction: ChatInputCommandInteraction) {
    await interaction.reply("מצטרף לחדר קולי (לא באמת, זו דמו)");
    // Note: Actual voice channel join is not implemented here.
}
