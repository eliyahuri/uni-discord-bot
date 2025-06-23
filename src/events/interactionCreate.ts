import { Events, type Interaction } from "discord.js";
import { client } from "../config/client";
import { commandHandlers } from "../commands";
import messages from "../utils/messages";
import { format } from "../utils/format";
import logger from "../utils/logger";

client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    try {
        if (!interaction.isChatInputCommand()) return;

        logger.info(
            `Received interaction ${interaction.commandName} from ${interaction.user.tag}`,
        );

        const handler = commandHandlers[interaction.commandName];
        if (handler) {
            await handler(interaction);
        } else if (interaction.isRepliable()) {
            await interaction.reply(messages.commands.unknown);
        }
    } catch (error) {
        logger.error(format(messages.errors.interactionError, { error }));
        if (interaction.isRepliable() && !interaction.replied) {
            await interaction.reply(messages.errors.errorOccurred);
        }
    }
});
