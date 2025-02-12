import { getVoiceConnection } from "@discordjs/voice";
import { Events, type VoiceState } from "discord.js";
import { client } from "./config/client";
import config from "./config/config";
import { commandHandlers } from "./functions/commandFunc";

client.on(Events.ClientReady, (readyClient) => {
    console.info(`Logged in as ${readyClient.user.tag}!`);
});
client.on(
    "voiceStateUpdate",
    async (oldState: VoiceState, newState: VoiceState) => {
        // Check if the bot is in a voice channel
        const botId = client.user?.id;
        if (!botId) return;

        const botVoiceChannel =
            oldState.guild.voiceStates.cache.get(botId)?.channel;
        if (!botVoiceChannel) return;

        // If the user disconnects and the bot is alone, disconnect the bot
        if (
            oldState.channelId === botVoiceChannel.id &&
            newState.channelId !== botVoiceChannel.id
        ) {
            const membersInChannel = botVoiceChannel.members.filter(
                (member) => !member.user.bot,
            );
            if (membersInChannel.size === 0) {
                const connection = getVoiceConnection(oldState.guild.id);
                connection?.destroy(); // Disconnect from the voice channel
                console.log(
                    "Bot disconnected from the voice channel as it was left alone.",
                );
            }
        }
    },
);

client.on(Events.InteractionCreate, async (interaction) => {
    // Only handle Chat Input commands (slash commands)
    if (!interaction.isChatInputCommand()) return;

    console.info(
        `Received interaction ${interaction.commandName} from ${interaction.user.tag}`,
    );

    // Retrieve the appropriate handler from the map
    const handler = commandHandlers[interaction.commandName];

    // Call the handler if it exists; otherwise respond with an error or ignore
    if (handler) {
        await handler(interaction);
    } else {
        await interaction.reply("Unknown command.");
    }
});

client.login(config.TOKEN);
