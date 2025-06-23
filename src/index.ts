import { getVoiceConnection } from "@discordjs/voice";
import type { Interaction } from "discord.js";
import { Events, type VoiceState } from "discord.js";
import { client } from "./config/client";
import config from "./config/config";
import { commandHandlers } from "./commands";
// Add translations and formatting
import messages from "./utils/messages";
import { format } from "./utils/format";
import logger from "./utils/logger";

// Global error handling for unhandled promise rejections and exceptions
/**
 * Logs unhandled promise rejections to console.
 * @param {any} reason - The reason for the unhandled rejection.
 */
process.on("unhandledRejection", (reason) => {
    logger.error(format(messages.errors.unhandledRejection, { reason }));
});

/**
 * Logs uncaught exceptions to console.
 * @param {Error} error - The uncaught exception error.
 */
process.on("uncaughtException", (error) => {
    logger.error(format(messages.errors.uncaughtException, { error }));
});

/**
 * Logs when the Discord client is ready.
 */
client.once(Events.ClientReady, () => {
    logger.info(`Logged in as ${client.user?.tag}!`);
});

/**
 * Handles voice state updates to disconnect the bot when channel is empty.
 * @param {VoiceState} oldState - Previous voice state.
 * @param {VoiceState} newState - New voice state.
 */
client.on(
    Events.VoiceStateUpdate,
    async (oldState: VoiceState, newState: VoiceState) => {
        try {
            const botId = client.user?.id;
            if (!botId) return;

            const botVoiceChannel =
                oldState.guild.voiceStates.cache.get(botId)?.channel;
            if (!botVoiceChannel) return;

            if (
                oldState.channelId === botVoiceChannel.id &&
                newState.channelId !== botVoiceChannel.id
            ) {
                const membersInChannel = botVoiceChannel.members.filter(
                    (member) => !member.user.bot,
                );
                if (membersInChannel.size === 0) {
                    getVoiceConnection(oldState.guild.id)?.destroy();
                    logger.info(messages.commands.voiceLeft);
                }
            }
        } catch (error) {
            logger.error("Error in VoiceStateUpdate handler:", error);
        }
    },
);

/**
 * Handles incoming interactions for chat input commands.
 * @param {Interaction} interaction - The interaction object.
 */
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

/**
 * Initializes and logs in the Discord client with error handling.
 */
(async () => {
    try {
        await client.login(config.TOKEN);
    } catch (error) {
        logger.error("Failed to login:", error);
    }
})();
