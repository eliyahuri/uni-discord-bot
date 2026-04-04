import { ChatInputCommandInteraction } from "discord.js";
import {
    answerCourseQuestion,
    getCourseFiles,
} from "../courseService";
import { formatErrorResponse, formatResponse } from "../responseFormatter";
import logger from "../utils/logger";
import subjectTranslations from "../utils/translations";

export default async function course(
    interaction: ChatInputCommandInteraction,
): Promise<void> {
    try {
        await interaction.deferReply();
        const subcommand = interaction.options.getSubcommand(true);

        if (subcommand === "ask") {
            const courseName = interaction.options.getString("course", true);
            const question = interaction.options.getString("question", true);
            const answer = await answerCourseQuestion(courseName, question);
            const intro = await formatResponse(interaction.user.id, {
                normal: `שאלת על ${answer.courseName}. סביר.`,
                funny: `שאלת על ${answer.courseName}. סוף סוף שימוש ראוי בבוט.`,
                spicy: `שאלת על ${answer.courseName}. מרגש לראות יוזמה אקדמית מאוחרת.`,
            });
            const references =
                answer.references.length > 0
                    ? answer.references.map((file) => `- ${file.name}`).join("\n")
                    : "- אין לי כרגע הפניות מקומיות נורמליות, שזה לא אידיאלי לשנינו.";

            await interaction.editReply(
                `${intro}\n\nתשובה קצרה: ${answer.shortAnswer}\n\nקבצים רלוונטיים:\n${references}\n\nExam tip: ${answer.examTip}`,
            );
            return;
        }

        const courseName = interaction.options.getString("course", true);
        const query = interaction.options.getString("contains") ?? undefined;
        const files = await getCourseFiles(courseName, query);
        const translated = subjectTranslations[courseName] ?? courseName;

        if (files.length === 0) {
            await interaction.editReply(
                `לא מצאתי קבצים עבור ${translated}${query ? ` עם "${query}"` : ""}. כנראה החומר התחבא טוב יותר ממך.` ,
            );
            return;
        }

        const intro = await formatResponse(interaction.user.id, {
            normal: `מצאתי ${files.length} קבצים עבור ${translated}.`,
            funny: `מצאתי ${files.length} קבצים עבור ${translated}. זה החלק שבו אתה באמת פותח אותם.`,
            spicy: `הנה ${files.length} קבצים של ${translated}. עכשיו אין אפילו תירוץ יצירתי.`,
        });

        await interaction.editReply({
            content: intro,
            files: files.slice(0, 8).map((file) => file.path),
        });
    } catch (error) {
        logger.error(error, "Error in course command");
        const message = await formatErrorResponse(interaction.user.id);
        if (interaction.deferred || interaction.replied) {
            await interaction.editReply(message);
            return;
        }

        await interaction.reply(message);
    }
}