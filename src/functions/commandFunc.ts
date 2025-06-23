import { joinVoiceChannel } from "@discordjs/voice";
import axios from "axios";
import { ChatInputCommandInteraction, type GuildMember } from "discord.js";
import fs from "fs";
import path from "path";
import { client } from "../config/client";
import { commands } from "../utils/commandsList";
import subjectTranslations from "../utils/translations";
import { parseTimeToMilliseconds } from "./convertTime";
import messages from "../utils/messages";
import { format } from "../utils/format";

interface MyCommand {
    name: string;
    description: string;
}

type CommandHandler = (
    interaction: ChatInputCommandInteraction,
) => Promise<void>;

const monkeys: string[] = [
    "src/assets/monkeyImages/monkey1.jpg",
    "src/assets/monkeyImages/monkey2.jpg",
    "src/assets/monkeyImages/monkey3.jpg",
    "src/assets/monkeyImages/monkey4.jpg",
    "src/assets/monkeyImages/monkey5.jpg",
    "src/assets/monkeyImages/monkey6.jpg",
    "src/assets/monkeyImages/monkey7.jpg",
    "src/assets/monkeyImages/monkey8.jpg",
];

// Extract command names from commands list for type-safe handlers
type CommandName = (typeof commands)[number]["name"];

/**
 * Map of command handlers for various slash commands.
 * Each handler processes a ChatInputCommandInteraction and returns a Promise.
 */
