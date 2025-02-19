import { getVoiceConnection } from "@discordjs/voice";
import { Events, type VoiceState } from "discord.js";
import { client } from "./config/client";
import config from "./config/config";
import { commandHandlers } from "./functions/commandFunc";

client.once(Events.ClientReady, () => {
    console.info(`Logged in as ${client.user?.tag}!`);
});

client.on(
    Events.VoiceStateUpdate,
    async (oldState: VoiceState, newState: VoiceState) => {
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
    },
);

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    console.info(
        `Received interaction ${interaction.commandName} from ${interaction.user.tag}`,
    );

    const handler = commandHandlers[interaction.commandName];
    if (handler) {
        await handler(interaction);
    } else {
        await interaction.reply("Unknown command.");
    }
});

client.login(config.TOKEN);
