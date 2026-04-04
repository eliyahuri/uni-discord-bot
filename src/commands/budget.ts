import { ChatInputCommandInteraction } from "discord.js";
import { formatErrorResponse, formatResponse } from "../responseFormatter";
import { surviveBudget } from "../studentSurvival";
import logger from "../utils/logger";

export default async function budget(
    interaction: ChatInputCommandInteraction,
): Promise<void> {
    try {
        const amount = interaction.options.getInteger("amount", true);
        const result = surviveBudget(amount);
        const intro = await formatResponse(interaction.user.id, {
            normal: `עם ${amount}₪ עוד אפשר לשרוד איכשהו.`,
            funny: `עם ${amount}₪ אתה לא חי טוב, אבל אתה עדיין technically במשחק.`,
            spicy: `עם ${amount}₪ זו כבר לא כלכלה, זו אמנות הישרדות.`,
        });
        const affordable =
            result.affordable.length > 0
                ? result.affordable
                      .map((meal) => `- ${meal.name} (${meal.price}₪)`) 
                      .join("\n")
                : `- כלום בערך. קח ${result.fallback.name} ותתפלל.`;

        await interaction.reply(
            `${intro}\nאפשרי כרגע:\n${affordable}\nMeal plan: ${result.mealPlan}`,
        );
    } catch (error) {
        logger.error(error, "Error in budget command");
        await interaction.reply(await formatErrorResponse(interaction.user.id));
    }
}