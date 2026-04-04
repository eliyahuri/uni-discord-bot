import { ChatInputCommandInteraction } from "discord.js";
import {
    addDeadline,
    formatDeadlineDate,
    formatTimeLeft,
    getDeadlinePanic,
    listDeadlines,
    parseDeadlineInput,
} from "../deadlineService";
import { formatErrorResponse, formatResponse } from "../responseFormatter";
import logger from "../utils/logger";

export default async function deadline(
    interaction: ChatInputCommandInteraction,
): Promise<void> {
    try {
        const subcommand = interaction.options.getSubcommand(true);
        const guildId = interaction.guildId ?? interaction.user.id;

        if (subcommand === "add") {
            const title = interaction.options.getString("title", true);
            const due = interaction.options.getString("due", true);
            const course = interaction.options.getString("course") ?? undefined;
            const notes = interaction.options.getString("notes") ?? undefined;
            const dueAt = parseDeadlineInput(due);

            if (!dueAt) {
                await interaction.reply({
                    content:
                        "לא הצלחתי להבין את התאריך. תן לי `YYYY-MM-DD HH:MM` או `DD/MM/YYYY HH:MM` ואל תאלתר פורמטים כמו בחיים.",
                    ephemeral: true,
                });
                return;
            }

            const saved = await addDeadline({
                guildId,
                title,
                course,
                dueAt,
                notes,
                createdBy: interaction.user.id,
            });
            const intro = await formatResponse(interaction.user.id, {
                normal: "שמרתי את הדדליין.",
                funny: "שמרתי את הדדליין, כי אתה כנראה לא תזכור לבד.",
                spicy: "שמרתי את הדדליין. מישהו פה חייב לקחת אחריות, וזה כנראה אני.",
            });

            await interaction.reply(
                `${intro}\n${saved.title} | ${saved.course} | ${formatDeadlineDate(new Date(saved.dueAt))}`,
            );
            return;
        }

        if (subcommand === "list") {
            const deadlines = await listDeadlines(guildId);
            if (deadlines.length === 0) {
                await interaction.reply("אין דדליינים שמורים. או שאתה מאורגן, או שאתה בהכחשה.");
                return;
            }

            const intro = await formatResponse(interaction.user.id, {
                normal: "הנה כל הדדליינים שלך:",
                funny: "הנה הרשימה. לא להסתכל עליה לא יגרום לה להיעלם.",
                spicy: "הנה הדדליינים. מצבך לא מזהיר, אבל לפחות מסודר.",
            });

            await interaction.reply(
                `${intro}\n\n${deadlines
                    .map(
                        (item) =>
                            `- ${item.title} | ${item.course} | ${formatDeadlineDate(new Date(item.dueAt))} | ${formatTimeLeft(new Date(item.dueAt))}`,
                    )
                    .join("\n")}`,
            );
            return;
        }

        const panic = await getDeadlinePanic(guildId);
        if (panic.overdue.length === 0 && panic.upcoming.length === 0) {
            await interaction.reply("אין שום דדליין שמור. תיהנה מהשקט הזמני הזה.");
            return;
        }

        const nextDeadline = panic.upcoming[0] ?? panic.overdue[0];
        const intro = await formatResponse(interaction.user.id, {
            normal: "מצב הדדליין הנוכחי:",
            funny: `יש לך ${formatTimeLeft(new Date(nextDeadline.dueAt))}. יהיה קשה, אבל לפחות זה עקבי.`,
            spicy: `יש לך ${formatTimeLeft(new Date(nextDeadline.dueAt))}. אתה לא תספיק. אבל תנסה, אני מאמין בך. לא באמת.`,
        });

        const upcomingText = panic.upcoming
            .slice(0, 3)
            .map(
                (item) =>
                    `- ${item.title} | ${item.course} | ${formatTimeLeft(new Date(item.dueAt))}`,
            )
            .join("\n");
        const overdueText = panic.overdue
            .slice(0, 2)
            .map(
                (item) =>
                    `- ${item.title} | ${item.course} | ${formatTimeLeft(new Date(item.dueAt))}`,
            )
            .join("\n");

        await interaction.reply(
            `${intro}\n\nהקרובים ביותר:\n${upcomingText || "- אין כרגע קרובים. suspicious."}\n\nבאיחור:\n${overdueText || "- בינתיים אתה נקי מחטאי עבר."}`,
        );
    } catch (error) {
        logger.error(error, "Error in deadline command");
        await interaction.reply(await formatErrorResponse(interaction.user.id));
    }
}