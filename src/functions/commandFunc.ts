import { ChatInputCommandInteraction, type GuildMember } from "discord.js";
import fs from "fs";
import path from "path";
import { client } from "../config/client";
import { commands } from "../utils/commandsList";
import subjectTranslations from "../utils/translations";
import { parseTimeToMilliseconds } from "./convertTime";
import { joinVoiceChannel } from "@discordjs/voice";
import axios from "axios";
import config from "../config/config";
interface MyCommand {
    name: string;
    description: string;
}

type CommandHandler = (
    interaction: ChatInputCommandInteraction,
) => Promise<void>;

export const commandHandlers: Record<string, CommandHandler> = {
    ping: async (interaction) => {
        try {
            if (Math.random() <= 0.1) {
                await interaction.reply(
                    `<@${interaction.user.id}> אני פה הצילו אליהו מחזיק אותי כמו עבד בבקשה תעזרו לי`,
                );
                setTimeout(() => {
                    interaction.editReply("Pong!");
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
            await interaction.reply(
                commands
                    .map((c: MyCommand) => `/${c.name} - ${c.description}`)
                    .join("\n"),
            );
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
            // Defer right away so Discord doesn't invalidate the interaction after 3 seconds
            await interaction.deferReply();

            const option = interaction.options.getString("option");
            if (!option) {
                // You have already deferred, so we edit the reply instead of calling "reply" again
                await interaction.editReply(
                    "Please provide a folder name for the summary.",
                );
                return;
            }

            // Construct the folder path (adjust as needed for your structure)
            const summaryPath = path.join(__dirname, "..", "assets", option);

            if (!fs.existsSync(summaryPath)) {
                await interaction.editReply(
                    `לא נמצאה תיקייה בשם "${subjectTranslations[option] ? subjectTranslations[option] : option}".`,
                );
                return;
            }

            const filesInDirectory = fs.readdirSync(summaryPath);

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

            // Now edit the deferred reply with the attachments
            await interaction.editReply({
                content: `הנה סיכומים מ "${subjectTranslations[option] ? subjectTranslations[option] : option}":`,
                files,
            });
        } catch (error) {
            console.error("Error in summary command:", error);

            // If an error happens, check if we've already replied.
            // If not, we can do one last editReply.
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
                await interaction.reply(
                    "\u05dc\u05d0 \u05e0\u05de\u05e6\u05d0 \u05d6\u05de\u05df",
                );
                return;
            }

            const msTime = parseTimeToMilliseconds(time);
            if (!msTime) {
                await interaction.reply(
                    "\u05d6\u05de\u05df \u05dc\u05d0 \u05ea\u05e7\u05d9\u05df",
                );
                return;
            }

            const targetDate = new Date(Date.now() + msTime);
            const hours = targetDate.getHours().toString().padStart(2, "0");
            const minutes = targetDate.getMinutes().toString().padStart(2, "0");

            const formattedTime = `${hours}:${minutes}`;
            await client.users.send(
                interaction.user.id,
                "היי ההתראה שלך מוכנה והיא תהיה בעוד",
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
        const message = interaction.options.getString("message");
        if (!message) {
            await interaction.reply("please provide a message");
            return;
        }
        const sentMessage = `ticket sent:\nfrom: <@${interaction.user.id}>\n it says: ${message}`;
        client.users.send("173926117172838401", sentMessage);
        client.users.send("762268300746686474", message);
        await interaction.reply({ content: "ticket sent", ephemeral: true });
    },
    poll: async (interaction) => {
        try {
            const question = interaction.options.getString("question");
            const answers = interaction.options.getString("answers");
            const time = interaction.options.getNumber("time") || 24;
            const isMultiSelect = interaction.options.getBoolean("multiselect");
            if (!question || !answers || answers.split(",").length < 2) {
                await interaction.reply("please provide a question");
                return;
            }
            const answersArray = answers.split(",").map((answer) => {
                return {
                    text: answer,
                };
            });
            const displayedQuestion = { text: question };
            await interaction.reply({
                poll: {
                    question: displayedQuestion,
                    answers: answersArray,
                    duration: time,
                    allowMultiselect: Boolean(isMultiSelect),
                },
            });
        } catch (e) {
            await interaction.reply("error");
        }
    },
    tal: async (interaction) => {
        await interaction.reply(
            "<@1317796479511035956> טלללללללללללללללללללללל",
        );
    },
    voice: async (interaction) => {
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
    },

    league: async (interaction) => {
        try {
            const summonerInput = interaction.options.getString("summoner");
            if (!summonerInput) {
                await interaction.reply("Please provide a summoner name.");
                return;
            }

            // Safely encode the user input
            const summonerName = encodeURIComponent(summonerInput.trim());

            // Use backticks to interpolate the summonerName variable in the URL
            const response = await axios.get(
                `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}`,
                {
                    headers: {
                        "X-Riot-Token": config.RIOT_API_KEY,
                    },
                },
            );

            const summonerData = response.data;

            // Use backticks for the template string in interaction.reply
            await interaction.reply(
                `Summoner Name: ${summonerData.name}\nLevel: ${summonerData.summonerLevel}`,
            );
        } catch (error: any) {
            console.error("Error fetching League of Legends data:", error);

            if (error.response) {
                switch (error.response.status) {
                    case 400:
                        await interaction.reply(
                            `Bad request. Check the summoner name or try again later. Error: ${error.response.data.status.message}`,
                        );
                        break;
                    case 403:
                        await interaction.reply(
                            "Access denied. Please check your Riot API key.",
                        );
                        break;
                    case 404:
                        await interaction.reply("Summoner not found.");
                        break;
                    case 429:
                        await interaction.reply(
                            "Rate limit exceeded. Please try again later.",
                        );
                        break;
                    default:
                        await interaction.reply(
                            `An error occurred (${error.response.status}) while fetching the data.`,
                        );
                }
            } else {
                await interaction.reply(
                    "An unexpected error occurred. Please try again later.",
                );
            }
        }
    },
};
