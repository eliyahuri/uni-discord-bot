import { ChatInputCommandInteraction } from "discord.js";
import logger from "../utils/logger";
import { chooseMeal } from "../studentSurvival";
import { formatErrorResponse, formatResponse } from "../responseFormatter";

/**
 * Handler for the /pizza command. Replies with pizza invitation message.
 * @param {ChatInputCommandInteraction} interaction - The interaction triggering this command.
 * @returns {Promise<void>}
 */
export default async function pizza(
    interaction: ChatInputCommandInteraction,
): Promise<void> {
    try {
        const recommendation = chooseMeal(25, "פיצה");
        const intro = await formatResponse(interaction.user.id, {
            normal: "פיצה עדיין פתרון לגיטימי לרוב הבעיות.",
            funny: "ברור שיצא פיצה. זה מוסד אקדמי, לא wellness retreat.",
            spicy: "פיצה זה לא תזונה, זה coping mechanism עם גבינה.",
        });

        await interaction.reply(
            `${intro}\nההמלצה שלי: ${recommendation.chosen.name} ב-${recommendation.chosen.campusSpot} (${recommendation.chosen.price}₪).\nMeal plan להיום: ${recommendation.mealPlan}\nאם בא לך משהו פחות צפוי, תנסה /food choose.`,
        );
    } catch (error) {
        logger.error(error, "Error in pizza command");
        await interaction.reply(await formatErrorResponse(interaction.user.id));
    }
}
