import ping from "./ping";
import representatives from "./representatives";
import help from "./help";
import userinfo from "./userinfo";
// ...import other commands when split...
import type { ChatInputCommandInteraction } from "discord.js";

// Define common CommandHandler type
export type CommandHandler = (
    interaction: ChatInputCommandInteraction,
) => Promise<void>;

// Command handlers map
export const commandHandlers: Record<string, CommandHandler> = {
    ping,
    representatives,
    help,
    userinfo,
    // ...add other commands here...
};
