import type { ChatInputCommandInteraction } from "discord.js";
import { getLore } from "../studentLore";

const tal = async (interaction: ChatInputCommandInteraction) => {
    await interaction.reply(`<@1317796479511035956> ${getLore("tal")}`);
};

export default tal;
