import { ChatInputCommandInteraction } from "discord.js";
import { commands as commandsList } from "../utils/commandsList";
import messages from "../utils/messages";
import { format } from "../utils/format";
import logger from "../utils/logger";

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
        await interaction.reply({
            content: format(messages.commands.help, { helpText }),
            ephemeral: isPrivate,
        });
    } catch (error) {
        logger.error(error, "Error in help command");
        await interaction.reply(messages.errors.errorOccurred);
    }
}
