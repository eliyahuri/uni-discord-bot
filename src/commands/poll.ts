import { ChatInputCommandInteraction } from "discord.js";
import logger from "../utils/logger";
import { formatErrorResponse } from "../responseFormatter";

const pollCommentary = [
    "הרוב בחרו לא להגיע להרצאה. מפתיע.",
    "הסקר נפתח. עכשיו תעמידו פנים שתכבדו את התוצאה.",
    "הנה סקר. כלי דמוקרטי נחמד עד שמישהו מציע 8 אופציות.",
];

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
                content: "צריך לפחות שתי תשובות. גם כאוס צריך מינימום מבנה.",
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

        const commentary = await interaction.followUp({
            content:
                pollCommentary[Math.floor(Math.random() * pollCommentary.length)] ??
                pollCommentary[0],
        });
        void commentary.react("🤡").catch(() => undefined);
        void commentary.react("🫠").catch(() => undefined);
        void commentary.react("☕").catch(() => undefined);
    } catch (error) {
        logger.error(error, "Error in poll command");
        await interaction.reply(await formatErrorResponse(interaction.user.id));
    }
}