export const commandHandlers: Partial<Record<CommandName, CommandHandler>> = {
    /**
     * Handler for the /ping command. Replies with a random joke or a standard ping response.
     * @param {ChatInputCommandInteraction} interaction - The interaction triggering this command.
     * @returns {Promise<void>}
     */
    ping: async (interaction) => {
        try {
            if (Math.random() <= 0.1) {
                await interaction.reply(
                    format(messages.commands.ping.joke, {
                        userId: interaction.user.id,
                    }),
                );
                setTimeout(async () => {
                    await interaction.editReply(messages.commands.ping.reply);
                }, 3000);
            } else {
                await interaction.reply(messages.commands.ping.reply);
            }
        } catch (error) {
            console.error("Error in ping command:", error);
            await interaction.reply(messages.errors.errorOccurred);
        }
    },

    /**
     * Handler for the /representatives command. Replies with the representatives message.
     * @param {ChatInputCommandInteraction} interaction - The interaction triggering this command.
     * @returns {Promise<void>}
     */
    representatives: async (interaction) => {
        try {
            await interaction.reply(messages.commands.representatives);
        } catch (error) {
            console.error("Error in representatives command:", error);
            await interaction.reply(messages.errors.errorOccurred);
        }
    },

    /**
     * Handler for the /help command. Sends a list of available commands and descriptions.
     * @param {ChatInputCommandInteraction} interaction - The interaction triggering this command.
     * @returns {Promise<void>}
     */
    help: async (interaction) => {
        try {
            const helpText = commands
                .map((c: MyCommand) => `/${c.name} - ${c.description}`)
                .join("\n");
            await interaction.reply(
                format(messages.commands.help, { helpText }),
            );
        } catch (error) {
            console.error("Error in help command:", error);
            await interaction.reply(messages.errors.errorOccurred);
        }
    },

    /**
     * Handler for the /pizza command. Sends a pizza invitation message.
     * @param {ChatInputCommandInteraction} interaction - The interaction triggering this command.
     * @returns {Promise<void>}
     */
    pizza: async (interaction) => {
        try {
            await interaction.reply("@here בואו לפיצה הדיקן בשעה 20:00");
        } catch (error) {
            console.error("Error in pizza command:", error);
            await interaction.reply(
                "An error occurred while executing the command.",
            );
        }
    },

    /**
     * Handler for the /summary command. Sends files from the specified summary folder.
     * @param {ChatInputCommandInteraction} interaction - The interaction triggering this command.
     * @returns {Promise<void>}
     */
    summary: async (interaction) => {
        try {
            await interaction.deferReply();

            const option = interaction.options.getString("option");
            if (!option) {
                await interaction.editReply(messages.commands.provideOption);
                return;
            }

            const summaryPath = path.join(__dirname, "..", "assets", option);

            if (!fs.existsSync(summaryPath)) {
                await interaction.editReply(
                    format(messages.commands.unknownFolder, {
                        folderName: subjectTranslations[option] || option,
                    }),
                );
                return;
            }

            const filesInDirectory = await fs.promises.readdir(summaryPath);
            if (filesInDirectory.length === 0) {
                await interaction.editReply(
                    format(messages.commands.noFiles, { folderName: option }),
                );
                return;
            }

            const files = filesInDirectory.map((fileName) =>
                path.join(summaryPath, fileName),
            );

            await interaction.editReply({
                content: format(messages.commands.summaryHeader, {
                    folderName: subjectTranslations[option] || option,
                }),
                files,
            });
        } catch (error) {
            console.error("Error in summary command:", error);
            if (!interaction.replied) {
                await interaction.editReply(messages.errors.errorOccurred);
            }
        }
    },

    /**
     * Handler for the /alert command. Schedules an alert message to the user after a delay.
     * @param {ChatInputCommandInteraction} interaction - The interaction triggering this command.
     * @returns {Promise<void>}
     */
    alert: async (interaction) => {
        try {
            const time = interaction.options.getString("time", true);
            const message = interaction.options.getString("message", true);

            const msTime = parseTimeToMilliseconds(time);
            if (!msTime) {
                await interaction.reply("זמן לא תקין");
                return;
            }

            // Calculate the target time (for possible feedback)
            const targetDate = new Date(Date.now() + msTime);
            const hours = targetDate.getHours().toString().padStart(2, "0");
            const minutes = targetDate.getMinutes().toString().padStart(2, "0");
            const formattedTime = `${hours}:${minutes}`;

            // Inform the user that the alert is scheduled
            await client.users.send(
                interaction.user.id,
                `היי, ההתראה שלך מוכנה והיא תהיה ב-${formattedTime}.`,
            );

            setTimeout(async () => {
                try {
                    await interaction.followUp(
                        `<@${interaction.user.id}> התראה! ${message}`,
                    );
                } catch (err) {
                    console.error("Failed to send alert follow-up", err);
                }
            }, msTime);
        } catch (error) {
            console.error("Error in alert command:", error);
            await interaction.reply(
                "An error occurred while executing the command.",
            );
        }
    },

    /**
     * Handler for the /ticket command. Sends a ticket message to support users.
     * @param {ChatInputCommandInteraction} interaction - The interaction triggering this command.
     * @returns {Promise<void>}
     */
    ticket: async (interaction) => {
        try {
            const message = interaction.options.getString("message");
            if (!message) {
                await interaction.reply("please provide a message");
                return;
            }
            const sentMessage = `ticket sent:\nfrom: <@${interaction.user.id}>\n it says: ${message}`;
            // Sending to the specified user IDs
            await client.users.send("173926117172838401", sentMessage);
            await client.users.send("762268300746686474", message);
            await interaction.reply({
                content: "ticket sent",
                ephemeral: true,
            });
        } catch (error) {
            console.error("Error in ticket command:", error);
            await interaction.reply(
                "An error occurred while executing the command.",
            );
        }
    },

    /**
     * Handler for the /poll command. Creates and sends a poll with the given question and answers.
     * @param {ChatInputCommandInteraction} interaction - The interaction triggering this command.
     * @returns {Promise<void>}
     */
    poll: async (interaction) => {
        try {
            const question = interaction.options.getString("question", true);
            const answers = interaction.options.getString("answers", true);
            const duration = interaction.options.getNumber("time") ?? 24;
            const allowMulti =
                interaction.options.getBoolean("multiselect") ?? false;

            if (answers.split(",").length < 2) {
                await interaction.reply(
                    "please provide a valid question and at least two answers",
                );
                return;
            }

            const answersArray = answers
                .split(",")
                .map((ans) => ({ text: ans.trim() }));
            const displayedQuestion = { text: question };

            await interaction.reply({
                poll: {
                    question: displayedQuestion,
                    answers: answersArray,
                    duration,
                    allowMultiselect: allowMulti,
                },
            });
        } catch (error) {
            console.error("Error in poll command:", error);
            await interaction.reply(
                "An error occurred while executing the command.",
            );
        }
    },

    /**
     * Handler for the /tal command. Mentions and sends a message to Tal.
     * @param {ChatInputCommandInteraction} interaction - The interaction triggering this command.
     * @returns {Promise<void>}
     */
    tal: async (interaction) => {
        try {
            await interaction.reply(
                "<@1317796479511035956> טלללללללללללללללללללללל",
            );
        } catch (error) {
            console.error("Error in tal command:", error);
            await interaction.reply(
                "An error occurred while executing the command.",
            );
        }
    },

    /**
     * Handler for the /voice command. Joins the voice channel of the command issuer.
     * @param {ChatInputCommandInteraction} interaction - The interaction triggering this command.
     * @returns {Promise<void>}
     */
    voice: async (interaction) => {
        try {
            const member = interaction.member as GuildMember;
            if (!member.voice.channel) {
                await interaction.reply("you are not in a voice channel");
                return;
            }
            joinVoiceChannel({
                channelId: member.voice.channel.id,
                guildId: member.voice.channel.guild.id,
                adapterCreator: member.voice.channel.guild.voiceAdapterCreator,
            });
            await interaction.reply("joined voice channel");
        } catch (error) {
            console.error("Error in voice command:", error);
            await interaction.reply(
                "An error occurred while executing the command.",
            );
        }
    },

    /**
     * Handler for the /noam command. Mentions and sends a message to Noam.
     * @param {ChatInputCommandInteraction} interaction - The interaction triggering this command.
     * @returns {Promise<void>}
     */
    noam: async (interaction) => {
        try {
            await interaction.reply(
                "נעםםםםםםםםםםםםםםםםםםםםםםםםםםםםםםםםםםםםםםםםםםםםםםם <@402922149041405974>",
            );
        } catch (error) {
            console.error("Error in noam command:", error);
            await interaction.reply(
                "An error occurred while executing the command.",
            );
        }
    },

    /**
     * Handler for the /eliyahu command. Mentions and sends a message to Eliyahu.
     * @param {ChatInputCommandInteraction} interaction - The interaction triggering this command.
     * @returns {Promise<void>}
     */
    eliyahu: async (interaction) => {
        try {
            await interaction.reply(
                "אליהוווווווווווווווווווו <@173926117172838401>",
            );
        } catch (error) {
            console.error("Error in eliyahu command:", error);
            await interaction.reply(
                "An error occurred while executing the command.",
            );
        }
    },

    /**
     * Handler for the /weather command. Provides the current weather for a specified city.
     * @param {ChatInputCommandInteraction} interaction - The interaction triggering this command.
     * @returns {Promise<void>}
     */
    weather: async (interaction: ChatInputCommandInteraction) => {
        try {
            const city = interaction.options.getString("city");
            if (!city) {
                await interaction.reply("Please provide a city name.");
                return;
            }

            let latitude: number, longitude: number;

            // Hardcode coordinates for Lod, Israel to prevent confusion with Łódź, Poland
            if (city.toLowerCase() === "lod") {
                latitude = 31.9511;
                longitude = 34.8953;
            } else {
                // Convert city name to latitude and longitude
                const geoResponse = await axios.get(
                    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
                        city,
                    )}&count=1&country=IL&format=json`,
                );

                if (
                    !geoResponse.data.results ||
                    geoResponse.data.results.length === 0
                ) {
                    await interaction.reply(
                        `City "${city}" not found in Israel!`,
                    );
                    return;
                }

                latitude = geoResponse.data.results[0].latitude;
                longitude = geoResponse.data.results[0].longitude;
            }

            // Fetch weather using latitude and longitude
            const weatherResponse = await axios.get(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode`,
            );

            const temperature = weatherResponse.data.current.temperature_2m;
            const weatherCode = weatherResponse.data.current.weathercode;

            // Map weather code to a readable description
            const weatherDescriptions: Record<number, string> = {
                0: "Clear sky ☀️",
                1: "Mainly clear 🌤️",
                2: "Partly cloudy ⛅",
                3: "Overcast ☁️",
                45: "Foggy 🌫️",
                48: "Depositing rime fog ❄️",
                51: "Light drizzle 🌦️",
                53: "Moderate drizzle 🌧️",
                55: "Heavy drizzle 🌧️",
                61: "Light rain 🌦️",
                63: "Moderate rain 🌧️",
                65: "Heavy rain 🌧️",
                80: "Light rain showers 🌦️",
                81: "Moderate rain showers 🌧️",
                82: "Heavy rain showers 🌧️",
                95: "Thunderstorm ⛈️",
                96: "Thunderstorm with light hail ⛈️",
                99: "Thunderstorm with heavy hail ⛈️",
            };

            const weatherDescription =
                weatherDescriptions[weatherCode] || "Unknown Weather";

            await interaction.reply(
                `The current weather in **${city}** is:\n🌡️ Temperature: **${temperature}°C**\n🌍 Condition: **${weatherDescription}**`,
            );
        } catch (error) {
            console.error("Error in weather command:", error);
            await interaction.reply(
                "An error occurred while fetching the weather.",
            );
        }
    },

    /**
     * Handler for the /monkey command. Sends a random monkey image.
     * @param {ChatInputCommandInteraction} interaction - The interaction triggering this command.
     * @returns {Promise<void>}
     */
    monkey: async (interaction: ChatInputCommandInteraction) => {
        try {
            const randomMonkey =
                monkeys[Math.floor(Math.random() * monkeys.length)];
            await interaction.reply({
                content: "Here's a monkey for you:",
                files: [randomMonkey],
            });
        } catch (error) {
            console.error("Error in monkey command:", error);
            await interaction.reply(
                "An error occurred while executing the command.",
            );
        }
    },
    /**
     * Handler for the /roll command. Rolls a virtual dice with a specified number of sides.
     * @param {ChatInputCommandInteraction} interaction - The interaction triggering this command.
     * @returns {Promise<void>}
     */
    roll: async (interaction) => {
        try {
            const sides = interaction.options.getInteger("sides") || 6;
            const randomNum = Math.floor(Math.random() * sides) + 1;
            await interaction.reply(`You rolled a ${randomNum}!`);
        } catch (error) {
            console.error("Error in roll command:", error);
            await interaction.reply(
                "An error occurred while executing the command.",
            );
        }
    },

    /**
     * Handler for the /echo command. Echos the provided text back to the user.
     * @param {ChatInputCommandInteraction} interaction - The interaction triggering this command.
     * @returns {Promise<void>}
     */
    echo: async (interaction) => {
        try {
            const text = interaction.options.getString("text", true);
            await interaction.reply(text);
        } catch (error) {
            console.error("Error in echo command:", error);
            await interaction.reply("Failed to echo your message.");
        }
    },

    /**
     * Handler for the /userinfo command. Displays information about a specified user.
     * @param {ChatInputCommandInteraction} interaction - The interaction triggering this command.
     * @returns {Promise<void>}
     */
    userinfo: async (interaction) => {
        try {
            const user = interaction.options.getUser("user", true);
            const member = interaction.guild?.members.cache.get(user.id);
            const joined = member?.joinedAt?.toLocaleDateString() || "Unknown";
            const created = user.createdAt.toLocaleDateString();
            await interaction.reply(
                `User: ${user.tag}\nCreated: ${created}\nJoined Server: ${joined}`,
            );
        } catch (error) {
            console.error("Error in userinfo command:", error);
            await interaction.reply("Failed to fetch user info.");
        }
    },

    /**
     * Handler for the /serverinfo command. Displays information about the server.
     * @param {ChatInputCommandInteraction} interaction - The interaction triggering this command.
     * @returns {Promise<void>}
     */
    serverinfo: async (interaction) => {
        try {
            const guild = interaction.guild;
            if (!guild) {
                await interaction.reply(
                    "This command must be used in a server.",
                );
                return;
            }
            await interaction.reply(
                `Server: ${guild.name}\nMembers: ${guild.memberCount}`,
            );
        } catch (error) {
            console.error("Error in serverinfo command:", error);
            await interaction.reply("Failed to fetch server info.");
        }
    },
};
