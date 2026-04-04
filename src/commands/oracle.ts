import { ChatInputCommandInteraction } from "discord.js";
import logger from "../utils/logger";
import { formatErrorResponse } from "../responseFormatter";

const usefulOracle = [
    "אם זה קורס כבד, תבדוק קודם סילבוס, דרישות, ומי כבר בכה עליו לפניך.",
    "תבחר פחות קורסים ממה שהאגו שלך אומר. האגו לא מגיש מטלות.",
    "אם אתה מתלבט בין להתחיל עכשיו או בלחץ, סטטיסטית 'עכשיו' מנצח, שזה מעליב אבל נכון.",
];

const chaoticOracle = [
    "לא. אבל אתה תעשה את זה בכל זאת.",
    "כן, אם המטרה שלך היא לפתח אופי דרך סבל.",
    "תשובה קצרה: רעיון גרוע. תשובה ארוכה: רעיון גרוע עם גאנט.",
];

function pickRandom<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)] as T;
}

export default async function oracle(
    interaction: ChatInputCommandInteraction,
): Promise<void> {
    try {
        const question = interaction.options.getString("question", true);
        const isUseful = Math.random() >= 0.5;
        const answer = isUseful ? pickRandom(usefulOracle) : pickRandom(chaoticOracle);

        await interaction.reply(`שאלת: ${question}\nהאורקל אומר: ${answer}`);
    } catch (error) {
        logger.error(error, "Error in oracle command");
        await interaction.reply(await formatErrorResponse(interaction.user.id));
    }
}