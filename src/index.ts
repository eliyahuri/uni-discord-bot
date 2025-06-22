import { getVoiceConnection } from "@discordjs/voice";
import type { Interaction } from "discord.js";
import { Events, type VoiceState } from "discord.js";
import { client } from "./config/client";
import config from "./config/config";
import { commandHandlers } from "./functions/commandFunc";

// Global error handling for unhandled promise rejections and exceptions
process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Rejection at:", reason);
});
process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
});

client.once(Events.ClientReady, () => {
    console.info(`Logged in as ${client.user?.tag}!`);
});

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
                    console.log(
                        "Bot disconnected from the voice channel as it was left alone.",
                    );
                }
            }
        } catch (error) {
            console.error("Error in VoiceStateUpdate handler:", error);
        }
    },
);

client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    try {
        if (!interaction.isChatInputCommand()) return;

        console.info(
            `Received interaction ${interaction.commandName} from ${interaction.user.tag}`,
        );

        const handler = commandHandlers[interaction.commandName];
        if (handler) {
            await handler(interaction);
        } else if (interaction.isRepliable()) {
            await interaction.reply("Unknown command.");
        }
    } catch (error) {
        console.error("Error handling interaction:", error);
        if (interaction.isRepliable() && !interaction.replied) {
            await interaction.reply(
                "An error occurred while processing your interaction.",
            );
        }
    }
});

// Initialize and login the client with error handling
(async () => {
    try {
        await client.login(config.TOKEN);
    } catch (error) {
        console.error("Failed to login:", error);
    }
})();
