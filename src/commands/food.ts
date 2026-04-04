import { ChatInputCommandInteraction } from "discord.js";
import { formatErrorResponse, formatResponse } from "../responseFormatter";
import { chooseMeal } from "../studentSurvival";
import logger from "../utils/logger";

export default async function food(
    interaction: ChatInputCommandInteraction,
): Promise<void> {
    try {
        const budget = interaction.options.getInteger("budget") ?? undefined;
        const craving = interaction.options.getString("craving") ?? undefined;
        const choice = chooseMeal(budget, craving);
        const intro = await formatResponse(interaction.user.id, {
            normal: "בדקתי את סיכויי ההישרדות הקולינריים שלך.",
            funny: "עשיתי אופטימיזציה לארוחה שלך, כי ברור שזה מה שיציל את הסמסטר.",
            spicy: "אם אתה בוחר אוכל טוב יותר מאשר קורסים, יש עוד תקווה.",
        });

        await interaction.reply(
            `${intro}\nבחירה מומלצת: ${choice.chosen.name} (${choice.chosen.price}₪) ב-${choice.chosen.campusSpot}.\nהכי זול כרגע: ${choice.cheapest.name} (${choice.cheapest.price}₪).\nMeal plan: ${choice.mealPlan}`,
        );
    } catch (error) {
        logger.error(error, "Error in food command");
        await interaction.reply(await formatErrorResponse(interaction.user.id));
    }
}