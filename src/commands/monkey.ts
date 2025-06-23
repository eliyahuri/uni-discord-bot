import { ChatInputCommandInteraction } from "discord.js";

const monkeyImages = [
    "monkey1.jpg",
    "monkey2.jpg",
    "monkey3.jpg",
    "monkey4.jpg",
    "monkey5.jpg",
    "monkey6.jpg",
    "monkey7.jpg",
    "monkey8.jpg",
];

export default async function monkey(interaction: ChatInputCommandInteraction) {
    const img = monkeyImages[Math.floor(Math.random() * monkeyImages.length)];
    await interaction.reply({
        files: [
            require("path").join(__dirname, "../assets/monkeyImages/", img),
        ],
    });
}
