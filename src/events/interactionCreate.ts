import { Events, type Interaction } from "discord.js";
import { client } from "../config/client";
import { commandHandlers } from "../commands";
import messages from "../utils/messages";
import { format } from "../utils/format";
import logger from "../utils/logger";
import { formatErrorResponse } from "../responseFormatter";

client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    try {
        if (!interaction.isChatInputCommand()) return;

        logger.info(
            `Received interaction ${interaction.commandName} from ${interaction.user.tag}`,
        );

        const handler = commandHandlers[interaction.commandName as keyof typeof commandHandlers];
        if (handler) {
            await handler(interaction);
        } else if (interaction.isRepliable()) {
            await interaction.reply(messages.commands.unknown);
        }
    } catch (error) {
        logger.error(format(messages.errors.interactionError, { error }));
        const errorMessage = interaction.isRepliable()
            ? await formatErrorResponse(interaction.user.id)
            : messages.errors.errorOccurred;
        if (interaction.isRepliable() && interaction.deferred) {
            await interaction.editReply(errorMessage);
        } else if (interaction.isRepliable() && !interaction.replied) {
            await interaction.reply(errorMessage);
        }
    }
});
