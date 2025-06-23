import { ChatInputCommandInteraction } from "discord.js";

export default async function poll(interaction: ChatInputCommandInteraction) {
    const question = interaction.options.getString("question", true);
    const answers = interaction.options.getString("answers", true).split(",");
    await interaction.reply(
        `סקר: ${question}\nאפשרויות: ${answers.map((a) => a.trim()).join(", ")}`,
    );
    // Note: Actual poll logic is not implemented here.
}
