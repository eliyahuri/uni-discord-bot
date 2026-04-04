import { joinVoiceChannel } from "@discordjs/voice";
import { ChatInputCommandInteraction, GuildMember } from "discord.js";
import logger from "../utils/logger";
import { formatErrorResponse } from "../responseFormatter";
import { getVoiceJoinLine, registerVoiceSession } from "../voicePersonality";

export default async function voice(interaction: ChatInputCommandInteraction) {
    try {
        const member = interaction.member as GuildMember;

        if (!member.voice.channel) {
            await interaction.reply({
                content: "אתה לא בקול. יהיה לי קשה לשפוט אתכם מרחוק.",
                ephemeral: true,
            });
            return;
        }

        joinVoiceChannel({
            channelId: member.voice.channel.id,
            guildId: member.voice.channel.guild.id,
            adapterCreator: member.voice.channel.guild.voiceAdapterCreator,
        });

        registerVoiceSession(
            interaction.client,
            member.voice.channel.guild.id,
            member.voice.channel.id,
            interaction.channel?.isTextBased() ? interaction.channel.id : undefined,
        );

        await interaction.reply(getVoiceJoinLine());
    } catch (error) {
        logger.error(error, "Error in voice command");
        await interaction.reply(await formatErrorResponse(interaction.user.id));
    }
}
