import ping from "./ping";
import representatives from "./representatives";
import help from "./help";
import userinfo from "./userinfo";
import tal from "./tal";
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
    tal,
    // ...add other commands here...
};
