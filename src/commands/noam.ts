import { ChatInputCommandInteraction } from "discord.js";
import messages from "../utils/messages";

export default async function noam(interaction: ChatInputCommandInteraction) {
    await interaction.reply(messages.commands.noam);
}
