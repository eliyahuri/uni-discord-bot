import { joinVoiceChannel } from "@discordjs/voice";
import { ChatInputCommandInteraction, GuildMember } from "discord.js";
import logger from "../utils/logger";
import messages from "../utils/messages";

export default async function voice(interaction: ChatInputCommandInteraction) {
    try {
        const member = interaction.member as GuildMember;

        if (!member.voice.channel) {
            await interaction.reply({
                content: messages.commands.notInVoice,
                ephemeral: true,
            });
            return;
        }

        joinVoiceChannel({
            channelId: member.voice.channel.id,
            guildId: member.voice.channel.guild.id,
            adapterCreator: member.voice.channel.guild.voiceAdapterCreator,
        });

        await interaction.reply(messages.commands.joinedVoice);
    } catch (error) {
        logger.error(error, "Error in voice command");
        await interaction.reply(messages.errors.errorOccurred);
    }
}
