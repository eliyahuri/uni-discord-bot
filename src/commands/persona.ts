import { ChatInputCommandInteraction } from "discord.js";
import {
    getPersonaModeLabel,
    getUserPersonaMode,
    setUserPersonaMode,
    type PersonaMode,
} from "../responseFormatter";
import logger from "../utils/logger";

export default async function persona(
    interaction: ChatInputCommandInteraction,
): Promise<void> {
    try {
        const subcommand = interaction.options.getSubcommand(true);

        if (subcommand === "set") {
            const mode = interaction.options.getString("mode", true) as PersonaMode;
            await setUserPersonaMode(interaction.user.id, mode);
            await interaction.reply(
                `סבבה. מעכשיו המצב שלך הוא: ${getPersonaModeLabel(mode)}. אתה ביקשת את זה.`,
            );
            return;
        }

        const mode = await getUserPersonaMode(interaction.user.id);
        await interaction.reply(`המצב הנוכחי שלך הוא: ${getPersonaModeLabel(mode)}.`);
    } catch (error) {
        logger.error(error, "Error in persona command");
        await interaction.reply("נכשלתי בלקרוא את ההעדפה שלך. מביך.");
    }
}