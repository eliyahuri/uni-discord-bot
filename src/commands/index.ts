import type { commands as CommandList } from "../utils/commandsList";

// Derive command names from the commands list for type-safe handlers
export type CommandName = (typeof CommandList)[number]["name"];

import ping from "./ping";
import representatives from "./representatives";
import help from "./help";
import userinfo from "./userinfo";
import tal from "./tal";
import pizza from "./pizza";
import summary from "./summary";
import alert from "./alert";
import ticket from "./ticket";
import poll from "./poll";
import voice from "./voice";
import noam from "./noam";
import eliyahu from "./eliyahu";
import weather from "./weather";
import monkey from "./monkey";
import roll from "./roll";
import type { ChatInputCommandInteraction } from "discord.js";

// Define common CommandHandler type
export type CommandHandler = (
    interaction: ChatInputCommandInteraction,
) => Promise<void>;

// Command handlers map, now type-safe with known command names
export const commandHandlers: Record<CommandName, CommandHandler> = {
    ping,
    representatives,
    help,
    userinfo,
    tal,
    pizza,
    summary,
    alert,
    ticket,
    poll,
    voice,
    noam,
    eliyahu,
    weather,
    monkey,
    roll,
};
