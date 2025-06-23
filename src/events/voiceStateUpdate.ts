import { Events, type VoiceState } from "discord.js";
import { getVoiceConnection } from "@discordjs/voice";
import { client } from "../config/client";
import logger from "../utils/logger";
import messages from "../utils/messages";

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
