import { ChatInputCommandInteraction } from "discord.js";
import { commands as commandsList } from "../utils/commandsList";
import logger from "../utils/logger";
import { formatErrorResponse, formatResponse } from "../responseFormatter";

/**
 * Handler for the /help command. Sends a list of available commands with descriptions.
 * @param {ChatInputCommandInteraction} interaction - The interaction triggering this command.
 * @returns {Promise<void>}
 */
export default async function help(
    interaction: ChatInputCommandInteraction,
): Promise<void> {
    try {
        const isPrivate = interaction.options.getBoolean("private") ?? false;
        const helpText = commandsList
            .map((command) => {
                const args =
                    command.options
                        ?.map((option) =>
                            option.required
                                ? `<${option.name}>`
                                : `[${option.name}]`,
                        )
                        .join(" ") ?? "";

                return `/${command.name}${args ? ` ${args}` : ""} - ${command.description}`;
            })
            .join("\n");
        const header = await formatResponse(interaction.user.id, {
            normal: "רשימת פקודות, כי apparently צריך להסביר הכל:",
            funny: "אתה צריך עזרה? shocking. הנה כל הפקודות:",
            spicy: "לא אידיאלי שאתה צריך את זה, אבל הנה. כל הפקודות:",
        });

        await interaction.reply({
            content: `${header}\n\n${helpText}\n\n/persona set mode:<...> כדי להחליט כמה אמת אתה מסוגל לשמוע.`,
            ephemeral: isPrivate,
        });
    } catch (error) {
        logger.error(error, "Error in help command");
        await interaction.reply(await formatErrorResponse(interaction.user.id));
    }
}
