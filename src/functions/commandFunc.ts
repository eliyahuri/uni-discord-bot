import { joinVoiceChannel } from "@discordjs/voice";
import axios from "axios";
import {
    ChatInputCommandInteraction,
    MessageFlags,
    type GuildMember,
} from "discord.js";
import fs from "fs";
import path from "path";
import { client } from "../config/client";
import { commands } from "../utils/commandsList";
import subjectTranslations from "../utils/translations";
import { parseTimeToMilliseconds } from "./convertTime";

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

export const commandHandlers: Record<string, CommandHandler> = {
    ping: async (interaction) => {
        try {
            if (Math.random() <= 0.1) {
                await interaction.reply(
                    `<@${interaction.user.id}> אני פה הצילו אליהו מחזיק אותי כמו עבד בבקשה תעזרו לי`,
                );
                setTimeout(async () => {
                    await interaction.editReply("Pong!");
                }, 3000);
            } else {
                await interaction.reply("Pong!");
            }
        } catch (error) {
            console.error("Error in ping command:", error);
            await interaction.reply(
                "An error occurred while executing the command.",
            );
        }
    },

    representatives: async (interaction) => {
        try {
            await interaction.reply(
                "יגל גרוס: 0515204882 \n אליהו חורי: 0584304307",
            );
        } catch (error) {
            console.error("Error in representatives command:", error);
            await interaction.reply(
                "An error occurred while executing the command.",
            );
        }
    },

    help: async (interaction) => {
        try {
            const helpText = commands
                .map((c: MyCommand) => `/${c.name} - ${c.description}`)
                .join("\n");
            await interaction.reply(helpText);
        } catch (error) {
            console.error("Error in help command:", error);
            await interaction.reply(
                "An error occurred while executing the command.",
            );
        }
    },

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

    summary: async (interaction) => {
        try {
            // Defer the reply so that Discord doesn't invalidate the interaction after 3 seconds.
            await interaction.deferReply();

            const option = interaction.options.getString("option");
            if (!option) {
                await interaction.editReply(
                    "Please provide a folder name for the summary.",
                );
                return;
            }

            // Construct the folder path (adjust as needed for your structure)
            const summaryPath = path.join(__dirname, "..", "assets", option);

            // Check if the folder exists (synchronously here because it's a quick check)
            if (!fs.existsSync(summaryPath)) {
                await interaction.editReply(
                    `לא נמצאה תיקייה בשם "${
                        subjectTranslations[option] || option
                    }".`,
                );
                return;
            }

            // Use asynchronous fs methods to avoid blocking the event loop.
            const filesInDirectory = await fs.promises.readdir(summaryPath);
            if (filesInDirectory.length === 0) {
                await interaction.editReply(
                    `No files found in "${option}" folder.`,
                );
                return;
            }

            // Map filenames to full paths
            const files = filesInDirectory.map((fileName) =>
                path.join(summaryPath, fileName),
            );

            await interaction.editReply({
                content: `הנה סיכומים מ "${
                    subjectTranslations[option] || option
                }":`,
                files,
            });
        } catch (error) {
            console.error("Error in summary command:", error);
            if (!interaction.replied) {
                await interaction.editReply(
                    "An error occurred while executing the command.",
                );
            }
        }
    },

    alert: async (interaction) => {
        try {
            const time = interaction.options.getString("time");
            const message = interaction.options.getString("message");
            if (!time) {
                await interaction.reply("לא נמסר זמן");
                return;
            }

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
                await interaction.followUp(
                    `<@${interaction.user.id}> \u05d4\u05ea\u05e8\u05d0\u05d4! ${message}`,
                );
            }, msTime);
        } catch (error) {
            console.error("Error in alert command:", error);
            await interaction.reply(
                "An error occurred while executing the command.",
            );
        }
    },

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
                flags: MessageFlags.Ephemeral,
            });
        } catch (error) {
            console.error("Error in ticket command:", error);
            await interaction.reply(
                "An error occurred while executing the command.",
            );
        }
    },

    poll: async (interaction) => {
        try {
            const question = interaction.options.getString("question");
            const answers = interaction.options.getString("answers");
            const time = interaction.options.getNumber("time") || 24;
            const isMultiSelect = interaction.options.getBoolean("multiselect");

            if (!question || !answers || answers.split(",").length < 2) {
                await interaction.reply(
                    "please provide a valid question and at least two answers",
                );
                return;
            }

            const answersArray = answers
                .split(",")
                .map((answer) => ({ text: answer.trim() }));
            const displayedQuestion = { text: question };

            await interaction.reply({
                poll: {
                    question: displayedQuestion,
                    answers: answersArray,
                    duration: time,
                    allowMultiselect: Boolean(isMultiSelect),
                },
            });
        } catch (error) {
            console.error("Error in poll command:", error);
            await interaction.reply(
                "An error occurred while executing the command.",
            );
        }
    },

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
};
