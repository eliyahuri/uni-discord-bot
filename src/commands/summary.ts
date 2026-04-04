import { ChatInputCommandInteraction } from "discord.js";
import logger from "../utils/logger";
import { getCourseFiles } from "../courseService";
import { formatErrorResponse, formatResponse } from "../responseFormatter";
import subjectTranslations from "../utils/translations";

export default async function summary(
    interaction: ChatInputCommandInteraction,
) {
    try {
        await interaction.deferReply();

        const option = interaction.options.getString("option", true);
        const query = interaction.options.getString("contains")?.trim();
        const translatedName = subjectTranslations[option] ?? option;
        const allFiles = await getCourseFiles(option);

        if (allFiles.length === 0) {
            await interaction.editReply(
                `לא מצאתי קבצי סיכום עבור ${translatedName}. הקורס הזה כרגע יותר מסתורי מהמרצה.`,
            );
            return;
        }

        const matchingFiles = query
            ? await getCourseFiles(option, query)
            : allFiles;

        if (matchingFiles.length === 0) {
            await interaction.editReply(
                `לא מצאתי שום דבר עם "${query}" ב-${translatedName}. או שהחיפוש גרוע, או שהחומר מוסתר יפה.`,
            );
            return;
        }

        if (matchingFiles.length > 8) {
            await interaction.editReply(
                `מצאתי ${matchingFiles.length} קבצים ב-${translatedName}. תצמצם עם contains, כי אני לא עושה dump רגשי כזה.`,
            );
            return;
        }

        const intro = await formatResponse(interaction.user.id, {
            normal: `הנה הסיכומים שמצאתי עבור ${translatedName}:`,
            funny: `הנה הסיכומים של ${translatedName}. נס שאתה פותח אותם בכלל:`,
            spicy: `מצאתי את זה עבור ${translatedName}. עכשיו נשאר הקטע הלא נעים של לקרוא:`,
        });

        await interaction.editReply({
            content: intro,
            files: matchingFiles.map((file) => file.path),
        });
    } catch (error: any) {
        logger.error(error, "Error in summary command");

        if (error?.code === "ENOENT") {
            const option = interaction.options.getString("option", true);
            await interaction.editReply(
                `לא מצאתי תיקיית חומר עבור ${subjectTranslations[option] ?? option}. מצבך עדיין עדיף משלי.`,
            );
            return;
        }

        await interaction.editReply(await formatErrorResponse(interaction.user.id));
    }
}
