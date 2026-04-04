import { ChatInputCommandInteraction } from "discord.js";
import { format } from "../utils/format";
import messages from "../utils/messages";

function formatUptime(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [
        days > 0 ? `${days}d` : null,
        hours > 0 ? `${hours}h` : null,
        minutes > 0 ? `${minutes}m` : null,
        `${seconds}s`,
    ]
        .filter(Boolean)
        .join(" ");
}

export default async function uptime(
    interaction: ChatInputCommandInteraction,
): Promise<void> {
    const uptime = formatUptime(process.uptime() * 1000);
    await interaction.reply(format(messages.commands.uptime, { uptime }));
}