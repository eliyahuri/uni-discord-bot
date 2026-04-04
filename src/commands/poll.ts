import { ChatInputCommandInteraction } from "discord.js";
import logger from "../utils/logger";
import messages from "../utils/messages";

export default async function poll(interaction: ChatInputCommandInteraction) {
    try {
        const question = interaction.options.getString("question", true);
        const answers = interaction.options
            .getString("answers", true)
            .split(",")
            .map((answer) => answer.trim())
            .filter(Boolean);
        const duration = interaction.options.getNumber("time") ?? 24;
        const allowMulti = interaction.options.getBoolean("multiselect") ?? false;

        if (answers.length < 2) {
            await interaction.reply({
                content: messages.commands.pollInvalid,
                ephemeral: true,
            });
            return;
        }

        await interaction.reply({
            poll: {
                question: { text: question },
                answers: answers.map((answer) => ({ text: answer })),
                duration,
                allowMultiselect: allowMulti,
            },
        });
    } catch (error) {
        logger.error(error, "Error in poll command");
        await interaction.reply(messages.errors.errorOccurred);
    }
}
